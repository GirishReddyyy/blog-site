import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config()

export const verifyToken = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            //read token from req
            const token = req.cookies.token;

            console.log("token:", token)
            if (token === undefined) {
                return res.status(400).json({ message: "Unauthorized req. please login" })
            }
            //verify the validity of the token ( decoding the token)
            let decodedToken = jwt.verify(token, process.env.JWT_SECRET)

            //check if role is allowed
            if (!allowedRoles.includes(decodedToken.role)) {
                return res.status(403).json({ message: "Forbidden. You dont have the permission" })
            }

            //attach user inof to req for use in routes
            req.user = decodedToken

            //foraward req to middleware/route
            next();
        } catch (err) {
            //jwt.verify throws if token is invalid/expired
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Session expired. Please login again" })
            }

            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: "Invalid token. Please login again" })
            }
            
            // Handle any other unexpected errors
            return res.status(401).json({ message: "Unauthorized request" })
        }
    }
}

//