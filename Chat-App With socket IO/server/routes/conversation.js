const router = require("express").Router();
const Conversation = require("../models/conversation")

//new conersation


router.post("/", async (req, res) => {
    const newConversation = new Conversation({
      members: [req.body.senderId, req.body.receiverId],
    });
    let conversation = await Conversation.findOne({members:{$all:[req.body.senderId, req.body.receiverId]}})
    
    if(conversation){
      return res
          .status(409)
          .send({message:"Already user exist your recent Chat"})
    }
    try {
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    } catch (err) {
      res.status(500).json(err);
    }
  });

//get user conversation

router.get("/:userId", async (req, res) => {
    try {
      const conversation = await Conversation.find({
        members: { $in: [req.params.userId] },
      });
      res.status(200).json(conversation);
    } catch (err) {
      res.status(500).json(err);
    }
  });

//Delete userConversation
router.delete("/:conversationId", async (req, res) => {
  try {
    const conversation = await Conversation.deleteOne({
      _id: req.params.conversationId,
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

  module.exports = router;