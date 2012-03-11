var fs = require("fs");
var sys = require("util");
var path = require("path");
require("../src/teacss/core.js");
require("../tests/core/samples.js");

for(ind in samples){
    var source = "assets/tea/" + samples[ind] + ".tea";
    var output = teacss.parseSheetFile(source);

    var outname = path.join("assets/samples/", samples[ind] + ".js");

    fs.writeFile(outname, output, undefined);

    sys.puts("- saved [" + outname + "]");
}