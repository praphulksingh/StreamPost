import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

// Apply verifyJWT middleware to all routes in this file
router.use(verifyJWT); 

// 🔥 THE FIX IS HERE: Mapping the URLs to the correct controllers
router
    .route("/c/:channelId")
    .get(getUserChannelSubscribers)
    .post(toggleSubscription);

router
    .route("/u/:subscriberId")
    .get(getSubscribedChannels);

export default router;