const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const braintree = require("braintree");

const { PORT = 3410 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(morgan("common"));
app.use(cors());

const {
  BRAINTREE_MERCHANT_ID,
  BRAINTREE_PUBLIC_KEY,
  BRAINTREE_PRIVATE_KEY
} = process.env;

if (!BRAINTREE_MERCHANT_ID || !BRAINTREE_PUBLIC_KEY || !BRAINTREE_PRIVATE_KEY) {
  throw new Error(`Invalid or missing Braintree credentials.
BRAINTREE_MERCHANT_ID, BRAINTREE_PUBLIC_KEY, and BRAINTREE_PRIVATE_KEY must all be provided.
  `);
}

const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: BRAINTREE_MERCHANT_ID,
  publicKey: BRAINTREE_PUBLIC_KEY,
  privateKey: BRAINTREE_PRIVATE_KEY
});

app.get("/", (_, res) => {
  res.send(
    `Client lives at <a href="http://localhost:3411">http://localhost:3411</a>`
  );
});

app.post("/checkout", async (req, res) => {
  const { amount, paymentMethodToken } = req.body;

  const result = await gateway.transaction.sale({
    amount,
    paymentMethodNonce: paymentMethodToken.id
  });

  if (result.success) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        transactionId: result.transaction.id
      })
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: result.message })
  };
});

app.listen(PORT, () => console.log(`App running @ http://localhost:${PORT}`));
