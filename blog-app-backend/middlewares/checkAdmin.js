import { UserTypeModel } from "../models/UserModel.js";


export const checkAdmin = async (req, res,next) => {
    //get the admin details from the body
    let adminId = req.body?.adminId||req.params.adminId
    //check if admin exits
    let admin = await UserTypeModel.findById(adminId)
    //if admin not found
    if (!admin) {
        return res.status(401).json({ message: "admin not found!" })
    }
    //if admin is found but role is different
    if (admin.role !== "ADMIN") {
        return res.status(403).json({ message: "user is not an admin" })
    }
    next()
}