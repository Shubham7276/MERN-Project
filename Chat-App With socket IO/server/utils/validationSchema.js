const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const signUpValidation = (data) => {
	const schema = Joi.object({
		userName: Joi.string().min(2).max(25).required().label("user Name"),
		mobileNo: Joi.string().min(10).max(10).required().label("Mobile Number"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),
		profile: Joi.optional()
	});
	return schema.validate(data);
};

const logInValidation = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = { signUpValidation, logInValidation };