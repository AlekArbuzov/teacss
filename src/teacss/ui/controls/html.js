teacss.ui.html = teacss.ui.Html = teacss.ui.HTML = teacss.ui.Control.extend("teacss.ui.Html",{},{
    init : function(options) {
        this._super($$.extend({html:""},options));
        this.element = $$(this.options.html);
    }
});