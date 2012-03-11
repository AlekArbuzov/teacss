tea.start('assets/tea/scope.tea',1);
tea.print("@x: blue");
tea.print("@z: transparent");
tea.print("@mix: none");

tea.f(".mixin", function(){
  tea.print("@mix: #989");
});

tea.f(".tiny-scope", function(){
  tea.print("color: "+(mix)+""); // #989
  tea.print(".mixin");
});

tea.f(".scope1", function(){
  tea.print("@y: orange");
  tea.print("@z: black");
  tea.print("color: "+(x)+""); // blue
  tea.print("border-color: "+(z)+""); // black
  tea.f(".hidden", function(){
    tea.print("@x: #131313");
  });
  tea.f(".scope2", function(){
    tea.print("@y: red");
    tea.print("color: "+(x)+""); // blue
    tea.f(".scope3", function(){
      tea.print("@local: white");
      tea.print("color: "+(y)+""); // red
      tea.print("border-color: "+(z)+""); // black
      tea.print("background-color: "+(local)+""); // white
    });
  });
});

tea.finish();