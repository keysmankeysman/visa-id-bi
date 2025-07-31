const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');

const app = express();
const stripe = Stripe('YOUR_STRIPE_SECRET_KEY'); // Замените на ваш секретный ключ Stripe

app.use(bodyParser.json());

app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency, paymentMethodId } = req.body;

        // Создание платежного интента
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            payment_method: paymentMethodId,
            confirm: true, // Подтверждение платежа
        });

        // Получение идентификатора карты Visa
        const cardId = paymentIntent.charges.data[0].payment_method_details.card.id;

        res.status(200).json({
            success: true,
            paymentIntentId: paymentIntent.id,
            cardId: cardId,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
