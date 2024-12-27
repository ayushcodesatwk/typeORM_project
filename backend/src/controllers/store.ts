import { Product } from "../entities/product";
import { JwtPayload } from "jsonwebtoken";
import jwtoken from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";

export const searchItemInProductTable = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  try {
    //infinite scrolling
    const skip = req.query.skip ? Number(req.query.skip) : 0;

    console.log(skip);

    const productRepo = AppDataSource.getRepository(Product);

    const allProducts = await productRepo.find({
      skip: skip,
      take: 10,
    });

    res.status(200).json(allProducts);
  } catch (error) {
    res.status(400).json({
      msg: `Error getting products: ${error}`,
    });
  }
};
