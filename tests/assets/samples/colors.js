tea.start('assets/tea/colors.tea',1);
tea.f("#yellow", function(){
  tea.f("#short", function(){
    tea.print("color: #fea");
  });
  tea.f("#long", function(){
    tea.print("color: #ffeeaa");
  });
  tea.f("#rgba", function(){
    tea.print("color: rgba(255, 238, 170, 0.1)");
  });
  tea.f("#argb", function(){
    tea.print("color: argb(rgba(255, 238, 170, 0.1))");
  });
});

tea.f("#blue", function(){
  tea.f("#short", function(){
    tea.print("color: #00f");
  });
  tea.f("#long", function(){
    tea.print("color: #0000ff");
  });
  tea.f("#rgba", function(){
    tea.print("color: rgba(0, 0, 255, 0.1)");
  });
  tea.f("#argb", function(){
    tea.print("color: argb(rgba(0, 0, 255, 0.1))");
  });
});

tea.f("#alpha #hsla", function(){
    tea.print("color: hsla(11, 20%, 20%, 0.6)");
});

tea.f("#overflow", function(){
  tea.f(".a", function(){ tea.print("color: #111111 - #444444"); }); // #000000
  tea.f(".b", function(){ tea.print("color: #eee + #fff"); }); // #ffffff
  tea.f(".c", function(){ tea.print("color: #aaa * 3"); }); // #ffffff
  tea.f(".d", function(){ tea.print("color: #00ee00 + #009900"); }); // #00ff00
});

tea.f("#grey", function(){
  tea.print("color: rgb(200, 200, 200)");
});

tea.f("#808080", function(){
  tea.print("color: hsl(50, 0%, 50%)");
});

tea.f("#00ff00", function(){
  tea.print("color: hsl(120, 100%, 50%)");
});

tea.f(".lightenblue", function(){
    tea.print("color: lighten(blue, 10%)");
});

tea.f(".darkenblue", function(){
    tea.print("color: darken(blue, 10%)");
});

tea.f(".unknowncolors", function(){
    tea.print("color: blue2");
    tea.print("border: 2px solid superred");
});

tea.finish();