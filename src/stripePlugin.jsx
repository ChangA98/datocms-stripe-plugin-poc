import React, { useState, useEffect } from 'react';

import Dropdown from './components/dropdown';

const stripePlugin = ({ token }) => {
    const TOKEN = '';
    console.log('token', TOKEN)

    const [products, setProducts] = useState(false);
    const [prices, setPrices] = useState(false);
    const [coupons, setCoupons] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedPrice, setSelectedPrice] = useState('');
    const [selectedCoupon, setSelectedCoupon] = useState('');

    const [elegibleForCoupon, setElegibleForCoupon] = useState('');

    console.log('Product > ', selectedProduct);
    console.log('Price > ', selectedPrice);
    console.log('Coupon > ', selectedCoupon);

    const [loading, setLoading] = useState(false);

    async function getProducts() {
        setLoading(true);

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
            setProducts(products);
        }

        setLoading(false);
    }

    async function getPrices(productId) {
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
            setPrices(prices);
        }
    }

    async function getCoupons() {
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
            setCoupons(coupons);
        }
    }

    useEffect(() => {
        getProducts();
        getCoupons();
    }, []);

    useEffect(() => {
        if (selectedProduct !== '') {
            setPrices(false);
            setSelectedPrice('');
            setElegibleForCoupon(false);
            getPrices(selectedProduct);
        }
    }, [selectedProduct]);

    useEffect(() => {
        if (selectedPrice !== '') {
            const price = prices.find(price => price.id === selectedPrice);

            if (price.type === 'recurring') {
                setElegibleForCoupon(true);
            } else {
                setElegibleForCoupon(false);
            }
        }
    }, [selectedPrice]);

    if (loading) {
        return (
            <div>
                <p>Wait... fetching products ;)</p>
            </div>
        )
    }

    if (!products) {
        return (
            <div>
                <p>No products loaded :(</p>
            </div>
        )
    }

    return (
        <div>
            {/* Products Dropdown */}
            {products && (
                <Dropdown
                    value={selectedProduct}
                    handleOnChange={e => setSelectedProduct(e.target.value)}
                    placeholder='Select Product'>
                    {products.map(({ id, name }) => (
                        <option key={id} value={id}>{name} sqft.</option>
                    ))}
                </Dropdown>
            )}

            {/* Prices Dropdown */}
            {prices && (
                <Dropdown
                    value={selectedPrice}
                    handleOnChange={e => setSelectedPrice(e.target.value)}
                    placeholder='Select Price'>
                    {prices.map(({ id, nickname }) => (
                        <option key={id} value={id}>{nickname}</option>
                    ))}
                </Dropdown>
            )}

            {/* Coupons Dropdown */}
            {(coupons && selectedPrice && elegibleForCoupon) && (
                <Dropdown
                    value={selectedCoupon}
                    handleOnChange={e => setSelectedCoupon(e.target.value)}
                    placeholder='Select Coupon'>
                    {coupons.map(({ id, name }) => (
                        <option key={id} value={id}>{name}</option>
                    ))}
                </Dropdown>
            )}
        </div >
    );
};

export default stripePlugin;