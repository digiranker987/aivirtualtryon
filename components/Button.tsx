
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
    return (
        <button
            className={`
                flex items-center justify-center px-6 py-3 border border-transparent 
                text-base font-medium rounded-md text-white shadow-sm 
                bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 
                focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500
                disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed
                transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-100
                ${className}
            `}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
