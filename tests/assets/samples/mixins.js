tea.start('assets/tea/mixins.tea',1);
tea.f(".mixin", function(){ tea.print("border: 1px solid black"); });
tea.f(".mixout", function(){ tea.print("border-color: orange"); });
tea.f(".borders", function(){ tea.print("border-style: dashed"); });

tea.f("#namespace", function(){
  tea.f(".borders", function(){
    tea.print("border-style: dotted");
  });
  tea.f(".biohazard", function(){
    tea.print("content: \"death\"");
    tea.f(".man", function(){
      tea.print("color: transparent");
    });
  });
});
tea.f("#theme", function(){
  tea.f("> .mixin", function(){
    tea.print("background-color: grey");
  });
});
tea.f("#container", function(){
  tea.print("color: black");
  tea.print(".mixin");
  tea.print(".mixout");
  tea.print("#theme > .mixin");
});

tea.f("#header", function(){
  tea.f(".milk", function(){
    tea.print("color: white");
    tea.print(".mixin");
    tea.print("#theme > .mixin");
  });
  tea.f("#cookie", function(){
    tea.f(".chips", function(){
      tea.print("#namespace .borders");
      tea.f(".calories", function(){
        tea.print("#container");
      });
    });
    tea.print(".borders");
  });
});
tea.f(".secure-zone", function(){ tea.print("#namespace .biohazard .man"); });
tea.f(".direct", function(){
  tea.print("#namespace > .borders");
});

tea.f(".bo, .bar", function(){
    tea.print("width: 100%");
});
tea.f(".bo", function(){
    tea.print("border: 1px");
});
tea.f(".ar.bo.ca", function(){
    tea.print("color: black");
});
tea.f(".jo.ki", function(){
    tea.print("background: none");
});
tea.f(".extended", function(){
    tea.print(".bo");
    tea.print(".jo.ki");
});
tea.f(".foo .bar", function(){
  tea.print(".bar");
});

tea.finish();