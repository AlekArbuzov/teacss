UI.Panel.extend("UI.FilePanel",{},{
    init: function(id,label,ajax_url) {
        this._super(id,label);
        this.ajax_url = ajax_url;
        this.path = '';
        this.mode = 'css';
        this.leftPanel.addClass("files");
        this.editPanel = teacss.jQuery("<div>").css({
            position:"absolute",
            left:0,right:0,top:0,bottom:0,
            background:'#fffffe',
            "font-size":"18px"
        }).attr({id:this.path+"_code"}).appendTo(this.rightPanel);


        if (teacss.jQuery("#fileMenu").length==0) {
            this.fileMenu = teacss.jQuery("<ul id='fileMenu'>").append(
                "<li class='delete'><a href='#delete'>Delete</a></li>"
            ).css("display","none");
            this.folderMenu = teacss.jQuery("<ul id='folderMenu'>").append(
                "<li class='createFile'><a href='#createFile'>Create file</a></li>",
                "<li class='createFolder'><a href='#createFolder'>Create folder</a></li>",
                "<li class='delete'><a href='#delete'>Delete</a></li>"
            ).css("display","none");

            teacss.jQuery("body").append(this.fileMenu,this.folderMenu);
        }
        this.refresh();
    },
    refresh: function() {
        this.fileData = {};
        this.fileItems = {};
        this.currentFile = this.currentFile || false;
        this.foldings = this.foldings || {};

        var me = this;
        teacss.jQuery.ajax({
            url:this.ajax_url+"?action=files&path="+this.path,
            success: function(data,status) {
                data = eval("("+data+")");
                if (me.filesPanel) me.filesPanel.remove();
                me.filesPanel = teacss.jQuery("<div>").addClass("ui-accordion-icons").appendTo(me.leftPanel);
                me.fillFiles(me.filesPanel,{children:[data]},true);
                if (me.currentFile) {
                    if (me.fileItems[me.currentFile])
                        me.fileItems[me.currentFile].addClass("ui-state-active");
                }
            }
        })
    },
    fillFiles: function(parent,data_parent,active) {
        var list = data_parent.children;
        for (var i=0;i<list.length;i++) {
            var item = list[i];
            item.parent = data_parent;
            var label = item.name.split("/").pop();
            label = label || 'root';
            var item_div = teacss.jQuery("<div>").addClass(item.type).addClass("ui-accordion").appendTo(parent);

            if (item.type=="folder") {
                var inner_div,inner_header;
                item_div.append(
                    inner_header = teacss.jQuery("<h3>").append(
                            "<a href='#'>"+label+"</a>"
                    ).contextMenu({menu:"folderMenu"},
                        function (file,me) {
                            return teacss.jQuery.proxy(function(action,el) {
                                if (action=='createFile') this.createFile(file);
                                if (action=='createFolder') this.createFolder(file);
                                if (action=='delete') this.deleteFolder(file);
                            },me);
                        }(item.name,this)
                    ),
                    inner_div = teacss.jQuery("<div>").css({padding:5}).addClass(item.type)
                );
                this.fillFiles(inner_div,item);
                item_div.accordion({
                    autoHeight:false,
                    collapsible:true,
                    active: active ? 0 : (this.foldings[item.name] ? 0 : false),
                    icons: {
                        header: "ui-icon-folder-collapsed",
			            headerSelected: "ui-icon-folder-open"
                    },
                    changestart: function(item,me) {
                        return function() {
                            me.foldings[item.name] = me.foldings[item.name] ? false:true;
                        }
                    }(item,this)
                });
            } else {
                var fileItem = teacss.jQuery("<h3>")
                    .addClass("ui-widget-header ui-state-default ui-accordion-header ui-helper-reset")
                    .append(
                        teacss.jQuery("<span>").addClass("ui-icon").addClass("ui-icon-document-b"),
                        teacss.jQuery("<a href='#'>").html(label).click(teacss.jQuery.proxy(this.selectFile,this)).data("file",item.name),
                        teacss.jQuery("<span>").addClass("ui-icon ui-icon-check save")
                                   .data("file",item.name).click(teacss.jQuery.proxy(this.saveFile,this))
                    )
                    .contextMenu({menu:"fileMenu"},
                        function (file,me) {
                            return teacss.jQuery.proxy(function(action,el) {
                                if (action=='delete') this.deleteFile(file);
                            },me);
                        }(item.name,this)
                    )
                    .appendTo(item_div);

                fileItem.data = item;
                this.fileItems[item.name] = fileItem;
            }
        }
    },
    createEditor: function(data) {
        var me = this;
        me.editPanel.html("");

        var parts = me.currentFile.split(".");
        var ext = parts[parts.length-1];

        var mode = undefined;
        if (ext=='css') mode = 'css';
        if (ext=='tea') mode = 'teacss';
        if (ext=='php') mode = 'php';
        if (ext=='js')  mode = 'javascript';
        if (ext=='haml') mode = 'css';

        this.editor = CodeMirror(me.editPanel[0],{
            value:data,
            lineNumbers:true,
            mode: mode,
            onChange:teacss.jQuery.proxy(this.editorChange,this),
            tabMode:"shift",
            indentUnit:2,
            theme:'default'
        });
        teacss.jQuery(window).keypress(function(event){
            if (teacss.jQuery(me.editPanel.children()[0]).hasClass('CodeMirror-focused')) {
                if (!(event.which == 115 && event.ctrlKey) && !(event.which == 19)) return true;
                event.preventDefault();
                if (me.fileData[me.currentFile].changed)
                    me.saveFile(false,me.currentFile);
                return false;
            }
            return true;
        });
        return this.editor;
    },
    setEditorValue : function (data) {
        this.editor.setValue(data);
    },
    selectFile: function(e) {
        e.preventDefault();
        teacss.jQuery(e.target).parents(".left-panel").find(".file h3").removeClass("ui-state-active").addClass("ui-state-default");
        teacss.jQuery(e.target).parent().addClass("ui-state-active");

        var file = teacss.jQuery(e.target).data("file");
        var me = this;
        if (!this.fileData[file])
        {
            teacss.jQuery.ajax({
                cache: false,
                url: this.ajax_url+"?action=files",
                data: {path:file},
                type: "POST",
                success: function(data,status) {
                    me.currentFile = file;

                    var parts = me.currentFile.split(".");
                    var ext = parts[parts.length-1];

                    if (ext=='png' || ext=='jpg' || ext=='jpeg' || ext=='gif') {

                        me.editPanel.html("");
                        me.editPanel.append(teacss.jQuery("<img>").attr("src",me.fileItems[file].data.url));

                    } else {
                        me.createEditor(data);
                        me.fileData[me.currentFile] = {text:data,changed:false};
                    }
                }
            })
        } else {
            me.currentFile = file;
            me.createEditor(this.fileData[file].text);
        }
    },
    saveFile: function(e,ex_file) {
        var file = ex_file || teacss.jQuery(e.target).data("file");
        var me = this;
        teacss.jQuery.ajax({
            url: this.ajax_url+"?action=files",
            data: {path:file,text:me.fileData[file].text},
            type: "POST",
            success: function (data,status) {
                if (data=="ok") {
                    me.fileData[file].changed = false;
                    me.fileItems[file].removeClass("changed");
                    if (me.callback) me.callback();
                } else {
                    alert(data);
                }
            }
        })
    },
    createFile : function (folder) {
        var file,me=this;
        if (file = prompt('Enter filename')) {
            teacss.jQuery.ajax({
                url: this.ajax_url+"?action=files",
                data: {path:folder,newFile:file},
                type: "POST",
                success: function (data,status) {
                    if (data=="ok") {
                        me.foldings[folder] = true;
                        me.refresh();
                    } else {
                        alert(data);
                    }
                }
            })
        }
    },
    createFolder : function (folder) {
        var newFolder,me=this;
        if (newFolder = prompt('Enter filename')) {
            teacss.jQuery.ajax({
                url: this.ajax_url+"?action=files",
                data: {path:folder,newFolder:newFolder},
                type: "POST",
                success: function (data,status) {
                    if (data=="ok") {
                        me.foldings[folder] = true;
                        me.refresh();
                    } else {
                        alert(data);
                    }
                }
            })
        }
    },
    deleteFile : function (file) {
        var me = this;
        if (confirm('Sure to delete '+file+"?")) {
            teacss.jQuery.ajax({
                url: this.ajax_url+"?action=files",
                data: {path:file,'delete':true},
                type: "POST",
                success: function (data,status) {
                    if (data=="ok") {
                        if (me.currentFile==file) {
                            me.currentFile = false;
                            me.editPanel.html("");
                        }
                        me.refresh();
                    } else {
                        alert(data);
                    }
                }
            })
        }
    },
    deleteFolder : function (folder) {
        var me = this;
        if (confirm('Sure to delete '+folder+"?")) {
            teacss.jQuery.ajax({
                url: this.ajax_url+"?action=files",
                data: {path:folder,'delete':true},
                type: "POST",
                success: function (data,status) {
                    if (data=="ok") {
                        if (me.currentFile && me.fileItems[me.currentFile]) {
                            var data = me.fileItems[me.currentFile].data;
                            var wasParent = false;
                            var current = data.parent;
                            while (current) {
                                if (current.name==folder) {
                                    wasParent = true;
                                    break;
                                }
                                current = current.parent;
                            }
                            if (wasParent) {
                                me.currentFile = false;
                                me.editPanel.html("");
                            }
                        }
                        me.refresh();
                    } else {
                        alert(data);
                    }
                }
            })
        }
    },
    editorChange: function() {
        data = this.editor.getValue();
        if (this.editor.historySize().undo) {
            this.fileData[this.currentFile] = {text:data,changed:true}
            this.fileItems[this.currentFile].addClass("changed");
        } else {
            this.fileData[this.currentFile] = {text:data,changed:false}
            this.fileItems[this.currentFile].removeClass("changed");
        }
    }
});