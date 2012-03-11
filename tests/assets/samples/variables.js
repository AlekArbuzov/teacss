tea.start('assets/tea/variables.tea',1);
tea.print("@a: 2");
tea.print("@x: "+(a)+" * "+(a)+"");
tea.print("@y: "+(x)+" + 1");
tea.print("@z: "+(x)+" * 2 + "+(y)+"");

tea.f(".variables", function(){
  tea.print("width: "+(z)+" + 1cm"); // 14cm
});

tea.print("@b: "+(a)+" * 10");
tea.print("@c: #888");

tea.print("@fonts: \"Trebuchet MS\", Verdana, sans-serif");
tea.print("@f: "+(fonts)+"");

tea.print("@quotes: \"~\" \"~\"");
tea.print("@q: "+(quotes)+"");

tea.f(".variables", function(){
  tea.print("height: "+(b)+" + "+(x)+" + 0px"); // 24px
  tea.print("color: "+(c)+"");
  tea.print("font-family: "+(f)+"");
  tea.print("quotes: "+(q)+"");
});

tea.f(".redefinition", function(){
    tea.print("@teavar: 4");
    tea.print("@teavar: 2");
    tea.print("@teavar: 3");
    tea.print("three: "+(teavar)+"");
});

tea.f(".values", function(){
    tea.print("@a: 'Trebuchet'");
    tea.print("@multi: 'A', B, C");
    tea.print("font-family: "+(a)+", "+(a)+", "+(a)+"");
    tea.print("color: "+(c)+" !important");
    tea.print("url: url("+(a)+")");
    tea.print("multi: something "+(multi)+", "+(a)+"");
});

tea.f(".variable-names", function(){
    tea.print("@teavar: 'hello'");
    tea.print("@name: 'var'");
    tea.print("name: "+(name)+"");
});
tea.f(".alpha", function(){
    tea.print("@teavar: 42");
    tea.print("filter: alpha(opacity="+(teavar)+")");
});

tea.f("a:nth-child("+(a)+")", function(){
    tea.print("border: 1px");
});

tea.finish();