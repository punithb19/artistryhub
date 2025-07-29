const isProd = process.env.NODE_ENV === 'production';

module.exports = function cookieOpts() {
  return {
    httpOnly : true,
    path    : '/',
    sameSite : 'None',
    secure   : isProd,          
    maxAge   : 60 * 60 * 1000   
  };
};