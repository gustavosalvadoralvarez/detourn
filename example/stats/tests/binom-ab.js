var betaln = require('./funcs/betaln.js');
module.exports = function binom_ab (counts) {
	//:: [ [interactions 1, impressions 1], [ interactions 2, impressions 2]]
	var a1, b1, a2, b2, log, exp, results = {};
	a1 = 1 + parseInt(counts[0][0], 10);
	a2 = 1 + parseInt(counts[1][0], 10);
	b1 = parseInt(counts[0][1], 10) - a1;
	b2 = parseInt(counts[1][1], 10) - a2;
	t1 = b1 + b2;
	t2 = a2 + b2;
	t3 = betaln(a1, b1);
	log = Math.log;
	exp = Math.exp;
	var k = 0,
		t = 0;
	while (k++ < a2) {
		t += exp(betaln(a1 + k, t1) - log(b1 + k) - betaln(1 + k, b2) - t3)
	}
	results.prob = 1 - t;
	results.conclusion = "The Probability that Proportion1 > Proportion2 is " + (1 - t);
	return results}