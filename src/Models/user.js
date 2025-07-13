const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// User Model
const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			minLength: 3,
			maxLenght: 50,
		},
		lastName: {
			type: String,
			required: false,
		},
		emailId: {
			type: String,
			lowercase: true,
			required: true,
			unique: true,
			trim: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error('Invalid Email :' + value);
				}
			},
		},
		password: {
			type: String,
			required: true,
			validate(value) {
				if (!validator.isStrongPassword(value)) {
					throw new Error('Enter Strong password :' + value);
				}
			},
		},
		age: {
			type: Number,
			required: false,
			min: 18,
		},
		gender: {
			type: String,
			required: false,
			trim: true,
			validate(value) {
				if (!['male', 'female', 'others', 'Male', 'Female', 'Others'].includes(value)) {
					throw new Error('Not a valid gender (Male , Female and other)');
				}
			},
		},
		about: {
			type: String,
			// default: "Dev is in search for someone here",
		},
		photoURL: {
			type: String,
			default: 'https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png',
			validate(value) {
				if (!validator.isURL(value)) {
					throw new Error('Invalid URL :' + value);
				}
			},
		},
		skills: {
			type: [String],
		},
	},
	{
		timestamps: true,
	}
);

//compound index
userSchema.index({ firstName: 1, lastName: 1 });

userSchema.methods.getjwt = async function () {
	const user = this;
	const token = await jwt.sign({ _id: this._id }, 'DEV@123', {
		expiresIn: '1d',
	});

	return token;
};

// userSchema.methods.encryptPassword = async function (passwordInputByUser) {
//     const passwordHash = await bcrypt.hash(passwordInputByUser, 10)
//     return passwordHash
// }

userSchema.methods.validatePassword = async function (passwordInputByUser) {
	const user = this;
	const passwordHash = user.password;
	const isValidPassword = await bcrypt.compare(passwordInputByUser, passwordHash);
	return isValidPassword;
};

mongoose.model('User', userSchema);
module.exports = mongoose.model('User', userSchema);
