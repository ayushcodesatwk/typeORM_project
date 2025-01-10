import { Request, Response, NextFunction } from "express";
import jwtoken from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

// adding custom property on the request object to store the userId
export interface RequestWithUserId extends Request {
  userId: string;
}

//NEVER USE RETURN STATEMENTS IN THE MIDDLEWARE FUNCTION
//JUST SEND THE RESPONSE
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  
  // Check if the token exists
  if (!token) {
    res.status(401).json({ msg: "No token provided", error: "Unauthorized" });
  }

  try {
    // Verify the token using the secret to decode its payload
    const data = jwtoken.verify(token, "chickiwikichicki") as JwtPayload;
    
    // Log the decoded token data to the console for debugging
    console.log("log the web token data--", data);
    
    // If the token is valid attach the userId to the request object
    (req as RequestWithUserId).userId = data.id;
    // Call the next middleware function
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ msg: "Token has expired", error: "TokenExpiredError" });
    } else if (error.name === "JsonWebTokenError") {
      res.status(401).json({ msg: "Invalid token", error: "JsonWebTokenError" });
    } else {
      console.error("Error verifying token:", error);
      res.status(500).json({ msg: "Internal server error", error: "InternalServerError" });
    }
  }
};

export default requireAuth;