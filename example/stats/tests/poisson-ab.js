var betaln = require('./funcs/betaln.js');
module.exports = function  poisson_ab (counts) {
	// :: [[int/float, int/float],[int/float, int/float]] ==> { prob: float, conclusion: string }
	// Calculates tie probability that Poisson process w/ posterior dist. A ~ Gamma(counts[0]) has a higher
	// frequency (lambda) than event B ~ Gamma(counts[1])  
	var log, exp, a1, b1, a2, b2, t1, t2, t3, results = {};
	// parse input and define locals
	a1 = parseInt(counts[0][0], 10); // hits in 1
	b1 = parseInt(counts[0][1], 10); // impressions in 1
	a2 = parseInt(counts[1][0], 10); // hits in 2
	b2 = parseInt(counts[1][1], 10); // impressions in 2
	log = Math.log;
	exp = Math.exp;
	// evaluate all constants in summation ahead of time
	t1 = log(b1);
	t2 = a2 * log(b2);
	t3 = log(b1 + b2);
	// sum from 0 to the int before a1 ( use logs to avoid hitting Infinity )
	var k = 0,
		t = 0;
	while (k++ < a1) {
		t += exp(k * t1 + t2 - (k + a2) * t3 - log(k + a2) - betaln(k + 1, a2))
	}
	// define results and return
	results.prob = t;
	results.conclusion = "The Probability that Freq1 > Freq2 is " + t;
	return results
}