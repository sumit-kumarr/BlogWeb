import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";

export const getPostComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "username img")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Failed to fetch comments", error: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const postId = req.params.postId;

    if (!clerkUserId) {
      return res.status(401).json({ message: "Not authenticated!" });
    }

    const user = await User.findOne({ clerkUserId });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newComment = new Comment({
      ...req.body,
      user: user._id,
      post: postId,
    });

    const savedComment = await newComment.save();
    
    // Populate user info before sending response
    const populatedComment = await Comment.findById(savedComment._id)
      .populate("user", "username img");

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Failed to add comment", error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const id = req.params.id;

    if (!clerkUserId) {
      return res.status(401).json({ message: "Not authenticated!" });
    }

    const role = req.auth.sessionClaims?.metadata?.role || "user";

    if (role === "admin") {
      await Comment.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: "Comment has been deleted" });
    }

    const user = await User.findOne({ clerkUserId });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedComment = await Comment.findOneAndDelete({
      _id: id,
      user: user._id,
    });

    if (!deletedComment) {
      return res.status(403).json({ message: "You can delete only your comment!" });
    }

    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Failed to delete comment", error: error.message });
  }
};