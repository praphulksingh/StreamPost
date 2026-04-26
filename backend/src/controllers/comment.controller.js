import mongoose, { isValidObjectId } from "mongoose";
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const userId = req.user?._id ? new mongoose.Types.ObjectId(req.user._id) : null;

    const commentsAggregate = Comment.aggregate([
        {
            // 1. Fetch only Top-Level Comments
            $match: {
                video: new mongoose.Types.ObjectId(videoId),
                parentComment: { $exists: false } 
            }
        },
        {
            $lookup: { from: "users", localField: "owner", foreignField: "_id", as: "owner" }
        },
        { $unwind: "$owner" },
        // 2. Calculate Likes for Top-Level Comment
        {
            $lookup: { from: "likes", localField: "_id", foreignField: "comment", as: "likes" }
        },
        {
            $addFields: {
                likesCount: { $size: "$likes" },
                isLiked: { $in: [userId, "$likes.likedBy"] }
            }
        },
        // 3. Fetch Replies AND Calculate their Likes
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "parentComment",
                pipeline: [
                    { $lookup: { from: "users", localField: "owner", foreignField: "_id", as: "owner" } },
                    { $unwind: "$owner" },
                    { $lookup: { from: "likes", localField: "_id", foreignField: "comment", as: "likes" } },
                    {
                        $addFields: {
                            likesCount: { $size: "$likes" },
                            isLiked: { $in: [userId, "$likes.likedBy"] }
                        }
                    },
                    { $project: { likes: 0 } }, // Clean up payload
                    { $sort: { createdAt: 1 } } // Oldest replies first
                ],
                as: "replies"
            }
        },
        { $project: { likes: 0 } }, // Clean up payload
        { $sort: { createdAt: -1 } } // Newest main comments first
    ]);

    const options = { page: parseInt(page, 10), limit: parseInt(limit, 10) };
    const comments = await Comment.aggregatePaginate(commentsAggregate, options);

    return res.status(200).json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params;
    const {content} = req.body;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Comment content is required");
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    });

    if (!comment) {
        throw new ApiError(500, "Something went wrong while adding the comment");
    }

    return res.status(201).json(
        new ApiResponse(201, comment, "Comment added successfully")
    );
})

const updateComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params;
    const {content} = req.body;

    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Comment content is required");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // Check ownership
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You do not have permission to update this comment");
    }

    comment.content = content;
    const updatedComment = await comment.save();

    return res.status(200).json(
        new ApiResponse(200, updatedComment, "Comment updated successfully")
    );
})

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params;

    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // Check ownership
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You do not have permission to delete this comment");
    }

    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Comment deleted successfully")
    );
});
const addReply = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
        throw new ApiError(400, "Reply content is required");
    }

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    // Find the original comment to ensure it exists
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
        throw new ApiError(404, "Original comment not found");
    }

    // Create the reply
    const reply = await Comment.create({
        content,
        video: parentComment.video, // Tie it to the same video
        owner: req.user._id,
        parentComment: commentId    // Tie it to the original comment
    });

    return res.status(201).json(new ApiResponse(201, reply, "Reply added successfully"));
});


const getTweetComments = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!isValidObjectId(tweetId)) throw new ApiError(400, "Invalid tweet ID");

    const userId = req.user?._id ? new mongoose.Types.ObjectId(req.user._id) : null;

    const commentsAggregate = Comment.aggregate([
        {
            $match: {
                tweet: new mongoose.Types.ObjectId(tweetId), // Match the tweet!
                parentComment: { $exists: false } 
            }
        },
        { $lookup: { from: "users", localField: "owner", foreignField: "_id", as: "owner" } },
        { $unwind: "$owner" },
        { $lookup: { from: "likes", localField: "_id", foreignField: "comment", as: "likes" } },
        {
            $addFields: {
                likesCount: { $size: "$likes" },
                isLiked: { $in: [userId, "$likes.likedBy"] }
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "parentComment",
                pipeline: [
                    { $lookup: { from: "users", localField: "owner", foreignField: "_id", as: "owner" } },
                    { $unwind: "$owner" },
                    { $lookup: { from: "likes", localField: "_id", foreignField: "comment", as: "likes" } },
                    {
                        $addFields: {
                            likesCount: { $size: "$likes" },
                            isLiked: { $in: [userId, "$likes.likedBy"] }
                        }
                    },
                    { $project: { likes: 0 } },
                    { $sort: { createdAt: 1 } }
                ],
                as: "replies"
            }
        },
        { $project: { likes: 0 } },
        { $sort: { createdAt: -1 } }
    ]);

    const options = { page: parseInt(page, 10), limit: parseInt(limit, 10) };
    const comments = await Comment.aggregatePaginate(commentsAggregate, options);

    return res.status(200).json(new ApiResponse(200, comments, "Tweet comments fetched successfully"));
});

const addCommentToTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!content) throw new ApiError(400, "Content is required");
    if (!isValidObjectId(tweetId)) throw new ApiError(400, "Invalid tweet ID");

    const comment = await Comment.create({
        content,
        tweet: tweetId, // Attach it to the tweet
        owner: req.user._id
    });

    return res.status(201).json(new ApiResponse(201, comment, "Comment added successfully"));
});



export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment,
    addReply,
    getTweetComments, 
    addCommentToTweet
}