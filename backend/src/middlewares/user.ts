import jwtoken from "jsonwebtoken";

//whenever user makes any request in the home page we'll simply use this
// function to verify if he's login
const requireAuth = (req: any, res: any, next: any) => {
  const token = req.cookies.jwt;

  if (token) {
    jwtoken.verify(token, "chickiwikichicki", () => {});
    next();
  } else {
    console.log("LOGIN FAILED");
    return res.status(401).json({ msg: "ERROR LOGGING IN" });
  }
};

export default requireAuth;