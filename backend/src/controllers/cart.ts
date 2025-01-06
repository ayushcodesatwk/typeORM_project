import { Cart } from "../entities/cart";
import requireAuth from "../middlewares/user";
import { JwtPayload } from "jsonwebtoken";
import jwtoken from "jsonwebtoken";
import { Product } from "../entities/product";
  import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";

// adding item to cart
export const addItemToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  
  const cartRepo = AppDataSource.getRepository(Cart);
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
    relations: ["user", "product"], // this ensures related entities are fetched
  });

  console.log("this is existing product --", existingProduct);

  if (existingProduct) {
    existingProduct.quantity += 1;

    await cartRepo.save(existingProduct);

    const cartArray = await cartRepo.find({
      where: { user: { id: userId }, product: { id: productId } },
      relations: ["user", "product"],
    });

    res.status(200).json(cartArray);

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
      const addedNewCartItem = await cartRepo.save(cart);
      console.log("new product added to cart--", addedNewCartItem);
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

  if (token) {
    const data = jwtoken.verify(token, "chickiwikichicki") as JwtPayload;
    console.log("log the web token data", data);
    const userId = data.id;

    console.log("userId from cart--", userId);

    try {
      if (!userId) {
        res.status(401).json({ msg: "Internal server error" });
        return;
      } else {
        const cartArray = await cartRepo.find({
          where: { user: { id: userId } },
          relations: ["product", "user"],
        });

        console.log("loggedin user's cart array- ", cartArray);

        res.status(201).json(cartArray);

        return;
      }
    } catch (error) {
      res.status(401).json({ msg: "ERROR FETCHING USER CART", error });
      return;
    }
  } else {
    res.status(400).json({ msg: "USER NOT FOUND: PLEASE LOGIN" });
    return;
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
    return;
  }

  const deleteItem = await AppDataSource.createQueryBuilder()
    .delete()
    .from(Cart)
    .where("cartId = :cartId", { cartId: cartId })
    .execute();

  if (deleteItem.affected === 0) {
    res.status(404).json({ message: "Product not found in cart." });
    return;
  }

  console.log("DeletedITEM", deleteItem);

  res.status(200).json({ message: "Product Deleted" });
  return;
};

// minus one item
export const minusOneItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  //what I have to do here --       token lo, cartRepo lo, ==> check for the token and userId   cartrepo se cartdata nikalo using cartId & userId
  // check if quantity is one, if it is one then remove kar do otherwise is cartData me quantity -= 1 kar do,

  const { cartId } = req.body;

  //getting the token to get logged in userId
  const token = req.cookies.jwt;
  const data = jwtoken.verify(token, "chickiwikichicki") as JwtPayload;
  console.log("log the web token data", data);
  const userId = data.id;

  const cartRepo = AppDataSource.getRepository(Cart);

  const existingProduct = await cartRepo.findOne({
    where: { user: { id: userId }, cartId: cartId },
    relations: ["user", "product"],
  });

  console.log("cartItem from minusOne--", existingProduct);

  if (existingProduct) {
 
    //if quantity is one delete it
    if (existingProduct.quantity == 1) {
      const deleteItem = await AppDataSource.createQueryBuilder()
        .delete()
        .from(Cart)
        .where("cartId = :cartId", { cartId: existingProduct.cartId })
        .execute();
 
      if (deleteItem.affected === 0) {
        res.status(404).json({ message: "Product not found in cart." });
        return;
      }

      console.log("DeletedITEM--", deleteItem);
  
      res.status(200).json({msg: "deleted from cart"});
  
      return;
    }
    else{
      //otherwise just reduce quantity by one
      existingProduct.quantity -= 1;
  
      await cartRepo.save(existingProduct);
  
      const cartArray = await cartRepo.find({
        where: { user: { id: userId } },
        relations: ["user", "product"],
      });
  
      res.status(200).json(cartArray);
  
      return;

    }
  }
};

// plus one item
export const plusOneItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  const { cartId } = req.body;

  //getting the token to get logged in userId
  const token = req.cookies.jwt;

  console.log('tokn from cart plusone---', token, cartId);
  

  if(token){

    const data = jwtoken.verify(token, "chickiwikichicki") as JwtPayload;
    console.log("log the web token data", data);
    const userId = data.id;
  
    const cartRepo = AppDataSource.getRepository(Cart);
  
    console.log("CARTiD- from plusOne--", cartId);
  
    const existingProduct = await cartRepo.findOne({
      where: { user: { id: userId }, cartId: cartId },
      relations: ["user", "product"],
    });
  
    console.log("cartItem from plusOne--", existingProduct);
  
    if (existingProduct) {
  
      existingProduct.quantity += 1;
  
      await cartRepo.save(existingProduct);
  
      const cartArray = await cartRepo.find({
        where: { user: { id: userId } },
        relations: ["user", "product"],
      });
  
      res.status(200).json(cartArray);
  
      return;
    }
  }

};