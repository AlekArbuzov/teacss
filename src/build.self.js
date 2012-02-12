require("./teacss/core");
require("./teacss/build/build.js");

// we're going to append core.js at start and "teacss.update()" to the end
var core_js = teacss.getFile("teacss/core.js");
var js_cb = function (js) {
    return core_js+"\n"+js+"\n"+"teacss.update();";
}

require('fs').writeFileSync(
    "../lib/teacss.core.js",
    teacss.build("teacss.core.tea","teacss.core.js",js_cb).js
);

require('fs').writeFileSync(
    "../lib/teacss.full.js",
    teacss.build("teacss.full.tea","teacss.full.js",js_cb).js
);
