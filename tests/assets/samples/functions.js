tea.start('assets/tea/functions.tea',1);
tea.f("#functions", function(){
  tea.print("@teavar: 10");
  tea.print("color: _color(\"evil red\")"); // #660000
  tea.print("width: increment(15)");
  tea.print("height: undefined(\"self\")");
  tea.print("border-width: add(2, 3)");
  tea.print("variable: increment("+(teavar)+")");
});

tea.f("#built-in", function(){
  tea.print("@r: 32");
  tea.print("escaped: e(\"-Some::weird(#thing, y)\")");
  tea.print("lighten: lighten(#ff0000, 40%)");
  tea.print("darken: darken(#ff0000, 40%)");
  tea.print("saturate: saturate(#29332f, 20%)");
  tea.print("desaturate: desaturate(#203c31, 20%)");
  tea.print("greyscale: greyscale(#203c31)");
  tea.print("spin-p: spin(hsl(340, 50%, 50%), 40)");
  tea.print("spin-n: spin(hsl(30, 50%, 50%), -40)");
  tea.print("format: %(\"rgb(%d, %d, %d)\", "+(r)+", 128, 64)");
  tea.print("format-string: %(\"hello %s\", \"world\")");
  tea.print("format-multiple: %(\"hello %s %d\", \"earth\", 2)");
  tea.print("format-url-encode: %('red is %A', #ff0000)");
  tea.print("eformat: e(%(\"rgb(%d, %d, %d)\", "+(r)+", 128, 64))");

  tea.print("hue: hue(hsl(98, 12%, 95%))");
  tea.print("saturation: saturation(hsl(98, 12%, 95%))");
  tea.print("lightness: lightness(hsl(98, 12%, 95%))");
  tea.print("rounded: round("+(r)+"/3)");
  tea.print("roundedpx: round(10px / 3)");
  tea.print("percentage: percentage(10px / 50)");
  tea.print("color: color(\"#ff0011\")");

  tea.f(".is-a", function(){
    tea.print("color: iscolor(#ddd)");
    tea.print("color: iscolor(red)");
    tea.print("color: iscolor(rgb(0, 0, 0))");
    tea.print("keyword: iskeyword(hello)");
    tea.print("number: isnumber(32)");
    tea.print("string: isstring(\"hello\")");
    tea.print("pixel: ispixel(32px)");
    tea.print("percent: ispercentage(32%)");
    tea.print("em: isem(32em)");
  });
});

tea.f("#alpha", function(){
  tea.print("alpha: darken(hsla(25, 50%, 50%, 0.6), 10%)");
});

tea.finish();