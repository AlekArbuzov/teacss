require("./teacss/core");
require("./teacss/build/build.js");

// we're going to append core.js at start and "teacss.update()" to the end
var core_js = teacss.getFile("teacss/core.js");
var js_cb = function (js) {
    return core_js+"\n"+js+"\n"+"if (typeof(window)!=undefined) window.onload = teacss.update; else teacss.update();";
}

require('fs').writeFileSync(
    "../lib/teacss.js",
    teacss.build("teacss.tea","teacss.js",false,{js_cb:js_cb}).js
);

require('fs').writeFileSync(
    "../lib/teacss-ui.js",
    teacss.build("teacss-ui.tea","teacss-ui.js",false).js
);
