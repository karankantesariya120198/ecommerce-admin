const express = require('express');
const { 
    getProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct 
} = require('../controllers/productController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware, getProducts);
router.get('/:id', authMiddleware, fetchProductById);
router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;