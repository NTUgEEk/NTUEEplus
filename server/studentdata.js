var fs = require('fs');
var readline = require('readline');

module.exports.verify = function(id, name, next) {
    var rd = readline.createInterface({
        input: fs.createReadStream('./studentdata.csv'),
        output: process.stdout,
        terminal: false
    });
    var ok = false;
    rd.on('line', (line) => {
        var arr = line.split(',');
        if(arr[0] == id && arr[1] == name) {
            ok = true;
            next(null, true);
        }
    });
    rd.on('close', () => {
        if(!ok) next(null, false);
    })
};