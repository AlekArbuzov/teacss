tea.start('assets/tea/media.tea',1);

// For now, variables can't be declared inside @media blocks.

tea.print("@teavar: 42");

tea.namespace("@media print", function(){
    tea.f(".class", function(){
        tea.print("color: blue");
        tea.f(".sub", function(){
            tea.print("width: "+(teavar)+"");
        });
    });
    tea.f(".top, header > h1", function(){
        tea.print("color: #222 * 2");
    });
});

tea.namespace("@media screen", function(){
    tea.print("@base: 8");
    tea.f("body", function(){ tea.print("max-width: "+(base)+" * 60"); });
});

tea.namespace("@media all and (orientation:portrait)", function(){
    tea.f("aside", function(){ tea.print("float: none"); });
});

tea.namespace("@media handheld and (min-width: "+(teavar)+"), screen and (min-width: 20em)", function(){
    tea.f("body", function(){
        tea.print("max-width: 480px");
    });
});

tea.finish();