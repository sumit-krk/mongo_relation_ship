const express=require("express")

const mongoose = require("mongoose")

const connect = () => {
    return mongoose.connect("mongodb://127.0.0.1:27017/entertainment")
}

//user
//step-1(create schema)
const userSchema = new mongoose.Schema({
    id:{type:Number,required:true},
    first_name: {type:String,required:true}, 
    lastname_genre: {type:String,required:false},
    email: {type:String,required:true},
    gender: {type:String,required:true},
});

//step-2(connet the schema to collection)

const User = mongoose.model("user", userSchema); //users

//post
//Create the schema for post
const postSchema=new mongoose.Schema({
    title: {type:String,required:true},
    body: {type:String,required:true},
    author:{type:mongoose.Schema.Types.ObjectId,ref:"user",required:true},
    tag:[{type:mongoose.Schema.Types.ObjectId,ref:"tag",required:true}]
},{
    versionKey:false,// ignore --v
    timestamps:true//createdAt,updateAt
})
//connect post schema to mongo
const Post=mongoose.model("post",postSchema)

//**comment
//Create the schema for comment
const commentSchema=new mongoose.Schema({
    body: {type:String,required:true},
    post:{type:mongoose.Schema.Types.ObjectId,ref:"post",required:true},
},{
    versionKey:false,// ignore --v
    timestamps:true//createdAt,updateAt
})
//connect comment schema to comment collection
const Comment=mongoose.model("comment",commentSchema)

//tag

//Create the schema for comment
const tagSchema=new mongoose.Schema({
    name: {type:String,required:true}
},{
    versionKey:false,// ignore --v
    timestamps:true//createdAt,updateAt
})
//connect comment schema to comment collection
const Tag=mongoose.model("name",tagSchema)

const app=express();

app.use(express.json());

//CRUD api for users
//post
app.post("/users", async function (req, res) {
    const user = await User.create(req.body);
    return res.status(201).send({user})
})

//get
app.get("/users", async function (req, res) {
    const users = await User.find().lean().exec()
    return res.status(200).send({users})
})

//patch
app.patch("/users/:id", async function (req, res) {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
    return res.status(200).send({user})
})

//delete

app.delete("/users/:id", async function (req, res) {
    const user = await User.findByIdAndDelete(req.params.id)
    return res.status(200).send({user})
})

//get single movi
app.get("/users/:id", async function (req, res) {
    const user = await User.findById(req.params.id).lean().exec();
    return res.send(user)
})

//get all post of a user
app.get("/users/:id/posts",async(req,res) =>{
    const posts = await Post.find({author: req.params.id}).lean().exec();
    const author = await User.findById(req.params.id).lean().exec();

    return res.status(200).send({post,author});
})

//------CRUD API for post------------
app.post("/posts", async function (req, res) {
    const post = await Post.create(req.body);
    return res.status(200).send({post})
})

//getting all post
app.get("/posts", async function (req, res) {
    const post = await Post.find().populate("author").populate(tag).lean().exec()
    return res.status(200).send({post})
})
//get single post
app.get("/posts/:id", async function (req, res) {
    const post = await Post.findById(req.params.id).lean().exec();
    return res.status(200).send({post});
})

//update single post
app.patch("/posts/:id", async function (req, res) {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true}).lean().exec();
    return res.status(200).send({post})
})

//delete a single post
app.delete("/posts/:id", async function (req, res) {
    const post = await Post.findByIdAndDelete(req.params.id).lean().exec();
    return res.status(200).send({post})
})

//get all comment for a post
app.get("/users/:id/comments",async(req,res) =>{
    const comment = await Comment.find({author: req.params.id}).lean().exec();
    const post = await Post.findById(req.params.id);

    return res.status(200).send({comment,post});
})
//-------CRUD api for comment-----------------
//create a single comment
app.post("/comments", async function (req, res) {
    const comment = await Comment.create(req.body);
    return res.status(200).send({comment})
})
//get all comment
app.get("/comments", async function (req, res) {
    const comment= await Comment.find().lean().exec()
    return res.status(200).send({comment})
})
//get a single comment
app.get("/comments/:id", async function (req, res) {
    const comment = await Comment.findById(req.params.id).lean().exec();
    return res.status(200).send({comment});
})
//update a single comment
app.patch("/comments/:id", async function (req, res) {
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {new: true}).lean().exec();
    return res.status(200).send({comment})
})
//delete a single comments
app.delete("/comments/:id", async function (req, res) {
    const comment = await Comment.findByIdAndDelete(req.params.id).lean().exec();
    return res.status(200).send({comment})
})
//------CRUD Api for tag-------
//create a single ctag
app.post("/tags", async function (req, res) {
    const tag = await Tag.create(req.body);
    return res.status(200).send({tag})
})
//get all tag
app.get("/tags", async function (req, res) {
    const tag= await Tag.find().lean().exec()
    return res.status(200).send({tag})
})
//get a single tag
app.get("/tags/:id", async function (req, res) {
    const tag = await Tag.findById(req.params.id).lean().exec();
    return res.status(200).send({tag});
})
//update a single tag
app.patch("/tags/:id", async function (req, res) {
    const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, {new: true}).lean().exec();
    return res.status(200).send({tag})
})
//delete a single tag
app.delete("/tags/:id", async function (req, res) {
    const tag = await Tag.findByIdAndDelete(req.params.id).lean().exec();
    return res.status(200).send({tag})
})


app.listen(2345, async function (){
    await connect();
    console.log("listing port 2345")
});