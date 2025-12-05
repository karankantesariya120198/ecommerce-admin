const { readData, writeData, storeFile, getImageFile, deleteFile } = require('../utils/fileHelper');
const { v4: uuidv4 } = require('uuid');
const { sendResponse } = require('../utils/responseHelper');
const Categories = require('../models/categories');
const Files = require('../models/files');

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

    if (status !== undefined && ![0, 1].includes(status)) {
        errors.status = ['Please choose a valid status (0 or 1).'];
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

exports.getCategories = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return sendResponse(res, 401, false, null, 'Unauthorized access. Please log in.');
        }

        let categories = await Categories.findAll(req.user.id);
        const categoriesWithUrl = await Promise.all(categories.map(async cat => {
            let image = cat.fileId ? await getImageFile(cat.fileId) : null;
            return {
                ...cat,
                file: image
            };
        }));
        return sendResponse(res, 200, true, categoriesWithUrl, 'Categories fetched successfully');
    } catch (error) {
        console.log('Get Category Api:', error.stack);
        return sendResponse(res, 500, false, null, 'Internal Server Error. Please try again later!');
    }
}

exports.fetchCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return sendResponse(res, 400, false, null, 'Category ID is required');

        const category = await Categories.findById(id);
        if (!category) return sendResponse(res, 404, false, null, 'Category not found');

        // Fetch associated subcategories
        // const subcategories = readData(subcategoryFile);
        // const associatedSubcategories = subcategories.filter(subcat => subcat.categoryId === id);

        // Fetch associated products
        // const products = readData(productFile);
        // const associatedProducts = products.filter(product => product.categoryId === id);

        // Attach file URLs to category, subcategories, and products
        const categoryWithDetails = {
            ...category,
            file: category.fileId ? getImageFile(category.fileId) : null,
            // subcategories: associatedSubcategories.map(subcat => ({
            // ...subcat,
            // file: subcat.fileId ? getImageFile(subcat.fileId, 'subcategory') : null
            // })),
            // products: associatedProducts.map(prod => ({
            // ...prod,
            // files: prod.fileIds
            //     ? prod.fileIds.split(',').map(fileId => getImageFile(fileId.trim(), 'product'))
            //     : []
            // }))
        };
        
        return sendResponse(res, 200, true, categoryWithDetails, 'Category fetched successfully');
    } catch (error) {
        console.log('Fetch Category Api:', error.stack);
        return sendResponse(res, 500, false, null, error.stack);
    }
}

exports.createCategory = async (req, res) => {
    try {
        const errors = validateCategoryData(req.body);
        if (Object.keys(errors).length > 0) {
            return sendResponse(res, 400, false, null, 'Validation failed', errors);
        }

        const { name, slug, description, parentId, status, featured, specifications, icon } = req.body;
        const categoryIcon = icon[0];
        let categories = await Categories.findAll(req.user.id);
    
        // Check for duplicate category name
        if (categories.some(cat => cat.name.toLowerCase() === name.toLowerCase() && cat.userId === req.user.id)) {
            return sendResponse(res, 409, false, null, 'Category name already exists');
        }

        let fileId = await storeFile(categoryIcon, 'category', 'category');
        let newCategory = {
            "userId": req.user.id,
            "name": name.trim(),
            "slug": slug.trim(),
            "description": description,
            "parentId": parentId || null,
            "status": status || false,
            "featured": featured || false,
            "specifications": JSON.stringify(Array.isArray(specifications) ? specifications : []),
            "fileId": fileId,
            "created_at": new Date(),
            "updated_at": new Date()
        };
        newCategory = await Categories.create(newCategory);
        return sendResponse(res, 201, true, newCategory, 'Category created successfully');
    } catch (error) {
        console.error("Create Category Api:", error.stack);
        return sendResponse(res, 500, false, null, 'Internal Server Error. Please try again later!');
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const errors = validateCategoryData(req.body);
        if (Object.keys(errors).length > 0) return sendResponse(res, 400, false, null, 'Validation failed', errors);

        const { name, slug, description, parentId, status, featured, specifications, icon } = req.body;
        const { id } = req.params;
        if (!id) return sendResponse(res, 400, false, null, 'Category ID is required');

        let category = await Categories.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        let categories = await Categories.findAll(req.user.id);
        // Check for duplicate name (excluding current category)

        if (
            categories.some(
                (cat) => (String(cat.id) !== String(id) && cat.name.toLowerCase() === name.toLowerCase() && cat.userId === req.user.id)
            )
        ) {
            return sendResponse(res, 409, false, null, 'Category name already exists');
        }

        let fileId = category.fileId;
        // Handle icon update if provided
        if (icon && icon[0]) {
            const categoryIcon = icon[0];
            
            // Validate icon
            if (!categoryIcon.type.startsWith('image/')) {
                return res.status(400).json({ message: 'Please upload a valid image file' });
            }

            // Delete old file if exists
            if (fileId) {
                const deleteResult = await deleteFile(fileId);
                if (!deleteResult.success) {
                    console.warn('Failed to delete old file:', deleteResult.message);
                }
            }

            // Store new file
            fileId = await storeFile(categoryIcon, 'category', 'category');
        }

        // Update category
        let updatedCategory = {
            ...category,
            name: name.trim(),
            slug: slug.trim(),
            description: description.trim(),
            parentId: parentId || null,
            status: status || false,
            featured: featured || false,
            specifications: JSON.stringify(Array.isArray(specifications) ? specifications : []),
            updated_at: new Date(),
            fileId: fileId || category.fileId // Keep old file if no new one provided
        };
        updatedCategory = await Categories.update(id, updatedCategory);
        // Get the icon URL for response
        const iconUrl = updatedCategory.fileId ? await getImageFile(updatedCategory.fileId) : null;
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

        // Delete associated file if exists
        if (categoryToDelete.fileId) {
            const deleteResult = deleteFile(categoryToDelete.fileId, 'category');
            if (!deleteResult.success) {
                console.warn('Failed to delete category file:', deleteResult.message);
            }
        }

        // Remove category from array
        categories.splice(categoryIndex, 1);
        writeData(categoryFile, categories);

        // Delete associated subcategories
        let subcategories = readData(subcategoryFile);
        const subcategoriesToDelete = subcategories.filter(subcat => subcat.categoryId === id);
        subcategoriesToDelete.forEach(subcat => {
            if (subcat.fileId) {
            const deleteResult = deleteFile(subcat.fileId, 'subcategory');
            if (!deleteResult.success) {
                console.warn('Failed to delete subcategory file:', deleteResult.message);
            }
            }
        });
        subcategories = subcategories.filter(subcat => subcat.categoryId !== id);
        writeData(subcategoryFile, subcategories);

        // Unlink associated products
        let products = readData(productFile);
        products = products.map(product => {
            if (product.categoryId === id) {
            return { ...product, categoryId: null };
            }
            return product;
        });
        writeData(productFile, products);

        return sendResponse(res, 200, true, null, 'Category deleted successfully');
    } catch (error) {
        console.error("Delete Category Api:", error.stack);
        return sendResponse(res, 500, false, null, 'Internal Server Error. Please try again later!');
    }
}