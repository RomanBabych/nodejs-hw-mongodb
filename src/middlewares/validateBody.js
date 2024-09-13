import pkg from 'http-errors';
const { BadRequest } = pkg;

const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return next(BadRequest(error.message));
  }
  next();
};

export default validateBody;
