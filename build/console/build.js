var fs = require('fs');
var path = require('path');

var argv = require('optimist')
    .usage('Usage: node build.js file.tea file.css')
    .demand(2)
    .argv
;
var file = path.resolve(argv._[0]);
var out = path.resolve(argv._[1]);

require("../../src/teacss/core");
require("../../src/teacss/color");
require("../../src/teacss/build/build");

var res = teacss.build(file,out);
var ext = out.split(".").pop();
if (ext=='css') {
    fs.writeFileSync(out,res.css);
} else if (ext=='js') {
    fs.writeFileSync(out,res.js);
} else {
    fs.writeFileSync(out+".css",res.css);
    fs.writeFileSync(out+".js",res.js);
}