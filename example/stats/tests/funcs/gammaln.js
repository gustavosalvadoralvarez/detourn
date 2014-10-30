module.exports = function gammaln(x) {
	// Adapted from jStat https://github.com/jstat/jstat
	var j = 0,
		cof = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5],
		ser = 1.000000000190015,
		xx, y, tmp;
	tmp = (y = xx = x) + 5.5;
	tmp -= (xx + 0.5) * Math.log(tmp);
	for (; j < 6; j++)
		ser += cof[j] / ++y;
	return Math.log(2.5066282746310005 * ser / xx) - tmp;
}

