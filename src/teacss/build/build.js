if (typeof(CleanCSS)=='undefined' && typeof(require)!='undefined') {
    require("./lib/clean-css");
    require("./lib/parse-js");
    require("./lib/process");
    require("./lib/uglify-js");
}

teacss.build = (function () {
    var path = {
        isAbsoluteOrData : function(part) {
            return /^(.:\/|data:|http:\/\/|https:\/\/|\/)/.test(part)
        },
        clean : function (part) {
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
        },
        dir : function (path) {
            var dir = path.replace(/\\/g,"/").split('/');dir.pop();dir = dir.join("/")+'/';
            return dir;
        },
        relative : function (path,from) {
            var pathParts = path.split("/");
            var fromParts = from.split("/");

            var once = false;
            while (pathParts.length && fromParts.length && pathParts[0]==fromParts[0]) {
                pathParts.splice(0,1);
                fromParts.splice(0,1);
                once = true;
            }
            if (!once) return path;
            return new Array(fromParts.length).join("../") + pathParts.join("/");
        }
    }

    /**
     * Builds tea file into js|css|images object
     * @param file source tea file
     * @param out resulting filename or mask (if extension is ommited)
     * @param result_cb result callback, needed only for browser version as in node this function is synchronous
     * @param options
     */
    var build = function(file,out,result_cb,options) {
        var js = "";
        var css = "";
        var images = {};

        options = options || {};
        options.minifyJS = (options.minifyJS===undefined) ? true : options.minifyJS;

        var js_cb = options.js_cb;
        var css_cb = options.css_cb;

        var inDir = path.dir(path.clean(file));
        var outDir = path.dir(path.clean(out));

        var old_appendScript = teacss.appendScript;
        var old_appendStyle = teacss.appendStyle;
        var old_update = teacss.update;
        if (teacss.Canvas) {
            var old_canvasBackground = teacss.Canvas.effects.background;
            teacss.Canvas.effects.background = function (part) {
                teacss.functions.tea.print("background-image:url("+part+");");
                if (path.isAbsoluteOrData(part)) {
                    part = path.relative(path.clean(part),outDir);
                }
                images[part] = this.toDataURL();
            }
        }

        teacss.appendScript = function(href) {}
        teacss.appendStyle = function(href) {}
        teacss.update = function () {
            var tea_f = teacss.parseSheetFile(file,true);
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

            if (css_cb) css = css_cb(css);
            if (css) css = CleanCSS.process(css);

            // preprocess CSS to match the path
            css = css.replace(/url\(['"]?([^'"\)]*)['"]?\)/g, function( whole, part ) {
                if (path.isAbsoluteOrData(part)) {
                    part = path.relative(path.clean(part),outDir);
                }
                return 'url('+part+')';
            });

            var hash = "";
            var ext = out.split(".").pop();
            if (ext=='js' && css) {

                var scriptName = out.replace(/\\/g,"/").split("/").pop();
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
            if (options.minifyJS) {
                var jsp = uglify.parser;
                var pro = uglify.uglify;
                var ast = jsp.parse(js);
                js = pro.gen_code(ast);
            }

            var result = {
                css: css,
                js: js,
                tea_js: tea_f.js,
                images: images
            };

            if (!teacss.image || teacss.image.getDeferred()==0) {
                teacss.appendScript = old_appendScript;
                teacss.appendStyle = old_appendStyle;
                if (teacss.Canvas)
                    teacss.Canvas.effects.background = old_canvasBackground;
                teacss.update = old_update;
                if (result_cb) result_cb(result);
            }
            return result;
        };
        return teacss.update();
    }

    return build;
})();