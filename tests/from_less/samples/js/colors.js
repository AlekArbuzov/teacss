tea.start('from_less/samples/cases/colors.tea',1);
// this block should be left un-touched
tea.f("#yelow", function(){
  tea.f("#short", function(){
    tea.print("color: #fea");
  });
  tea.f("#long", function(){
    tea.print("color: #ffeeaa");
  });
  tea.f("#rgba", function(){
    tea.print("color: rgba(255, 238, 170, 0.1)");
  });
  tea.f("#alpha #hsla", function(){
      tea.print("color: hsla(11, 20%, 20%, 0.6)");  //this is supported by CSS (3?)
  });
});

tea.f("#blue", function(){
  tea.f("#parse",function(){
    tea.print("color: "+(color(255, 170, 255))+"");
  });
  tea.f("#rgb", function(){
    tea.print("color: "+(rgb(0, 0, 255))+"");
  });
  tea.f("#rgba", function(){
    tea.print("color: "+(rgba(0, 0, 255, 0.1))+"");
  });
  tea.f("#argb", function(){
    tea.print("color: "+(argb(0.1, 0, 0, 255))+"");
  });
  tea.f("#hsl", function(){
    tea.print("color: "+(hsl(11, 20, 20))+"");
  });
  tea.f("#hsla", function(){
    tea.print("color: "+(hsla(11, 20, 20, 0.6))+"");
  });
});

tea.f("#overflow", function(){
  tea.f(".a", function(){ tea.print("color: "+(sub_colors(color('#111111'), color('#444444')))+""); }); // #000000
  tea.f(".b", function(){ tea.print("color: "+(add_colors(color('#eee'), color('#fff')))+""); }); // #ffffff
  tea.f(".d", function(){ tea.print("color: "+(add_colors(color('#00ee00'), color('#009900')))+""); }); // #00ff00
});

tea.f(".lightenblue", function(){
    tea.print("color: "+(lighten('blue', 10))+"");
});

tea.f(".darkenblue", function(){
    tea.print("color: "+(darken('blue', 10))+"");
});

tea.finish();