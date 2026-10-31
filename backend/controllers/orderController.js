import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

// Placing orders using COD method

const placeOrder = async(req, res) => {

    try {

        const { userId, items, amount, address} = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"COD",
            payment: false,
            data: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId,{cartData:{}})

        res.json({success: true, message: "Order Placed"})

    } catch(error) {
        console.log(error)
        res.json({success:false, message:error.message})

    }

}

// Placing orders using stripe method
const placeOrderStripe = async (req, res) => {

}

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {

}

// All orders data for Admin Panel
const allOrders = async (req, res) => {

}

// user Order Data for forntend
const userOrders = async (req, res) => {

}

// Update order status from admin Panel
const updateStatus = async(req, res) => {

}

export { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus }