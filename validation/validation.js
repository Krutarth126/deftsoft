const joi = require("@hapi/joi");

const registerValidation = (data) => {
  const schema = {
    username: joi.string().min(3).required(),
    email: joi.string().min(6).required().email(),
    password: joi.string().min(6).required(),
    phone: joi.string().min(10).required(),
  };
  return joi.validate(data, schema);
};
const LoginValidation = (data) => {
  const schema = {
    email: joi.string().min(3).required().email(),
    password: joi.string().min(6).required(),
  };
  return joi.validate(data, schema);
};

module.exports.registerValidation = registerValidation;
module.exports.LoginValidation = LoginValidation;
