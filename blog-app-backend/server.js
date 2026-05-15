import exp from 'express'
import { connect } from 'mongoose'
import { config } from 'dotenv'
import { authorRoute } from './APIs/AuthorAPI.js'
import { adminRoute } from './APIs/AdminAPI.js'
import { userRoute } from './APIs/UserAPI.js'
import cookieParser from 'cookie-parser'
import { commonRouter } from './APIs/commonAPI.js'
import cors from 'cors'
import { UserTypeModel } from './models/UserModel.js'
import { register } from './services/authService.js'
import dns from 'node:dns'

// Force Node.js to use Google's public DNS servers (fixes MongoDB Atlas SRV lookup failures)
dns.setServers(['8.8.8.8', '8.8.4.4'])
dns.setDefaultResultOrder('ipv4first')

config() //process.env 

//create express application
const app = exp()
//use cors middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', 'https://blog-site-ten-pi.vercel.app'], credentials: true }))
//add body parser middleware
app.use(exp.json())
//add cookieparser middleware
app.use(cookieParser())


//connect APIs
app.use('/user-api', userRoute)
app.use('/author-api', authorRoute)
app.use('/admin-api', adminRoute)
app.use('/common-api', commonRouter)

//connect to db
const createAdminIfMissing = async () => {
    const adminEmail = "admin1@mail.com"
    const exists = await UserTypeModel.findOne({ email: adminEmail, role: "ADMIN" })
    if (exists) {
        console.log("Admin account already exists:", adminEmail)
        return
    }

    try {
        await register({
            firstName: "Admin",
            lastName: "User",
            email: adminEmail,
            password: "123456",
            role: "ADMIN",
            profileImageUrl: "",
        })
        console.log("Admin account created: admin1@mail.com / 123456")
    } catch (err) {
        console.log("Failed to create admin account:", err.message)
    }
}

const connectDB = async () => {
    try {
        await connect(process.env.DB_URL)
        console.log("DB connection success")
        await createAdminIfMissing()
        //start http server
        app.listen(process.env.PORT, () => console.log("Server started"))
    } catch (err) {
        console.log("Err in DB connection", err)
    }
}

connectDB()

//dealing with invalid path
app.use((req, res, next) => {
    console.log(req.url)
    res.json({ message: ` ${req.url} is Invalid path` })
})

// error handling middlware
app.use((err, req, res, next) => {
    //log the error to console for debugging
    console.log("Error:", err.message)
    console.log("Stack:", err.stack)

    //Mongoose Validation Error
    if (err.name == "ValidationError") {
        return res.status(400).json({
            message: "Validation Failed",
            errors: err.errors
        })
    }
    //Invalid Object ID
    if (err.name == "CastError") {
        return res.status(400).json({
            message: "Invalid ID format"
        })
    }
    //Duplicate Key
    if (err.code == 11000) {
        return res.status(400).json({
            message: "Duplicate Field Value"
        })
    }
    res.status(500).json({
        message: "Internal Server Error",
        error: err.message
    })
})