
import ImageKit from "imagekit";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

// Utility function to ensure valid username
const ensureValidUsername = async (user) => {
  if (!user || !user.username || 
      user.username.trim() === '' || 
      user.username.includes('@') || 
      user.username === 'unnamed_user' || 
      user.username === 'Unknown User' || 
      user.username === 'no-email') {
    
    // Generate a new username from email or clerkUserId
    const email = user.email;
    if (email && email !== 'no-email' && email.includes('@')) {
      const newUsername = email.split('@')[0];
      // Update the user's username
      await User.findByIdAndUpdate(user._id, { username: newUsername });
      return newUsername;
    } else {
      // If no valid email, generate from a random string
      const newUsername = `user_${Math.random().toString(36).substr(2, 8)}`;
      // Update the user's username
      await User.findByIdAndUpdate(user._id, { username: newUsername });
      return newUsername;
    }
  }
  return user.username;
};

export const getPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;

  const query = {};

  console.log(req.query);

  // Clean up orphaned posts (posts without valid users)
  try {
    const orphanedPosts = await Post.find({}).populate('user');
    const postsToDelete = orphanedPosts.filter(post => !post.user);
    if (postsToDelete.length > 0) {
      await Post.deleteMany({ _id: { $in: postsToDelete.map(post => post._id) } });
      console.log(`Cleaned up ${postsToDelete.length} orphaned posts`);
    }
  } catch (error) {
    console.error('Error cleaning up orphaned posts:', error);
  }

  const cat = req.query.cat;
  const author = req.query.author;
  const searchQuery = req.query.search;
  const sortQuery = req.query.sort;
  const featured = req.query.featured;

  if (cat) {
    query.category = cat;
  }

  if (searchQuery) {
    query.title = { $regex: searchQuery, $options: "i" };
  }

  if (author) {
    const user = await User.findOne({ username: author }).select("_id");

    if (!user) {
      return res.status(404).json("No post found!");
    }

    query.user = user._id;
  }

  let sortObj = { createdAt: -1 };

  if (sortQuery) {
    switch (sortQuery) {
      case "newest":
        sortObj = { createdAt: -1 };
        break;
      case "oldest":
        sortObj = { createdAt: 1 };
        break;
      case "popular":
        sortObj = { visit: -1 };
        break;
      case "trending":
        sortObj = { visit: -1 };
        query.createdAt = {
          $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        };
        break;
      default:
        break;
    }
  }

  if (featured) {
    query.isFeatured = true;
  }

  const posts = await Post.find(query)
    .populate("user", "username email img")
    .sort(sortObj)
    .limit(limit)
    .skip((page - 1) * limit);

  // Filter out posts with null users (deleted users) and ensure usernames are valid
  const validPosts = [];
  for (const post of posts) {
    if (!post.user) continue;
    
    try {
      // Ensure username is valid using utility function
      const validUsername = await ensureValidUsername(post.user);
      post.user.username = validUsername;
      validPosts.push(post);
    } catch (error) {
      console.error('Error ensuring valid username for post:', post._id, error);
      continue;
    }
  }

  const totalPosts = await Post.countDocuments();
  const hasMore = page * limit < totalPosts;

  res.status(200).json({ posts: validPosts, hasMore });
};

export const getPost = async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug }).populate(
    "user",
    "username img email"
  );
  
  if (!post) {
    return res.status(404).json("Post not found!");
  }
  
  if (!post.user) {
    return res.status(404).json("Post author not found!");
  }

  try {
    // Ensure username is valid using utility function
    const validUsername = await ensureValidUsername(post.user);
    post.user.username = validUsername;
    
    res.status(200).json(post);
  } catch (error) {
    console.error('Error ensuring valid username for post:', post._id, error);
    res.status(500).json({ message: 'Error processing post data' });
  }
};

export const createPost = async (req, res) => {
  const clerkUserId = req.auth.userId;

  console.log(req.headers);

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const user = await User.findOne({ clerkUserId });

  if (!user) {
    return res.status(404).json("User not found!");
  }

  let slug = req.body.title.replace(/ /g, "-").toLowerCase();

  let existingPost = await Post.findOne({ slug });

  let counter = 2;

  while (existingPost) {
    slug = `${slug}-${counter}`;
    existingPost = await Post.findOne({ slug });
    counter++;
  }

  const newPost = new Post({ user: user._id, slug, ...req.body });

  const post = await newPost.save();
  res.status(200).json(post);
};

export const deletePost = async (req, res) => {
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const role = req.auth.sessionClaims?.metadata?.role || "user";

  if (role === "admin") {
    await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json("Post has been deleted");
  }

  const user = await User.findOne({ clerkUserId });

  const deletedPost = await Post.findOneAndDelete({
    _id: req.params.id,
    user: user._id,
  });

  if (!deletedPost) {
    return res.status(403).json("You can delete only your posts!");
  }

  res.status(200).json("Post has been deleted");
};

export const featurePost = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const postId = req.body.postId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const role = req.auth.sessionClaims?.metadata?.role || "user";

  if (role !== "admin") {
    return res.status(403).json("You cannot feature posts!");
  }

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json("Post not found!");
  }

  const isFeatured = post.isFeatured;

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      isFeatured: !isFeatured,
    },
    { new: true }
  );

  res.status(200).json(updatedPost);
};

export const getFeaturedPosts = async (req, res) => {
  try {
    const featuredPosts = await Post.find({ isFeatured: true })
      .populate("user", "username email img")
      .sort({ createdAt: -1 })
      .limit(4);

    // Filter out posts with null users and ensure usernames are valid
    const validFeaturedPosts = [];
    for (const post of featuredPosts) {
      if (!post.user) continue;
      
      try {
        // Ensure username is valid using utility function
        const validUsername = await ensureValidUsername(post.user);
        post.user.username = validUsername;
        validFeaturedPosts.push(post);
      } catch (error) {
        console.error('Error ensuring valid username for featured post:', post._id, error);
        continue;
      }
    }

    res.status(200).json({ featuredPosts: validFeaturedPosts });
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    res.status(500).json({ message: 'Failed to fetch featured posts' });
  }
};

export const getPostsByUser = async (req, res) => {
  try {
    const { username } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Find user by username
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get posts by this user
    const posts = await Post.find({ user: user._id })
      .populate("user", "username email img")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    // Ensure usernames are valid
    const validPosts = [];
    for (const post of posts) {
      if (!post.user) continue;
      
      try {
        const validUsername = await ensureValidUsername(post.user);
        post.user.username = validUsername;
        validPosts.push(post);
      } catch (error) {
        console.error('Error ensuring valid username for post:', post._id, error);
        continue;
      }
    }

    const totalPosts = await Post.countDocuments({ user: user._id });
    const hasMore = page * limit < totalPosts;

    res.status(200).json({ 
      posts: validPosts, 
      hasMore, 
      totalPosts,
      user: {
        username: user.username,
        img: user.img,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching posts by user:', error);
    res.status(500).json({ message: 'Error fetching posts by user' });
  }
};

export const savePost = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const { postId } = req.body;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  if (!postId) {
    return res.status(400).json("Post ID is required!");
  }

  try {
    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res.status(404).json("User not found!");
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json("Post not found!");
    }

    // Check if post is already saved
    if (user.savedPosts.includes(postId)) {
      return res.status(400).json("Post is already saved!");
    }

    // Add post to saved posts
    user.savedPosts.push(postId);
    await user.save();

    res.status(200).json({ message: "Post saved successfully", savedPosts: user.savedPosts });
  } catch (error) {
    console.error('Error saving post:', error);
    res.status(500).json({ message: 'Error saving post' });
  }
};

export const unsavePost = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const { postId } = req.body;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  if (!postId) {
    return res.status(400).json("Post ID is required!");
  }

  try {
    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res.status(404).json("User not found!");
    }

    // Remove post from saved posts
    user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId);
    await user.save();

    res.status(200).json({ message: "Post unsaved successfully", savedPosts: user.savedPosts });
  } catch (error) {
    console.error('Error unsaving post:', error);
    res.status(500).json({ message: 'Error unsaving post' });
  }
};

export const getSavedPosts = async (req, res) => {
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  try {
    const user = await User.findOne({ clerkUserId }).populate('savedPosts');
    if (!user) {
      return res.status(404).json("User not found!");
    }

    const savedPosts = await Post.find({ _id: { $in: user.savedPosts } })
      .populate("user", "username email img")
      .sort({ createdAt: -1 });

    // Ensure usernames are valid
    const validSavedPosts = [];
    for (const post of savedPosts) {
      if (!post.user) continue;
      
      try {
        const validUsername = await ensureValidUsername(post.user);
        post.user.username = validUsername;
        validSavedPosts.push(post);
      } catch (error) {
        console.error('Error ensuring valid username for saved post:', post._id, error);
        continue;
      }
    }

    res.status(200).json({ savedPosts: validSavedPosts });
  } catch (error) {
    console.error('Error fetching saved posts:', error);
    res.status(500).json({ message: 'Error fetching saved posts' });
  }
};

let imagekit = null;

const getImageKit = () => {
  if (!imagekit) {
    if (!process.env.IK_URL_ENDPOINT || !process.env.IK_URL_PUBLIC_KEY || !process.env.IK_URL_PRIVATE_KEY) {
      throw new Error('ImageKit configuration is missing. Please check your environment variables.');
    }

    imagekit = new ImageKit({
      urlEndpoint: process.env.IK_URL_ENDPOINT,
      publicKey: process.env.IK_URL_PUBLIC_KEY,
      privateKey: process.env.IK_URL_PRIVATE_KEY
    });
  }
  return imagekit;
};

export const uploadAuth = async (req, res) => {
  try {
    console.log('ImageKit Auth Request received');
    const imagekitInstance = getImageKit();
    const result = imagekitInstance.getAuthenticationParameters();
    console.log('ImageKit Auth Response:', { 
      hasSignature: !!result.signature, 
      hasExpire: !!result.expire, 
      hasToken: !!result.token 
    });
    res.status(200).json(result);
  } catch (error) {
    console.error('ImageKit Auth Error:', error);
    res.status(500).json({ 
      message: 'Failed to generate ImageKit authentication parameters',
      error: error.message
    });
  }
};
