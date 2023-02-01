import Joi from 'joi';

function validate(schema) {
  // eslint-disable-next-line func-names
  return function (value) {
    const { error } = schema.validate(value);
    if (!error) return true;
    return error.message || 'Campo requerido.';
  };
}

export function alphaString(message = 'Campo requerido.') {
  const schema = Joi.string().alphanum().required()
    .error(new Error(message));
  return validate(schema);
}

export function string(message = 'Campo requerido.') {
  const schema = Joi.string().required()
    .error(new Error(message));

  return validate(schema);
}

export function integer(message = 'Campo requerido.') {
  const schema = Joi.number().integer().min(0).required()
    .error(new Error(message));

  return validate(schema);
}

export function email(message = 'Campo requerido.') {
  const schema = Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'sv'] } }).required()
    .error(new Error(message));

  return validate(schema);
}
