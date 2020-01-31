const express=require('express');
const connectDB=require('./config/db');
const app=express();

const path= require('path')

connectDB();
app.use(express.json({ extended: false }));

const userRouter=require('./routes/api/users');
const profileRouter=require('./routes/api/profile');
const postsRouter=require('./routes/api/posts');
const authRouter=require('./routes/api/auth');

// app.get('/',(req,res)=>{

//   res.send('API running')
// })


//serve static aessect in production

if(process.env.NODE_ENV=== 'production'){
  app.use(express.static('client/build'))
  app.get('*', (req,res)=>{
    res.sendFile(path.resolve(_dirname, 'client', 'build', 'index.html'))
  })
}


//define routes
app.use('/api/users',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/profile',profileRouter);
app.use('/api/posts',postsRouter);

const PORT=process.env.PORT || 5000;

app.listen(PORT,console.log(`Server started on ${PORT}`))