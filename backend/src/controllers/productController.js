const { readData, writeData, storeFile, getImageFile, deleteFile } = require('../utils/fileHelper');
const { v4: uuidv4 } = require('uuid');

const productFile = 'products.json';
const categoryFile = 'categories.json';
const subcategoryFile = 'subcategories.json';
const productFolder = 'product';

const validateProductData = (data) => {
    const errors = {};

    if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
        errors.name = 'Product name is required';
    }

    if (!data.sku || typeof data.sku !== 'string' || !data.sku.trim()) {
        errors.sku = 'Product SKU is required';
    }

    if (typeof data.price !== 'number' || data.price <= 0) {
        errors.price = 'Valid product price is required';
    }

    if (typeof data.originalPrice !== 'number' || data.originalPrice < 0) {
        errors.originalPrice = 'Valid original price is required';
    }

    if (typeof data.stock !== 'number' || data.stock < 0) {
        errors.stock = 'Valid stock quantity is required';
    }

    if (!data.categoryId || typeof data.categoryId !== 'string' || !data.categoryId.trim()) {
        errors.categoryId = 'Category is required';
    }

    let categories = readData(categoryFile);
    if (!categories.some(cat => cat.id === data.categoryId && cat.status === 'active')) {
        errors.categoryId = 'Category not exists.';
    }

    if (!data.subcategoryId || typeof data.subcategoryId !== 'string' || !data.subcategoryId.trim()) {
        errors.subcategoryId = 'Subcategory is required';
    }

    let subcategories = readData(subcategoryFile);
    if (!subcategories.some(subcat => subcat.id === data.subcategoryId && subcat.status === 'active')) {
        errors.subcategoryId = 'Subcategory not exists.';
    }

    if (!data.description || typeof data.description !== 'string' || !data.description.trim()) {
        errors.description = 'Product description is required';
    }

    if (!Array.isArray(data.specifications) || data.specifications.length === 0) {
        errors.specifications = 'Product specifications are required';
    }

    if (!Array.isArray(data.icons) || data.icons.length === 0 || !data.icons.every(icon => icon.type.startsWith('image/'))) {
        errors.icons = 'Valid product images are required';
    }

    if (!data.status || typeof data.status !== 'string' || !data.status.trim()) {
        errors.status = 'Product status is required';
    }

    if (typeof data.featured !== 'boolean') {
        errors.featured = 'Product featured status is required';
    }

    return errors;
};

exports.getProducts = (req, res) => {
    try {
        const products = readData(productFile);
        const categories = readData(categoryFile);
        const subcategories = readData(subcategoryFile);

        const productsWithDetails = products.map(prod => {
            let images = prod.fileIds
            ? prod.fileIds.split(',').map(fileId => getImageFile(fileId, 'product'))
            : [];
            let category = categories.find(c => c.id === prod.categoryId);
            let subcategory = subcategories.find(c => c.id === prod.subcategoryId);
            return {
                ...prod,
                iconsUrl: images,
                category: category ? { id: category.id, name: category.name } : null,
                subcategory: subcategory ? { id: subcategory.id, name: subcategory.name } : null
            };
        });

        res.status(200).json(productsWithDetails);
    } catch (error) {
        console.log('Get Product Api:', error.stack);
        res.status(500).json({ error : 'Internal Server Error. Please try again later!' });
    }
}

exports.fetchProductById = (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const product = readData(productFile).find(prod => prod.id === id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const productWithImages = {
            ...product,
            iconsUrl: product.fileIds
                ? product.fileIds.split(',').map(fileId => getImageFile(fileId, productFolder))
                : []
        };

        res.status(200).json(productWithImages);
    } catch (error) {
        console.log('Get Product By ID Api:', error.stack);
        res.status(500).json({ error: 'Internal Server Error. Please try again later!' });
    }
}

exports.createProduct = (req, res) => {
    try {
        const { name, sku, price, originalPrice, stock, categoryId, subcategoryId, description, specifications,  icons, status, featured} = req.body;
        const errors = validateProductData(req.body);
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors });
        }

        let products = readData(productFile);

        // Check for duplicate SKU
        if (products.some(prod => prod.sku.toLowerCase() === sku.toLowerCase())) {
            return res.status(409).json({ message: 'Product SKU already exists' });
        }

        const fileIds = icons.map(icon => storeFile(icon, productFolder)).join(',');
        const newProduct = {
            id: uuidv4(),
            name: name.trim(),
            sku: sku.trim(),
            price: price,
            fileIds: fileIds,
            categoryId: categoryId,
            subcategoryId: subcategoryId,
            originalPrice: originalPrice,
            stock: stock,
            specifications: specifications,
            description: description.trim(),
            featured: featured,
            status: status,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        products.push(newProduct);
        writeData(productFile, products);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Create Product Api:", error.stack);
        res.status(500).json({ error: 'Internal Server Error. Please try again later!' });
    }
}

exports.updateProduct = (req, res) => {
    try {
        const { name, sku, price, originalPrice, stock, categoryId, subcategoryId, description, specifications,  icons, status, featured} = req.body;
        const errors = validateProductData(req.body);
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors });
        }

        let products = readData(productFile);
        const productIndex = products.findIndex(prod => prod.id === req.params.id);
        if (productIndex === -1) return res.status(404).json({ message: 'Product not found' });

        // Check for duplicate name (excluding current product)
        if (products.some((prod, index) => 
            index !== productIndex && prod.name.toLowerCase() === name.toLowerCase())) {
            return res.status(409).json({ message: 'Product name already exists' });
        }

        const existingProduct = products[productIndex];
        let fileId = existingProduct.fileId;

        // Handle icon update if provided
        const fileIds = icons.map(icon => storeFile(icon, productFolder)).join(',');

        // Update product
        const updatedProduct = {
            ...existingProduct,
            name: name.trim(),
            sku: sku.trim(),
            price: price,
            fileId: fileIds,
            categoryId: categoryId,
            subcategoryId: subcategoryId,
            originalPrice: originalPrice,
            stock: stock,
            specifications: specifications,
            description: description.trim(),
            featured: featured,
            status: status,
            updatedAt: new Date().toISOString()
        };

        products[productIndex] = updatedProduct;
        writeData(productFile, products);

        // Get the icon URL for response
        const iconUrl = updatedProduct.fileId ? getImageFile(updatedProduct.fileId, 'product') : null;
        res.status(200).json({
            ...updatedProduct,
            iconUrl
        });
    } catch (error) {
        console.error("Update Product Api:", error.stack);
        res.status(500).json({ error: 'Internal Server Error. Please try again later!' });
    }
}

exports.deleteProduct = (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        let products = readData(productFile);
        const productIndex = products.findIndex(prod => prod.id === id);
        if (productIndex === -1) return res.status(404).json({ message: 'Product not found' });

        const productToDelete = products[productIndex];

        // Deleted associated file if exists
        if (productToDelete.fileId) {
            const deleteResult = deleteFile(productToDelete.fileId, 'product');
            if (!deleteResult.success) {
                console.warn('Failed to delete product file:', deleteResult.message);
            }
        }

        // Remove product from array
        products.splice(productIndex, 1);
        writeData(productFile, products);

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error("Delete Product Api:", error.stack);
        res.status(500).json({ error: 'Internal Server Error. Please try again later!' });
    }
}