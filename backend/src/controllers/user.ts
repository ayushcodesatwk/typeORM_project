import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { Users } from "../entities/user";
import bcrypt from "bcrypt";
import { createToken } from "../service/auth";
import { Cart } from "../entities/cart";
import requireAuth from "../middlewares/user";
import { JwtPayload } from "jsonwebtoken";
import jwtoken from "jsonwebtoken";
import { Product } from "../entities/product";

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

  return;
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
export const addItemToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  // middleware authenticates the user if loggedin
  const cartRepo = AppDataSource.getRepository(Cart);
  const userRepo = AppDataSource.getRepository(Users);
  const productRepo = AppDataSource.getRepository(Product);

  //getting the product details
  const { product } = req.body;
  const productId = product.id;


  //getting the token to get logged in userId
  const token = req.cookies.jwt;
  const data = jwtoken.verify(token, "chickiwikichicki") as JwtPayload;
  console.log("log the web token data", data);
  const userId = data.id;

  console.log("this is product--",product);

  // const user = await userRepo.findOne({ where: { id: userId } });

  const existingProduct = await cartRepo.findOne({
    where: {
      user: { id: userId },
      product: { id: productId },
    },
    relations: ['user', 'product'],  // This ensures related entities are fetched
  });

  console.log("this is existing product --",existingProduct);

  if (existingProduct) {

    existingProduct.quantity += 1;

    await cartRepo.save(existingProduct);

    res.status(200).json({ msg: "Quantity Updated" });
  
    return;
  
  } else {

    let cart = new Cart();

    const product = await productRepo.findOne({ where: { id: productId } });

    if (!product) {
      res.status(404).json({ message: "Product not found" });
    } 
    else{
        
        cart.product = product;
        cart.user = userId;
        cart.quantity = 1;
        const addedNewCart = await cartRepo.save(cart);
        console.log(addedNewCart);
      }

    res
      .status(201)
      .json({ message: "Product added to cart" });
  }

  // try {
  // } catch (error) {
  //   console.log('error==', error)
    
  // }

    // try {

    //   // let user = userRepo.findOne({where: {id: }})

    //   let cart = await cartRepo.findOne({
    //       where: { product: product }
    //   })

    //   //if cart is not present for the user, we'll create new one
    //   if(!cart){
    //     cart = new Cart();

    //     // await cartRepo.save(cart);
    //   }

    //   res.status(200).json({ message: 'Item added to cart successfully!' });

    // } catch (error) {
    //   console.error('Error adding item to cart: ', error);
    //   res.status(500).json({ message: 'Error adding item to cart.' });
    // }
  }

