import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { to: '/compress-pdf', text: 'PDF Compressor' },
        { to: '/compress-image', text: 'Image Compressor' },
        { to: '/generate-ai-image', text: 'AI Generator' },
        { to: '/convert-image-format', text: 'Converter' },
        { to: '/convert-image-to-pdf', text: 'Image to PDF' },
        { to: '/convert-pdf-to-image', text: 'PDF to Image' },
    ];

    const activeStyle = {
      color: 'black',
      fontWeight: '600',
    };

    return (
        <header className="bg-white shadow-md w-full sticky top-0 z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-bold text-black">
                           PixelShift
                        </Link>
                    </div>

                    <nav className="hidden md:flex md:space-x-8">
                        {navLinks.map((link) => (
                             <NavLink
                                key={link.text}
                                to={link.to}
                                style={({ isActive }) => isActive ? activeStyle : undefined}
                                className="font-medium text-gray-600 hover:text-black transition-colors duration-200"
                            >
                                {link.text}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-black focus:outline-none">
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                         {navLinks.map((link) => (
                             <NavLink to={link.to} key={link.text} onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-black hover:bg-gray-100">
                                {link.text}
                            </NavLink>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}
