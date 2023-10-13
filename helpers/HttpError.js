const messageList = {
  400: "Bad request",
  401: "Unauthrized",
  403: "Forbidden",
  404: "Not found",
  409: "Conflict",
};

const HttpError = (status, message = messageList[status]) => {
  const err = new Error(message);
  err.status = status;
  return err;
};
export default HttpError;
