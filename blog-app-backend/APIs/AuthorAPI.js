import exp from 'express'
import { register, authenticate } from '../services/authService.js';
import { ArticleModel } from '../models/ArticleModel.js';
import { UserTypeModel } from '../models/UserModel.js';
import { checkAuthor } from '../middlewares/checkAuthor.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { uploadToCloudinary } from '../config/cloudinaryUpload.js';
import { upload } from '../config/multer.js';
export const authorRoute = exp.Router()


//Register author(public route)
authorRoute.post("/users", upload.single("profileImageUrl"),async (req, res, next) => {
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
                role: "AUTHOR",
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

//Create article(protected route)
authorRoute.post('/articles', verifyToken("AUTHOR"), checkAuthor, async (req, res) => {
    //get article form body
    let article = req.body
    //check for the author
    //middleware will check the author and pass the control here if author is valid
    //create article document
    let newarticleDOc = new ArticleModel(article)
    //save
    let createdArticleDoc = await newarticleDOc.save()
    //send res
    res.status(201).json({ message: "Article created successfully", payload: createdArticleDoc })
})

//Read articles of author(protected route)
authorRoute.get('/articles/:authorID', verifyToken("AUTHOR"), checkAuthor, async (req, res) => {
    //get author id
    let authorId = req.params.authorID
    //check the author middle ware is handling this
    // let author=await UserTypeModel.findById(authorId)
    // if(!author || author.role != "AUTHOR"){
    //     return res.status(401).json({message:"Invalid Author"})
    // }

    //read articles by this author
    //let articles=await ArticleModel.find({author:authorId})

    //read articles by this author which are active
    let articles = await ArticleModel.find({ author: authorId, isArticleActive: true }).populate("author", "firstName email")

    //send res
    res.status(200).json({ message: "articles of the author", payload: articles })
})

//Edit article(protected route)
authorRoute.put("/articles", verifyToken("AUTHOR"), checkAuthor, async (req, res) => {
    //get modified article from req
    // let modifiedArticle=req.body

    let { articleId, title, category, content, author } = req.body

    //find article
    let articleOfDB = await ArticleModel.findOne({ _id: articleId, author: author })
    if (!articleOfDB) {
        return res.status(404).json({ message: "article not found" })
    }

    //update the article
    //let updatedArticle=await ArticleModel.findByIdAndUpdate(modifiedArticle.articleid,modifiedArticle,{new:true})
    let updatedArticle = await ArticleModel.findByIdAndUpdate(
        articleId,
        {
            $set: { title, category, content }
        },
        { new: true }
    )

    //send res(updated article)
    res.status(200).json({ message: "article updated successfully", payload: updatedArticle })
})

//Delete article(soft delete) (protected route)
authorRoute.patch('/articles-delete', verifyToken("AUTHOR"), async (req, res) => {
    //get article id and new status
    let { articleId, isArticleActive } = req.body

    //find article
    let article = await ArticleModel.findById(articleId)
    if (!article) {
        return res.status(404).json({ message: "article not found" })
    }

    //AUTHOR can only modify their own articles
    if (req.user.role === 'AUTHOR' && article.author.toString() != req.user._id) {
        return res.status(403).json({ message: "Forbidden. You can modify only your articles " })
    }

    //already in requested state
    if (article.isArticleActive === isArticleActive) {
        return res.status(400).json({ message: `Article is already ${isArticleActive ? "active" : "deleted"}` })
    }

    //update status
    article.isArticleActive = isArticleActive;
    let updatedArticle = await article.save()

    //send res(updated article)
    res.status(200).json({ message: "article deleted successfully", payload: updatedArticle })

})