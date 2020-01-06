
const express=require('express');
const router = express.Router();
const jwt=require('jsonwebtoken');

const {check, validationResult}=require('express-validator/check');
const User=require('../../models/User');

const bcrypt=require('bcryptjs');
const gravatar=require('gravatar');
const config=require('config');


// @route get api/user
router.post('/',
[
  check('name','Please input your name')
  .not()
  .isEmpty(),
  check('email','Please include a email').isEmail(),
  check('password','Please input your password')
  .isLength({min:6})
],
async(req,res)=>{
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()});
  }

  const {name, email, password}=req.body;
  console.log(req.body);
  
  
  try{ 
     //see if the user exists
    let user=await User.findOne({email})
    if(user){
       return res.status(404).json({errors:[{msg:'User already exist'}]});
    }
    // get the user gavatar
    const avatar=gravatar.url(email,{
      s:'200',
      r:'pg',
      d:'mm'
    })
    user=new User({name, email,avatar, password})

    //encrypt the password
    const slat=await bcrypt.genSalt(10);
    user.password=await bcrypt.hash(password,slat);
    await user.save();

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

module.exports=router;