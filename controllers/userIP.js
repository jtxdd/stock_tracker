module.exports = req => {
  let ipAddr = req.connection.remoteAddress;
  
  if (req.headers && req.headers["x-forwarded-for"]) {
    [ipAddr] = req.headers["x-forwarded-for"].split(",");
  }
  return ipAddr;
};
