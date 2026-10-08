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

function validateRestaurantFields(body, { partial = false } = {}) {
  const details = {};

  const requiredStringFields = [
    ["restaurantId", "Restaurant ID"],
    ["name", "Name"],
    ["cuisine", "Cuisine"],
    ["borough", "Borough"],
  ];

  for (const [field, label] of requiredStringFields) {
    if (partial && body[field] === undefined) {
      continue;
    }

    if (typeof body[field] !== "string" || !body[field].trim()) {
      details[field] = `${label} is required.`;
    }
  }

  if (body.address === undefined && !partial) {
    details.address = "Address is required.";
  }

  if (body.address !== undefined) {
    if (
      typeof body.address !== "object" ||
      Array.isArray(body.address) ||
      body.address === null
    ) {
      details.address = "Address must be an object.";
    } else {
      if (
        body.address.street !== undefined &&
        (typeof body.address.street !== "string" || !body.address.street.trim())
      ) {
        details["address.street"] = "Street must be a non-empty string.";
      }

      if (
        body.address.zipcode !== undefined &&
        (typeof body.address.zipcode !== "string" ||
          !body.address.zipcode.trim())
      ) {
        details["address.zipcode"] = "Zipcode must be a non-empty string.";
      }

      if (
        body.address.building !== undefined &&
        typeof body.address.building !== "string"
      ) {
        details["address.building"] = "Building must be a string.";
      }

      if (body.address.coord !== undefined) {
        const coord = body.address.coord;

        if (
          !Array.isArray(coord) ||
          coord.length !== 2 ||
          !coord.every((value) => typeof value === "number")
        ) {
          details["address.coord"] =
            "Coordinates must contain exactly two numbers.";
        } else if (
          coord[0] < -180 ||
          coord[0] > 180 ||
          coord[1] < -90 ||
          coord[1] > 90
        ) {
          details["address.coord"] =
            "Coordinates must be valid longitude and latitude values.";
        }
      }
    }
  }

  return details;
}

export function validateAdminRestaurantCreate(req, res, next) {
  const details = validateRestaurantFields(req.body);

  if (Object.keys(details).length > 0) {
    return next(validationError(details));
  }

  next();
}

export function validateAdminRestaurantUpdate(req, res, next) {
  const details = validateRestaurantFields(req.body, {
    partial: true,
  });

  if (Object.keys(details).length > 0) {
    return next(validationError(details));
  }

  next();
}
