const router = require('express').Router();
const { User, UserData, Server } = require('./models');

router.get('/', function(req, res) {
    res.json({
        status: 'API is working',
        message: 'Welcome to the server!'
    });
});

/***USERS***/
//get all users
router.get('/users', async (req, res) => {
    const allUsers = await User.find();
    return res.status(200).json(allUsers);
});

//get user by id
router.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    return res.status(200).json(user);
});

//search users by username
router.get('/users/search/:username', async (req, res) => {
    const { username } = req.params;
    const users = await User.find({username: {$regex: username} });
    return res.status(200).json(users);
});

//post new user
router.post('/users', async (req, res) => {
    const newUser = new User({ ...req.body });
    const insertedUser = await newUser.save();
    return res.status(201).json(insertedUser);
});

//update existing user
router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    await User.updateOne({ _id: id }, req.body);
    const updatedUser = await User.findById(id);
    return res.status(200).json(updatedUser);
});

//delete user by id
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    return res.status(200).json(deletedUser);
});

/***USER DATA***/
//get user data by user id
router.get('/userData/:userId', async (req, res) => {
    const { userId } = req.params;
    const userData = await UserData.find({userId: userId});
    //get username and add it to user data object
    const user = await User.findById(userId);
    let retData = userData[0].toObject();
    retData['username'] = user.username;
    return res.status(200).json(retData);
});

//post new user data for user
router.post('/userData', async (req, res) => {
    const newUserData = new UserData({ ...req.body });
    const insertedUserData = await newUserData.save();
    return res.status(201).json(insertedUserData);
});

//update existing user data
router.put('/userData/:id', async (req, res) => {
    const { id } = req.params;
    await UserData.updateOne({ _id: id }, req.body);
    const updatedUserData = await UserData.findById(id);
    return res.status(200).json(updatedUserData);
});

//delete user data by id
router.delete('/userData/:id', async (req, res) => {
    const { id } = req.params;
    const deletedUserData = await UserData.findByIdAndDelete(id);
    return res.status(200).json(deletedUserData);
});

/***SERVERS***/
//get server by user id
router.get('/server/:id', async (req, res) => {
    const { id } = req.params;
    const server = await Server.findById(id);
    return res.status(200).json(server);
});

//post new server
router.post('/server', async (req, res) => {
    const newServer = new Server({ ...req.body });
    const insertedServer = await newServer.save();
    return res.status(201).json(insertedServer);
});

//update existing server
router.put('/server/:id', async (req, res) => {
    const { id } = req.params;
    await Server.updateOne({ _id: id }, req.body);
    const updatedServer = await Server.findById(id);
    return res.status(200).json(updatedServer);
});

//delete user server by id
router.delete('/server/:id', async (req, res) => {
    const { id } = req.params;
    const deletedServer = await Server.findByIdAndDelete(id);
    return res.status(200).json(deletedServer);
});

module.exports = router;