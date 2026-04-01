import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";
import { UserTypeModel } from "../models/UserModel.js";
import { config } from 'dotenv'
config() //process.env

//register function
export const register = async (userObj) => {
    console.log("Registering user:", userObj)
    //create document
    const userDoc = new UserTypeModel(userObj)
    console.log("UserDoc created")
    //validate for empty passwords
    await userDoc.validate()
    console.log("Validation passed")
    //hash and replace plain password
    userDoc.password = await bcrypt.hash(userDoc.password, 10)
    console.log("Password hashed")
    //save
    const created = await userDoc.save()
    console.log("User saved")
    //convert document to object to remove password
    const newUserObj = created.toObject()
    //remove password
    delete newUserObj.password
    //return user obj without password
    return newUserObj
}

//authenticate function
export const authenticate = async ({ email, password }) => {
    console.log("Authenticate called with email:", email)
    //check user with email and role
    const user = await UserTypeModel.findOne({ email })
    console.log("User found:", user ? "Yes" : "No")
    if (!user) {
        const err = new Error("Invalid email")
        err.status = 401
        throw err
    }

    //if user valid but blocked by admin
    if (user.isActive === false) {
        const err = new Error("Your account is blocked, Please contact Admin")
        err.status = 403
        throw err
    }

    //compare passwords
    console.log("Comparing passwords...")
    const isMatch = await bcrypt.compare(password, user.password)
    console.log("Password match:", isMatch)
    if (!isMatch) {
        const err = new Error("Invalid Password")
        err.status = 401
        throw err
    }

    //generate token
    console.log("Generating token...")
    const token = jwt.sign({
        _id: user._id,
        role: user.role, email: user.email
    },
        process.env.JWT_SECRET, {
        expiresIn: "1h",
    })

    const userObj = user.toObject();
    delete userObj.password;

    return { token, user: userObj }

}
