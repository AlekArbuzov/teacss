require("./teacss/core");
require("../build/console/teacss.build");

var core_js = teacss.getFile("teacss/core.js");
var js_cb = function (js) {
    return core_js+"\n"+js+"\n"+"teacss.update();";
}

teacss.build("teacss.core.tea","../lib/teacss.core.js",js_cb);
teacss.build("teacss.full.tea","../lib/teacss.full.js",js_cb);