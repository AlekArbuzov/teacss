tea.start('from_less/samples/cases/scope.tea',1);
var x = "blue";
var z = "transparent";
var mix = "none";

mixin = tea.f(function(){
  mix = "#989";
});

tea.f(".tiny-scope", function(){
  tea.print("color: "+(mix)+""); // none
  mixin();
  tea.print("color: "+(mix)+""); //#989
});

tea.f(".scope1", function(){
  var y = "orange";
  z = "black";
  tea.print("color: "+(x)+""); // blue
  tea.print("border-color: "+(z)+""); // black
  hidden = tea.f(function(){
    x = "#131313";
  });
  tea.f(".scope2", function(){
    y = "red";
    tea.print("color: "+(x)+""); // blue
    tea.f(".scope3", function(){
      var local = "white";
      tea.print("color: "+(y)+""); // red
      tea.print("border-color: "+(z)+""); // black
      tea.print("background-color: "+(local)+""); // white
    });
  });
});

tea.finish();