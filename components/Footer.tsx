
import React from 'react';

interface FooterProps {
    onNavigate: (page: 'privacy' | 'disclaimer') => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    return (
        <footer className="bg-slate-900/50 border-t border-slate-800 mt-12 py-6">
            <div className="container mx-auto max-w-7xl text-center text-slate-500 text-sm">
                <div className="flex justify-center items-center space-x-6 mb-4">
                    <button onClick={() => onNavigate('privacy')} className="hover:text-sky-400 transition-colors">
                        Privacy Policy
                    </button>
                    <span className="text-slate-600">|</span>
                    <button onClick={() => onNavigate('disclaimer')} className="hover:text-sky-400 transition-colors">
                        Disclaimer
                    </button>
                </div>
                <p>&copy; {new Date().getFullYear()} AI Virtual Try-On Studio. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
