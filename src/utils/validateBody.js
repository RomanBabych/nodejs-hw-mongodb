import createHttpError from 'http-errors';

export default function validateBody(schema) {
  async function func  (req , res , next) {
    try{
      await schema.validateAsync(req.body , {abortEarly: false,});
      next();
    }catch(e) {
      const error = createHttpError(400 , e.message);
      next(error);
    }
  }
  return func;
}
