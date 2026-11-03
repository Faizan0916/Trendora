// // Context solve one problem - Sharing data betweem many components without passing it
// // down through props, without context-> Your arr needs the same data in many places
// // >products is used in Home, Collection, Product page and cartv
// import { createContext, useEffect, useState } from "react";
// import { toast } from 'react-toastify'
// import { useNavigate } from "react-router-dom";
// import axios from 'axios'

// export const ShopContext = createContext();

// const ShopContextProvider = (props) => {

//     const currency = '$'; 
//     const delivery_fee = 10;
//     const backendUrl = import.meta.env.VITE_BACKEND_URL
//     const [search, setSearch] = useState('');
//     const [showSearch, setShowSearch] = useState(false);
//     const [cartItems, setCartItems] = useState({});
//     const [products, setProducts] = useState([]);
//     const [token, setToken] = useState('')
//     const navigate = useNavigate();

//     // console.log("BACKEND URL:", backendUrl);
//     console.log("ENV:", import.meta.env);
//     console.log("BACKEND URL:", import.meta.env.VITE_BACKEND_URL);

//     const addToCart = async (itemId, size) => {

//         if(!size) {
//             toast.error('Select Product Size');
//             return;
//         }

//         let cartData = structuredClone(cartItems);

//         if (cartData[itemId]) {
//             if (cartData[itemId][size]) {
//                 cartData[itemId][size] += 1;
//             }
//             else {
//                 cartData[itemId][size] = 1;
//             }
//         }
//         else {
//             cartData[itemId] = {};
//             cartData[itemId][size] = 1;
//         }
//         setCartItems(cartData);

//         if(token) {
//             try {

//                 await axios.post(backendUrl + '/api/cart/add', {itemId, size}, {headers: {token}} )

//             } catch(error) {
//                 console.log(error)
//                 toast.error(error.message)
//             }
//         }
//     }

//     const getCartCount = () => {
//         let totalCount = 0;
//         for(const items in cartItems) {
//             for(const item in cartItems[items]) {
//                 try {
//                     if(cartItems[items][item] > 0) {
//                         totalCount += cartItems[items][item];
//                     }
//                 } catch (error) {

//                 }
//             }
//         }
//         return totalCount;
//     }

//     const updateQuantity = async (itemId, size, quantity) => {
//         let cartData = structuredClone(cartItems);

//         cartData[itemId][size] = quantity;

//         setCartItems(cartData);

//         if(token) {
//             try {

//                 await axios.post(`${backendUrl}/api/product/list`, {itemId, size, quantity}, {headers:{token}})

//             } catch(error) {
//                 console.log(error)
//                 toast.error(error.message)

//             }
//         }
//     }


//     const getCartAmount = () => {
//         let totalAmount = 0;
//         for(const items in cartItems) {
//             let itemInfo = products.find((product) => product._id === items);
//             if (!itemInfo) continue; 
//             for(const item in cartItems[items]) {
//                 try {
//                     if(cartItems[items][item] > 0) {
//                         totalAmount += itemInfo.price * cartItems[items][item];
//                     } 
//                 } catch(error) {

//                 }
//             }
//         }
//         return totalAmount;
//     }

//     const getProductData = async () => {
//     try {
//         const response = await axios.get(
//             backendUrl + '/api/product/list'
//         );


//         if (response.data.success) {
//             setProducts(response.data.products);
//             console.log("PRODUCTS LOADED:", response.data.products);
//         } else {
//             toast.error(response.data.message);
//         }

//     } catch(error) {
//         console.log(error);
//         toast.error(error.message);
//     }
//    };

//    const getUserCart = async (token) => {
//         try {
//             const response = await axios.post(backendUrl + '/api/cart/get', {}, {headers: {token}})
//             if(response.data.success) {
//                 setCartItems(response.data.cartData)
//             }
//         } catch (error) {
//             console.log(error) 
//             toast.error(error.message)
//         }
//     }

//     useEffect(() => {
//     getProductData();
//     }, []);

//     useEffect(() => {
//         const savedToken = localStorage.getItem('token')
//         if (savedToken) {
//             setToken(savedToken)
//         }
//     }, [])

//     useEffect(() => {
//         if (token) {
//             getUserCart(token)
//         }
//     }, [token])


//     const value = {
//         products, currency, delivery_fee,
//         search, setSearch, showSearch, setShowSearch,
//         cartItems, addToCart, setCartItems,
//         getCartCount, updateQuantity,
//         getCartAmount, navigate, backendUrl,
//         token, setToken

//     }

//     return (
//         <ShopContext.Provider value={value}>
//             {props.children}
//         </ShopContext.Provider>        

//     )

// }

// export default ShopContextProvider;

// ShopContext solves the problem of sharing data between components
// without passing it down through props.
// Products are used in Home, Collection, Product, and Cart pages.

import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = "$";
    const delivery_fee = 10;

    // Remove trailing slash from the backend URL
    // This prevents URLs like https://backend.com//api/product/list
    const backendUrl = (
        import.meta.env.VITE_BACKEND_URL || ""
    ).replace(/\/+$/, "");

    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState("");

    const navigate = useNavigate();

    // Debug information
    console.log("BACKEND URL:", backendUrl);

    // ------------------------------------
    // ADD PRODUCT TO CART
    // ------------------------------------
    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error("Select Product Size");
            return;
        }

        const cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(
                    `${backendUrl}/api/cart/add`,
                    { itemId, size },
                    {
                        headers: { token },
                    }
                );
            } catch (error) {
                console.error("Add to cart error:", error);
                toast.error(
                    error.response?.data?.message || error.message
                );
            }
        }
    };

    // ------------------------------------
    // GET TOTAL CART COUNT
    // ------------------------------------
    const getCartCount = () => {
        let totalCount = 0;

        for (const itemId in cartItems) {
            for (const size in cartItems[itemId]) {
                try {
                    if (cartItems[itemId][size] > 0) {
                        totalCount += cartItems[itemId][size];
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }

        return totalCount;
    };

    // ------------------------------------
    // UPDATE CART QUANTITY
    // ------------------------------------
    const updateQuantity = async (itemId, size, quantity) => {
        const cartData = structuredClone(cartItems);

        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }

        cartData[itemId][size] = quantity;

        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(
                    `${backendUrl}/api/cart/update`,
                    { itemId, size, quantity },
                    {
                        headers: { token },
                    }
                );
            } catch (error) {
                console.error("Update quantity error:", error);
                toast.error(
                    error.response?.data?.message || error.message
                );
            }
        }
    };

    // ------------------------------------
    // GET TOTAL CART AMOUNT
    // ------------------------------------
    const getCartAmount = () => {
        let totalAmount = 0;

        for (const itemId in cartItems) {
            const itemInfo = products.find(
                (product) => product._id === itemId
            );

            if (!itemInfo) continue;

            for (const size in cartItems[itemId]) {
                try {
                    if (cartItems[itemId][size] > 0) {
                        totalAmount +=
                            itemInfo.price * cartItems[itemId][size];
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }

        return totalAmount;
    };

    // ------------------------------------
    // GET PRODUCTS FROM BACKEND
    // ------------------------------------
    const getProductData = async () => {
        if (!backendUrl) {
            console.error("VITE_BACKEND_URL is missing");
            toast.error("Backend URL is not configured");
            return;
        }

        try {
            const response = await axios.get(
                `${backendUrl}/api/product/list`
            );

            if (response.data.success) {
                setProducts(response.data.products || []);

                console.log(
                    "PRODUCTS LOADED:",
                    response.data.products
                );
            } else {
                toast.error(
                    response.data.message || "Unable to load products"
                );
            }
        } catch (error) {
            console.error("Product API error:", error);
            console.error("Response:", error.response?.data);
            console.error("Status:", error.response?.status);

            toast.error(
                error.response?.data?.message || error.message
            );
        }
    };

    // ------------------------------------
    // GET USER CART FROM BACKEND
    // ------------------------------------
    const getUserCart = async (userToken) => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/cart/get`,
                {},
                {
                    headers: { token: userToken },
                }
            );

            if (response.data.success) {
                setCartItems(response.data.cartData || {});
            } else {
                toast.error(
                    response.data.message || "Unable to load cart"
                );
            }
        } catch (error) {
            console.error("Get user cart error:", error);

            toast.error(
                error.response?.data?.message || error.message
            );
        }
    };

    // ------------------------------------
    // LOAD PRODUCTS ON COMPONENT MOUNT
    // ------------------------------------
    useEffect(() => {
        getProductData();
    }, []);

    // ------------------------------------
    // LOAD SAVED TOKEN
    // ------------------------------------
    useEffect(() => {
        const savedToken = localStorage.getItem("token");

        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    // ------------------------------------
    // LOAD CART WHEN TOKEN IS AVAILABLE
    // ------------------------------------
    useEffect(() => {
        if (token) {
            getUserCart(token);
        }
    }, [token]);

    // ------------------------------------
    // CONTEXT VALUES
    // ------------------------------------
    const value = {
        products,
        currency,
        delivery_fee,

        search,
        setSearch,
        showSearch,
        setShowSearch,

        cartItems,
        addToCart,
        setCartItems,

        getCartCount,
        updateQuantity,
        getCartAmount,

        navigate,
        backendUrl,

        token,
        setToken,
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;