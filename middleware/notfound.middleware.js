const notfound = (req, res, next) => {
  next({
    status: 400,
    message: "Resource not found",
  });
};

module.exports = {
  notfound,
};
