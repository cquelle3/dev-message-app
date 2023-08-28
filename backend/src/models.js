const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/***MODELS***/

/*USER*/
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

/*USER DATA*/
UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

const User = mongoose.model("User", UserSchema);

const UserDataSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    servers: {
        type: Array,
        required: true
    }
});

const UserData = mongoose.model("UserData", UserDataSchema);

module.exports = { User, UserData };