const { readData, writeData, storeFile, getImageFile, deleteFile } = require('../utils/fileHelper');
const { sendResponse } = require('../utils/responseHelper');
const SubCategories = require('../models/subcategories');
const Categories = require('../models/categories');

const subcategoryFile = 'subcategories.json';

const validateSubcategoryData = (data) => {
    const { name, slug, description, category_id, status, featured, specifications, icon } = data;
    const errors = {};
    if (!name || typeof name !== 'string' || !name.trim()) {
        errors.name = ['Please enter a valid category name.'];
    }

    if (!slug || typeof slug !== 'string' || !slug.trim()) {
        errors.slug = ['Please enter a valid category slug.'];
    }

    if (!description || typeof description !== 'string' || !description.trim()) {
        errors.description = ['Please enter a valid category description.'];
    }

    if (category_id && typeof category_id !== 'integer') {
        errors.category_id = ['Category ID must be a string.'];
    } else if (category_id) {
        const category = Categories.findById(category_id);
        if (!category) {
            errors.category_id = ['Category does not exist.'];
        }
    }

    if (status !== undefined && ![0, 1].includes(status)) {
        errors.status = ['Please choose a valid status.'];
    }

    if (featured !== undefined && typeof featured !== 'boolean') {
        errors.featured = ['Featured must be a boolean.'];
    }

    if (specifications && !Array.isArray(specifications)) {
        errors.specifications = ['Specifications must be there.'];
    }

    if (icon && data.icon[0] && !data.icon[0].type.startsWith('image/')) {
        errors.icon = ['Please upload a valid subcategory icon image.'];
    }

    return errors;
};

exports.getSubcategories = async (req, res) => {
    try {
        const subcategories = await SubCategories.findAll(req.user.id);

        const subcategoriesWithDetails = await Promise.all(subcategories.map(async (subcat) => {
            let image = subcat.file_id ? await getImageFile(subcat.file_id) : null;
            return {
                ...subcat,
                file: image
            };
        }));

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

exports.createSubcategory = async (req, res) => {
    try {
        const errors = validateSubcategoryData(req.body);
        if (Object.keys(errors).length > 0) {
            return sendResponse(res, 400, false, null, 'Validation failed', errors);
        }

        const { name, slug, description, category_id, status, featured, specifications, icon } = req.body;
        const subcategoryIcon = icon[0];
        let subcategories = SubCategories.findAll(req.user.id);
    
        // Check for duplicate subcategory name
        if (subcategories.some(cat => cat.name.toLowerCase() === req.body.name.toLowerCase())) {
            return res.status(409).json({ message: 'Subcategory name already exists.' });
        }

        const fileId = await storeFile(subcategoryIcon, 'subcategory', 'subcategory');
        let newSubcategory = {
            "user_id": req.user.id,
            "name": name.trim(),
            "slug": slug.trim(),
            "description": description,
            "category_id": category_id || null,
            "status": status || false,
            "featured": featured || false,
            "specifications": JSON.stringify(Array.isArray(specifications) ? specifications : []),
            "file_id": fileId,
            "created_at": new Date(),
            "updated_at": new Date()
        };
        newSubcategory = await SubCategories.create(newSubcategory);
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