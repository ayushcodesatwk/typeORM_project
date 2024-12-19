import {Request, Response, NextFunction} from 'express';
import { AppDataSource } from "../data-source";
import { Users } from "../entities/user";
import bcrypt from "bcrypt";
import { createToken } from "../service/auth";
import requireAuth from "../middlewares/user";
import { Cart } from "../entities/cart";

//creating a new user
export const handleCreateNewUser = async (req: Request, res: Response) => {
  const { fname, lname, address, phone, email, password } = req.body;
  console.log(fname, address);

  const userRepo = AppDataSource.getRepository(Users);

  //check if user already exists in db
  const user = await userRepo.findOne({ where: { email } });

  console.log("user--", user);

  if (!user) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = userRepo.create({
      firstname: fname,
      lastname: lname,
      email: email,
      password: hashedPassword,
      phone: phone,
      address: address,
    });

    console.log(newUser);

    const result = await userRepo.save(newUser);

    const token = createToken({ id: result.id });

    console.log("l 36", token);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    res.status(201);
    console.log("Success: new user created", result.id);
    return;
  } else {
    res.status(201);
    console.log(`user already exists ${user}`);
    return;
  }
};

//handle login
export const handleUserLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log("line 57 user login", email, password);

  const userRepo = AppDataSource.getRepository(Users);
  const user = await userRepo.findOne({ where: { email } });

  console.log(user);

  try {
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        console.log("Wrong password");
        return;
      } else {
        const token = createToken({ id: user.id });
        console.log("token login-- 72-- ", token);

        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 15 * 60 * 1000,
          path: "/", // Specify the path (root path by default)
        });

        res.status(200).json({ message: "Login successful", token });
        return;
      }
    }
  } catch (error) {
    res.status(400).send({ error: `user not found ${error}` });
  }
};

// handle logout
export const logoutOnGetRequest = async (req: Request, res: Response) => {
  const cookies = req.cookies.jwt;
  console.log("logoutToken", cookies); // Debug: Check if the token exists
  res.clearCookie("jwt");

  res.status(200).json({ msg: "token cookie cleared " });

  return
  // if (token) {
  //     // Clear the cookie with the same path used when setting the cookie
  //     res.clearCookie('jwt', {
  //         path: "/", // Ensure the path matches how the cookie was set
  //     });
  //     return res.status(200).json({ msg: "Cookie cleared, user logged out" });
  // }
  // return res.status(400).json({ msg: "No cookie found" });
};


// adding item to cart
export const addItemToCart = async (req: Request, res: Response, next: NextFunction) => {
  
  requireAuth(req, res, next); // middleware authenticates the user if loggedin

  const { product } = req.body;

  const productId = product.id;

  const cartRepo = AppDataSource.getRepository(Cart);
  
  try {

    let cart = await cartRepo.findOne({
        where: { product: product }
    })

    if(!cart){
      cart = new Cart();
      
      await cartRepo.save(cart);  
    }

    res.status(200).json({ message: 'Item added to cart successfully!' });

  } catch (error) {
    console.error('Error adding item to cart: ', error);
    res.status(500).json({ message: 'Error adding item to cart.' });
  }
}   