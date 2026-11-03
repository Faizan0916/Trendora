 import { useContext, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const Verify = () => {
    const { navigate, token, setCartItems, backendUrl } =
        useContext(ShopContext)

    const [searchParams] = useSearchParams()

    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')
    const sessionId = searchParams.get('session_id')

    const verificationStarted = useRef(false)

    useEffect(() => {
        const verifyPayment = async () => {
            console.log('VERIFY COMPONENT MOUNTED')
            console.log('VERIFY PARAMS:', {
                success,
                orderId,
                sessionId,
                tokenExists: Boolean(token),
                backendUrl
            })

            if (!token) {
                console.log('TOKEN IS MISSING')
                return
            }

            if (verificationStarted.current) {
                return
            }

            verificationStarted.current = true

            if (success !== 'true' || !orderId || !sessionId) {
                console.log('INVALID VERIFICATION PARAMETERS')

                toast.error('Payment verification details are missing')
                navigate('/orders', { replace: true })
                return
            }

            try {
                const verifyUrl = `${backendUrl}/api/order/verifyStripe`

                console.log('SENDING VERIFY REQUEST:', verifyUrl)

                const response = await axios.get(verifyUrl, {
                    headers: {
                        token
                    },
                    params: {
                        success,
                        orderId,
                        session_id: sessionId
                    }
                })

                console.log('VERIFY API RESPONSE:', response.data)
                
                if (response.data.success) {
                    toast.success('Payment verified successfully')

                    setCartItems({})

                    navigate('/orders', { replace: true })
                } else {
                    toast.error(
                        response.data.message ||
                        'Payment verification failed'
                    )

                    navigate('/orders', { replace: true })
                }
            } catch (error) {
                console.error('STRIPE VERIFY ERROR:', error)

                console.error(
                    'BACKEND ERROR:',
                    error.response?.data
                )

                toast.error(
                    error.response?.data?.message ||
                    error.message ||
                    'Payment verification failed'
                )
            }
        }

        verifyPayment()
    }, [token])

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>

            <p className="mt-4 text-gray-600">
                Verifying your payment...
            </p>
        </div>
    )
}

export default Verify