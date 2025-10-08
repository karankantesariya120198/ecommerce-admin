const { readData, writeData, storeFile, getImageFile, deleteFile } = require('../utils/fileHelper');
const { v4: uuidv4 } = require('uuid');
const { sendResponse } = require('../utils/responseHelper');

const categoryFile = 'categories.json';
const subcategoryFile = 'subcategories.json';
const productFile = 'products.json';

const validateCategoryData = (data) => {
    const { name, slug, description, parentId, status, featured, specifications, icon } = data;
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

    if (parentId && typeof parentId !== 'string') {
        errors.parentId = ['Parent ID must be a string.'];
    }

    if (status !== undefined && typeof featured !== 'boolean') {
        errors.status = ['Please choose a valid status.'];
    }

    if (featured !== undefined && typeof featured !== 'boolean') {
        errors.featured = ['Featured must be a boolean.'];
    }

    if (specifications && !Array.isArray(specifications)) {
        errors.specifications = ['Specifications must be an array.'];
    }

    if (icon && data.icon[0] && !data.icon[0].type.startsWith('image/')) {
        errors.icon = ['Please upload a valid category icon image.'];
    }

    return errors;
};

exports.getCategories = (req, res) => {
    try {
        let categories = readData(categoryFile);
        categories = categories.filter(cat => {
            // Check if userId exists and matches the current user's ID
            return cat.userId ? cat.userId === req.user.id : false;
        });
        const categoriesWithUrl = categories.map(cat => {
            let image = cat.fileId ? getImageFile(cat.fileId, 'category') : null;
            return {
                ...cat,
                file: image
            }
        })
        return sendResponse(res, 200, true, categoriesWithUrl, 'Categories fetched successfully');
    } catch (error) {
        console.log('Get Category Api:', error.stack);
        return sendResponse(res, 500, false, null, 'Internal Server Error. Please try again later!');
    }
}

exports.fetchCategory = (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return sendResponse(res, 400, false, null, 'Category ID is required');

        const categories = readData(categoryFile);
        const category = categories.find(cat => cat.id === id && cat.userId === req.user.id);

        if (!category) return sendResponse(res, 404, false, null, 'Category not found');

        // Fetch associated subcategories
        const subcategories = readData(subcategoryFile);
        const associatedSubcategories = subcategories.filter(subcat => subcat.categoryId === id);

        // Fetch associated products
        const products = readData(productFile);
        const associatedProducts = products.filter(product => product.categoryId === id);

        // Attach file URLs to category, subcategories, and products
        const categoryWithDetails = {
            ...category,
            file: category.fileId ? getImageFile(category.fileId, 'category') : null,
            subcategories: associatedSubcategories.map(subcat => ({
            ...subcat,
            file: subcat.fileId ? getImageFile(subcat.fileId, 'subcategory') : null
            })),
            products: associatedProducts.map(prod => ({
            ...prod,
            files: prod.fileIds
                ? prod.fileIds.split(',').map(fileId => getImageFile(fileId.trim(), 'product'))
                : []
            }))
        };
        
        return sendResponse(res, 200, true, categoryWithDetails, 'Category fetched successfully');
    } catch (error) {
        console.log('Fetch Category Api:', error.stack);
        return sendResponse(res, 500, false, null, error.stack);
    }
}

exports.createCategory = (req, res) => {
    try {
        const errors = validateCategoryData(req.body);
        if (Object.keys(errors).length > 0) {
            return sendResponse(res, 400, false, null, 'Validation failed', errors);
        }

        const { name, slug, description, parentId, status, featured, specifications, icon } = req.body;
        const categoryIcon = icon[0];
        let categories = readData(categoryFile);
    
        // Check for duplicate category name
        if (categories.some(cat => cat.name.toLowerCase() === name.toLowerCase() && cat.userId === req.user.id)) {
            return sendResponse(res, 409, false, null, 'Category name already exists');
        }

        const fileId = storeFile(categoryIcon, 'category');
        const newCategory = {
            id: uuidv4(),
            userId: req.user.id,
            name: name.trim(),
            slug: slug.trim(),
            description: description.trim(),
            parentId: parentId || null,
            status: status || false,
            featured: featured || false,
            specifications: Array.isArray(specifications) ? specifications : [],
            fileId: fileId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        categories.push(newCategory);
        writeData(categoryFile, categories);
        return sendResponse(res, 201, true, newCategory, 'Category created successfully');
    } catch (error) {
        console.error("Create Category Api:", error.stack);
        return sendResponse(res, 500, false, null, 'Internal Server Error. Please try again later!');
    }
}

exports.updateCategory = (req, res) => {
    try {
        const errors = validateCategoryData(req.body);
        if (Object.keys(errors).length > 0) return sendResponse(res, 400, false, null, 'Validation failed', errors);

        const { name, slug, description, parentId, status, featured, specifications, icon } = req.body;
        const { id } = req.params;
        if (!id) return sendResponse(res, 400, false, null, 'Category ID is required');

        let categories = readData('categories.json');
        const categoryIndex = categories.findIndex(cat => cat.id === req.params.id);
        if (categoryIndex === -1) return res.status(404).json({ message: 'Category not found' });

        // Check for duplicate name (excluding current category)
        if (
            categories.some(
                (cat, index) => 
                    index !== categoryIndex && cat.name.toLowerCase() === name.toLowerCase() && cat.userId === req.user.id
            )
        ) {
            return sendResponse(res, 409, false, null, 'Category name already exists');
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
            slug: slug.trim(),
            description: description.trim(),
            parentId: parentId || null,
            status: status || false,
            featured: featured || false,
            specifications: Array.isArray(specifications) ? specifications : [],
            updatedAt: new Date().toISOString(),
            fileId: fileId || existingCategory.fileId // Keep old file if no new one provided
        };

        categories[categoryIndex] = updatedCategory;
        writeData(categoryFile, categories);

        // Get the icon URL for response
        const iconUrl = updatedCategory.fileId ? getImageFile(updatedCategory.fileId, 'category') : null;
        return sendResponse(res, 200, true, { ...updatedCategory, iconUrl }, 'Category updated successfully');
    } catch (error) {
        console.error("Update Category Api:", error.stack);
        return sendResponse(res, 500, false, null, 'Internal Server Error. Please try again later!');
    }
}

exports.deleteCategory = (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return sendResponse(res, 400, false, null, 'Category ID is required');

        let categories = readData(categoryFile);
        const categoryIndex = categories.findIndex(cat => cat.id === id);
        if (categoryIndex === -1) return sendResponse(res, 404, false, null, 'Category not found');

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

        return sendResponse(res, 200, true, null, 'Category deleted successfully');
    } catch (error) {
        console.error("Delete Category Api:", error.stack);
        return sendResponse(res, 500, false, null, 'Internal Server Error. Please try again later!');
    }
}