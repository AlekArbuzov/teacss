var fs = require('fs');
var path = require('path');

teacss.getFile = function (url) {
    return fs.readFileSync(url,'ascii');
}
teacss.getFullPath = function(url,base) {
    return path.relative(".",path.resolve(path.dirname(base),url));
}
teacss.build = function(file,out,js_cb,css_cb) {
    var js = "";
    var css = "";

    teacss.appendScript = function(href) {
        if (js) js += ";\n";
        js += teacss.getFile(href);
    }
    teacss.appendStyle = function(href) {
        css += teacss.getFile(href);
    }

    var tea_f = teacss.parseFile(file);
    css += teacss.getSheetFunction(function (){
        for (var name in teacss.functions) eval('var '+name+' = teacss.functions.'+name);
        eval('(function() {' + tea_f + '}())');
    })();

    if (css_cb) css = css_cb(css);
    if (css) css = require('clean-css').process(css);

    var hash = "";

    var ext = out.split(".").pop();
    if (ext=='js' && css) {

        var scriptName = out.replace("\\","/").split("/").pop();

        var f_css = function (css) {
            var styleNode = document.createElement("style");
            styleNode.type = "text/css";
            styleNode.rel = "stylesheet";
            document.getElementsByTagName("head")[0].appendChild(styleNode);

            var script_name = "SCRIPT_NAME";
            var script_root = "";
            var scripts = document.getElementsByTagName('script');
            for (var s=0;s<scripts.length;s++) {
                var src = scripts[s].src;
                if (src && src.substring(src.length-script_name.length)==script_name) {
                    script_root = src.replace("\\","/").split("/");
                    script_root.pop();
                    script_root = script_root.join("/")+"/";
                }
            }
            var isAbsoluteOrData = function(part) {
                return /^(data:|http:\/\/|https:\/\/|\/)/.test(part)
            }
            css = css.replace(/url\(['"]?([^'"\)]*)['"]?\)/g, function( whole, part ) {
                if (isAbsoluteOrData(part) ) return whole;
                return "url("+ script_root + part +")"
            });
            var rules = document.createTextNode(css);
            if (styleNode.styleSheet) {
                styleNode.styleSheet.cssText = rules.nodeValue;
            } else {
                styleNode.innerHTML = "";
                styleNode.appendChild(rules);
            }
        };
        js += '('+f_css.toString().replace("SCRIPT_NAME",scriptName)+')("' + css.replace(/\\/g,"\\\\").replace(/\"/g,"\\\"") + '");';
    }

    if (js_cb) js = js_cb(js);
    var jsp = require("uglify-js").parser;
    var pro = require("uglify-js").uglify;
    var ast = jsp.parse(js);
    js = pro.gen_code(ast);

    if (ext=="js") {
        fs.writeFileSync(out,js);
    }
    else if (ext=='css') {
        fs.writeFileSync(out,css);
    }
    else {
        if (js) fs.writeFileSync(out+".js",js);
        if (css) fs.writeFileSync(out+".css",css);
    }
}