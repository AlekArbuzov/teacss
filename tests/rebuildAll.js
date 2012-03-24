var fs = require("fs");
var sys = require("util");
var path = require("path");
require("../tests/core/samples.js");
require("../src/teacss/core.js");
require ("../src/teacss/color.js");

for(var ind in samples){
    var source = "assets/tea/" + samples[ind] + ".tea";
    var js = teacss.parseSheetFile(source);
    var css = teacss.parseSheet(source)();

    var jsname = path.join("assets/samples/js/", samples[ind] + ".js");
    var cssname = path.join("assets/samples/css/", samples[ind] + ".css");

    fs.writeFile(jsname, js, undefined);
    fs.writeFile(cssname, css, undefined);

    sys.puts("- saved [" + samples[ind] + "] (js + css)");
}