export function notFoundHandler(req, res) {
  res.status(404).json({
    error: {
      code: "ROUTE_NOT_FOUND",
      message: "Route not found.",
    },
  });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  const known = {
    "entity.parse.failed": [400, "INVALID_JSON", "Request body contains invalid JSON."],
    "entity.too.large": [413, "PAYLOAD_TOO_LARGE", "Request body is too large."],
    "encoding.unsupported": [415, "UNSUPPORTED_ENCODING", "Compressed request bodies are not supported."],
  }[err.type];
  const statusCode = known?.[0] ?? (Number.isInteger(err.statusCode) && err.statusCode >= 400 && err.statusCode < 600 ? err.statusCode : 500);
  if (statusCode >= 500) console.error("API request failed", { method: req.method, path: req.path, name: err.name });

  res.status(statusCode).json({
    error: {
      code: known?.[1] ?? (statusCode >= 500 ? "INTERNAL_SERVER_ERROR" : err.code || "REQUEST_ERROR"),
      message:
        known?.[2] ?? (statusCode >= 500 ? "An unexpected error occurred." : err.message),
      ...(statusCode < 500 && err.details && { details: err.details }),
    },
  });
}
