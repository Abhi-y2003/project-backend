const { instance } = require("../config/razorpay");
const Product = require("../models/Product");
const User = require("../models/User");

const mailSender = require("../utils/mailSender");

//capture the payment and initiate the razorpay order
exports.capturePayment = async (req, res) => {
  try {
    //get productId and UserId
    const { productId } = req.body;
    const userId = req.user.id;

    //validation
    if (!productId) {
      return res.json({
        success: false,
        message: "Invalid course Id",
      });
    }

    let product;

    try {
      product = await Product.findById({ productId });
      if (!product) {
        return res.json({
          success: false,
          message: "Invalid course details",
        });
      }
    } catch (error) {
      console.error(error);
      return res.json({
        success: false,
        message: "Product id could not be found",
      });
    }

    //orderCreate

    const amount = Product.price;
    const currency = "INR";

    const option = {
      amount: amount * 100,
      currency,
      receipt: Math.random(Date.now()).toString(),
      notes: {
        product_id: productId,
        userId,
      },
    };

    try {
      //initiating the Payment using razorpay

      const paymentResponse = await instance.orders.create(options);

      console.log(paymentResponse);

      return res.status(200).json({
        success: true,
        productName: Product.productName,
        orderId: paymentResponse.id,
        current: paymentResponse.currency,
        amount: paymentResponse.amount,
      });
    } catch (error) {
      console.log(error);
      return res.json({
        success: false,
        message: "Could not initiated the razorpay order",
      });
    }
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Error occurred while creating payment",
    });
  }
};

//verifying the signature

exports.verifySignature = async (req, res) => {
  try {
    const webhookSecret = "123456789";

    const signature = req.headers["x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));

    const digest = shasum.digest("hex");

    if (signature === digest) {
      console.log("payment is authorized");

      const { product_id, userId } = req.body.payload.payment.entity.notes;

      try {
        //fullfil the action order placed by the user

        const boughtProduct = await Product.findOneAndUpdate(
          { _id: product_id },
          {
            $push: {
              buyingUser: userId,
            },
          },
          { new: true }
        );

        if (!boughtProduct) {
          return res.status(403).json({
            success: false,
            message: "Error in Bought product assigning to user",
          });
        }

        console.log(boughtProduct);

        //find the user and update the product bought in his history

        const userProducts = await User.findOneAndUpdate(
          { _id: userId },
          {
            $push: {
              userHistory: product_id,
            },
          },
          { new: true }
        );

        console.log(userProducts);

        //mail sending

        const emailResponse = await mailSender(
          enrolledStudents.email,
          "Product bought",
          "successfully bought the product"
        );

        console.log(emailResponse);

        return res.status(200).json({
          success: true,
          message: "Signature verified and product is added to user",
        });
      } catch (error) {
        return res.status(403).json({
          success: false,
          message: "Signature verified and product is added to user",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid response signature verification",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "signature verification Error",
    });
  }
};
