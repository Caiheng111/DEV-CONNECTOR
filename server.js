const express=require('express');
const connectDB=require('./config/db');
const app=express();

connectDB();
app.use(express.json({ extended: false }));

const userRouter=require('./routes/api/users');
const profileRouter=require('./routes/api/profile');
const postsRouter=require('./routes/api/posts');
const authRouter=require('./routes/api/auth');

app.get('/',(req,res)=>{

  res.send('API running')
})


//define routes
app.use('/api/users',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/profile',profileRouter);
app.use('/api/posts',postsRouter);

const PORT=process.env.PORT || 5000;

app.listen(PORT,console.log(`Server started on ${PORT}`))