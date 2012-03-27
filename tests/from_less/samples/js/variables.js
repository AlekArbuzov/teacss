tea.start('from_less/samples/cases/variables.tea',1);
{
    var a = 2;
    var x = a * a;
    var y = x + 1;
    var z = x * 2 + y;
}

tea.f(".variables", function(){
  tea.print("width: "+(z + 1)+"cm"); // 14cm
});

{
    var b = a * 10;
    var c = "#888";
    var fonts = "\"Trebuchet MS\", Verdana, sans-serif";
    var f = fonts;
    var quotes = "\"~\" " + "\"~\"";
}

tea.f(".variables", function(){
  tea.print("height: "+(b + x + 0)+"px"); // 24px
  tea.print("color: "+(c)+"");
  tea.print("font-family: "+(f)+"");
  tea.print("quotes: "+(quotes)+"");
});

tea.f(".redefinition", function(){
    {
        var teavar = 4;
        teavar = 3;
        var three = teavar;
    }

    tea.print("three: "+(teavar)+"");
});

tea.f(".values", function(){
    {
        var a = "'Trebuchet'",
        multi = "\"A\", B, C";
    }tea.print("");
    tea.print("font-family: "+(a)+", "+(a)+", "+(a)+"");
    tea.print("url: url("+(a)+")");
    tea.print("multi: something "+(multi)+", "+(a)+"");
});

tea.f(".variable-names", function(){
    teavar = "\"hello\"";
    tea.print("name: "+(teavar)+"");
});
tea.f(".alpha", function(){
    teavar = 42;
    tea.print("filter: alpha(opacity="+(teavar)+")");
});

tea.f("a:nth-child("+(a)+")", function(){
    tea.print("border: 1px");
});

tea.finish();