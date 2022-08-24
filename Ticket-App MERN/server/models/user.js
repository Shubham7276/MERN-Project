const mongoose = require("mongoose")
const crypto = require("crypto")
const { v1: uuidv1 } = require("uuid")

const userSchema = new mongoose.Schema(
	{
		firstname: {
			type: String,
			trim: true,
			required: true,
			maxLength: 32,
		},
		lastname: {
			type: String,
			trim: true,
			required: true,
			maxLength: 32,
		},
		username: {
			type: String,
			trim: true,
			required: true,
			maxLength: 32,
			unique:true
		},
		email: {
			type: String,
			trim: true,
			required: true,
			unique: true,
		},
		hashed_password: {
			type: String,
			required: true,
		},
		salt: String,
		
	}
)

//virtual field

userSchema
	.virtual("password")
	.set(function (password) {
		this._password = password
		this.salt = uuidv1()
		this.hashed_password = this.encryptPassword(password)
	})
	.get(function () {
		return this._password
	})

userSchema.methods = {
	authenticate: function (plainText) {
		return this.encryptPassword(plainText) === this.hashed_password
	},

	encryptPassword: function (password) {
		if (!password) return ""
		try {
			return crypto.createHmac("sha1", this.salt).update(password).digest("hex")
		} catch (err) {
			return ""
		}
	},
}



module.exports = mongoose.model("User", userSchema)
