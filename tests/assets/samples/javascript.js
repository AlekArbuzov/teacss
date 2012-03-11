tea.start('assets/tea/javascript.tea',1);
tea.f(".eval", function(){
    tea.print("js: `42`");
    tea.print("js: `1 + 1`");
    tea.print("js: `\"hello world\"`");
    tea.print("js: `[1, 2, 3]`");
    tea.print("title: `process.title`");
    tea.print("ternary: `(1 + 1 == 2 ? true : false)`");
});
tea.f(".scope", function(){
    tea.print("@foo: 42");
    tea.print("var: `this.foo.toJS()`");
    tea.print("escaped: ~`2 + 5 + 'px'`");
});
tea.f(".vars", function(){
    tea.print("@teavar: `4 + 4`");
    tea.print("width: "+(teavar)+"");
});
tea.f(".escape-interpol", function(){
    tea.print("@world: \"world\"");
    tea.print("width: ~`\"hello\" + \" \" + "+(world)+"`");
});
tea.f(".arrays", function(){
    tea.print("@ary:  1, 2, 3");
    tea.print("@ary2: 1  2  3");
    tea.print("ary: `"+(ary)+".join(', ')`");
    tea.print("ary: `"+(ary2)+".join(', ')`");
});

tea.finish();