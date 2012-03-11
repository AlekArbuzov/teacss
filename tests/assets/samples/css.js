tea.start('assets/tea/css.tea',1);
tea.print("@charset \"utf-8\"");
tea.f("div", function(){ tea.print("color: black"); });
tea.f("div", function(){ tea.print("width: 99%"); });

tea.f("*", function(){
  tea.print("min-width: 45em");
});

tea.f("h1, h2 > a > p, h3", function(){
  tea.print("color: none");
});

tea.f("div.class", function(){
  tea.print("color: blue");
});

tea.f("div#id", function(){
  tea.print("color: green");
});

tea.f(".class#id", function(){
  tea.print("color: purple");
});

tea.f(".one.two.three", function(){
  tea.print("color: grey");
});

tea.namespace("@media print", function(){
  tea.print("font-size: 3em");
});

tea.namespace("@media screen", function(){
  tea.print("font-size: 10px");
});

tea.namespace("@font-face", function(){
  tea.print("font-family: 'Garamond Pro'");
  tea.print("src: url(\"/fonts/garamond-pro.ttf\")");
});

tea.f("a:hover, a:link", function(){
  tea.print("color: #999");
});

tea.f("p, p:first-child", function(){
  tea.print("text-transform: none");
});

tea.f("q:lang(no)", function(){
  tea.print("quotes: none");
});

tea.f("p + h1", function(){
  tea.print("font-size: 2.2em");
});

tea.f("#shorthands", function(){
  tea.print("border: 1px solid #000");
  tea.print("font: 12px/16px Arial");
  tea.print("font: 100%/16px Arial");
  tea.print("margin: 1px 0");
  tea.print("padding: 0 auto");
  tea.print("background: url(\"http://www.teacss.org\") no-repeat 0 4px");
});

tea.f("#more-shorthands", function(){
  tea.print("margin: 0");
  tea.print("padding: 1px 0 2px 0");
  tea.print("font: normal small/20px 'Trebuchet MS', Verdana, sans-serif");
});

tea.f(".misc", function(){
  tea.print("-moz-border-radius: 2px");
  tea.print("display: -moz-inline-stack");
  tea.print("width: .1em");
  tea.print("background-color: #009998");
  tea.print("background-image: url(images/image.jpg)");
  tea.print("background: -webkit-gradient(linear, left top, left bottom, from(red), to(blue))");
  tea.print("margin:"); 
  tea.print("filter: alpha(opacity=100)");
});

tea.f("#important", function(){
  tea.print("color: red !important");
  tea.print("width: 100%!important");
  tea.print("height: 20px ! important");
});

tea.f("#data-uri", function(){
  tea.print("background: url(data:image/png");tea.print("charset=utf-8");tea.print("base64,"+
    "kiVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/"+
    "k//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U"+
    "kg9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC)");
  tea.print("background-image: url(data:image/x-png,f9difSSFIIGFIFJD1f982FSDKAA9==)");
});

tea.f("#svg-data-uri", function(){
  tea.print("background: transparent url('data:image/svg+xml, <svg version=\"1.1\"><g></g></svg>')");
});

tea.finish();