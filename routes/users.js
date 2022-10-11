const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Update user
  router.put("/:id", async (req, res) => {
          if (req.body.userId === req.params.id || req.body.isAdmin ){
            
            if(req.body.password){
              try {
                  //generate new password
                   const salt = await bcrypt.genSalt(10);
                   req.body.password = await bcrypt.hash(req.body.password, salt);

              } catch (error) {
                return res.status(500).json(error);
              }
            }

            try {
              const user = await User.findByIdAndUpdate(req.params.id, {
                $set:req.body
              });
              res.status(200).json("Account has been updated!");
            } catch (error) {
              return res.status(500).json(error);
            }

          } else {
            return res.status(403).json("You can't update other's account!");
          }
  });

// Delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin ){

    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted!");
    } catch (error) {
      return res.status(500).json(error);
    }
    
  } else {
    return res.status(403).json("You can't delete other's account!");
  }
});

// Get a user
router.get("/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const {password, updatedAt, ...other} = user._doc; 

      res.status(200).json(other);
    } catch (error) {
      return res.status(500).json(error);
    }
});

// Follow a user
router.put("/:id/follow", async (req, res) => {
  if(req.body.userId !== req.params.id){
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (!user.followers.includes(req.body.userId)){        
      await user.updateOne({ $push: {followers:req.body.userId} });
      await currentUser.updateOne({ $push: {following:req.params.id} });
      res.status(200).json("you are now following this user!");

      } else {
        res.status(403).json("you already follow this user!");
      }
    } catch (error) {
       res.status(500).json(error);
    }
  } else {
    res.status(403).json("you can't follow yourself");
  }
})

// Unfollow a user

module.exports = router;