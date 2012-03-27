tea.start('from_less/samples/cases/selectors.tea',1);
tea.f("h1, h2, h3", function(){
  tea.f("a, p", function(){
    tea.f("hover", function(){
      tea.print("color: red");
    });
  });
});

tea.f("#all", function(){ tea.print("color: blue"); });
tea.f("#the", function(){ tea.print("color: blue"); });
tea.f("#same", function(){ tea.print("color: blue"); });

tea.f("ul, li, div, q, blockquote, textarea", function(){
  tea.print("margin: 0");
});

tea.f("td", function(){
  tea.print("margin: 0");
  tea.print("padding: 0");
});

tea.f("td, input", function(){
  tea.print("line-height: 1em");
});

tea.f("a", function(){
  tea.print("color: red");

  tea.f(":hover", function(){ tea.print("color: blue"); });

  tea.f("div", function(){ tea.print("color: green"); });

  tea.f("p span", function(){ tea.print("color: yellow"); });
});

tea.f(".foo", function(){
  tea.f(".bar, .baz", function(){
    tea.f(".qux", function(){
      tea.print("display: block");
    });
    tea.f(".qux", function(){
      tea.print("display: inline");
    });
    tea.f(".qux .biz", function(){
      tea.print("display: none");
    });
  });
});
tea.finish();