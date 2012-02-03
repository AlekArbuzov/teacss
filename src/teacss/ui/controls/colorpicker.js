teacss.ui.colorPicker = teacss.ui.Colorpicker = teacss.ui.Control.extend("teacss.ui.Colorpicker",{},{
    setValue: function (value) {
        if (this.form && teacss.ui) value = teacss.ui.ref(this.form.value,value);
        this.value = value || 'white';
        if (this.colorDiv) {
            var col = teacss.Color.parse(this.value);
            var alpha = col.alpha;
            col.alpha = 1;
            var hex = col.toString();
            this.colorDiv.css({background:hex,opacity:alpha});
            $$(this.colorDiv).ColorPickerSetColor(hex.replace("#",""),alpha);
        }
    },
    init : function(options) {
        var me = this;
        this._super(options);
        this.value = this.options.value || 'white';

        this.element = $$("<div>")
            .addClass("color_control")
            .css({display:'inline-block','text-align':'center', 'vertical-align':'middle',
                  width:this.options.width,height:this.options.height,margin:this.options.margin})
            .append(
                me.colorDiv = $$("<div>")
                .css({width:'100%',height:'100%',background:me.value})
            );

        $$(function(){
            me.colorDiv.ColorPicker({
                eventName: 'mousedown',
                onBeforeShow: function () {
                    me.setValue(me.value);
                },
                onChange: function (hsb, hex, rgb, alpha) {
                    el = $$(this).data("colorpicker").el;
                    var color = teacss.Color.functions.rgba(rgb.r,rgb.g,rgb.b,alpha);
                    var s_color = color.toString();
                    $$(el).css("background",s_color);
                    $$(el).css("color",teacss.Color.functions.hsl(0,100,color.toHSL().l>0.5?0:1).toString());

                    me.value = s_color;
                    me.change();                }
            })
            $$('#' + $$(me.colorDiv).data('colorpickerId')).mousedown(function(e){
                e.stopPropagation();
                return false;
            })
        })
    }
})