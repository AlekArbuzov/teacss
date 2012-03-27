tea.start('from_less/samples/cases/strings.tea',1);
tea.f("#strings", function(){
  tea.print("background-image: url(\"http://son-of-a-banana.com\")");
  tea.print("quotes: \"~\" \"~\"");
//  content: "#*%:&^,)!.(~*})";           //fails to parse
  tea.print("empty: \"\"");
  //brackets: @{"\"{\" \"" + "}" + "\""}; //fails to parse if "}" added
});

tea.f("#comments", function(){
  tea.print("content: \"/* hello */ // not-so-secret\"");
});

tea.f("#single-quote", function(){
  tea.print("quotes: \"'\" \"'\"");
  tea.print("content: '\"\"#!&\"\"'");
  tea.print("empty: ''");
  tea.print("semi-colon: '");tea.print("'");
});
tea.f("#one-line", function(){ tea.print("image: url(\"http://tooks.com\")"); });
tea.f("#interpolation", function(){
  var teavar = '/dev';
  tea.print("url: "+("\"http://teacss.org" + teavar + "/image.jpg\"")+"");
});

// multiple calls with string interpolation

mixmul = tea.f(function(a){
    tea.print("color: \""+(a)+"\"");
});
tea.f(".mix-mul-class", function(){
    mixmul('blue'); //retruns "blue". Shouldn't "@a" remain un-parsed??
});

tea.finish();