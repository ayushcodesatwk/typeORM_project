import { Request, Response, NextFunction } from "express";
import Razorpay from "razorpay";

//to handle the order request from the user
export const HandleOrdersRzrPay = async (
  req: Request,
  res: Response,
  next: NextFunction
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
