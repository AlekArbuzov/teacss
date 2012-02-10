var fs = require('fs');
var path = require('path');

var argv = require('optimist')
    .usage('Usage: node builder.js file.tea file.css')
    .demand(2)
    .argv
;
var file = path.relative(".",path.resolve(argv._[0]));
var out = path.resolve(argv._[1]);

require("../core");
teacss.getFile = function (url) {
    return fs.readFileSync(url,'ascii');
}
teacss.getFullPath = function(url,base) {
    return path.relative(".",path.resolve(path.dirname(base),url));
}

var js = teacss.parseFile(file);
var css = teacss.getSheetFunction(function (){
    for (var name in teacss.functions)
        eval('var '+name+' = teacss.functions.'+name);
    eval(js);
})();

fs.writeFileSync(out,css);
