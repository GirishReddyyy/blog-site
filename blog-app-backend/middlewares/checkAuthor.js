import { UserTypeModel } from '../models/UserModel.js';
export const checkAuthor = async (req, res, next) => {
    //get author id
    let authorId = req.body?.author || req.params?.authorID

    //verify author
    let author = await UserTypeModel.findById(authorId)
    //if author not found
    if (!author) {
        return res.status(401).json({ message: "Invalid Author" })
    }
    //if author found but role is different
    if(author.role!='AUTHOR'){
        return res.status(403).json({message:"User is not an Author"})
    }
    //if author blocked
    if(!author.isActive){
        return res.status(403).json({message:"Author account is not active"})
    }
    //forward req to next
    next()
}