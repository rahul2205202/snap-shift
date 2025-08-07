import React, { useState, useEffect } from 'react';
import { compressImage } from '../service/ApiService'; // Adjust path if needed

export default function ImageCompressor() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [originalImagePreview, setOriginalImagePreview] = useState(null);
    const [compressedImageUrl, setCompressedImageUrl] = useState(null);
    const [quality, setQuality] = useState(0.8); // Default quality 80%
    
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Clean up object URLs
    useEffect(() => {
        return () => {
            if (originalImagePreview) URL.revokeObjectURL(originalImagePreview);
            if (compressedImageUrl) URL.revokeObjectURL(compressedImageUrl);
        };
    }, [originalImagePreview, compressedImageUrl]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setOriginalImagePreview(URL.createObjectURL(file));
            setOriginalSize(file.size);
            // Reset previous results
            setCompressedImageUrl(null);
            setCompressedSize(0);
            setError(null);
        } else {
            setError('Please select a valid image file.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
            setError('Please select an image file first.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setCompressedImageUrl(null);
        setCompressedSize(0);

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('quality', quality);

        try {
            const compressedBlob = await compressImage(formData);
            setCompressedImageUrl(URL.createObjectURL(compressedBlob));
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
        <div className="bg-gray-100 min-h-screen flex items-center justify-center font-sans p-4">
        <div className="w-full max-w-6xl">
            <div className="bg-white rounded-lg shadow-xl p-8">
                <h2 className="text-3xl font-bold text-black text-center mb-2">Image Compressor</h2>
                <p className="text-center text-gray-500 mb-8">Reduce the file size of your images with adjustable quality.</p>

                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <div>
                            <label htmlFor="file-upload" className="block text-sm font-bold text-black mb-2">1. Upload Image</label>
                            <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-black hover:file:bg-gray-300" />
                        </div>
                        <div>
                            <label htmlFor="quality-slider" className="block text-sm font-bold text-black mb-2">2. Select Quality ({Math.round(quality * 100)}%)</label>
                            <input id="quality-slider" type="range" min="0.1" max="1.0" step="0.05" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                        </div>
                        <div>
                            <button type="submit" disabled={isLoading || !selectedFile} className="w-full bg-black text-white font-bold py-2.5 px-4 rounded-md transition-colors duration-300 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                {isLoading ? 'Compressing...' : '3. Compress Image'}
                            </button>
                        </div>
                    </div>
                </form>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md my-4" role="alert"><strong className="font-bold">Error: </strong><span className="block sm:inline">{error}</span></div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-bold text-black">Original</h3>
                            {originalSize > 0 && <span className="text-sm font-medium text-gray-600">{formatFileSize(originalSize)}</span>}
                        </div>
                        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md border">
                           {originalImagePreview ? <img src={originalImagePreview} alt="Original preview" className="max-h-full max-w-full object-contain" /> : <p className="text-gray-400">Upload an image to see a preview</p>}
                        </div>
                    </div>
                    <div>
                         <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-bold text-black">Compressed</h3>
                            {compressedSize > 0 && <span className="text-sm font-medium text-green-600">{formatFileSize(compressedSize)} (~{getReductionPercent()}% smaller)</span>}
                        </div>
                        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md border">
                           {isLoading && <div className="text-black">Processing...</div>}
                           {compressedImageUrl && !isLoading && <img src={compressedImageUrl} alt="Compressed preview" className="max-h-full max-w-full object-contain" />}
                           {!isLoading && !compressedImageUrl && <p className="text-gray-400">Your compressed image will appear here</p>}
                        </div>
                        {compressedImageUrl && <a href={compressedImageUrl} download={`compressed-${selectedFile.name}`} className="mt-4 w-full block text-center bg-green-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 hover:bg-green-700">Download Compressed Image</a>}
                    </div>
                </div>
            </div>
            
            <div className="mt-12 bg-white rounded-lg shadow-xl p-8">
                {/* How to Use Section */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-black mb-10">How to Compress Images</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4"><span className="text-white font-bold text-2xl">1</span></div>
                            <h3 className="text-xl font-semibold text-black mb-2">Upload Image</h3>
                            <p className="text-gray-600 px-4">Select the JPG, PNG, or other image file you want to reduce in size.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4"><span className="text-white font-bold text-2xl">2</span></div>
                            <h3 className="text-xl font-semibold text-black mb-2">Adjust Quality</h3>
                            <p className="text-gray-600 px-4">Use the slider to find the perfect balance between file size and image quality.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4"><span className="text-white font-bold text-2xl">3</span></div>
                            <h3 className="text-xl font-semibold text-black mb-2">Download</h3>
                            <p className="text-gray-600 px-4">Download your optimized image. Your original file remains untouched.</p>
                        </div>
                    </div>
                </div>

                <div className="my-12 border-t border-gray-200"></div>

                {/* Key Features Section */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-black mb-10">Key Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 max-w-4xl mx-auto text-left">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-black mb-1">Smart Compression</h4>
                                <p className="text-gray-600">Our tool uses advanced lossy compression techniques to significantly reduce file size without sacrificing quality.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                               <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l-4 4-4-4M6 16l-4-4 4-4"></path></svg>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-black mb-1">Live Preview</h4>
                                <p className="text-gray-600">See the original and compressed images side-by-side to compare quality and file size in real-time.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 16v-2m8-8h2M4 12H2m15.364 6.364l-1.414-1.414M6.05 6.05l-1.414-1.414m12.728 0l-1.414 1.414M6.05 17.95l-1.414 1.414"></path></svg>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-black mb-1">Adjustable Quality</h4>
                                <p className="text-gray-600">You have full control over the compression level with an easy-to-use quality slider.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.417l5.5-5.5a1 1 0 011.414 0l5.5 5.5A12.02 12.02 0 0012 21.944a11.955 11.955 0 018.618-3.04m-3.04-7.016a1 1 0 011.414 0l2.12 2.12a1 1 0 010 1.414l-2.12 2.12a1 1 0 01-1.414 0l-2.12-2.12a1 1 0 010-1.414l2.12-2.12z"></path></svg>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-black mb-1">Secure & Private</h4>
                                <p className="text-gray-600">Your images are processed securely and are never stored on our servers.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}
