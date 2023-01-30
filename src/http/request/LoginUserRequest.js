import Joi from 'joi';

const schema = Joi.object({
  email: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  password: Joi.string(),
}).options({ abortEarly: false });

schema.validate({ username: 'abc', birth_year: 1994 });

const LoginUserRequest = (payload) => {
  schema.validate(payload);
}

export default LoginUserRequest
