const router = require("express").Router();
const { User } = require("../models/user");



router.get("/:_id", async (req, res) => {
    const userId = req.params._id;
	
		try {
		  const user = await User.findById(userId)
		  res.status(200).json(user);
		} catch (err) {
		  res.status(500).json(err);
		}
  });


//All users

router.get("/users/all", async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  });

//User update
router.put("/:_id",async (req,res)=>{
  try {
    var update={
      profile: req.body.profile,
      userName:req.body.userName,
      mobileNo:req.body.mobileNo,
      email:req.body.email
    };
    const Newupdate = await User.findByIdAndUpdate(req.params._id,{$set:update});
    if(!Newupdate){
      res.status(400).json();
    }
   
    res.status(200).json(Newupdate);
  } catch (error) {
      res.status(500).json(error);
  }
})





module.exports = router;
