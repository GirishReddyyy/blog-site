import { Schema,model } from "mongoose";

const UserSchema = new Schema({
    firstName:{
        type:String,
        required:[true,"First name is required"]
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:[true,"email already existed"]
    },
    password:{
        type:String,
        required:[true,"password is required"],
        minlength:[6,"password must be at least 6 characters"]
    },
    profileImageUrl:{
        type:String,
    },
    role:{
        type:String,
        enum:["AUTHOR","USER","ADMIN"],
        required:[true,"{Value} is an invalid role"]
    },
    isActive:{
        type:Boolean,
        default:true,
    }
},
{
    timestamps:true,
    strict:"throw",
    versionKey:false,
    collection:"blog-users"
})


//create model
export const UserTypeModel=model("user",UserSchema)