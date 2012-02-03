window.$ = teacss.jQuery;
steal('./fileManager/jquery/jquery.contextMenu.js')

.then('./fileManager/ui/Panel.js')
.then('./fileManager/ui/FilePanel.js')

.then('./fileManager/codemirror/lib/codemirror.js')
.then('./fileManager/codemirror/mode/css/css.js')
.then('./fileManager/codemirror/mode/javascript/javascript.js')
.then('./fileManager/codemirror/mode/php/php.js')
.then('./fileManager/codemirror/mode/xml/xml.js')
.then('./fileManager/codemirror/mode/clike/clike.js')
.then('./fileManager/codemirror/mode/teacss/teacss.js')

.then('./fileManager/codemirror/lib/codemirror.css')
.then('./fileManager/codemirror/theme/night.css')
.then('./fileManager/codemirror/theme/default.css')
.then('./fileManager/codemirror/mode/teacss/teacss.css')
.then('./fileManager/style/jquery.contextMenu.css')
.then('./fileManager/style/fileManager.css')
.then(function(){
    var $ = teacss.jQuery;
    teacss.ui.Control.extend("teacss.ui.FileManager",{},{
        init : function (options) {
            this._super(options);
            if (!options.path) {
                this.element = "Please set the File Manager backend path";
                return;
            }
            var me = this;
            $(function(){
                me.panel = new UI.FilePanel("fileManager","Test",me.options.path);
                me.panel.element.dialog({
                    resizable: false,
                    draggable: false,
                    autoOpen: false,
                    title: 'File manager',
                    create: function(event, ui){
                        $(this).parent().wrap('<div class="teacss-ui"/>');
                    }
                });
            })

            this.element = $("<div>").append(
                $("<button>")
                .html('Open file manager')
                .click(function(){
                    me.panel.element
                        .dialog("option",{
                            width: document.documentElement.clientWidth-10,
                            height: document.documentElement.clientHeight-10,
                            position: ['right','bottom']
                        })
                        .dialog("open");
                }),
                "<br>",
                $("<button>")
                .html('Export styles')
                .click(function(){
                    var data = [];
                    for (var i = 0; i < teacss.sheets.length;i++) {
                        var sheet = teacss.sheets[i];
                        var css = sheet.func();
                        var href = sheet.css;
                        if (href) data.push({href:href,css:css});
                    }
                    if (data.length)
                        $.ajax({
                            url: me.options.path+"?action=profile_export",
                            data: {data:data},
                            type: "POST",
                            success: function (data,status) {
                                if (data=="ok") {
                                    alert("Export OK")
                                } else {
                                    alert(data);
                                }
                            }
                        })
                })
            )
        }
    });

});