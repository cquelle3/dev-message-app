const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

const User = mongoose.model("User", UserSchema);

module.exports = { User };