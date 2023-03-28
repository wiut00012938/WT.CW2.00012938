const express = require('express');
const router = express.Router();
router.get('/',(req,res)=>{
    const success = req.query.success || false;
    res.render('account', { success });
});

module.exports = router;