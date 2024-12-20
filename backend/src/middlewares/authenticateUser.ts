import { NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
const JWT_SECRET = 'chickiwikichicki';

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {

    
    // const token = req.cookies.jwt;
    // console.log("token from authenticator",token);
    

    // if (!token) {
    //     return res.sendStatus(403);
    // }

    try {
         
        // const data = jwt.verify(token, JWT_SECRET) as JwtPayload
        // console.log('data from authenticate user,',data);
        
         //attaching the userId in the req object
        next(); // prodceeding to the next middleware or router
    } catch (error) {
        //  res.sendStatus(403);
    }

};
