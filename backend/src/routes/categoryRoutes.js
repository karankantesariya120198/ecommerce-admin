const express = require('express');
const { 
    getCategories,
    fetchCategory,
    createCategory,
    updateCategory,
    deleteCategory 
} = require('../controllers/categoryController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware, getCategories);
router.get('/:id', authMiddleware, fetchCategory);
router.post('/', authMiddleware, createCategory);
router.put('/:id', authMiddleware, updateCategory);
router.delete('/:id', authMiddleware, deleteCategory);

module.exports = router;