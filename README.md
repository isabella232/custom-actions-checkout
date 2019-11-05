# Custom Actions checkout

An example checkout (client and server) for integrating Braintree [Custom Actions](https://github.com/braintree/custom-actions-docs).

Before starting, familiarize yourself with both [Custom Actions](https://github.com/braintree/custom-actions-docs) and [getting started with Braintree](https://developers.braintreepayments.com/start/overview).

**Requirements**

1. A Braintree sandbox account – https://www.braintreepayments.com/sandbox
2. Credentials
   1. **Client:** A [tokenization key](https://developers.braintreepayments.com/guides/authorization/tokenization-key/javascript/v3)
   2. **Server:** [Server credentials](https://articles.braintreepayments.com/control-panel/important-gateway-credentials?_ga=1.213870932.1908520325.1572965010#api-credentials) ([Guide](https://developers.braintreepayments.com/start/hello-server/node#install-and-configure))

## Quickstart

**Install dependencies**

```sh
nvm install && npm i
```

**Run:**

```sh
BRAINTREE_TOKENIZATION_KEY=<BRAINTREE_TOKENIZATION_KEY> \
BRAINTREE_MERCHANT_ID=<BRAINTREE_MERCHANT_ID> \
BRAINTREE_PUBLIC_KEY=<BRAINTREE_PUBLIC_KEY> \
BRAINTREE_PRIVATE_KEY=<BRAINTREE_PRIVATE_KEY> \
npm start
```

This will spin up a client (http://localhost:3411) and a server API (http://localhost:3410).

## Client

The client is an example checkout that ships with the [Braintree JavaScript web SDK](https://github.com/braintree/braintree-web). It is wired up to tokenize a Custom Actions payment method to generate a [nonce](https://developers.braintreepayments.com/guides/payment-method-nonces) to send to the server to run a transaction.

Learn more about tokenizing data for Custom Actions integrations [here](https://github.com/braintree/custom-actions-docs/blob/master/accept-a-new-payment-method.md#tokenization).

## Server

The uses the [Braintre Node.js SDK](https://github.com/braintree/braintree_node) and exposes an API to create a transaction ([docs](https://developers.braintreepayments.com/start/hello-server/node#receive-a-payment-method-nonce-from-your-client)).

> The API is CORS-enabled by default

### API

> All endpoints accept JSON bodies and return JSON payloads

#### POST /checkout

**Required body:**

```json
{
  "amount": "<AMOUNT>",
  "paymentMethodToken": {
    "id": "<PAYMENT_METHOD_NONCE>"
  }
}
```

**Response**

`200 OK`

```json
{
  "data": {
    "transactionId": "<ID_OF_THE_TRANSACTION>"
  }
}
```
