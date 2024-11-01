import axios from "axios";
import { showAlert } from "./alarm";
import Stripe from "stripe";

const stripe = Stripe('pk_test_51QFxCHFVbnXhAVjs793aLMbAcCoCj0UGEhW5XCKtyFIpivE8Sdb1zztRjp36tPk0Y4koFfzoDV6j5y7wkkPigWP300Lf5A7THW');

export const bookTour = async tourId => {
    try{
        const session = await axios(`/booking/checkout-session/${tourId}`);
        
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    
    } catch (err) {
        showAlert('error', err)
    }
};