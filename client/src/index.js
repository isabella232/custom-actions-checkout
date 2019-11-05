import braintree from "braintree-web";

const BASE_URI = `http://localhost:3410`;

if (!process.env.BRAINTREE_TOKENIZATION_KEY) {
  throw new Error("Braintree Tokenization Key required");
}

const TOKENIZE_CUSTOM_ACTIONS_PAYMENT_METHOD = `mutation TokenizeCustomActionsPaymentMethod($input: TokenizeCustomActionsPaymentMethodInput!) {
    tokenizeCustomActionsPaymentMethod(input: $input){
      paymentMethod {
        id
        usage
        details {
          ... on CustomActionsPaymentMethodDetails {
            actionName
            fields {
              name
              displayValue
            }
          }
        }
      }
    }
  }`;

const tokenize = async fields => {
  const client = await braintree.client.create({
    authorization: process.env.BRAINTREE_TOKENIZATION_KEY
  });

  // Get single-use token
  const { data } = await client.request({
    api: "graphQLApi",
    data: {
      query: TOKENIZE_CUSTOM_ACTIONS_PAYMENT_METHOD,
      variables: {
        input: {
          customActionsPaymentMethod: {
            actionName: "demo",
            fields
          }
        }
      }
    }
  });

  return data.tokenizeCustomActionsPaymentMethod.paymentMethod;
};

const pay = async paymentMethodToken => {
  const res = await fetch(`${BASE_URI}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paymentMethodToken, amount: "10" })
  });

  return await res.json();
};

const checkout = async () => {
  const paymentMethodToken = await tokenize([
    { name: "AccountNumber", value: "1234", displayValue: "***4" }
  ]);
  const transaction = await pay(paymentMethodToken);

  console.log(transaction);
};

const main = async () => {
  const payButton = document.querySelector("button");
  payButton.addEventListener("click", checkout);
};

main().catch(error => console.error("App Error", error));
