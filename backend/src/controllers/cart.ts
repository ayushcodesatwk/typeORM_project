import { Cart } from "../entities/cart";
import { JwtPayload } from "jsonwebtoken";
import jwtoken from "jsonwebtoken";
import { Product } from "../entities/product";
import { Request, Response, NextFunction } from "express";
import { RequestWithUserId } from "../middlewares/requireAuth";
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

  const RequestWithUserId = req as RequestWithUserId;

  const userId: any = Number(RequestWithUserId.userId);

  if (!userId) {
    res.status(401).json({ msg: "Invalid token" });
    return;
  }

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

  const cartRepo = AppDataSource.getRepository(Cart);

  const reqWithUserId = req as RequestWithUserId;

  const userId = Number(reqWithUserId.userId);

  if (!userId) {
    res.status(401).json({ msg: "Token is invalid" });
    return;
  }

  try {

    const cartArray = await cartRepo.find({
      where: { user: { id: userId } },
      relations: ["product", "user"],
    });

    res.status(201).json(cartArray);
    
    return;
  } catch (error) {
    res.status(401).json({ msg: "ERROR FETCHING USER CART", error });
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

      res.status(200).json({ msg: "deleted from cart" });

      return;
    } else {
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

  console.log("tokn from cart plusone---", token, cartId);

  if (token) {
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

//clear cart items by userId
export const clearCartByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // we have used middleware so we don't need to verify the token
  // we'll get the userId directly from the request like this-
  const reqWithUserId = req as RequestWithUserId;

  const userId = reqWithUserId.userId;

  // console.log("REQUEST WITH USER ID FROM CLEAR CART--", reqWithUserId);

  try {
    const deleteItem = await AppDataSource.createQueryBuilder()
      .delete()
      .from(Cart)
      .where("userId = :userId", { userId: userId })
      .execute();

    if (deleteItem.affected === 0) {
      res.status(404).json({ message: "Product not found in cart" });
      return;
    }

    console.log("DeletedITEM", deleteItem);

    res.status(200).json({ message: "Product Deleted" });
    return;
  } catch (error) {
    res.status(500).json({ msg: "Failed to delete cart" });
  }
};
