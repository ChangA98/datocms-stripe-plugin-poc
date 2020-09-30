import React, { useState, useEffect } from 'react';

import { getProducts, getPrices, getCoupons } from './utils';

import Dropdown from './components/dropdown';

const TOKEN = '';

const deserialize = plugin => JSON.parse(plugin.getFieldValue(plugin.fieldPath)) || {};

const StripePlugin = ({ plugin }) => {
    const [fieldValue, setFieldValue] = useState(deserialize(plugin));

    useEffect(() => {
        const unsubscribe = plugin
            .addFieldChangeListener(
                plugin.fieldPath,
                () => setFieldValue(deserialize(plugin))
            );
        return () => unsubscribe();
    }, []);

    const initSelection = itemName => fieldValue[itemName] ? fieldValue[itemName] : '';

    const [selectedProduct, setSelectedProduct] = useState(initSelection('productId'));
    const [selectedPrice, setSelectedPrice] = useState(initSelection('priceId'));
    const [selectedCoupon, setSelectedCoupon] = useState(initSelection('couponId'));

    useEffect(() => {
        fieldValue['productId'] && setSelectedProduct(fieldValue['productId']);
        fieldValue['priceId'] && setSelectedPrice(fieldValue['priceId']);
        fieldValue['couponId'] && setSelectedCoupon(fieldValue['couponId']);
    }, [fieldValue]);

    const [products, setProducts] = useState(false);
    const [prices, setPrices] = useState(false);
    const [coupons, setCoupons] = useState(false);

    const [elegibleForCoupon, setElegibleForCoupon] = useState(false); // TODO Add Initializer
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            setProducts(await getProducts(TOKEN) || false);
            setCoupons(await getCoupons(TOKEN) || false);
            setLoading(false)
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (selectedProduct !== '') {
                setLoading(true);
                setPrices(await getPrices(TOKEN, selectedProduct) || false);
                setLoading(false);
            }
        })();
    }, [selectedProduct]);

    useEffect(() => {
        if (prices && selectedPrice !== '') {
            const price = prices.find(price => price.id === selectedPrice);
            if (price.type === 'recurring') {
                setElegibleForCoupon(true);
            } else {
                setElegibleForCoupon(false);
            }
        }
    }, [prices, selectedPrice]);

    const handleOnChange = (value, itemName) => {
        plugin.setFieldValue(
            plugin.fieldPath, (
            JSON.stringify({
                ...fieldValue,
                [itemName]: value
            })
        ));
    }

    return (
        <div>
            {/* Products Dropdown */}
            {products && (
                <Dropdown
                    value={selectedProduct}
                    handleOnChange={e => handleOnChange(e.target.value, 'productId')}
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
                    handleOnChange={e => handleOnChange(e.target.value, 'priceId')}
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
                    handleOnChange={e => handleOnChange(e.target.value, 'couponId')}
                    placeholder='Select Coupon'>
                    {coupons.map(({ id, name }) => (
                        <option key={id} value={id}>{name}</option>
                    ))}
                </Dropdown>
            )}
        </div >
    );
};

export default StripePlugin;