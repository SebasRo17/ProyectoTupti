const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

function environment() {
    return new checkoutNodeJssdk.core.SandboxEnvironment(
        'AdgQYJ5vd3ydgmH4MQQ1oktAjVwQ4KN5j4Ytot7rAsIHHg5LTBzTaYluIKOWdmHRF1Cs2RdWCqltq8QN',
        'EKIcn4G0NPQv69zgjBtPJLMeXmm1ociCVCQAqmnH0mIsNWf96-wtshAyZgkAstTUjXMJ4N5JFunz5CDCT'
    );
}

function client() {
    return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

async function createOrder(total) {
    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'MXN',
                value: total
            }
        }]
    });

    try {
        const order = await client().execute(request);
        return order.result;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports = { client, createOrder };