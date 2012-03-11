tea.start('assets/tea/parens.tea',1);
tea.f(".parens", function(){
  tea.print("@teavar: 1px");
  tea.print("border: ("+(teavar)+" * 2) solid black");
  tea.print("margin: ("+(teavar)+" * 1) ("+(teavar)+" + 2) (4 * 4) 3");
  tea.print("width: (6 * 6)");
  tea.print("padding: 2px (6px * 6px)");
});

tea.f(".more-parens", function(){
  tea.print("@teavar: (2 * 2)");
  tea.print("padding: (2 * "+(teavar)+") 4 4 ("+(teavar)+" * 1px)");
  tea.print("width: ("+(teavar)+" * "+(teavar)+") * 6");
  tea.print("height: (7 * 7) + (8 * 8)");
  tea.print("margin: 4 * (5 + 5) / 2 - ("+(teavar)+" * 2)");
  //margin: (6 * 6)px;
});

tea.f(".nested-parens", function(){
  tea.print("width: 2 * (4 * (2 + (1 + 6))) - 1");
  tea.print("height: ((2+3)*(2+3) / (9-4)) + 1");
});

tea.f(".mixed-units", function(){
  tea.print("margin: 2px 4em 1 5pc");
  tea.print("padding: (2px + 4px) 1em 2px 2");
});

tea.finish();