import createError from 'http-errors';

const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return next(
      createError(
        400,
        error.details.map((detail) => detail.message).join(', '),
      ),
    );
  }

  next();
};

export default validateBody;
