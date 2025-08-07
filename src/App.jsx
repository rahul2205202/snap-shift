import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import your components
import Layout from './components/Layout';
import Homepage from './components/Homepage';
import ImageConverter from './components/ImageConverter';
import ImageToPdfConverter from './components/ImageToPdfConverter';
import PdfToImageConverter from './components/PdfToImageConverter';
import ImageGenerator from './components/ImageGenerator';
import ImageCompressor from './components/ImageCompressor';
import PdfCompressor from './components/PdfCompressor'; // The new component

function App() {
  return (
    <Routes>
      {/* All pages will use the Layout component (Header & Footer) */}
      <Route path="/" element={<Layout />}>
        {/* The index route renders the Homepage by default at "/" */}
        <Route index element={<Homepage />} />
        
        {/* Define a unique route for each tool */}
        <Route path="compress-pdf" element={<PdfCompressor />} />
        <Route path="compress-image" element={<ImageCompressor />} />
        <Route path="generate-ai-image" element={<ImageGenerator />} />
        <Route path="convert-image-format" element={<ImageConverter />} />
        <Route path="convert-image-to-pdf" element={<ImageToPdfConverter />} />
        <Route path="convert-pdf-to-image" element={<PdfToImageConverter />} />

        {/* A "catch-all" route for any undefined paths (404 page) */}
        <Route path="*" element={
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold">404 - Not Found</h1>
            <p className="text-gray-600 mt-4">The page you are looking for does not exist.</p>
          </div>
        } />
      </Route>
    </Routes>
  );
}

export default App;
