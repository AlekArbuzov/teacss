teacss.jQuery.Class.extend("UI.Panel",{},{
    init : function(id,label){
        this.element = teacss.jQuery("<div>").css({
        }).append(
            this.leftPanel = teacss.jQuery("<div>").addClass("left-panel").css({
                width: 220,
                float: "left",
                position: "relative",
                height: "100% !important",
                "z-index" : 9999,
                "border-right": "2px solid #93C3CD",
                'padding-right':'1em'
            }),
            this.rightPanel = teacss.jQuery("<div>").css({
                height: "100%",
                overflow: "hidden",
                position: "relative"
            })
        );
        this.leftPanel.resizable({
            handles: 'e',
            minWidth: 180,
            maxWidth: 600,
            start: function(event, ui) {
                var o = teacss.jQuery(this).data('resizable').options;
                teacss.jQuery("iframe").each(function() {
                    teacss.jQuery('<div class="ui-resizable-iframeFix" style="background: #fff;"></div>')
                    .css({
                        left:0,right:0,top:0,bottom:0,
                        position: "absolute", opacity: "0.001", zIndex: 1000
                    })
                    .appendTo("body");
                });
            },
            stop: function(event, ui) {
                teacss.jQuery("div.ui-resizable-iframeFix").each(function() { this.parentNode.removeChild(this); });
            }
        });
    }
})