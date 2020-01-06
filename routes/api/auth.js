
const express=require('express');
const router = express.Router();
const auth=require('../../middleware/auth');
const {check, validationResult}=require('express-validator/check');
const User=require('../../modules/User');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const config=require('config'); 
//@route get api/auth
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Authenticate user & get token
router.post('/',
[
  check('email','Please include a valid email').isEmail(),
  check('password','Password is required')
  .isLength({min:6})
],

async(req,res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()});
  }

  const { email, password}=req.body;
  console.log(req.body);
  
  
  try{ 
     //see if the user exists
    let user=await User.findOne({email})
    if(!user){
       return res.status(404).json({errors:[{msg:'Invalid user'}]});
    }
    // get the user gavatar
   


   const isMatch= await bcrypt.compare(password, user.password);
   if(!isMatch){
    return res.status(404).json({errors:[{msg:'Invalid user'}]});
  }

    const payload={
      user:{
        id:user.id
      }
    }

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );

    }catch(err){
      console.log(err);
      res.status(500).send('server error');
  }

  // console.log(req.body);
  // res.send('Users route')

})


// router.post('/',(req,res)=>{

//   console.log(req.body);
//   res.send('User route')
// })


module.exports = router;