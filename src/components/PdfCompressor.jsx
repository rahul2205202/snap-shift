import React, { useState, useEffect } from 'react';
import { compressPdf } from '../service/ApiService'; // Adjust path if needed

export default function PdfCompressor() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [compressedPdfUrl, setCompressedPdfUrl] = useState(null);
    const [quality, setQuality] = useState(0.5); // A good default for significant compression
    
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        return () => {
            if (compressedPdfUrl) URL.revokeObjectURL(compressedPdfUrl);
        };
    }, [compressedPdfUrl]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
            setOriginalSize(file.size);
            setCompressedPdfUrl(null);
            setCompressedSize(0);
            setError(null);
        } else {
            setError('Please select a valid PDF file.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
            setError('Please select a PDF file first.');
            return;
        }

        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('quality', quality); // Send the float value from the slider

        try {
            const compressedBlob = await compressPdf(formData);
            setCompressedPdfUrl(URL.createObjectURL(compressedBlob));
            setCompressedSize(compressedBlob.size);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    const getReductionPercent = () => {
        if (originalSize === 0 || compressedSize === 0) return 0;
        return Math.round(((originalSize - compressedSize) / originalSize) * 100);
    };

    return (
        <div className="w-full max-w-4xl">
            <div className="bg-white rounded-lg shadow-xl p-8">
                <h2 className="text-3xl font-bold text-black text-center mb-2">PDF Compressor</h2>
                <p className="text-center text-gray-500 mb-8">Reduce the file size of your PDF documents by compressing the images inside.</p>

                <form onSubmit={handleSubmit}>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 mb-6">
                        <label htmlFor="pdf-upload" className="block text-sm font-bold text-black mb-2">1. Upload PDF File</label>
                        <input id="pdf-upload" type="file" accept="application/pdf" onChange={handleFileChange} className="mx-auto block w-full max-w-xs text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-black hover:file:bg-gray-300" />
                        {selectedFile && <p className="mt-4 text-gray-600">Selected: <span className="font-semibold">{selectedFile.name}</span></p>}
                    </div>

                    <div className="mt-6">
                        <label htmlFor="quality-slider" className="block text-sm font-bold text-black mb-2 text-center">
                            2. Select Image Quality ({Math.round(quality * 100)}%)
                        </label>
                        <input 
                            id="quality-slider" 
                            type="range" 
                            min="0.1" 
                            max="1.0" 
                            step="0.05" 
                            value={quality} 
                            onChange={(e) => setQuality(parseFloat(e.target.value))} 
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                        />
                        <p className="text-xs text-center text-gray-500 mt-1">Lower quality settings result in a much smaller file size.</p>
                    </div>
                    
                    <div className="mt-8 text-center">
                        <button type="submit" disabled={isLoading || !selectedFile} className="w-full max-w-xs bg-black text-white font-bold py-2.5 px-4 rounded-md transition-colors duration-300 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {isLoading ? 'Compressing...' : '3. Compress PDF'}
                        </button>
                    </div>
                </form>

                {error && <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert"><strong className="font-bold">Error: </strong><span className="block sm:inline">{error}</span></div>}

                {compressedPdfUrl && (
                    <div className="mt-8 text-center border border-gray-200 rounded-lg p-6">
                        <h3 className="text-xl font-bold text-black mb-4">Compression Complete!</h3>
                        <div className="flex justify-center items-center space-x-8">
                            <div>
                                <p className="text-gray-500">Original Size</p>
                                <p className="text-lg font-semibold">{formatFileSize(originalSize)}</p>
                            </div>
                            <div className="text-green-600">
                                <p className="font-bold">~{getReductionPercent()}% smaller</p>
                                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path></svg>
                            </div>
                            <div>
                                <p className="text-gray-500">Compressed Size</p>
                                <p className="text-lg font-semibold">{formatFileSize(compressedSize)}</p>
                            </div>
                        </div>
                        <a href={compressedPdfUrl} download={`compressed-${selectedFile.name}`} className="mt-6 inline-block bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors duration-300">
                            Download Compressed PDF
                        </a>
                    </div>
                )}
            </div>
            
            <div className="mt-12 bg-white rounded-lg shadow-xl p-8">
                {/* ... Guide and Features Section ... */}
            </div>
        </div>
    );
}
