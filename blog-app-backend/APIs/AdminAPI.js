import exp from 'express'
import { ArticleModel } from '../models/ArticleModel.js'
import { UserTypeModel } from '../models/UserModel.js'
import { authenticate, register } from '../services/authService.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import { checkAdmin } from '../middlewares/checkAdmin.js'
export const adminRoute = exp.Router()

//Authenticate admin
adminRoute.post('/authenticate', async (req, res) => {
    //get admin cred object
    let userCred = req.body
    //call authenticate function
    let { token, admin } = await authenticate(userCred)
    //save the token as a httponly cookie
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    //send the res
    res.status(200).json({ message: "admin logged in!", payload: admin })
})

//Read all users (by admin)
adminRoute.get("/users/:adminId", verifyToken("ADMIN"), checkAdmin, async (req, res) => {
    //get the admin id from the url params
    let adminId = req.params.adminId;
    //optional: use adminId for audit/validation if needed
    //get all normal users (not admin)
    let usersList = await UserTypeModel.find({ role: "USER" })
    //send the res
    res.status(200).json({ message: "users:", payload: usersList })
})

//Read all articles
adminRoute.get("/articles/:adminId", verifyToken("ADMIN"), checkAdmin, async (req, res) => {
    //get the admin id from the url params
    let adminId = req.params.adminId;
    //get the articles
    let articlesList = await ArticleModel.find({ isArticleActive: true }).populate("author", "firstName lastName").populate("comments.user", "firstName lastName")
    //send the res
    res.status(200).json({ message: "articles:", payload: articlesList })
})
//Block user roles
adminRoute.put('/block/:uid/adminId/:adminId', verifyToken("ADMIN"), checkAdmin, async (req, res) => {
    //get the user id and the admin id from the url
    let uid = req.params.uid
    let adminId = req.params.adminId
    //check if the user exists
    let user = await UserTypeModel.findById(uid)
    if(!user || user.role !== "USER"){
        return res.json({message:"user not found"})
    }
    //update the isActive field in the user
    let modifiedUser = await UserTypeModel.findByIdAndUpdate(
        uid,
        {$set:{isActive:false}},
        {new:true}
    )
    //send the res
    res.status(200).json({message:"user is blocked!"})

})

// Unblock user roles 
adminRoute.put('/unblock/:uid/adminId/:adminId', verifyToken("ADMIN"), checkAdmin, async (req, res) => {
    //get the user id and the admin id from the body
    let uid = req.params.uid
    let adminId = req.params.adminId
    //check if the user exists
    let user = await UserTypeModel.findById(uid)
    if(!user || user.role !== "USER"){
        return res.json({message:"user not found"})
    }
    //update the isActive field in the user
    let modifiedUser = await UserTypeModel.findByIdAndUpdate(
        uid,
        {$set:{isActive:true}},
        {new:true}
    )
    //send the res
    res.status(200).json({message:"user is unblocked!"})
})

// Deactivate article
adminRoute.put('/deactivate/:articleId/adminId/:adminId', verifyToken("ADMIN"), checkAdmin, async (req, res) => {
    //get the article id and admin id from the url
    let articleId = req.params.articleId
    let adminId = req.params.adminId
    //check if the article exists
    let article = await ArticleModel.findById(articleId)
    if(!article){
        return res.status(404).json({message:"article not found"})
    }
    //update the isArticleActive field
    let modifiedArticle = await ArticleModel.findByIdAndUpdate(
        articleId,
        {$set:{isArticleActive:false}},
        {new:true}
    )
    //send the res
    res.status(200).json({message:"article deactivated!"})
})

// Activate article
adminRoute.put('/activate/:articleId/adminId/:adminId', verifyToken("ADMIN"), checkAdmin, async (req, res) => {
    //get the article id and admin id from the url
    let articleId = req.params.articleId
    let adminId = req.params.adminId
    //check if the article exists
    let article = await ArticleModel.findById(articleId)
    if(!article){
        return res.status(404).json({message:"article not found"})
    }
    //update the isArticleActive field
    let modifiedArticle = await ArticleModel.findByIdAndUpdate(
        articleId,
        {$set:{isArticleActive:true}},
        {new:true}
    )
    //send the res
    res.status(200).json({message:"article activated!"})
})