if (typeof(CleanCSS)=='undefined' && typeof(require)!='undefined') {
    require("./lib/clean-css");
    require("./lib/parse-js");
    require("./lib/process");
    require("./lib/uglify-js");
}

teacss.build = function(file,out,js_cb,css_cb) {
    var js = "";
    var css = "";

    var old_appendScript = teacss.appendScript;
    var old_appendStyle = teacss.appendStyle;

    teacss.appendScript = function(href) {}
    teacss.appendStyle = function(href) {}

    var tea_f = teacss.parseFile(file,true);
    for (var a=0;a<tea_f.appends.length;a++) {
        var append_name = tea_f.appends[a];
        if (append_name.split(".").pop()=="css") {
            css += teacss.getFile(append_name);
        }
        if (append_name.split(".").pop()=="js") {
            if (js) js += ";\n"; js += teacss.getFile(append_name);
        }
    }

    css += teacss.getSheetFunction(function (){
        for (var name in teacss.functions) eval('var '+name+' = teacss.functions.'+name);
        eval('(function() {' + tea_f.js + '}())');
    })();

    teacss.appendScript = old_appendScript;
    teacss.appendStyle = old_appendStyle;

    if (css_cb) css = css_cb(css);
    if (css) css = CleanCSS.process(css);

    // preprocess CSS to match the path
    var isAbsoluteOrData = function(part) {
        return /^(data:|http:\/\/|https:\/\/|\/)/.test(part)
    }
    var pathClean = function (part) {
        part = part.replace(/\\/g,"/");
        part = part.split("/");
        for (var p=0;p<part.length;p++) {
            if (part[p]=='..' && part[p-1]) {
                part.splice(p-1,2);
                p = p - 2;
            }
            if (part[p]==".") {
                part.splice(p,1);
                p = p - 1;
            }
        }
        return part = part.join("/");
    }
    var pathDir = function (path) {
        var dir = path.replace(/\\/g,"/").split('/');dir.pop();dir = dir.join("/")+'/';
        return dir;
    }
    var inDir = pathDir(pathClean(file));
    var outDir = pathDir(pathClean(out));

    var inParts = inDir.split("/");
    var outParts = outDir.split("/");

    while (inParts.length && outParts.length && outParts[0]==inParts[0]) {
        outParts.splice(0,1);
        inParts.splice(0,1);
    }
    var relative = outParts.join("/");
    css = css.replace(/url\(['"]?([^'"\)]*)['"]?\)/g, function( whole, part ) {
        part = pathClean(part).replace(relative,"");
        return 'url('+part+')';
    });


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
        if (js) js += ";\n";
        js += '('+f_css.toString().replace("SCRIPT_NAME",scriptName)+')("' + css.replace(/\\/g,"\\\\").replace(/\"/g,"\\\"") + '");';
    }

    if (js_cb) js = js_cb(js);
    var jsp = uglify.parser;
    var pro = uglify.uglify;
    var ast = jsp.parse(js);
    js = pro.gen_code(ast);

    return {
        css: css,
        js: js
    };
}