const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

app.use('/static', express.static('libraries'))

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

app.use(cors())
app.use(express.json())

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { totalAmount } = req.body

    if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({ error: 'Invalid total amount' })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(totalAmount),
      currency: 'hkd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        visaID: 'VN-123456'
      }
    })

    res.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    res.status(500).json({ error: error.message })
  }
})


const PORT = process.env.PORT || 4242
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
)
