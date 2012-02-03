teacss = (function () {
    var teacss = {
        functions: {},
        sheets: []
    };

    var files = {};
    var parseLine = 0;

    function trim(text) {
        var rtrim = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;
		return (text || "").replace( rtrim, "" );
	}
    teacss.trim = trim;

    function getFile(url) {
        var AJAX;
        if (window.XMLHttpRequest) {
            AJAX=new XMLHttpRequest();
        } else {
            AJAX=new ActiveXObject("Microsoft.XMLHTTP");
        }
        if (AJAX) {
            AJAX.open("GET", url, false);
            AJAX.send(null);
            if (AJAX.status!=200) return false;
            return AJAX.responseText;
        } else {
            return false;
        }
    }

    function getFullPath(path,base) {
        if (!(path[0]=='/' ||
            path.indexOf("http://")==0 ||
            path.indexOf("https://")==0))
        {
            var last = base.lastIndexOf("/");
            base = (last==-1) ? "" : base.substring(0,last);
            path = base+"/"+path;
        }
        if (path.indexOf(".js")==-1 && path.indexOf(".tea")==-1 && path.indexOf(".css")==-1) path += ".tea";
        return path;
    }

    teacss.parseFile = function (path) {
        if (files[path]) return files[path].js;
        var data = getFile(path);
        if (data) {
            files[path] = {tea:data,js:'',imports:[],counter:0,line:0,lineCount:0};
            var startLine = parseLine;
            files[path].js = this.parse(data, path);
            files[path].lineCount = parseLine - startLine + 1;
            return files[path].js
        } else {
            return false;
        }
    };

    teacss.parse = function(code,path) {
        var js_file = /\.js$/.test(path);
        var stack = [],state,state_data;
        var me = this;

        var N = code.length,s = 0,l;
        var output = "";
        var errors = [];
        output = "tea.start('"+path+"',"+parseLine+");\n" + output;
        parseLine++;

        function next() {
            if (code[s]=='\n') parseLine++;
            return code[s++];
        }
        function error(message) {
            var line = 0;
            for (var i=0;i<=s;i++) if (code[i]=='\n') line++;
            errors.push({message:message,line:line,source:code,path:path});
        }
        function push_state(type,data) {
            data = data || {};
            stack.push({state:state=type,data:state_data=data});
        }
        function pop_state() {
            stack.pop();
            var st = stack[stack.length-1];
            if (st) {
                state = st.state;
                state_data = st.data;
            } else {
                error('Wrong closing tag');
            }
        }
        if (js_file)
            push_state('js');
        else
            push_state('css');

        function blank(s) {
            return (s==' ' || s=='\n' || s=='\r' || s=='\t' || s=='\r');
        }

        while (s<N) {
            if (state=='css') {
                while (s<N && blank(code[s])) output += next();
                if (code[s]=='@') {
                    if (code.substring(s,s+7)=='@import') {
                        s+=7;
                        push_state('import'); continue;
                    }
                    if (code.substring(s,s+"@keyframes".length)=='@keyframes' ||
                        code.substring(s,s+"@-moz-keyframes".length)=='@-moz-keyframes' ||
                        code.substring(s,s+"@-webkit-keyframes".length)=='@-webkit-keyframes' ||
                        code.substring(s,s+"@media".length)=='@media'
                    ) {
                        push_state('namespace'); continue;
                    }
                    if (code[s+1]=='{') {
                        output += '{';
                        s+=2;
                        push_state('js',{brackets:1}); continue;
                    }
                    next();
                    if (code[s]==' ') next();
                    push_state('js_line'); continue;
                }
                if (code[s]=='}') {
                    if (stack.length>2 && stack[stack.length-2].state=='js')
                        output += '}';
                    else
                        output += '});';
                    next();
                    pop_state(); continue;
                }
                if (code[s]=='/' && code[s+1]=='*') {
                    push_state('comment'); continue;
                }
                if (code[s]=='/' && code[s+1]=='/') {
                    push_state('comment_line'); continue;
                }
                if (s<N)
                    push_state('rule_or_mixin');
                continue;
            }
            if (state=='comment') {
                while (s<N && !(code[s]=='*' && code[s+1]=='/')) {
                    output += next();
                }
                output += '*/';
                s+=2;
                pop_state(); continue;
            }
            if (state=='import') {
                output += '/* @import';
                var importName = "";
                while (s<N && code[s]!=';') {
                    importName += code[s];
                    output += next();
                }
                importName = trim(importName);
                if (importName[0]=='"' || importName[0]=="'") {
                    var br = importName[0];
                    importName = importName.substring(1);
                    if (importName[importName.length-1]==br)
                        importName = importName.substring(0,importName.length-1);
                    importName = importName.replace("\\"+br,br);
                }
                importName = getFullPath(importName,path);
                var parsed = this.parseFile(importName);
                if (code[s]!=';') error('; expected');
                output+= '; */\n'; parseLine++; next();
                if (parsed===false)
                    error('Can\'t load file: '+importName);
                else
                    output += parsed;
                pop_state(); continue;
            }
            if (state=='js_line' || state=='comment_line') {
                while (s<N && code[s]!='\n') output += next();
                if (s<N) output += next();
                pop_state(); continue;
            }
            if (state=='js') {
                if (code[s]=='@' && code[s+1]=='{') {
                    output += '{';
                    s+=2;
                    push_state('css'); continue;
                }
                if (code[s]=='{') {
                    state_data.brackets++;
                }
                if (code[s]=="}") {
                    state_data.brackets--;
                }
                output += next();
                if (state_data.brackets==0) {
                    pop_state();
                }
                continue;
            }

            if (state=='rule_or_mixin' || state=='namespace') {
                var has_js = false;
                var rule = "";
                var raw = "";
                if (state=='namespace') rule += next();
                while (s<N) {
                    if (code[s]=='{') break;
                    if (code[s]==';') break;
                    if (code[s]=='@') {
                        has_js = true;
                        if (code[s+1]=='{') {
                            s+=2;
                            var name = "";
                            while (s<N && code[s]!='}') {
                                raw += code[s];
                                name += next();
                            }
                            if (!name) error('Inline JS Code expected');
                            if (code[s]!='}') error("} expected");
                            raw += code[s];
                            next();
                            rule += '"+('+name+')+"';
                            continue;
                        } else {
                            s+=1;
                            var regex = /[0-9a-zA-Z_$\.]/;
                            var name = "";
                            while (s<N && regex.test(code[s])) {
                                raw += code[s];
                                name += next();
                            }
                            if (!name) error('Variable expression expected');
                            rule += '"+('+name+')+"';
                            continue;
                        }
                    }
                    if (code[s]=='\\') {
                        rule += "\\\\";
                        raw += code[s];
                        next();
                        continue;
                    }
                    if (code[s]=='"') {
                        rule += "\\\"";
                        raw += code[s];
                        next();
                        continue;
                    }
                    if (code[s]=='\r') {
                        next();
                        continue;
                    }
                    if (code[s]=='\n') {
                        rule += '"+\n';
                        raw += code[s];
                        next();
                        while (s<N && blank(code[s])) {
                            raw += code[s];
                            rule += next();
                        }
                        rule += '"';
                        continue;
                    }
                    if (code[s]=='\t') {
                        rule += ' ';
                        raw += code[s];
                        next();
                        continue;
                    }
                    raw += code[s];
                    rule += next();
                }
                var last = rule.length-1;
                while (blank(rule[last]) && last>=0) last--;
                var postfix = rule.substring(last+1);
                rule = rule.substring(0,last+1);
                raw = raw.substring(0,last+1);

                var mixin_regex = /^\.[0-9a-zA-Z_$\.]*?\(.*?\)$/;

                if (code[s]=='{') {
                    if (mixin_regex.test(raw)) {
                        var parts = raw.split("(");
                        var params = '('+parts[1];
                        var name = parts[0].substring(1);
                        output += name + ' = tea.f(function '+params+'{'+postfix;
                    } else {
                        if (state=='namespace')
                            output += 'tea.namespace("'+rule+'", function (){'+postfix;
                        else
                            output += 'tea.f("'+rule+'", function (){'+postfix;
                    }
                    next();
                    pop_state();
                    push_state("css");

                } else if (code[s]==';') {
                    if (mixin_regex.test(raw)) {
                        output += raw.substring(1)+';'+postfix;
                    } else {
                        output += 'tea.print("'+rule+';");'+postfix;
                    }
                    next();
                    pop_state();
                } else {
                    error("; or { expected");
                }
            }
        }
        if (js_file) {
            if (stack.length!=1 || state!='js') error("Unexpected end of file");
        } else {
            if (stack.length!=1 || state!='css') error("Unexpected end of file");
        }

        if (errors.length) {
            throw {
                name: 'parse',
                errors: errors
            }
        }
        output += "\ntea.finish();";
        parseLine++;
        return output;
    }

    teacss.functions.tea = function () {
        var tea = {
            path: false,
            stack : [],
            current : false,
            rules: [],
            indent: ""
        };

        tea.Rule = function(parent,selector) {
            this.code = [];
            this.parent = parent;
            this.selector = selector;
            this.indent = tea.indent;
            this.print = function(s) { this.code.push(s); }
            this.getSelector = function() {
                if (this.parent && this.parent.selector) {
                    var parent_full = this.parent.getSelector();
                    var parent_items = parent_full.split(",");
                    var parts = [];
                    for (var j=0;j<parent_items.length;j++) {
                        var parent_sel = trim(parent_items[j]);
                        var items = this.selector.split(",");
                        for (var i=0;i<items.length;i++) {
                            var sel = trim(items[i]);
                            if (this.selector.indexOf("&")==0)
                                sel = parent_sel + trim(sel.substring(1));
                            else
                                sel = parent_sel + " " + sel;
                            parts.push(sel);
                        }
                    }
                    return parts.join(", ");
                }
                else {
                    return this.selector;
                }
            }
            this.getOutput = function () {
                if (!this.code.length) return "";
                var output = "";
                var selector = this.getSelector();
                if (selector) output += this.indent+selector + " {\n";
                for (var i=0;i<this.code.length;i++)
                    output += this.indent+"    "+this.code[i]+"\n";
                if (selector) output += this.indent+"}\n";
                return output;
            }
            tea.rules.push(this);
        }

        tea.namespace = function (selector,func) {
            tea.indent = "    ";
            tea.rules.push({getOutput:function(){return selector+' {\n'}});
            func.call(tea.current);
            tea.rules.push({getOutput:function(){return '}\n'}});
            tea.indent = "";
        }
        tea.f = function (selector,func) {
            if (!func) { func = selector; selector = false; }
            if (selector) {
                tea.current = new tea.Rule(tea.current,selector);
                func.call(tea.current);
                tea.current = tea.current.parent;
            } else {
                return function () {
                    return func.apply(tea.current,arguments);
                }
            }
        }
        tea.setPath = function (path) {
            if (path) {
                var dir = path.split('/');dir.pop();dir = dir.join("/")+'/';
                tea.dir = dir;
                tea.path = path;
            } else {
                tea.dir = false;
                tea.path = false;
            }
        }
        tea.start = function (file,line) {
            files[file].line = line;
            files[file].counter = 0;
            files[file].start = line;
            files[file].level = tea.stack.length ? tea.stack[tea.stack.length-1].level + 1 : 0;
            tea.setPath(file);
            tea.stack.push(file);
        };
        tea.finish = function () {
            var imported = tea.stack.pop();
            var file = tea.stack[tea.stack.length-1];
            if (file) files[file].line += files[imported].lineCount;
            tea.setPath(file);
        };
        tea.print = function(s) {tea.current.print(s);}
        return tea;
    }();

    teacss.getSheetFunction = function(tea_function) {
        return function(sheet) {
            var tea = teacss.functions.tea;
            tea.sheet = sheet;
            tea.rules = [];
            var res = tea.f(false,tea_function)();
            if (res===false) return false;
            var output = "";
            for (var i=0;i<tea.rules.length;i++) output += tea.rules[i].getOutput();
            return output;
        }
    }

    teacss.sheets = function () {
        var sheets = [];
        var links = document.getElementsByTagName('link');
        for (var i = 0; i < links.length; i++) {
            var tea = links[i].getAttribute('tea');
            if (tea) {
                sheets.push({
                    src:tea,
                    css:links[i].getAttribute('href'),
                    linkNode:links[i],
                    styleNode:false,
                    scriptNode:false}
                );
            }
        }
        return sheets;
    }();

    teacss.updating = false;
    teacss.error = function (e) {
        if (e.name=='runtime' || e.name=='parse') {
            (function () {
                if (document.body) {
                    var err_div = document.getElementById('teacss_errors');
                    if (!err_div) {
                        err_div = document.createElement("div");
                        err_div.setAttribute('id','teacss_errors');

                        if (document.body.children.length)
                            document.body.insertBefore(err_div,document.body.children[0]);
                        else
                            document.body.appendChild(err_div);
                    }
                    err_div.setAttribute("style",
                        "background:#faa;color:#000;padding:10px;border:1px solid #a33;"+
                        "position: fixed; left:0; right: 0; z-index:900000; top:0;"
                    )
                    var innerHTML = "";
                    function toN(n) { n = ''+n; while (n.length<4) n = ' '+n; return n; }
                    for (var i=0;i<e.errors.length;i++) {
                        var error = e.errors[i];
                        if (e.name=='runtime')
                            innerHTML += "<b>Runtime error:</b><br>";
                        else
                            innerHTML += "<b>Parse error:</b><br>";

                        innerHTML += '<i>'+error.path+'</i>, line: <b>'+error.line+'</b><br>';
                        innerHTML += error.message + '<br>';

                        innerHTML += "<pre style='padding: 10px; margin-left: 0px; background: #eee;'>";

                        if (error.line==undefined) {
                            innerHTML += "Can't detect line number in your browser";
                        } else {
                            var lines = error.source.split('\n');
                            for (var l=-3;l<=3;l++) {
                                var ln = error.line + l;
                                if (ln>=0 && ln<lines.length) {
                                    if (l==0)
                                        innerHTML += '<div style="background: #ffa"><b>'+toN(ln+1)+'</b>   '+lines[ln]+'</div>';
                                    else
                                        innerHTML += '<b>'+toN(ln+1)+'</b>   '+lines[ln]+'\n';
                                }
                            }
                        }
                        innerHTML += '</pre>';
                    }
                    err_div.innerHTML = innerHTML;
                } else {
                    setTimeout(arguments.callee,1);
                }
            })();
        } else {
            throw e;
        }
    }
    teacss.debugRuntime = true;
    teacss.update = function(){
        if (teacss.updating) return;
        teacss.updating = true;
        try {
            for (var i=0;i<teacss.sheets.length;i++) {
                var sheet = teacss.sheets[i];
                if (sheet.linkNode) {
                    sheet.linkNode.parentNode.removeChild(sheet.linkNode);
                    sheet.linkNode = false;
                }
                if (!sheet.scriptNode) {
                    var code = "var teacss_sheet_"+i+" = teacss.getSheetFunction(function() {\n";
                    parseLine = 1;
                    for (var name in teacss.functions) {
                        code += "var "+name+" = teacss.functions."+name+";\n";
                        parseLine++;
                    }
                    code += teacss.parseFile(sheet.src);
                    code += "\n})";

                    sheet.scriptNode = document.createElement("script");
                    sheet.scriptNode.type = 'text/javascript';
                    sheet.scriptNode.text = code;

                    document.getElementsByTagName("head")[0].appendChild(sheet.scriptNode);
                }

                try {
                    var css = window['teacss_sheet_'+i](sheet);
                }
                catch (e) {
                    var lineNumber = e.lineNumber;
                    if (Boolean(window.chrome)) {
                        lineNumber = /\:([0-9]{1,100})\:[0-9]{1,100}/.exec(e.stack)[1] - 1;
                    }

                    var path = teacss.functions.tea.stack[teacss.functions.tea.stack.length-1];
                    var file = files[path];
                    /*var min_delta = 100000000;
                    for (var f in files) {
                        var delta = files[f].start - lineNumber;
                        if (delta>=0 && delta<min_delta) {
                            min_delta = delta;
                            file = files[f];
                            path = f;
                        }
                    }*/

                    if (this.debugRuntime) {
                        throw {
                            name: 'runtime',
                            errors: [{
                                message: e.message,
                                source: file.tea,
                                js: file.js,
                                line: (lineNumber - 3) - file.line,
                                path: path
                            }],
                            innerException: e
                        }
                    } else
                        throw e;
                }

                if (!sheet.styleNode) {
                    sheet.styleNode = document.createElement("style");
                    sheet.styleNode.type = "text/css";
                    sheet.styleNode.rel = "stylesheet";
                    sheet.styleNode.media = "screen";
                    document.getElementsByTagName("head")[0].appendChild(sheet.styleNode);
                }

                if (css!==false) {
                    var rules = document.createTextNode(css);
                    if (sheet.styleNode.styleSheet) {
                        sheet.styleNode.styleSheet.cssText = rules.nodeValue;
                    } else {
                        sheet.styleNode.innerHTML = "";
                        sheet.styleNode.appendChild(rules);
                    }
                }
            }
        } catch (e) {
            teacss.error(e);
        }
        teacss.updating = false;
    }
    return teacss;
})();