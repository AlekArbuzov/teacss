(function(){
    var $ = teacss.jQuery;
    teacss.ui.fileManager = teacss.ui.FileManager = teacss.ui.Control.extend("teacss.ui.FileManager",{},{
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
                    open: function () {
                        $(this).parent().appendTo("#teacss-ui");
                    }
                });
            })

            this.element = $("<div>").append(
                $("<button>")
                    .html('Open file manager')
                    .click(function(){
                        me.panel.element
                            .dialog("open")
                            .dialog("option",{
                                width: document.documentElement.clientWidth-10,
                                height: document.documentElement.clientHeight-10,
                                position: [0,0]
                            })
                    }),
                " ",
                $("<button>")
                    .html('Export styles')
                    .click(function(){
                        var data = [];
                        for (var i = 0; i < teacss.sheets.length;i++) {
                            var sheet = teacss.sheets[i];
                            var target = sheet.target;
                            if (target) data.push({href:target,css:sheet.style});
                        }
                        if (data.length) {
                            $.ajax({
                                url: me.options.path+"?action=profile_export",
                                data: {data:data},
                                type: "POST",
                                error:function(xhr,status) {
                                    alert("AJAX Error: "+xhr.status);
                                },
                                success: function (data,status) {
                                    if (data=="ok") {
                                        alert("Export OK")
                                    } else {
                                        alert(data);
                                    }
                                }
                            })
                        } else {
                            alert('No targets to save');
                        }
                    })
            )
        }
    });
})();
