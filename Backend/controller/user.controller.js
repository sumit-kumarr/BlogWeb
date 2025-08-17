import User from "../models/user.model.js";
import Post from "../models/post.model.js";

// Get user profile by username
export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ username }).select("-__v");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get posts by this user
    const userPosts = await Post.find({ user: user._id })
      .select("title slug desc category createdAt visit img")
      .sort({ createdAt: -1 })
      .limit(10);

    const userProfile = {
      ...user.toObject(),
      posts: userPosts,
      postCount: userPosts.length
    };

    res.status(200).json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

// Get all users (for admin purposes)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("username email img createdAt").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { clerkUserId } = req.auth;
    
    if (!clerkUserId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findOne({ clerkUserId });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only allow updating certain fields
    const allowedUpdates = ['username', 'img'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      updates,
      { new: true, runValidators: true }
    ).select("-__v");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating user profile' });
  }
};

// Clean up and fix invalid usernames for all users
export const cleanupUsernames = async (req, res) => {
  try {
    const users = await User.find({});
    let updatedCount = 0;
    let errors = [];

    for (const user of users) {
      try {
        if (!user.username || 
            user.username.trim() === '' || 
            user.username.includes('@') || 
            user.username === 'unnamed_user' || 
            user.username === 'Unknown User' || 
            user.username === 'no-email') {
          
          // Generate a new username from email or clerkUserId
          let newUsername;
          if (user.email && user.email !== 'no-email' && user.email.includes('@')) {
            newUsername = user.email.split('@')[0];
          } else {
            newUsername = `user_${Math.random().toString(36).substr(2, 8)}`;
          }

          // Update the user's username
          await User.findByIdAndUpdate(user._id, { username: newUsername });
          updatedCount++;
          console.log(`Updated username for user ${user._id} to ${newUsername}`);
        }
      } catch (error) {
        errors.push({ userId: user._id, error: error.message });
        console.error(`Error updating username for user ${user._id}:`, error);
      }
    }

    res.status(200).json({ 
      message: `Successfully updated ${updatedCount} usernames`,
      updatedCount,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error cleaning up usernames:', error);
    res.status(500).json({ message: 'Error cleaning up usernames' });
  }
};
