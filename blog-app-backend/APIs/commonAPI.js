import exp from 'express'
import bcrypt from "bcrypt"
import { authenticate } from '../services/authService.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { UserTypeModel } from '../models/UserModel.js';
export const commonRouter = exp.Router()

//login
commonRouter.post('/login', async (req, res) => {
    try {
        let userCred = req.body;
        let { token, user } = await authenticate(userCred);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        res.status(200).json({ message: "logged in successfully!", payload: user });
    } catch (err) {
        console.log("Authentication error:", err.message);
        res.status(err.status || 500).json({ message: err.message });
    }
})

//logout
commonRouter.get('/logout', async (req, res) => {
    //clear the cookie named 'token'
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })
    res.status(200).json({ message: "logged out successfully" })
})

//password update
commonRouter.put('/change-password', async (req, res) => {
    // //get the current password and new password
    // let {currentPassword,newPassword,email}=req.body
    // //check if the old password of the user is correct
    // let {user}=await authenticate({password:currentPassword,email:email})
    // //update the current password with new password
    // let hashedPassword=await bcrypt.hash(newPassword,10)
    // let userObj=await UserTypeModel.findByIdAndUpdate(
    //     user._id,
    //     {
    //         $set:{password:hashedPassword}
    //     },
    //     {new:true}
    // )

    // //send res
    // res.status(200).json({message:"password updated",payload:userObj})


    //get current password and new password
    const { role, email, currentPassword, newPassword } = req.body;
    // Prevent same password
    if (currentPassword === newPassword) {
        return res.status(400).json({ message: "newPassword must be different from currentPassword" });
    }

    // Find user by email (works for USER, AUTHOR, ADMIN — all same collection)
    const account = await UserTypeModel.findOne({ email });
    if (!account) {
        return res.status(404).json({ message: "Account not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, account.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Current password is incorrect" });
    }
    // Hash and save new password
    account.password = await bcrypt.hash(newPassword, 10);
    await account.save();

    res.status(200).json({ message: "Password changed successfully" });
})

//Page refresh
commonRouter.get("/check-auth", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res) => {
    try {
        // Get full user object from database instead of just JWT payload
        const user = await UserTypeModel.findById(req.user._id).select("-password");
        res.status(200).json({ message: "authenticated", payload: user })
    } catch (err) {
        res.status(401).json({ message: "Invalid session" })
    }
})