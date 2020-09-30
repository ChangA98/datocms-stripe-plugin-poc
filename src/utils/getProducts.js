export default async function getProducts(TOKEN) {
    const response = await fetch('https://api.stripe.com/v1/products?active=true', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
        }
    }).then(res => {
        return res.json();
    }).then(response => {
        return response;
    });

    const products = response.data;

    if (products) {
        return products;
    }

    return null;
}