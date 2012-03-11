tea.start('assets/tea/strings.tea',1);
tea.f("#strings", function(){
  tea.print("background-image: url(\"http://son-of-a-banana.com\")");
  tea.print("quotes: \"~\" \"~\"");
//  content: "#*%:&^,)!.(~*})";
  tea.print("empty: \"\"");
  tea.f("brackets: \"",function(){tea.print("\" \"");});tea.print("\"");
  tea.print("escapes: \"\\\"hello\\\" \\\\world\"");
  tea.print("escapes2: \"\\\"llo\"");
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
tea.f("#escaped", function(){
  tea.print("filter: ~\"DX.Transform.MS.BS.filter(opacity=50)\"");
});
tea.f("#one-line", function(){ tea.print("image: url(http://tooks.com)"); });
//#crazy { image: url(http://), "}", url("http://}") }
//#interpolation {
//  @teavar: '/dev';
//  url: "http://lesscss.org@{var}/image.jpg";
//
//  @teavar2: 256;
//  url2: "http://lesscss.org/image-@{var2}.jpg";
//
//  @teavar3: #456;
//  url3: "http://lesscss.org@{var3}";
//
//  @teavar4: hello;
//  url4: "http://lesscss.org/@{var4}";
//
//  @teavar5: 54.4px;
//  url5: "http://lesscss.org/@{var5}";
//}

//// multiple calls with string interpolation
//
//.mix-mul (@a: green) {
//    color: ~"@{a}";
//}
//.mix-mul-class {
//    .mix-mul(blue);
//    .mix-mul(red);
//    .mix-mul(blue);
//    .mix-mul(orange);
//}

tea.finish();