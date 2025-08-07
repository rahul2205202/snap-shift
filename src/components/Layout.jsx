import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header'; // Assuming your navigation is named Header.jsx
import Footer from './Footer';

// Define tools to show the tab navigation
const tools = {
  HOME: 'Home',
  IMAGE_COMPRESSOR: 'Image Compressor',
  AI_GENERATOR: 'AI Image Generator',
  IMAGE_CONVERTER: 'Image Format Converter',
  IMAGE_TO_PDF: 'Image to PDF',
  PDF_TO_IMAGE: 'PDF to Image',
};

export default function Layout() {
  const location = useLocation();
  // We determine if the current page is the homepage
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header tools={tools} />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            {/* The Outlet renders the matched child route component */}
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
