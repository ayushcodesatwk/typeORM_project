import { Cart } from "../entities/cart";
import requireAuth from "../middlewares/user";
import { JwtPayload } from "jsonwebtoken";
import jwtoken from "jsonwebtoken";
import { Product } from "../entities/product";
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { Users } from "../entities/user";

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

  console.log("this is product--", product);

  // const user = await userRepo.findOne({ where: { id: userId } });

  const existingProduct = await cartRepo.findOne({
    where: {
      user: { id: userId },
      product: { id: productId },
    },
    relations: ["user", "product"], // This ensures related entities are fetched
  });

  console.log("this is existing product --", existingProduct);

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
    } else {
      cart.product = product;
      cart.user = userId;
      cart.quantity = 1;
      const addedNewCart = await cartRepo.save(cart);
      console.log(addedNewCart);
    }

    res.status(201).json({ message: "Product added to cart" });
  }
};

// get cart items of user
export const fetchUserCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  //what I need to fetch items:-
  //userId, cartRepo

  const cartRepo = AppDataSource.getRepository(Cart);

  //getting the token to get logged in userId
  const token = req.cookies.jwt;

  if(token){
      const data = jwtoken.verify(token, "chickiwikichicki") as JwtPayload;
      console.log("log the web token data", data);
      const userId = data.id;

      console.log('userId from cart--', userId);

      try {
        if (!userId) {
          
          res.status(401).json({ msg: "Internal server error" });
          return;

        } else {

          const cartArray = await cartRepo.find({ where: { user: userId },  relations: ["product", "user"] });
    
          console.log("loggedin user's cart array- ", cartArray);
    
          res.status(201).json(cartArray);
    
          return;
        }
      } 
      catch (error) {
        res.status(401).json({ msg: "ERROR FETCHING USER CART", error });
        return;
      }
    } else{
    res.status(400).json({msg: "USER NOT FOUND: PLEASE LOGIN"})
    return
  }
};

// delete item from cart
export const deleteItemFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // get the cart repo =>  get the element's id from req.body =>
  // find the element in the cart repo  =>
  // perform delete operation and save.

  const { cartId } = req.body;

  if (!cartId) {
    res.status(400).json({ message: "Product Id is required." });
    return
  }


  
  const deleteItem = await AppDataSource.createQueryBuilder()
    .delete()
    .from(Cart)
    .where("cartId = :cartId", { cartId: cartId })
    .execute();


    if (deleteItem.affected === 0) {
      res.status(404).json({ message: "Product not found in cart." });
      return
    }

    console.log("DeletedITEM", deleteItem);

    res.status(200).json({ message: "Product Deleted" });
    return
};

// remove one item
export const removeOneItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {};
