
const express=require('express');
const router = express.Router();


//@route get api/user
router.get('/',(req,res)=>{
  res.send('Posts route')

})

module.exports=router;