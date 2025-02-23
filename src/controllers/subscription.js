import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.js";
import { Subscription } from "../models/subscription.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Incorrect Channel Id.");
  }
  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "The Channel does not exist.");
  }
  const subscription = await Subscription.findOne({
    subscriber: req.user._id,
    channel: channelId,
  });
  if (subscription) {
    await Subscription.findByIdAndDelete(subscription._id);
    return res
      .status(200)
      .json(
        new ApiResponse(200, { subscribed: false }, "Successfully Unsubscribed")
      );
  }
  const newSubscription = await Subscription.create({
    subscriber: req.user._id,
    channel: channelId,
  });
  if (!newSubscription) {
    throw new ApiError(500, "Something went wrong");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, { subscribed: true }, "Successfully Subscribed")
    );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Incorrect Channel Id.");
  }
  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "The Channel does not exist.");
  }
  const subscriberList = await Subscription.aggregate([
    {
      $match: {
        channel: mongoose.Types.ObjectId.createFromHexString(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriber",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
  ]);

  console.log(subscriberList);

  return res
    .status(200)
    .json(
      new ApiResponse(200, subscriberList, "Subscribers fetch successfully")
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Incorrect Subscriber Id.");
  }
  const subscriber = await User.findById(subscriberId);
  if (!subscriber) {
    throw new ApiError(404, "The Subscriber does not exist.");
  }
  const channelList = await Subscription.aggregate([
    {
      $match: {
        subscriber: mongoose.Types.ObjectId.createFromHexString(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channel",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
  ]);

  console.log(channelList);

  return res
    .status(200)
    .json(new ApiResponse(200, channelList, "Subscribers fetch successfully"));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
