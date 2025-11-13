export class RequestError extends Error {
  constructor(message = "Request Error", status = 400) {
    super(message);
    this.name = "RequestError";
    this.status = status;
  }
}
export class BadRequestError extends Error {
  constructor(message = "Bad Request", status = 400) {
    super(message);
    this.name = "BadRequestError";
    this.status = status;
  }
}
export class NotFoundError extends Error {
  constructor(message = "Not Found", status = 404) {
    super(message);
    this.name = "NotFoundError";
    this.status = status;
  }
}
export class ConflictError extends Error {
  constructor(message = "Conflict", status = 409) {
    super(message);
    this.name = "ConflictError";
    this.status = status;
  }
}
export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized", status = 401) {
    super(message);
    this.name = "UnauthorizedError";
    this.status = status;
  }
}
export class ForbiddenError extends Error {
  constructor(message = "Forbidden", status = 403) {
    super(message);
    this.name = "ForbiddenError";
    this.status = status;
  }
}