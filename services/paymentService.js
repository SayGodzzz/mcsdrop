const stripe = require('stripe')('your-stripe-secret-key');

class PaymentService {
    constructor() {
        this.stripe = stripe;
    }

    async createPaymentIntent(amount, currency = 'usd') {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount,
                currency,
            });
            return paymentIntent;
        } catch (error) {
            throw new Error(`Payment Intent Creation Failed: ${error.message}`);
        }
    }

    async confirmPayment(intentId, paymentMethodId) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.confirm(intentId, {
                payment_method: paymentMethodId,
            });
            return paymentIntent;
        } catch (error) {
            throw new Error(`Payment Confirmation Failed: ${error.message}`);
        }
    }
}

module.exports = new PaymentService();