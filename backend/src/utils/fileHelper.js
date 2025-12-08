const { message } = require('antd');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Files = require('../models/files');
const Cloudinary = require('./cloudinary');

/**
 * Upload a file to Cloudinary in a specific folder and store metadata
 * @param {object} file - { thumbUrl: base64 string, ... }
 * @param {string} folder - Cloudinary folder name
 * @param {string} moduleName - Module name for metadata
 * @returns {Promise<object>} - File metadata from DB
 */
const storeFileCloudinary = async (file, folder, moduleName) => {
    const matches = file.thumbUrl.match(/^data:(.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
        throw new Error('Invalid Base64 format');
    }
    const mimeType = matches[1];
    const imageData = matches[2];
    const ext = mimeType.split('/')[1];
    const filename = `${uuidv4()}.${ext}`;
    // Upload to Cloudinary
    const uploadRes = await Cloudinary.upload(file.thumbUrl, { folder });
    // Store metadata in DB
    let fileData = {
        folder_name: folder,
        file_name: filename,
        format: ext,
        sizeKB: Math.round(uploadRes.bytes / 1024),
        type: uploadRes.resource_type,
        module: moduleName,
        public_id: uploadRes.public_id,
        url: uploadRes.secure_url,
        created_at: new Date(),
        updated_at: new Date()
    };
    fileData = await Files.create(fileData);
    return fileData.id;
};

/**
 * Get Cloudinary file URL and metadata by fileId
 * @param {number} fileId
 * @returns {Promise<object|null>}
 */
const getCloudinaryFile = async (fileId) => {
    const file = await Files.findById(fileId);
    if (file && file.public_id) {
        const url = Cloudinary.getUrl(file.public_id);
        return { ...file, cloudinaryUrl: url };
    }
    return null;
};

const getFilePath = (filename) => path.join(__dirname, `../data/${filename}`);

const readData = (filename) => {
    const filePath = getFilePath(filename);
    if (!fs.existsSync(filePath)) return [];
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    if (jsonData.trim().length == 0) return [];
    return JSON.parse(jsonData);
}

const writeData = (filename, data) => {
    const filePath = getFilePath(filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

const storeFile = async (file, folder, moduleName) => {
    // Extract the file extension from Base64
    const matches = file.thumbUrl.match(/^data:(.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
        return res.status(400).json({ message: 'Invalid Base64 format' });
    }

    const mimeType = matches[1]; // e.g. image/png
    const imageData = matches[2]; // actual base64 content
    const ext = mimeType.split('/')[1]; // e.g. png

    // Create a unique filename
    const filename = `${uuidv4()}.${ext}`;
    const folderPath = path.join(__dirname, '..', 'assets', folder);
    const filePath = path.join(folderPath, filename);

    // Create the folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    // Save file to local disk
    fs.writeFileSync(filePath, Buffer.from(imageData, 'base64'));

    // Prepare icon info
    const iconFormat = ext.replace('.', '').toLowerCase();
    const sizeInBytes = Buffer.from(imageData, 'base64').length;
    const iconSizeKB = Math.round(sizeInBytes / 1024);

    // Store icon info in a JSON file
    let fileData = {
        'folder_name': folder,
        'file_name': filename,
        'format': iconFormat,
        'sizeKB': iconSizeKB,
        'type': 'image',
        'module': moduleName,
        'created_at': new Date(),
        'updated_at': new Date()
    };
    fileData = await Files.create(fileData);
    return fileData.id;
}

const deleteFile = async (fileId) => {
    const fileData = await Files.findById(fileId); 

    if (!fileData) {
        return { success: false, message: "File not found in database" };
    }

    const folderPath = path.join(__dirname, `../assets/${fileData.folder_name}`);
    const filePath = path.join(folderPath, fileData.file_name);

    // Check if folder exists
    if (!fs.existsSync(folderPath)) {
        return { success: false, message: 'Folder does not exist' };
    }

    // Delete the physical file
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
    // Remove file record from database
    await Files.softDelete(fileId);
    return { success: true, message: 'File Deleted Successfully' };
}

const getImageFile = async (fileId) => {
    const file = await Files.findById(fileId);
    if (file) {
        const filePath = path.join(__dirname, `../assets/${file.folder_name}`, file.file_name);
        const fileBuffer = fs.readFileSync(filePath);
        const base64 = `data:image/${file.format};base64,${fileBuffer.toString("base64")}`;
        return { ...file, base64Url: base64 };
    }
    return null;
}

module.exports = { readData, writeData, storeFile, deleteFile, getImageFile, storeFileCloudinary, getCloudinaryFile };