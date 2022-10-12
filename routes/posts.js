const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// create a post
router.post("/", async (req, res) => {
    const newPost =  new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (error) {
        res.status(500).json(error);
    }
});

// update a post
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId){
           await post.updateOne({$set: req.body});
           res.status(200).json("the post has been updated!");
        } else {
         res.status(403).json("you can update only your post");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

// delete a post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId){
           await post.deleteOne();
           res.status(200).json("the post has been deleted!");
        } else {
         res.status(403).json("you can delete only your post");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

// like/dislike a post
router.put("/:id/like", async (req, res) => {
   try {
      const post = await Post.findById(req.params.id);
      if (!post.likes.includes(req.body.userId)){
        await post.updateOne({$push:{likes:req.body.userId}});
        res.status(200).json("you liked this post");
      } else {
        await post.updateOne({$pull:{likes:req.body.userId}});
        res.status(200).json("the post has been disliked");
      }
   } catch (error) {
     res.status(500).json(error);
   }
});

// get a post
router.get("/:id", async (req, res) => {
    try {
      const post =  await Post.findById(req.params.id);
      res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
});

// get timeline posts (from users i am following)
router.get("/timeline/all", async (req, res) => {
    try {
      //promise
      const currentUser = await User.findById(req.body.userId); //get current user
      const userPosts = await Post.find({userId: currentUser._id}); //get current users posts
      const friendsPosts = await Promise.all(
        currentUser.following.map((friendId) => {
          return  Post.find({userId:friendId});
        })
      );
      res.status(200).json(userPosts.concat(...friendsPosts));
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;