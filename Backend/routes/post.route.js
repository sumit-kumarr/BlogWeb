import express from 'express';
import { getPosts, getPost, createPost, deletePost, uploadAuth, getFeaturedPosts, getPostsByUser, savePost, unsavePost, getSavedPosts } from '../controller/post.controller.js';

const router = express.Router();
router.get("/upload-auth", uploadAuth);

router.get("/", getPosts);
router.get("/featured", getFeaturedPosts);
router.get("/user/:username", getPostsByUser);
router.get("/:slug", getPost);
router.post("/", createPost);
router.delete("/:id",deletePost);

// Save/Unsave post routes
router.post("/save", savePost);
router.post("/unsave", unsavePost);
router.get("/saved/all", getSavedPosts);

export default router;