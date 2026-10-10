const unsafeKey = (key) =>
  key.startsWith("$") ||
  key.includes(".") ||
  ["__proto__", "prototype", "constructor"].includes(key);
function fail(statusCode, code, message) {
  return Object.assign(new Error(message), { statusCode, code });
}
export function requestSecurity(clientOrigin) {
  const allowedOrigin = new URL(clientOrigin).origin;
  return (req, res, next) => {
    res.set("Cache-Control", "no-store");
    const origin = req.get("Origin");
    if (origin && origin !== allowedOrigin)
      return next(
        fail(403, "ORIGIN_NOT_ALLOWED", "Request origin is not allowed."),
      );
    if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) {
      if (!origin && req.get("Sec-Fetch-Site") === "cross-site")
        return next(
          fail(
            403,
            "CROSS_SITE_REQUEST_BLOCKED",
            "Cross-site requests are not allowed.",
          ),
        );
      if (
        ["POST", "PATCH", "PUT"].includes(req.method) &&
        !req.is("application/json")
      )
        return next(
          fail(415, "JSON_REQUIRED", "Use application/json for this request."),
        );
    }
    next();
  };
}
export function validateRequestShape(req, res, next) {
  const inspect = (value, depth = 0) => {
    if (depth > 8)
      throw fail(400, "VALIDATION_ERROR", "Request nesting is too deep.");
    if (value && typeof value === "object") {
      for (const [key, item] of Object.entries(value)) {
        if (unsafeKey(key))
          throw fail(
            400,
            "VALIDATION_ERROR",
            "Request contains unsupported field names.",
          );
        inspect(item, depth + 1);
      }
    }
  };
  try {
    if (
      req.body !== undefined &&
      (!req.body || Array.isArray(req.body) || typeof req.body !== "object")
    )
      throw fail(
        400,
        "VALIDATION_ERROR",
        "Request body must be a JSON object.",
      );
    req.body ??= {};
    inspect(req.body);
    for (const [key, value] of Object.entries(req.query)) {
      if (
        unsafeKey(key) ||
        /[\[\]]/.test(key) ||
        typeof value !== "string" ||
        value.length > 200
      )
        throw fail(
          400,
          "VALIDATION_ERROR",
          "Query parameters must be single strings of at most 200 characters.",
        );
      if (
        ["page", "limit"].includes(key) &&
        (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 10000)
      )
        throw fail(
          400,
          "VALIDATION_ERROR",
          "Pagination values must be integers between 1 and 10000.",
        );
      if (
        ["minRating", "maxRating"].includes(key) &&
        (!value.trim() ||
          !Number.isFinite(Number(value)) ||
          Number(value) < 0 ||
          Number(value) > 5)
      )
        throw fail(
          400,
          "VALIDATION_ERROR",
          "Rating filters must be between 0 and 5.",
        );
      if (key === "sort" && !["name", "rating", "reviews"].includes(value))
        throw fail(400, "VALIDATION_ERROR", "Unsupported sort value.");
      if (key === "status" && !["all", "active", "inactive"].includes(value))
        throw fail(400, "VALIDATION_ERROR", "Unsupported status value.");
    }
    next();
  } catch (error) {
    next(error);
  }
}
export function validateObjectId(req, res, next, id) {
  if (!/^[a-f\d]{24}$/i.test(id))
    return next(fail(400, "INVALID_ID", "A valid resource ID is required."));
  next();
}
