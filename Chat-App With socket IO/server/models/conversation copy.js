const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema(
  {
    conversationName:{type:String},
    reciver: {
      type: Array,
    },
    sender:{
      type: Array,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", GroupSchema);