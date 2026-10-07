function validationError(details) {
  const error = new Error("Request validation failed.");
  error.statusCode = 400;
  error.code = "VALIDATION_ERROR";
  error.details = details;

  return error;
}

export function validateRegister(req, res, next) {
  const { name, email, password } = req.body;

  const details = {};

  if (typeof name !== "string" || !name.trim()) {
    details.name = "Name is required.";
  } else if (name.trim().length < 2 || name.trim().length > 100) {
    details.name = "Name must be between 2 and 100 characters.";
  }

  if (typeof email !== "string" || !email.trim()) {
    details.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    details.email = "A valid email address is required.";
  }

  if (typeof password !== "string" || !password) {
    details.password = "Password is required.";
  } else if (password.length < 8 || password.length > 128) {
    details.password = "Password must be between 8 and 128 characters.";
  }

  if (Object.keys(details).length > 0) {
    return next(validationError(details));
  }

  next();
}

export function validateLogin(req, res, next) {
  const { email, password } = req.body;

  const details = {};

  if (typeof email !== "string" || !email.trim()) {
    details.email = "Email is required.";
  }

  if (typeof password !== "string" || !password) {
    details.password = "Password is required.";
  }

  if (Object.keys(details).length > 0) {
    return next(validationError(details));
  }

  next();
}
