import { Product } from "../entities/product";
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import cloudinary from "../cloudinary";

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
    const sortByPrice = req.query.priceCategory
      ? String(req.query.priceCategory)
      : "";

    const productRepo = AppDataSource.getRepository(Product);

    const queryOptions: any = {
      where: {},
      order: {},
    };

    if (category) {
      queryOptions.where.category = category;
    }

    if (sortByPrice === "asc" || sortByPrice === "desc") {
      queryOptions.order.price = sortByPrice;
    }

    const filteredProducts = await productRepo.find(queryOptions);

    res.status(200).json(filteredProducts);
  } catch (error) {
    console.error("Error fetching products:", error);

    res.status(500).json({
      message: "An error occurred while fetching products.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const uploadAnImageToCloudinary = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const imageURL = req.body.imageURL;
  const product_id = req.body.product_id;

  console.log(product_id);

  try {
    const cloudinaryRes = await cloudinary.uploader.upload(imageURL, {
      folder: "/product-images",
    });

    console.log("response from cloudinary--", cloudinaryRes);

    res.status(200).json({ response: cloudinaryRes });

    return;
  } catch (error) {
    console.log("ERROR UPLOADING-- ", error);

    res.status(500).json({ msg: "failed to upload the image!", error: error });

    return;
  }
};

//saving product as an admin
export const addProductToTable = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  const product = req.body.product;

  const productRepo = AppDataSource.getRepository(Product);

  try {
    let newProduct = new Product();
    let currentdate = new Date();

    newProduct.title = product.title;
    newProduct.stock = product.stock;
    newProduct.category = product.category;
    newProduct.imageURL = product.imageURL;
    newProduct.createdAt = currentdate;
    newProduct.price = product.price;
    newProduct.description = product.description;

    const addedNewProduct = await productRepo.save(newProduct);

    console.log("New product added to the product table--", addedNewProduct);
    
    res.status(201).json({msg: "New product added to the product table-- ", result: addedNewProduct})
    
  } catch (error) {

    res.status(501).json({error: error, msg: "Failed to add product to the table..."});

  }
};
