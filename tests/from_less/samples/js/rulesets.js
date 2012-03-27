tea.start('from_less/samples/cases/rulesets.tea',1);
tea.f("#first > .one", function(){
  tea.f("> #second .two > #deux", function(){
    tea.print("width: 50%");
    tea.f("#third", function(){
      tea.f("&:focus", function(){
        tea.print("color: black");
        tea.f("#fifth", function(){
          tea.f("> #sixth", function(){
            tea.f(".seventh #eighth", function(){
              tea.f("+ #ninth", function(){
                tea.print("color: purple");
              });
            });
          });
        });
      });
      tea.print("height: 100%");
    });
    tea.f("#fourth, #five, #six", function(){
      tea.print("color: #110000");
      tea.f(".seven, .eight > #nine", function(){
        tea.print("border: 1px solid black");
      });
      tea.f("#ten", function(){
        tea.print("color: red");
      });
    });
  });
  tea.print("font-size: 2em");
});

tea.finish();