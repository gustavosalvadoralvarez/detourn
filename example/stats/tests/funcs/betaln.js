var gammaln = require('./gammaln.js');
module.exports = function betaln(x, y) {
	return gammaln(x) + gammaln(y) - gammaln(x + y)}