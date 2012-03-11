tea.start('assets/tea/lazy-eval.tea',1);
tea.print("@teavar: "+(a)+"");
tea.print("@a: 100%");

tea.f(".lazy-eval", function(){
  tea.print("width: "+(teavar)+"");
});

tea.finish();