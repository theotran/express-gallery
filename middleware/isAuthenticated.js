module.exports = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return  res.redirect('/login');
  }
  //make a comparison for the passwords between database and 
  return next();
};