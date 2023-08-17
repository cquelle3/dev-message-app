const router = require('express').Router();

router.get('/', function(req, res) {
    res.json({
        status: 'API is working',
        message: 'Welcome to the server!'
    });
});

module.exports = router;