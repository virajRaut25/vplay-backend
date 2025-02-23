import { Router } from "express";
import { verifyJWT } from "../middleware/auth.js";
import {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
} from "../controllers/subscription.js";

const router = Router();
router.use(verifyJWT);

router.route("/toggle-subs/:channelId").post(toggleSubscription);
router.route("/subs/:channelId").get(getUserChannelSubscribers);
router.route("/subscribed-to/:subscriberId").get(getSubscribedChannels);

export default router;
