// Input.tsx

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export function Input({ className, ...props }: InputProps) {
    return (
        <input
            className={`w-full h-10 px-4 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:bg-white transition-all ${className || ''}`}
            {...props}
        />
    );
}