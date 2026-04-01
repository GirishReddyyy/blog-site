import { UserTypeModel } from "../models/UserModel.js"

export const userCheck=async(req,res,next)=>{
    //get the user id
    let uid = req.params?.uid || req.body.user
    //verify user
    let user = await UserTypeModel.findById(uid)
    //if user not found
    if(!user){
        return res.status(401).json({message:"user not found!"})
    }
    //if user is found but role is different
    if(user.role!=="USER"){
        return res.status(403).json({message:"user is not an user"})
    }
    //if user is blocked
    if(!user.isActive){
        return res.status(403).json({message:"user is blocked. Please contact admin to make it unblocked!"})
    }
    //forward the req to next
    next()
}