tea.start('from_less/samples/cases/media.tea',1);
teavar = 42;

var _media = "media";

tea.namespace("@"+("media")+" print", function(){
    tea.f(".class", function(){
        tea.print("color: blue");
        tea.f(".sub", function(){
            tea.print("width: "+(teavar)+"");
        });
    });
});

tea.namespace("@"+(_media)+" screen", function(){
    base = 8;
    tea.f("body", function(){ tea.print("max-width: "+(base * 60)+""); });
});

tea.finish();