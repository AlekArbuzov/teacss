teacss.buildButton = function (options) {
    return teacss.ui.button($.extend({label:'Export',click:function(){
        var dst = this.options.dst;
        var src = this.options.src;
        var url = this.options.url;
        if (!dst || !src) alert('No src or dst');
        teacss.build(src,dst,function(result){
            $.ajax({
                type: "POST",
                url: url,
                data: {
                    data: [{
                        href: dst,
                        css: result.js
                    }]
                },
                complete: function (data) {
                    console.debug(data);
                    alert(data.responseText);
                }
            })
        })
    }},options))
}
