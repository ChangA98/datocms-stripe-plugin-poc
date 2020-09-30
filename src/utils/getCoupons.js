export default async function getCoupons(TOKEN) {
    const response = await fetch(`https://api.stripe.com/v1/coupons`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
        },
    }).then(res => {
        return res.json();
    }).then(response => {
        return response;
    });

    const coupons = response.data;

    if (coupons) {
        return coupons;
    }

    return null;
}