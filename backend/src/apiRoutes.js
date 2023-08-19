const router = require('express').Router();
const { User } = require('./models');

router.get('/', function(req, res) {
    res.json({
        status: 'API is working',
        message: 'Welcome to the server!'
    });
});

/***USERS***/
router.get('/users', async (req, res) => {
    const allUsers = await User.find();
    return res.status(200).json(allUsers);
});

router.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    return res.status(200).json(user);
});

router.post('/users', async (req, res) => {
    const newUser = new User({ ...req.body });
    const insertedUser = await newUser.save();
    return res.status(201).json(insertedUser);
});

router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    await User.updateOne({ _id: id }, req.body);
    const updatedUser = await User.findById(id);
    return res.status(200).json(updatedUser);
});

router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    return res.status(200).json(deletedUser);
});

module.exports = router;