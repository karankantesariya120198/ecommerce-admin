const { message } = require('antd');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

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

const storeFile = (file, folder) => {
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
    let filesData = readData('files.json');
    const fileData = {
        'id': uuidv4(),
        'filename': filename,
        'format': iconFormat,
        'sizeKB': iconSizeKB,
        'location': filePath,
        'type': 'image',
        'createdAt': new Date().toISOString(),
        'updatedAt': new Date().toISOString()
    };
    filesData.push(fileData);
    writeData('files.json', filesData);
    return fileData.id;
}

const deleteFile = (fileId, folder) => {
    // Read the files data
    const filesData = readData('files.json');

    // Find the file to delete
    const fileIndex = filesData.findIndex(f => f.id === fileId);

    if (fileIndex === -1) {
        return { success: false, message: "File not found in database" };
    }

    const fileInfo = filesData[fileIndex];
    const folderPath = path.join(__dirname, `../assets/${folder}`);
    const filePath = path.join(folderPath, fileInfo.filename);

    // Check if folder exists
    if (!fs.existsSync(folderPath)) {
        return { success: false, message: 'Folder does not exist' };
    }

    // Delete the physical file
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    // Remove from the JSON data
    filesData.splice(fileIndex, 1);
    writeData('files.json', filesData);

    return { success: true, message: 'File Deleted Successfully' };
}

const getImageFile = (fileId, folderName) => {
    const filesData = readData('files.json');
    const fileInfo = filesData.find(f => f.id === fileId);
    if (fileInfo) {
        const filePath = path.join(__dirname, `../assets/${folderName}`, fileInfo.filename);
        const fileBuffer = fs.readFileSync(filePath);
        const base64 = `data:image/${fileInfo.format};base64,${fileBuffer.toString("base64")}`;
        return { ...fileInfo, base64Url: base64 };
    }
    return null;
}

module.exports = { readData, writeData, storeFile, deleteFile, getImageFile };