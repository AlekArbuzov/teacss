tea.start('assets/tea/whitespace.tea',1);


tea.f(".whitespace",
  function(){ tea.print("color: white"); });

tea.f(".whitespace",
function(){
  tea.print("color: white");
});
  tea.f(".whitespace",
function(){ tea.print("color: white"); });

tea.f(".whitespace",function(){tea.print("color:white");});
tea.f(".whitespace", function(){ tea.print("color : white");  });

tea.f(".white,"+
".space,"+
".mania",
function(){ tea.print("color: white"); });

tea.f(".no-semi-column", function(){ tea.print("color: white"); });
tea.f(".no-semi-column", function(){
  tea.print("color: white");
  tea.print("white-space: pre");
});
tea.f(".no-semi-column", function(){tea.print("border: 2px solid white");});
tea.f(".newlines", function(){
  tea.print("background: the,"+
              "great,"+
              "wall");
  tea.print("border: 2px"+
          "solid"+
          "black");
});
tea.f(".empty", function(){

});

tea.finish();