export default async function getPrices(TOKEN, productId) {
    const response = await fetch(`https://api.stripe.com/v1/prices?product=${productId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
        },
    }).then(res => {
        return res.json();
    }).then(response => {
        return response;
    });

    const prices = response.data;

    if (prices) {
        return prices;
    }

    return null;
}