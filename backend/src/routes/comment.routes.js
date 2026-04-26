import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
    addReply,
    getTweetComments, 
    addCommentToTweet 
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

// 🔥 CRITICAL FIX: Specific routes MUST go above the dynamic /:videoId route
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);
router.route("/reply/:commentId").post(addReply);
router.route("/t/:tweetId").get(getTweetComments).post(verifyJWT, addCommentToTweet);

// 👇 The dynamic video ID route goes LAST
router.route("/:videoId").get(getVideoComments).post(addComment);

export default router;