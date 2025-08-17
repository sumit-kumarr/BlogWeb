import { Schema, model } from "mongoose";


const commentSchema = new Schema({
   
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    desc:{
        type: String,
        required: true,
    },
    post:{
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    }


}, { timestamps: true })


export default model("Comment", commentSchema);