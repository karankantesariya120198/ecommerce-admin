const { readData, writeData, storeFile, getImageFile, deleteFile } = require('../utils/fileHelper');
const { v4: uuidv4 } = require('uuid');

const categoryFile = 'categories.json';

exports.getCategories = (req, res) => {
    try {
        const categories = readData(categoryFile);

        const categoriesWithUrl = categories.map(cat => {
            let image = cat.fileId ? getImageFile(cat.fileId, 'category') : null;
            return {
                ...cat,
                file: image
            }
        })
        res.status(200).json(categoriesWithUrl);
    } catch (error) {
        console.log('Get Category Api:', error.stack);
        res.status(500).json({ error : 'Internal Server Error. Please try again later!' });
    }
}

exports.fetchCategory = (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error('Category ID is required');
        }

        const categories = readData(categoryFile);
        const category = categories.find(cat => cat.id === id);
        if (!category) {
            throw new Error('Category not found');
        }

        const categoryWithDetails = {
            ...category,
            file: category.fileId ? getImageFile(category.fileId, 'category') : null
        };
        res.status(200).json(categoryWithDetails);
    } catch (error) {
        console.log('Fetch Category Api:', error.stack);
        res.status(500).json({ error : 'Internal Server Error. Please try again later!' });
    }
}

exports.createCategory = (req, res) => {
    try {
        const { name, quantity, icon } = req.body;
        if (!icon[0]) {
            return res.status(400).json({ message: 'Please upload a valid category icon image.' });
        }
        const categoryIcon = icon[0];

        // Validate name
        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ message: 'Please enter category name' });
        }

        // Validate icon (expecting an uploaded image file)
        if (!categoryIcon || !categoryIcon.type.startsWith('image/')) {
            return res.status(400).json({ message: 'Please upload a valid category icon image.' });
        }

        // Validate quantity
        if (quantity === undefined || typeof quantity !== 'number' || quantity < 0) {
            return res.status(400).json({ message: 'Quantity is required and must be a non-negative number.' });
        }

        let categories = readData(categoryFile);
    
        // Check for duplicate category name
        if (categories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
            return res.status(409).json({ message: 'Category name already exists.' });
        }

        const fileId = storeFile(categoryIcon, 'category');
        const newCategory = {
            id: uuidv4(),
            name: name.trim(),
            fileId: fileId,
            quantity,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        categories.push(newCategory);
        writeData(categoryFile, categories);
        res.status(201).json(newCategory);
    } catch (error) {
        console.error("Create Category Api:", error.stack);
        res.status(500).json({ error: 'Internal Server Error. Please try again later!' });
    }
}

exports.updateCategory = (req, res) => {
    try {
        const { name, quantity, icon } = req.body;
        const { id } = req.params;
        if (!id) {
            return res.status(404).json({ message: 'Category ID is required' });
        }

        // Validate name
        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ message: 'Please enter category name' });
        }

        // Validate icon (expecting an uploaded image file)
        if (!icon || !icon[0].type.startsWith('image/')) {
            return res.status(400).json({ message: 'Please upload a valid category icon image.' });
        }

        // Validate quantity
        if (quantity === undefined || typeof quantity !== 'number' || quantity < 0) {
            return res.status(400).json({ message: 'Quantity is required and must be a non-negative number.' });
        }

        let categories = readData('categories.json');
        const categoryIndex = categories.findIndex(cat => cat.id === req.params.id);
        if (categoryIndex === -1) return res.status(404).json({ message: 'Category not found' });

        // Check for duplicate name (excluding current category)
        if (categories.some((cat, index) => 
            index !== categoryIndex && cat.name.toLowerCase() === name.toLowerCase())) {
            return res.status(409).json({ message: 'Category name already exists' });
        }

        const existingCategory = categories[categoryIndex];
        let fileId = existingCategory.fileId;

        // Handle icon update if provided
        if (icon && icon[0]) {
            const categoryIcon = icon[0];
            
            // Validate icon
            if (!categoryIcon.type.startsWith('image/')) {
                return res.status(400).json({ message: 'Please upload a valid image file' });
            }

            // Delete old file if exists
            if (fileId) {
                const deleteResult = deleteFile(fileId, 'category');
                if (!deleteResult.success) {
                    console.warn('Failed to delete old file:', deleteResult.message);
                }
            }

            // Store new file
            fileId = storeFile(categoryIcon, 'category');
        }

        // Update category
        const updatedCategory = {
            ...existingCategory,
            name: name.trim(),
            quantity,
            updatedAt: new Date().toISOString(),
            fileId: fileId || existingCategory.fileId // Keep old file if no new one provided
        };

        categories[categoryIndex] = updatedCategory;
        writeData(categoryFile, categories);

        // Get the icon URL for response
        const iconUrl = updatedCategory.fileId ? getImageFile(updatedCategory.fileId, 'category') : null;
        res.status(200).json({
            ...updatedCategory,
            iconUrl
        });
    } catch (error) {
        console.error("Update Category Api:", error.stack);
        res.status(500).json({ error: 'Internal Server Error. Please try again later!' });
    }
}

exports.deleteCategory = (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Category ID is required' });
        }

        let categories = readData(categoryFile);
        const categoryIndex = categories.findIndex(cat => cat.id === id);
        if (categoryIndex === -1) return res.status(404).json({ message: 'Category not found' });

        const categoryToDelete = categories[categoryIndex];

        // Deleted associated file if exists
        if (categoryToDelete.fileId) {
            const deleteResult = deleteFile(categoryToDelete.fileId, 'category');
            if (!deleteResult.success) {
                console.warn('Failed to delete category file:', deleteResult.message);
            }
        }

        // Remove category from array
        categories.splice(categoryIndex, 1);
        writeData(categoryFile, categories);

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error("Delete Category Api:", error.stack);
        res.status(500).json({ error: 'Internal Server Error. Please try again later!' });
    }
}