teacss = (function () {
    var teacss = {
        functions: {},
        sheets: [],
        parsers: {},
        aliases: {}
    };

    var files = {};
    var parseLine = 0;

    function trim(text) {
        var rtrim = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;
		return (text || "").replace( rtrim, "" );
	}
    teacss.trim = trim;

    teacss.getFile = function(url) {
        if (typeof require!='undefined') {
            return require('fs').readFileSync(url,'ascii');
        } else {
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
    }

    teacss.getFullPath = function(path,base) {
        if (typeof require!='undefined') {
            var m_path = require('path');
            path = m_path.relative(".",m_path.resolve(m_path.dirname(base),path));
        } else {
            if (!(path[0]=='/' ||
                path.indexOf("http://")==0 ||
                path.indexOf("https://")==0))
            {
                var last = base.lastIndexOf("/");
                base = (last==-1) ? "" : base.substring(0,last);
                path = base+"/"+path;
            }
        }
        if (path.indexOf(".js")==-1 && path.indexOf(".tea")==-1 && path.indexOf(".css")==-1) path += ".tea";
        return path;
    }

    teacss.parseFile = function (path,return_hash) {
        if (!files[path]) {
            var data = teacss.getFile(path);
            if (data) {
                files[path] = {tea:data,js:'',imports:[],counter:0,line:0,lineCount:0,appends:[]};
                var startLine = parseLine;
                files[path].js = this.parse(data, path);
                files[path].lineCount = parseLine - startLine + 1;
            } else {
                return false;
            }
        }
        return return_hash ? files[path] : files[path].js;
    };

    teacss.parse = function(code,path) {
        var ext = path.split(".").pop();
        if (teacss.parsers[ext]) return teacss.parsers[ext](code,path);

        var js_file = /\.js$/.test(path);
        var stack = [],state,state_data;
        var me = this;

        var N = code.length,s = 0,l;
        var output = "";
        var errors = [];
        output = "tea.start('"+path.replace(/\\/g,"\\\\")+"',"+parseLine+");\n" + output;
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
                    if (code[s+1]==' ') {
                        s+=2;
                        push_state('js_line'); continue;
                    }
                    if (code[s+1]=='{') {
                        output += '{';
                        s+=2;
                        push_state('js',{brackets:1}); continue;
                    }
                    if (code.substring(s,s+7)=='@import') {
                        s+=7;
                        push_state('import'); continue;
                    }
                    if (code.substring(s,s+7)=='@append') {
                        s+=7;
                        push_state('append'); continue;
                    }
                    push_state('namespace'); continue;
                }
                if (code[s]=='}') {
                    if (stack.length>=2 && stack[stack.length-2].state=='js')
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
            if (state=='import' || state=='append') {
                output += '/* @'+state;
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
                importName = teacss.getFullPath(importName,path);
                if (state=="import") {
                    var parsed = this.parseFile(importName,true);
                    if (parsed!==false) {
                        files[path].appends = files[path].appends.concat(parsed.appends);
                        parsed = parsed.js;
                    }
                // state=="append"
                } else {
                    var parsed = "";
                    files[path].appends.push(importName);
                    if (importName.split(".").pop()=="js")
                        teacss.appendScript(importName);
                    else if (importName.split(".").pop()=="css")
                        teacss.appendStyle(importName);
                }
                if (code[s]!=';') error('; expected');
                output+= ';*/\n'; next(); parseLine++;

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
                var rule = "";
                var raw = "";
                if (state=='namespace') rule += next();
                while (s<N) {
                    if (code[s]=='}') break;
                    if (code[s]=='{') break;
                    if (code[s]==';') break;
                    if (code[s]=='@') {
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
                        var trail = "";
                        next();
                        while (s<N && blank(code[s])) {
                            trail += next();
                        }

                        if (code[s]=='}' || code[s]=='{')
                            rule += '\n'+trail+'';
                        else
                            rule += '"+\n'+trail+'"';
                        raw += '\n'+trail;
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

                var mixin_declare_regex = /^\.([0-9a-zA-Z_$\.]*?)(<([0-9a-zA-Z_-]+?)>)?(\(.*?\))$/;
                var mixin_execute_regex = /^\.[0-9a-zA-Z_$\.]*?\(.*?\)$/;

                if (code[s]=='{') {
                    var match;
                    if (match = mixin_declare_regex.exec(raw)) {
                        var params = match[4];
                        var name = match[1];
                        if (match[3]) teacss.aliases[match[3]] = name;
                        output += name + postfix + '= tea.f(function'+params+'{';
                    } else {
                        if (state=='namespace')
                            output += 'tea.namespace("'+rule+'",'+postfix+'function(){';
                        else
                            output += 'tea.f("'+rule+'",'+postfix+'function(){';
                    }
                    next();
                    pop_state();
                    push_state("css");

                } else if (code[s]==';' || code[s]=='}') {
                    if (mixin_execute_regex.test(raw)) {
                        output += raw.substring(1)+';'+postfix;
                    } else {
                        var is_alias = false;
                        if (rule[0]!='!') {
                            for (var alias in teacss.aliases) {
                                if (raw.substring(0,alias.length)==alias) {
                                    var reg = new RegExp(alias+"(\\s)*?(:(.*))?","m");
                                    var match;
                                    if (match = reg.exec(rule)) {
                                        is_alias = true;
                                        if (match[3]) {
                                            var args = '"'+trim(match[3])+'"';
                                            args = args.replace(/(\+)?\"\"(\+)?/g,"");
                                            output += teacss.aliases[alias]+'('+args+');'+postfix;
                                        } else {
                                            output += teacss.aliases[alias]+'();'+postfix;
                                        }
                                    }
                                }
                            }
                        } else {
                            rule = rule.substring(1);
                        }
                        if (!is_alias) output += 'tea.print("'+rule+'");'+postfix;
                    }
                    if (code[s]==';') next();
                    pop_state();
                } else {
                    error("; { or } expected");
                }
            }
        }
        if (js_file) {
            if (stack.length!=1 || state!='js') error("Unexpected end of js file");
        } else {
            if (stack.length!=1 || state!='css') error("Unexpected end of tea file");
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
                this.fullSelector = this.selector;
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
                    this.fullSelector = parts.join(", ");
                }
                return this.fullSelector;
            }
            this.getOutput = function () {
                if (!this.code.length) return "";
                var output = "";
                var selector = this.getSelector();
                if (selector) output += this.indent+selector + " {\n";
                for (var i=0;i<this.code.length;i++)
                    output += this.indent+"    "+this.code[i]+";\n";
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
                var dir = path.replace(/\\/g,"/").split('/');dir.pop();dir = dir.join("/")+'/';
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
        tea.print = function(s) {if (tea.current) tea.current.print(s);}
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
        if (typeof document=='undefined') return [];
        var links = document.getElementsByTagName('link');
        for (var i = 0; i < links.length; i++) {
            var tea = links[i].getAttribute('tea');
            if (tea) {
                sheets.push({
                    src:tea,
                    css:links[i].getAttribute('href'),
                    linkNode:links[i],
                    styleNode:false,
                    scriptNode:false,
                    variableLines: 0
                });
            }
        }
        return sheets;
    }();

    teacss.updating = false;
    teacss.error = function (e) {
        if (e.name=='runtime' || e.name=='parse') {
            console.debug(e);
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
                                var ln = error.line + l - 1;
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
    teacss.appendStyle = function(href,css) {
        css = css || "";
        if (href) {
            var styleNode = document.createElement("link");
            styleNode.type = "text/css";
            styleNode.rel = "stylesheet";
            styleNode.href = href;
            document.getElementsByTagName("head")[0].appendChild(styleNode);
        } else {
            var styleNode = document.createElement("style");
            styleNode.type = "text/css";
            styleNode.rel = "stylesheet";
            document.getElementsByTagName("head")[0].appendChild(styleNode);

            var rules = document.createTextNode(css);
            if (styleNode.styleSheet) {
                styleNode.styleSheet.cssText = rules.nodeValue;
            } else {
                styleNode.innerHTML = "";
                styleNode.appendChild(rules);
            }
        }
        return styleNode;
    }
    teacss.appendScript = function(href,js) {
        js = js || "";
        var scriptNode = document.createElement("script");
        scriptNode.type = 'text/javascript';
        if (href) {
            var src = href;
            var js = teacss.getFile(src);
            //scriptNode.src = src;
            scriptNode.text = js || "";
        } else {
            scriptNode.text = js || "";
        }
        document.getElementsByTagName("head")[0].appendChild(scriptNode);
        return scriptNode;
    }

    teacss.parseSheet = function (src,sheet) {
        var code = "teacss.getSheetFunction(function() {\n";
        parseLine = 1;
        var parsed = teacss.parseFile(src);
        var variableLines = 0;
        for (var name in teacss.functions) {
            code += "var "+name+" = teacss.functions."+name+";\n";
            variableLines++;
        }
        code += parsed;
        code += "\n})";

        if (sheet) {
            sheet.variableLines = variableLines;
            return code;
        } else {
            return eval(code);
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
                    var code = "var teacss_sheet_"+i+" = "+teacss.parseSheet(sheet.src,sheet);
                    sheet.scriptNode = teacss.appendScript(false,code);
                }
                try {
                    var css = window['teacss_sheet_'+i](sheet);
                    sheet.style = css;
                }
                catch (e) {
                    var lineNumber = e.lineNumber;
                    if (Boolean(window.chrome)) {
                        lineNumber = /\:([0-9]{1,100})\:[0-9]{1,100}/.exec(e.stack)[1] - 1;
                    }

                    var min_line = 10000000;
                    var min_path = false;
                    for (var path in files) {
                        var file = files[path];
                        var line = (lineNumber - 1) - file.line - sheet.variableLines;
                        if (line>=0 && line<min_line) {
                            min_path = path;
                            min_line = line;
                        }
                    }
                    file = files[min_path];
                    if (this.debugRuntime && file) {
                        throw {
                            name: 'runtime',
                            errors: [{
                                message: e.message,
                                source: file.tea,
                                js: file.js,
                                line: (lineNumber - 1) - file.line - sheet.variableLines,
                                path: min_path
                            }],
                            innerException: e
                        }
                    } else
                        throw e;
                }

                if (!sheet.styleNode) {
                    if (css!==false) sheet.styleNode = teacss.appendStyle(false,css||"");
                } else {
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
            }
        } catch (e) {
            teacss.error(e);
        }
        teacss.updating = false;
    }
    return teacss;
})();