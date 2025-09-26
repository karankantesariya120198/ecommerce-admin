const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/dashboard', verifyToken, (req, res) => {
    // Assuming user information is stored in req.user by authMiddleware
    res.status(200).json({
        email: req.user.email,
        nickname: req.user.nickname
    });
});

module.exports = router;
