const { readData, writeData, storeFile, getImageFile, deleteFile } = require('../utils/fileHelper');
const { v4: uuidv4 } = require('uuid');

const subcategoryFile = 'subcategories.json';

exports.getSubcategories = (req, res) => {
    try {
        const subcategories = readData(subcategoryFile);
        const categories = readData('categories.json');

        const subcategoriesWithDetails = subcategories.map(cat => {
            let image = cat.fileId ? getImageFile(cat.fileId, 'subcategory') : null;
            let category = categories.find(c => c.id === cat.categoryId);
            return {
            ...cat,
            file: image,
            category: category ? { id: category.id, name: category.name } : null
            };
        });

        res.status(200).json(subcategoriesWithDetails);
    } catch (error) {
        console.log('Get Subcategory Api:', error.stack);
        res.status(500).json({ error : 'Internal Server Error. Please try again later!' });
    }
}

exports.fetchSubcategory = (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Subcategory ID is required' });
        }

        const subcategories = readData(subcategoryFile);
        const subcategory = subcategories.find(cat => cat.id === id);
        if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        const subcategoryWithDetails = {
            ...subcategory,
            file: subcategory.fileId ? getImageFile(subcategory.fileId, 'subcategory') : null,
            category: categories.find(c => c.id === subcategory.categoryId)
        };

        res.status(200).json(subcategoryWithDetails);
    } catch (error) {
        console.log('Fetch Subcategory Api:', error.stack);
        res.status(500).json({ error : 'Internal Server Error. Please try again later!' });
    }
}

exports.createSubcategory = (req, res) => {
    try {
        const { name, icon, categoryId, status, description } = req.body;
        if (!icon[0]) {
            return res.status(400).json({ message: 'Please upload a valid subcategory icon image.' });
        }
        const subcategoryIcon = icon[0];

        // Validate name
        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ message: 'Please enter subcategory name' });
        }

        // Validate icon (expecting an uploaded image file)
        if (!subcategoryIcon || !subcategoryIcon.type.startsWith('image/')) {
            return res.status(400).json({ message: 'Please upload a valid subcategory icon image.' });
        }

        // Validate categoryId
        if (!categoryId || typeof categoryId !== 'string' || !categoryId.trim()) {
            return res.status(400).json({ message: 'Invalid or missing category ID' });
        }

        // Check if categoryId exists in categories
        let categories = readData('categories.json');
        if (!categories.some(cat => cat.id === categoryId)) {
            return res.status(400).json({ message: 'Category does not exist' });
        }

        // Check if status exists or not
        if (!status || typeof status !== 'string' || !status.trim()) {
            return res.status(400).json({ message: 'Invalid or missing status' });
        }

        // Check if description exists or not
        if (!description || typeof description !== 'string' || !description.trim()) {
            return res.status(400).json({ message: 'Invalid or missing description' });
        }

        let subcategories = readData(subcategoryFile);
    
        // Check for duplicate subcategory name
        if (subcategories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
            return res.status(409).json({ message: 'Subcategory name already exists.' });
        }

        const fileId = storeFile(subcategoryIcon, 'subcategory');
        const newSubcategory = {
            id: uuidv4(),
            name: name.trim(),
            fileId: fileId,
            categoryId: categoryId,
            status: status,
            description: description,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        subcategories.push(newSubcategory);
        writeData(subcategoryFile, subcategories);
        res.status(201).json(newSubcategory);
    } catch (error) {
        console.error("Create Subcategory Api:", error.stack);
        res.status(500).json({ error: 'Internal Server Error. Please try again later!' });
    }
}

exports.updateSubcategory = (req, res) => {
    try {
        const { name, icon, categoryId, status, description } = req.body;
        const { id } = req.params;
        if (!id) {
            return res.status(404).json({ message: 'Subcategory ID is required' });
        }

        // Validate name
        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ message: 'Please enter subcategory name' });
        }

        // Validate icon (expecting an uploaded image file)
        if (!icon || !icon[0].type.startsWith('image/')) {
            return res.status(400).json({ message: 'Please upload a valid subcategory icon image.' });
        }

        // Validate categoryId
        if (!categoryId || typeof categoryId !== 'string' || !categoryId.trim()) {
            return res.status(400).json({ message: 'Invalid or missing category ID' });
        }

        // Check if categoryId exists in categories
        let categories = readData('categories.json');
        if (!categories.some(cat => cat.id === categoryId)) {
            return res.status(400).json({ message: 'Category does not exist' });
        }

        // Check if status exists or not
        if (!status || typeof status !== 'string' || !status.trim()) {
            return res.status(400).json({ message: 'Invalid or missing status' });
        }

        // Check if description exists or not
        if (!description || typeof description !== 'string' || !description.trim()) {
            return res.status(400).json({ message: 'Invalid or missing description' });
        }

        let subcategories = readData(subcategoryFile);
        const subcategoryIndex = subcategories.findIndex(cat => cat.id === req.params.id);
        if (subcategoryIndex === -1) return res.status(404).json({ message: 'Subcategory not found' });

        // Check for duplicate name (excluding current subcategory)
        if (subcategories.some((cat, index) => 
            index !== subcategoryIndex && cat.name.toLowerCase() === name.toLowerCase())) {
            return res.status(409).json({ message: 'Subcategory name already exists' });
        }

        const existingSubcategory = subcategories[subcategoryIndex];
        let fileId = existingSubcategory.fileId;

        // Handle icon update if provided
        if (icon && icon[0]) {
            const categoryIcon = icon[0];
            
            // Validate icon
            if (!categoryIcon.type.startsWith('image/')) {
                return res.status(400).json({ message: 'Please upload a valid image file' });
            }

            // Delete old file if exists
            if (fileId) {
                const deleteResult = deleteFile(fileId, 'subcategory');
                if (!deleteResult.success) {
                    console.warn('Failed to delete old file:', deleteResult.message);
                }
            }

            // Store new file
            fileId = storeFile(categoryIcon, 'subcategory');
        }

        // Update subcategory
        const updatedSubcategory = {
            ...existingSubcategory,
            name: name.trim(),
            categoryId: categoryId,
            status: status.trim(),
            description: description.trim(),
            updatedAt: new Date().toISOString(),
            fileId: fileId || existingSubcategory.fileId // Keep old file if no new one provided
        };

        subcategories[subcategoryIndex] = updatedSubcategory;
        writeData(subcategoryFile, subcategories);

        // Get the icon URL for response
        const iconUrl = updatedSubcategory.fileId ? getImageFile(updatedSubcategory.fileId, 'subcategory') : null;
        res.status(200).json({
            ...updatedSubcategory,
            iconUrl
        });
    } catch (error) {
        console.error("Update Subcategory Api:", error.stack);
        res.status(500).json({ error: 'Internal Server Error. Please try again later!' });
    }
}

exports.deleteSubcategory = (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Subcategory ID is required' });
        }

        let subcategories = readData(subcategoryFile);
        const subcategoryIndex = subcategories.findIndex(cat => cat.id === id);
        if (subcategoryIndex === -1) return res.status(404).json({ message: 'Subcategory not found' });

        const subcategoryToDelete = subcategories[subcategoryIndex];

        // Deleted associated file if exists
        if (subcategoryToDelete.fileId) {
            const deleteResult = deleteFile(subcategoryToDelete.fileId, 'subcategory');
            if (!deleteResult.success) {
                console.warn('Failed to delete subcategory file:', deleteResult.message);
            }
        }

        // Remove subcategory from array
        subcategories.splice(subcategoryIndex, 1);
        writeData(subcategoryFile, subcategories);

        res.status(200).json({ message: 'Subcategory deleted successfully' });
    } catch (error) {
        console.error("Delete Subcategory Api:", error.stack);
        res.status(500).json({ error: 'Internal Server Error. Please try again later!' });
    }
}