// src/services/apiService.js
import axios from 'axios';

// Create an axios instance for your local API.
// This is configured to use the proxy you set up in package.json (e.g., "proxy": "http://localhost:8080").
const localApi = axios.create({
    baseURL: 'http://localhost:8080/api/'
});

// --- Service Functions ---

/**
 * Converts a single image to a different format.
 * @param {FormData} formData Contains the file and target format.
 * @returns {Promise<Blob>} A promise that resolves to the converted image blob.
 */
export const convertImage = async (formData) => {
    try {
        const response = await localApi.post('convert/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            responseType: 'blob', // Important for file downloads
        });
        return response.data;
    } catch (error) {
        // Try to parse the error response if it's a blob
        const errorText = await error.response?.data?.text();
        throw new Error(errorText || 'Image conversion failed.');
    }
};

/**
 * Converts multiple images into a single PDF.
 * @param {FormData} formData Contains the image files.
 * @returns {Promise<Blob>} A promise that resolves to the PDF blob.
 */
export const convertImagesToPdf = async (formData) => {
    try {
        const response = await localApi.post('convert/image-to-pdf', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        const errorText = await error.response?.data?.text();
        throw new Error(errorText || 'Image to PDF conversion failed.');
    }
};

/**
 * Converts a PDF into a ZIP file of images.
 * @param {FormData} formData Contains the PDF file and target format.
 * @returns {Promise<Blob>} A promise that resolves to the ZIP file blob.
 */
export const convertPdfToImages = async (formData) => {
    try {
        const response = await localApi.post('convert/pdf-to-image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        const errorText = await error.response?.data?.text();
        throw new Error(errorText || 'PDF to Image conversion failed.');
    }
};

/**
 * Compresses an image to a specified quality.
 * @param {FormData} formData Contains the file and quality level.
 * @returns {Promise<Blob>} A promise that resolves to the compressed image blob.
 */
export const compressImage = async (formData) => {
    try {
        const response = await localApi.post('compress/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        const errorText = await error.response?.data?.text();
        throw new Error(errorText || 'Image compression failed.');
    }
};

/**
 * NEW: Compresses a PDF file.
 * @param {FormData} formData Contains the PDF file.
 * @returns {Promise<Blob>} A promise that resolves to the compressed PDF blob.
 */
export const compressPdf = async (formData) => {
    try {
        const response = await localApi.post('compress/pdf', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        const errorText = await error.response?.data?.text();
        throw new Error(errorText || 'PDF compression failed.');
    }
};


/**
 * Generates an image using the Gemini AI model.
 * @param {string} prompt The text prompt for the AI.
 * @returns {Promise<string>} A promise that resolves to the base64 data URL of the image.
 */
export const generateAiImage = async (prompt) => {
    try {
        const payload = {
            instances: [{ prompt }],
            parameters: { "sampleCount": 1 }
        };
        
        // The API key should be handled by the environment, not hardcoded.
        const apiKey = ""; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

        // Using axios directly for the external API
        const response = await axios.post(apiUrl, payload);
        
        const predictions = response.data.predictions;
        if (predictions && predictions.length > 0 && predictions[0].bytesBase64Encoded) {
            return `data:image/png;base64,${predictions[0].bytesBase64Encoded}`;
        } else {
            throw new Error('API did not return a valid image.');
        }
    } catch (error) {
        const errorMessage = error.response?.data?.error?.message || error.message;
        throw new Error(errorMessage || 'AI image generation failed.');
    }
};
