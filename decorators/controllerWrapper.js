const controllerWrapper = (fn) => {
  const fnWrapper = async (req, rej, next) => {
    try {
      await fn(req, rej, next);
    } catch (error) {
      next(error);
    }
  };
  return fnWrapper;
};

export default controllerWrapper;
