const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const { User } = require('./models');

router.get('/', function(req, res) {
    res.json({
        status: 'Auth Route is working',
        message: 'Welcome to the server!'
    });
});

//register an account
router.post('/register', async function(req, res) {
    //create a new user
    var newUser = new User(req.body);
    //hash the password
    newUser.password = bcrypt.hashSync(req.body.password, 10);
    //save the new user
    const saved = await newUser.save();
    return res.json({ saved: saved });
});

//login to an account
router.post('/login', async function(req, res) {
    //find an existing user via username
     const user = await User.findOne({
        username: req.body.username
    });

    console.log(user);

    //if a user with the given username does not exist, or the password is incorrect, throw an invalid error
    if(!user || !user.comparePassword(req.body.password)) {
        return res.status(401).json({ message: 'Invalid username or password'});
    }

    const signObj = {
        email: user.email,
        username: user.username,
        password: user.password
    };

    //sign a json token and send it back to the frontend
    const accessToken = jwt.sign(signObj, process.env.ACCESS_TOKEN_SECRET);
    return res.json({ accessToken: accessToken });
});

module.exports = router;