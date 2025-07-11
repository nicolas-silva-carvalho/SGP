const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const error = validationResult(req);

  if (error.isEmpty()) {
    return next();
  }

  const extractedError = [];

  error.array().map((err) => extractedError.push(err.msg));

  return res.status(422).json({ errors: extractedError });
};

module.exports = validate;
