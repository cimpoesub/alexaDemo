const http = require('http');

function getTrivia(callback) {
    const options = {
        host: 'ec2-54-226-217-184.compute-1.amazonaws.com',
        port: 3000,
        path: '/api'
    }
    http.get(options, (res) => {
        // Continuously update stream with data
        let body = '';
        res.on('data', function(d) {
            body += d;
        });
        res.on('end', function() {
            // Data reception is done, do whatever with it!
            const parsed = JSON.parse(body);
            const message = JSON.stringify(parsed.message);
            console.log('===== message : ' + message);
            callback(message);
        }).on('error', (e) => {
            console.log('\nError at get request: ' + e);
            callback('Couldn\'t connect to the trivia server. Please try again.')
        });
    });
};

module.exports.getTrivia = getTrivia;