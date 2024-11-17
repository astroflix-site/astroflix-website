const User = require('../models/user')

const checkRole = (requiredRole) => async(req,res,next)=>{
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if(!user) {
        return res.status(404).json({error:"user not found"});
    }
    if(user.role !== requiredRole) {
        return res.status(403).json({error:"Access denied"});
    }
    next();
  } catch (error) {
    console.log(error)
    res.status(500).json({error:"Internal server error"});
  }
};

module.exports = checkRole;
//lol
//lol dimag kharab hogaya}
// tu aage ka kr ladke wale ane waale hai didi ko dekhne ma jerha saman laane pc on rhyga
//required role kaya ha 
//simple middleware bnata isAdmin us main id la kr ro