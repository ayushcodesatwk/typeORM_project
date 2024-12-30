import { Product } from "../entities/product";
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

export const filterProductsByCategoryAndPrice = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const category = req.query.category ? String(req.query.category) : "";
    const sortByPrice = req.query.priceCategory ? String(req.query.priceCategory) : "";

    const productRepo = AppDataSource.getRepository(Product);
    
    const queryOptions: any = {
        where: {},
        order: {},
    }

    if(category){
        queryOptions.where.category = category
    }

    if(sortByPrice === "asc" || sortByPrice === "desc"){
        queryOptions.order.price = sortByPrice
    }

    const filteredProducts = await productRepo.find(queryOptions);

    res.status(200).json(filteredProducts);
  
  } catch (error) {
    console.error("Error fetching products:", error);

    res.status(500).json({
        message: "An error occurred while fetching products.",
        error: error instanceof Error ? error.message : "Unknown error"
    });
  }    

}