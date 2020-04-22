const blacklist = [];

module.exports.blacklist = (req, res, next) => {
  blacklist.push(req.headers.authorization);
  console.log(blacklist);
  next();
};

module.exports.IsInBlacklist = (req, res, next) => {
  console.log(blacklist);
  if (blacklist.includes(req.headers.authorization)) {
    res.status(200).send({ message: 'разлогинились' });
  }
  next();
};