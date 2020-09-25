import React, { useState, useEffect } from 'react';

const stripePlugin = ({ token }) => {

    const [drBool, setDrBool] = useState(false);

    useEffect(async () => {
        let promiseTest = new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve("¡Éxito!");
            }, 10000);
        });

        promiseTest.then(sms => {
            setDrBool(sms);
        })

    }, []);

    console.log(drBool)

    return (
        <div>
            {token}
        </div>
    );
};

export default stripePlugin;