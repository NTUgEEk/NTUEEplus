var fs = require('fs');
var readline = require('readline');

module.exports.verify = function(id, name, next) {
    id = id.toUpperCase();
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
    });
};

module.exports.findIdOrName = function(key, next) {
    if(key.length < 1) {
        next(null, []);
        return;
    }
    var tgt = 0;
    if(key.substr(0, 1) == 'B' || key.substr(0, 1) == 'b') {
        key = key.toUpperCase();
    } else tgt = 1;
    var rd = readline.createInterface({
        input: fs.createReadStream('./studentdata.csv'),
        output: process.stdout,
        terminal: false
    });
    var res = [];
    rd.on('line', (line) => {
        var arr = line.split(',');
        if(arr[tgt] == key) {
            res.push({ name: arr[1], school_id: arr[0] });
        }
    });
    rd.on('close', () => {
        next(null, res);
    });
}