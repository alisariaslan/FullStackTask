// components/ui/Button.tsx

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    isLoading?: boolean;
}

export function Button({
    children,
    className = '',
    variant = 'primary',
    isLoading = false,
    disabled,
    ...props
}: ButtonProps) {

    // Animasyonlar, boyutlandırma ve focus durumları
    const baseStyles = "inline-flex items-center justify-center py-2.5 px-4 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer disabled:cursor-not-allowed active:scale-95 disabled:active:scale-100";
    // Variant stilleri
    const variants = {
        // Primary renk, shadow efekti, hover durumları
        primary: `
      bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:bg-primary-dark 
      disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none
    `,
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white disabled:bg-gray-100",
        ghost: "bg-transparent hover:bg-gray-100 text-gray-700"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            <span className={isLoading ? 'opacity-80' : ''}>
                {children}
            </span>
        </button>
    );
}