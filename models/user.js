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
    var self = this;
    
    // Salt the password
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
        
        // Hash the password
        bcrypt.hash(self.password, 10)
            .then(hash => {
                self.password = hash;
                next();
            })
            .catch(err => next(err));
    });
});

userSchema.methods.comparePassword = function(loginPassword) {
    return bcrypt.compare(loginPassword, this.password);
}

module.exports = mongoose.model("User", userSchema);
