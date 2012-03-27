tea.start('from_less/samples/cases/functions.tea',1);
tea.f("#functions", function(){
  {var teavar = 10}
  tea.print("color: "+(color("beige"))+""); //#f5f5dc
  tea.print("width: "+(++teavar)+"");
  tea.print("border-width: "+(2 + 3)+"");
});

tea.f("#built-in", function(){
  var r = 32
  tea.print("lighten: "+(lighten("#ff0000", 40))+"");
  tea.print("darken: "+(darken("#ff0000", 40))+"");
  tea.print("saturate: "+(saturate("#29332f", 20))+"");
  tea.print("desaturate: "+(desaturate("#203c31", 20))+"");
  tea.print("greyscale: "+(greyscale("#203c31"))+"");
  tea.print("spin-p: "+(spin(hsl(340, 50, 50), 40))+"");
  tea.print("spin-n: "+(spin(hsl(30, 50, 50), -40))+"");

  tea.print("hue: "+(hue(hsl(98, 12, 95)))+"");
  tea.print("saturation: "+(saturation(hsl(98, 12, 95)))+"");
  tea.print("lightness: "+(lightness(hsl(98, 12, 95)))+"");
  tea.print("rounded: "+(Math.round(r/3))+"");
  tea.print("roundedpx: "+(Math.round(10 / 3))+"px");
  tea.print("color: "+(color("#ff0011"))+"");

  tea.f(".is-a", function(){
    tea.print("color: "+(color("#ddd") instanceof teacss.Color)+"");
    tea.print("color: "+(color('red') instanceof teacss.Color)+"");
    tea.print("color: "+(rgb(0, 0, 0) instanceof teacss.Color)+"");
    tea.print("number: "+((parseFloat("32") != NaN))+"");
  });
});

tea.finish();