require('dotenv').config();

const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

class Cloudinary {
    /**
     * Upload a file to Cloudinary
     * @param {string} filePath - Local path or base64 string
     * @param {object} options - Cloudinary upload options
     * @returns {Promise<object>} - Cloudinary upload response
     */
    static async upload(filePath, options = {}) {
        return cloudinary.uploader.upload(filePath, options);
    }

    /**
     * Delete a file from Cloudinary by public ID
     * @param {string} publicId - Cloudinary public ID
     * @returns {Promise<object>} - Cloudinary delete response
     */
    static async delete(publicId) {
        return cloudinary.uploader.destroy(publicId);
    }

    /**
     * Get a Cloudinary URL for a public ID (with optional transformations)
     * @param {string} publicId
     * @param {object} options - Transformation options
     * @returns {string} - Cloudinary URL
     */
    static getUrl(publicId, options = {}) {
        return cloudinary.url(publicId, options);
    }

    /**
     * Optionally: List resources (images/files) in Cloudinary
     * @param {object} options - List options
     * @returns {Promise<object>} - Cloudinary resources response
     */
    static async list(options = {}) {
        return cloudinary.api.resources(options);
    }
}

module.exports = Cloudinary;