import { Request, Response, NextFunction } from "express";
import Razorpay from "razorpay";
import { Orders } from "../entities/order";
import { OrderItem } from "../entities/orderItem";
import { Payments } from "../entities/payment";
import { AppDataSource } from "../data-source";
import { JwtPayload } from "jsonwebtoken";
import jwtoken from "jsonwebtoken";
import requireAuth, { RequestWithUserId } from "../middlewares/requireAuth";

//to handle the order request from the user
export const HandleOrdersRzrPay = async (
  req: Request,
  res: Response
  // next: NextFunction
): Promise<void> => {
  //create new razorpay payment
  const razorpay = new Razorpay({
    key_id: "rzp_test_omD6kXJUMZEbn4",
    key_secret: "MwCpXvU1xukEfXSZKFAqcLxF",
  });

  //creating an order in reference to options
  const options = {
    amount: Math.round(req.body.amount),
    currency: req.body.currency,
    receipt: "Receipt",
    payment_capture: 1,
  };

  console.log("options--", options);

  try {
    //creating an order in reference to options
    const response = await razorpay.orders.create(options);
    console.log("RESPONSE--", response);

    res.json({
      order_id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.log("error-", error);
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

  const RequestWithUserId = req as RequestWithUserId;

  const userId:any = Number(RequestWithUserId.userId);

  if (!userId) {
    res.status(401).json({ msg: "Invalid token" });
    return;
  }


  // Create repository instances
  const orderItemRepo = AppDataSource.getRepository(OrderItem);

  // start a transaction
  // transactions are a way to handle multiple queries
  // in a single transaction
  // to avoid foreign key contraint violations
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.startTransaction();

  try {
    // Create a new order instance
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

    // Create a new payment instance
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
    // release the query runner
    await queryRunner.release();
  }
};

//to get all the orders of the user
export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  
  const RequestWithUserId = req as RequestWithUserId;

  const userId = Number(RequestWithUserId.userId);

  if (!userId) {
    res.status(401).json({ msg: "Invalid token" });
    return;
  }

  try {
    const orderRepo = AppDataSource.getRepository(Orders);
    const orderItemRepo = AppDataSource.getRepository(OrderItem);
    const orders = await orderRepo.find({
      where: { user: { id: userId } },
      relations: ["orderItem", "payment"],
    });
    // console.log("ORDERS--", orders);

    const orderItems = await orderItemRepo.find({
      where: { order: orders },
      relations: ["product", "order"],
    });
    // console.log("ORDERITEMS-", orderItems);

    //getting all the orders of the user & mapping the orderItems to the orders
    const orderItemsMap = orders.reduce((acc: any, curr: any, i: any) => {
      acc[curr.id] = orderItems.filter(
        (item: any) => item.order.id === curr.id
      );
      return acc;
    }, []);

    // console.log("ORDERS-", orders);
    res.json({ orders, orderItemsMap });
    return;
  } catch (error) {
    // console.log("ERROR--", error);
    res.status(500).json({ msg: "Failed to fetch orders", ERROR: error });
    return;
  }
};

//delete orders from cart
export const deleteOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log("REQ PARAMS--", req.params);

  const orderId = Number(req.params.orderId);

  if (!orderId) {
    console.log("Order Id is required", orderId);
    res.status(400).json({ message: "order Id is required" });
    return;
  }

  const orderRepo = AppDataSource.getRepository(Orders);
  const orderItemRepo = AppDataSource.getRepository(OrderItem);

  try {
    const deletedOrderItem = await orderItemRepo.delete({
      order: { id: orderId },
    });

    const deleteOrder = await orderRepo.delete(orderId);

    if (deleteOrder.affected === 0 || deletedOrderItem.affected === 0) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.log("ERROR--", error);
    res.status(500).json({ msg: "Failed to delete order", ERROR: error });
  }
};
