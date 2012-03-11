tea.start('assets/tea/ie-filters.tea',1);
tea.print("@fat: 0");
tea.print("@cloudhead: \"#000000\"");

tea.f(".nav", function(){
  tea.print("filter: progid:DXImageTransform.Microsoft.Alpha(opacity = 20)");
  tea.print("filter: progid:DXImageTransform.Microsoft.Alpha(opacity="+(fat)+")");
  tea.print("filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=\"#333333\", endColorstr="+(cloudhead)+", GradientType="+(fat)+")");
});
tea.finish();