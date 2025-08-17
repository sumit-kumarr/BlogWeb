import express from "express"
import { addComment, deleteComment, getPostComments } from "../controller/commentController.js"


const router = express.Router()

router.get("/:postId", getPostComments)
router.post("/:postId", addComment)
router.delete("/:id", deleteComment)

export default router 