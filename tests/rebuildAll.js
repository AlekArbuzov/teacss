var fs = require("fs");
var sys = require("util");
var path = require("path");
require("../tests/from_less/samples.js");
require("../src/teacss/core.js");
require ("../src/teacss/color.js");

for(var ind in samples){
    var source = "from_less/samples/cases/" + samples[ind] + ".tea";
    var js = teacss.parseSheetFile(source);
    var css = teacss.parseSheet(source)();

    var jsname = path.join("from_less/samples/js/", samples[ind] + ".js");
    var cssname = path.join("from_less/samples/css/", samples[ind] + ".css");

    fs.writeFile(jsname, js, undefined);
    fs.writeFile(cssname, css, undefined);

    sys.puts("- saved [" + samples[ind] + "] (js + css)");
}