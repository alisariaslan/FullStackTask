import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline';
}

export function Button({ children, className, variant = 'primary', ...props }: ButtonProps) {
    const baseStyles = "py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200";
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white font-bold",
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className || ''}`}
            {...props}
        >
            {children}
        </button>
    );
}