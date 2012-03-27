tea.start('from_less/samples/cases/css3.tea',1);
tea.f(".comma-delimited", function(){
  tea.print("background: url(bg.jpg) no-repeat, url(bg.png) repeat-x top left, url(bg)");
  tea.print("text-shadow: -1px -1px 1px red, 6px 5px 5px yellow");
  tea.print("-moz-box-shadow: 0pt 0pt 2px rgba(255, 255, 255, 0.4) inset,"+
    "0pt 4px 6px rgba(255, 255, 255, 0.4) inset");
});
tea.namespace("@font-face", function(){
  tea.print("font-family: Headline");
  tea.print("src: local(Futura-Medium),"+
       "url(fonts.svg#MyGeometricModern) format(\"svg\")");
});
tea.f(".other", function(){
  tea.print("-moz-transform: translate(0, 11em) rotate(-90deg)");
});
tea.f("p:not([class*=\"lead\"])", function(){
  tea.print("color: black");
});

tea.f("input[type=\"text\"].class#id[attr=32]:not(1)", function(){
  tea.print("color: white");
});

tea.f("div#id.class[a=1][b=2].class:not(1)", function(){
  tea.print("color: white");
});

tea.f("ul.comma > li:not(:only-child)::after", function(){
  tea.print("color: white");
});

tea.f("ol.comma > li:nth-last-child(2)::after", function(){
  tea.print("color: white");
});

tea.f("li:nth-child(4n+1),"+
"li:nth-child(-5n),"+
"li:nth-child(-n+2)", function(){
  tea.print("color: white");
});

tea.f("a[href^=\"http://\"]", function(){
  tea.print("color: black");
});

tea.f("a[href$=\"http://\"]", function(){
  tea.print("color: black");
});

tea.f("form[data-disabled]", function(){
  tea.print("color: black");
});

tea.f("p::before", function(){
  tea.print("color: black");
});

tea.f("#issue322", function(){
  tea.print("-webkit-animation: anim2 7s infinite ease-in-out");
});

tea.namespace("@-webkit-keyframes frames", function(){
  tea.f("0%", function(){ tea.print("border: 1px"); });
  tea.f("5.5%", function(){ tea.print("border: 2px"); });
  tea.f("100%", function(){ tea.print("border: 3px"); });
});

tea.finish();