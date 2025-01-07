import { Request, Response, NextFunction } from "express";
import Razorpay from "razorpay";
import { Orders } from "../entities/order";
import { OrderItem } from "../entities/orderItem";
import { Payments } from "../entities/payment";
import { AppDataSource } from "../data-source";
import { JwtPayload } from "jsonwebtoken";
import jwtoken from "jsonwebtoken";

//to handle the order request from the user
export const HandleOrdersRzrPay = async (
  req: Request,
  res: Response,
  // next: NextFunction
): Promise<void> => {
  //create new razorpay payment
  const razorpay = new Razorpay({
    key_id: "rzp_test_omD6kXJUMZEbn4",
    key_secret: "MwCpXvU1xukEfXSZKFAqcLxF",
  });

  //creating an order in reference to options
  const options = {
    amount: req.body.amount,
    currency: req.body.currency,
    receipt: "Receipt",
    payment_capture: 1,
  };

  try {
    //creating an order in reference to options
    const response = await razorpay.orders.create(options);

    res.json({
      order_id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

//to get the payment details
export const getPaymentDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  //get the paymentId from the frontend
  const { paymentId } = req.params;

  const razorpay = new Razorpay({
    key_id: "rzp_test_omD6kXJUMZEbn4",
    key_secret: "MwCpXvU1xukEfXSZKFAqcLxF",
  });

  //handle errors
  try {
    const payment = await razorpay.payments.fetch(paymentId);

    if (!payment) {
      res.status(500).json("Error at razorpay loading");
      return;
    }

    console.log("Payment details-", payment);

    res.json({
      status: payment.status,
      method: payment.method,
      amount: payment.amount,
      currency: payment.currency,
    });
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch payment" });
    return;
  }
};

//to create an order and a payment in the table
// export const createOrder = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   const { totalPrice, orderItem, paymentId } = req.body;

//   console.log("order item-",orderItem);
  

//   //getting the token to get logged in userId
//   const token = req.cookies.jwt;
//   const data = jwtoken.verify(token, "chickiwikichicki") as JwtPayload;
//   console.log("data from jwt token- ", data);
  
//   const userId = data.id;

//   //create respository
//   const orderRepo = AppDataSource.getRepository(Orders);
//   const orderItemRepo = AppDataSource.getRepository(OrderItem);
//   const paymentRepo = AppDataSource.getRepository(Payments);

//   //create a new order
//   const order = new Orders();
//   order.orderDate = new Date();
//   order.totalPrice = totalPrice;
//   order.user = userId;
//   order.payment = paymentId;

//   //create a new orderItem
//   const orderItems = orderItem.map((item: any) => {
//     const newOrderItem = new OrderItem();
//     newOrderItem.quantity = item.quantity;
//     newOrderItem.price = item.price;
//     newOrderItem.product = item.product;
//     newOrderItem.order = order;
//     return newOrderItem;
//   });

//   //create a new payment
//   const payment = new Payments();
//   payment.amount = totalPrice;
//   payment.paymentDate = new Date();
//   payment.orders = [order];
//   payment.paymentMethod = "Razorpay";
//   payment.user = userId;
//   payment.paymentId = paymentId;


//   console.log("PAYMENT STATUS-", payment);
//   console.log("ORDER STATUS-", order);
//   console.log("ORDERITEM STATUS-", orderItems);

//   try {
//     await orderRepo.save(order);
//     await orderItemRepo.save(orderItems);
//     await paymentRepo.save(payment);
//     res.status(200).json({ msg: "Order created successfully" });
//   } catch (error) {
//     res.status(500).json({ msg: "Failed to create order" });
//   }
// };

//to create an order and a payment in the table
export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { totalPrice, orderItem, paymentId } = req.body;


  if (!totalPrice || !orderItem || !paymentId) {
    res.status(400).json({ msg: "Missing required fields" });
    return;
  }

  // getting the token from cookies to get the logged-in userId
  const token = req.cookies.jwt;
  if (!token) {
    res.status(401).json({ msg: "No token provided" });
    return;
  }

  let userId: any;

  try {
    const data = jwtoken.verify(token, "chickiwikichicki") as JwtPayload;
    console.log("Data from JWT token: ", data);
    userId = data.id;
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
    return;
  }

  // Create repository instances
  const orderRepo = AppDataSource.getRepository(Orders);
  const orderItemRepo = AppDataSource.getRepository(OrderItem);
  const paymentRepo = AppDataSource.getRepository(Payments);

  // Begin transaction
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.startTransaction();

  try {
    // Create a new order
    const order = new Orders();
    order.orderDate = new Date();
    order.totalPrice = totalPrice;
    order.user = userId;
    order.payment = paymentId;
    order.orderItem = [];

    // Create new orderItems
    const orderItems = orderItem.map((item: any) => {
      const newOrderItem = new OrderItem();
      newOrderItem.quantity = item.quantity;
      newOrderItem.price = item.product.price;
      newOrderItem.product = item.product;
      newOrderItem.order = order;
      return newOrderItem;
    });

    // Create a new payment
    const payment = new Payments();
    payment.amount = totalPrice;
    payment.paymentDate = new Date();
    payment.paymentMethod = "Razorpay";
    payment.paymentId = paymentId;
    payment.user = userId;
    payment.orders = [order];

    console.log("PAYMENT STATUS:", payment);
    console.log("ORDER STATUS:", order);
    console.log("ORDER ITEMS STATUS:", orderItems);

    // Save payment first to avoid foreign key constraint violations
    await queryRunner.manager.save(payment);
    // Save order and orderItems using transaction
    await queryRunner.manager.save(order);
    await queryRunner.manager.save(orderItemRepo.create(orderItems));
    await queryRunner.commitTransaction();

    res.status(200).json({ msg: "Order created successfully" });

  } catch (error) {
    // rollback the transaction in case of error
    await queryRunner.rollbackTransaction();
    console.error("Error creating order:", error);
    res.status(500).json({ msg: "Failed to create order", error });
  } finally {
    // release the query runner (return it to the pool)
    await queryRunner.release();
  }
};
