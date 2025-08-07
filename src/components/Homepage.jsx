import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

// ToolCard now uses the Link component and a 'to' prop
const ToolCard = ({ icon, title, description, to }) => (
    <Link to={to} className="block bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="flex-shrink-0 w-14 h-14 bg-black rounded-full flex items-center justify-center mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-black mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </Link>
);

export default function Homepage() {
    // Icons for the tool cards
    const icons = {
        pdfCompressor: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>,
        compressor: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>,
        generator: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L11 15l-4 6h12l-4-6 2.293-2.293a1 1 0 011.414 0L19 12M5 12l2.293 2.293a1 1 0 001.414 0L11 12l-4-6H3l2 6z"></path></svg>,
        converter: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>,
        imgToPdf: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>,
        pdfToImg: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>,
    };

    return (
        <div className="w-full">
            <Helmet>
                <title>PixelShift - Free Online Image & PDF Tools</title>
                <meta name="description" content="A complete suite of free online tools. Convert, compress, create with AI, and manage your images and PDFs all in one place." />
                <meta name="keywords" content="pdf compressor, image converter, image compressor, ai image generator, image to pdf, pdf to image, free online tools" />
                <link rel="canonical" href="https://your-domain.com/" />
            </Helmet>

            <section className="text-center bg-white py-20 px-4 rounded-lg shadow-xl">
                <h1 className="text-5xl md:text-6xl font-extrabold text-black mb-4">
                    Your Complete Document & Image Toolkit
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                    Convert, compress, create, and manage your images and PDFs with our powerful suite of free online tools. Fast, secure, and easy to use.
                </p>
                <Link to="/compress-pdf" className="bg-black text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors duration-300 transform hover:scale-105">
                    Get Started
                </Link>
            </section>

            <section className="py-16">
                <h2 className="text-3xl font-bold text-black text-center mb-10">Explore Our Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <ToolCard to="/compress-pdf" icon={icons.pdfCompressor} title="PDF Compressor" description="Reduce the file size of your PDF documents quickly while maintaining quality." />
                    <ToolCard to="/compress-image" icon={icons.compressor} title="Image Compressor" description="Reduce image file sizes without losing quality. Perfect for web optimization." />
                    <ToolCard to="/generate-ai-image" icon={icons.generator} title="AI Image Generator" description="Bring your ideas to life. Describe any scene and watch our AI generate a unique image." />
                    <ToolCard to="/convert-image-format" icon={icons.converter} title="Image Format Converter" description="Easily convert images between popular formats like JPG, PNG, GIF, and BMP." />
                    <ToolCard to="/convert-image-to-pdf" icon={icons.imgToPdf} title="Image to PDF" description="Combine multiple images into a single, professional PDF document." />
                    <ToolCard to="/convert-pdf-to-image" icon={icons.pdfToImg} title="PDF to Image" description="Extract every page from a PDF and save them as high-quality JPG or PNG images." />
                </div>
            </section>
        </div>
    );
}
