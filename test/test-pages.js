var expect  = require('chai').expect;
var request = require('request');

it('API require', function(done) {
    request({url: 'https://api.exchangeratesapi.io/latest?base=USD', json: true} , function(error, response, body) {
        // console.log(body.rates.USD);
        expect(body.rates.USD).to.equal(0);
        done();
    });
});