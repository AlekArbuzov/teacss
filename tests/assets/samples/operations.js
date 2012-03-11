tea.start('assets/tea/operations.tea',1);
tea.f("#operations", function(){
  tea.print("color: #110000 + #000011 + #001100"); // #111111
  tea.print("height: 10px / 2px + 6px - 1px * 2"); // 9px
  tea.print("width: 2 * 4 - 5em"); // 3em
  tea.f(".spacing", function(){
    tea.print("height: 10px / 2px+6px-1px*2");
    tea.print("width: 2  * 4-5em");
  });
  tea.print("substraction: 20 - 10 - 5 - 5"); // 0
  tea.print("division: 20 / 5 / 4"); // 1
});

tea.print("@x: 4");
tea.print("@y: 12em");

tea.f(".with-variables", function(){
  tea.print("height: "+(x)+" + "+(y)+""); // 16em
  tea.print("width: 12 + "+(y)+""); // 24em
  tea.print("size: 5cm - "+(x)+""); // 1cm
});

tea.f(".with-functions", function(){
  tea.print("color: rgb(200, 200, 200) / 2");
  tea.print("color: 2 * hsl(0, 50%, 50%)");
  tea.print("color: rgb(10, 10, 10) + hsl(0, 50%, 50%)");
});

tea.print("@z: -2");

tea.f(".negative", function(){
  tea.print("height: 2px + "+(z)+""); // 0px
  tea.print("width: 2px - "+(z)+""); // 4px
});

tea.f(".shorthands", function(){
  tea.print("padding: -1px 2px 0 -4px"); //
});

tea.f(".rem-dimensions", function(){
  tea.print("font-size: 20rem / 5 + 1.5rem"); // 5.5rem
});

tea.f(".colors", function(){
  tea.print("color: #123"); // #112233
  tea.print("border-color: #234 + #111111"); // #334455
  tea.print("background-color: #222222 - #fff"); // #000000
  tea.f(".other", function(){
    tea.print("color: 2 * #111"); // #222222
    tea.print("border-color: #333333 / 3 + #111"); // #222222
  });
});

tea.f(".negations", function(){
    tea.print("@teavar: 4px");
    tea.print("variable: -"+(teavar)+""); // 4
    tea.print("variable1: -"+(teavar)+" + "+(teavar)+""); // 0
    tea.print("variable2: "+(teavar)+" + -"+(teavar)+""); // 0
    tea.print("variable3: "+(teavar)+" - -"+(teavar)+""); // 8
    tea.print("variable4: -"+(teavar)+" - -"+(teavar)+""); // 0
    tea.print("paren: -("+(teavar)+")"); // -4px
    tea.print("paren2: -(2 + 2) * -"+(teavar)+""); // 16
});

tea.finish();