import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Card({ children, className, ...props }: CardProps) {
    return (
        <div
            className={`bg-white shadow-md rounded-lg border border-gray-200 ${className || ''}`}
            {...props}
        >
            {children}
        </div>
    );
}