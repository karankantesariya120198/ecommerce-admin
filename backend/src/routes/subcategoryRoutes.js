const express = require('express');
const { 
    getSubcategories,
    fetchSubcategory,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory 
} = require('../controllers/subcategoryController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware, getSubcategories);
router.get('/:id', authMiddleware, fetchSubcategory);
router.post('/', authMiddleware, createSubcategory);
router.put('/:id', authMiddleware, updateSubcategory);
router.delete('/:id', authMiddleware, deleteSubcategory);

module.exports = router;