import React from 'react';

const Dropdown = ({ value, handleOnChange, placeholder, children, ...props }) => {
    return (
        <div>
            <select value={value} onChange={handleOnChange}>
                <option value='' disabled> - {placeholder} - </option>
                {children}
            </select>
        </div>
    );
};

export default Dropdown;