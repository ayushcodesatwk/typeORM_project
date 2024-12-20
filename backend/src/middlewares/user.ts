import { Request, Response, NextFunction } from "express";
import jwtoken from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

//whenever user makes any request in the home page we'll simply use this
// function to verify if he's login
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  console.log(token);

  if (token) {
    const data = jwtoken.verify(token, "chickiwikichicki") as JwtPayload;

    console.log("log the web token data", data);

    next(); 
  } else {
    console.log("LOGIN FAILED");
    return res.status(401).json({ msg: "ERROR LOGGING IN" });
  }
};

export default requireAuth;
