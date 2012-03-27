tea.start('from_less/samples/cases/mixins.tea',1);
mixin = tea.f(function(border){ tea.print("border: "+(border)+"px solid black"); });
mixout = tea.f(function(){ tea.print("border-color: orange"); });
borders = tea.f(function(){
    inner_color= tea.f(function(col){
        tea.print("color: "+(col)+"");
    });
    tea.print("border-style: dashed");
});

tea.f("#container", function(){
  mixin(1);
  mixout();
  borders();
  inner_color('red');
});


tea.finish();