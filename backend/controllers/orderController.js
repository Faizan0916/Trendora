import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe'
import razorpay from 'razorpay'


// Global variables
const currency = "inr"
const deliveryCharges = 10

// getway initalization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const razorpayInstance = new razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_KEY_SECRET
})

// Placing orders using COD method
const placeOrder = async(req, res) => {
    try {
        console.log("PLACE ORDER BODY:", req.body);
        console.log("PLACE ORDER USER ID:", req.body.userId);

        const { userId, items, amount, address} = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"COD",
            payment: false,
            date: Date.now()
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
    try {
        const { userId, items, amount, address } = req.body
        const { origin } = req.headers

        const newOrder = new orderModel({
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        })
        await newOrder.save()

        const line_items = items.map((item) => ({
            price_data: {
                currency,
                product_data: { name: item.name },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency,
                product_data: { name: 'Delivery Charges' },
                unit_amount: deliveryCharges * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/cart?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
            metadata: {
                orderId: newOrder._id.toString()
            }
        })

        res.json({ success: true, session_url: session.url })
   
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Verify Stripe payment
const verifyStripe = async (req, res) => {
    try {

        console.log("VERIFY STRIPE ROUTE HIT");
        console.log("VERIFY QUERY:", req.query);

        const { orderId, success, session_id } = req.query

        if (success !== 'true') {
            if (orderId) await orderModel.findByIdAndDelete(orderId)
            return res.json({ success: false, message: 'Payment was cancelled' })
        }

        if (!orderId || !session_id) {
            return res.json({ success: false, message: 'Missing orderId or session_id' });
        }

        const session = await stripe.checkout.sessions.retrieve(session_id)

        if (session.payment_status !== 'paid' || session.metadata.orderId !== orderId) {
            return res.json({ success: false, message: 'Stripe payment could not be verified' })
        }

        const order = await orderModel.findById(orderId)
        if (!order) {
            return res.json({ success: false, message: 'Order not found' })
        }
        if (order.paymentMethod !== 'Stripe') {
            return res.json({ success: false, message: 'This is not a Stripe order' })
        }

        await orderModel.findByIdAndUpdate(orderId, { payment: true })
        await userModel.findByIdAndUpdate(order.userId, { cartData: {} })

        res.json({ success: true, message: 'Payment verified successfully' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const options = {
            amount: amount * 100,
            currency: 'INR',
            receipt: newOrder._id.toString()
        }

        razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error)
                return res.json({ success: false, message: error.error?.description || error.message })
            }
            res.json({ success: true, order })
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const verifyRazorpay = async (req, res) => {
    try {
        const { userId, razorpay_order_id } = req.body

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if (orderInfo.status === 'paid') {
            await orderModel.findByIdAndUpdate(orderInfo.receipt, {payment:true});
            await userModel.findByIdAndUpdate(userId, { cartData:{} })
            res.json({ success: true, message: "Payment Successful" });
        } else {
            res.json({ success: false, message: "Payment Failed"});
        }
    } catch(error) {
        console.log(error)
        res.json({ success:false, message: error.message })
    }
}

// All orders data for Admin Panel
const allOrders = async (req, res) => {
    try {

        const orders = await orderModel.find({})
        res.json({success: true, orders})

    } catch(error) {
        console.log(error)
        res.json({success:false, message:error.message})

    }
}

// user Order Data for forntend
const userOrders = async (req, res) => {
    try {
        console.log("USER ID:", req.body.userId)

        const allOrders = await orderModel.find({})
        console.log("TOTAL ORDERS:", allOrders.length)

        const orders = await orderModel.find({
            userId: req.body.userId
        })

        console.log("MATCHING ORDERS:", orders.length)

        res.json({
            success: true,
            orders
        })

    } catch (error) {
        console.log(error)

        res.json({
            success: false,
            message: error.message
        })
    }
}


// Update order status from admin Panel
const updateStatus = async(req, res) => {
    try {
        const { orderId, status} = req.body;
        await orderModel.findByIdAndUpdate(orderId, {status})
        res.json({success: true, message: "Status Updated"})
    } catch(error) {
        console.log(error) 
        res.json({success:false, message:error.message})
    }

}

export { verifyRazorpay ,verifyStripe ,placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus }