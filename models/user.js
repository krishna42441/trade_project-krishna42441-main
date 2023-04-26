const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
        firstName: {type: String, required: [true, 'First name is required']},
        lastName: {type: String, required: [true, 'Last name is required']},
        email: {type: String, required: [true, 'Email is required']},
        password: {type: String, required: [true, 'Password is required'], 
                  minLength: [6, 'the content should have at least 6 characters']}
    },
    { timestamps: true }
);

userSchema.pre("save", function(next) {
    if (!this.isModified("password")) {
        return next();
    }
    
    // TODO: Check email
    
    // Save password
    bcrypt.hash(this.password, 10)
        .then(hash => {
            this.password = hash;
            next();
        })
        .catch(err => next(err));
});

userSchema.methods.comparePassword = function(loginPassword) {
    return bcrypt.compare(loginPassword, this.password);
}

module.exports = mongoose.model("User", userSchema);
