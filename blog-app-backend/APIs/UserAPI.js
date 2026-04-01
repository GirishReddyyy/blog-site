import exp from 'express'
import { register } from '../services/authService.js';
import { UserTypeModel } from '../models/UserModel.js';
import { ArticleModel } from '../models/ArticleModel.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { uploadToCloudinary } from '../config/cloudinaryUpload.js';
import { upload } from '../config/multer.js';
export const userRoute = exp.Router()

//Register user
userRoute.post("/users", upload.single("profileImageUrl"),async (req, res, next) => {
        let cloudinaryResult;

        try {
            //get user obj
            let userObj = req.body;

            //  Step 1: upload image to cloudinary from memoryStorage (if exists)
            if (req.file) {
                cloudinaryResult = await uploadToCloudinary(req.file.buffer);
            }

            // Step 2: call existing register()
            const newUserObj = await register({
                ...userObj,
                role: "USER",
                profileImageUrl: cloudinaryResult?.secure_url || null,
            });

            res.status(201).json({
                message: "user created",
                payload: newUserObj,
            });

        } catch (err) {

            // Step 3: rollback 
            if (cloudinaryResult?.public_id) {
                await cloudinary.uploader.destroy(cloudinaryResult.public_id);
            }

            next(err); // send to your error middleware
        }   

    }
);

//Read all articles(protected route)
userRoute.get('/articles/:userId', verifyToken("USER"), async (req, res, next) => {
    try {
        console.log("Get articles request for user:", req.params.userId)
        //get userid
        let userId = req.params.userId
        //check if user is verified
        let user = await UserTypeModel.findById(userId)
        console.log("User found:", user ? "Yes" : "No")
        if (!user || user.role != "USER" || !user.isActive) {
            return res.status(403).json({ message: "not a valid user" })
        }

        //fetch articles
        let articles = await ArticleModel.find({ isArticleActive: true })
        console.log("Articles found:", articles.length)
        if (!articles || articles.length === 0) {
            return res.status(200).json({ message: "No articles found", payload: [] })
        }
        //send res
        res.status(200).json({ message: "articles", payload: articles })
    } catch (err) {
        console.log("Error fetching articles:", err.message)
        next(err)
    }
})

//Get single article by ID (protected route)
userRoute.get('/article/:articleId', verifyToken("USER", "AUTHOR"), async (req, res, next) => {
    try {
        let articleId = req.params.articleId
        //fetch article and populate author info
        let article = await ArticleModel.findById(articleId).populate("author", "firstName email profileImageUrl").populate("comments.user", "email firstName")
        
        if (!article) {
            return res.status(404).json({ message: "Article not found" })
        }
        
        res.status(200).json({ message: "article fetched", payload: article })
    } catch (err) {
        console.log("Error fetching article:", err.message)
        next(err)
    }
})


//Add comment to an article(protected route)
userRoute.put('/articles', verifyToken("USER"), async (req, res, next) => {
    try {
        //get article id and comment from req body
        let { articleId, comment } = req.body
        //get user id from authenticated user
        let userId = req.user._id

        //find and check if article exists
        let article = await ArticleModel.findById(articleId)
        if (!article || !article.isArticleActive) {
            return res.status(404).json({ message: "Article not found" })
        }

        //add comment to article
        article.comments.push({ user: userId, comment })
        await article.save()

        //populate user data for response
        let articleWithComment = await ArticleModel.findById(articleId)
            .populate("author", "firstName email profileImageUrl")
            .populate("comments.user", "email firstName")

        //send response with updated article
        res.status(200).json({ message: "Comment added successfully", payload: articleWithComment })
    } catch (err) {
        next(err)
    }
})
