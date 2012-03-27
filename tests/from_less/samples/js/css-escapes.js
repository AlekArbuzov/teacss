tea.start('assets/tea/css-escapes.tea',1);
var ugly = color('fuchsia');

tea.f(".escape\\|random\\|char", function(){
	tea.print("color: red");
});

tea.f(".mixin\\!tUp", function(){
	tea.print("font-weight: bold");
});

// class="404"
tea.f(".\\34 04", function(){
	tea.print("background: red");

	tea.f("strong", function(){
		tea.print("color: "+(ugly)+"");
		tea.print(".mixin\\!tUp");
	});
});

tea.f(".trailingTest\\+", function(){
	tea.print("color: red");
});

/* This hideous test of hideousness checks for the selector "blockquote" with various permutations of hex escapes */
tea.f("\\62\\6c\\6f \\63 \\6B \\0071 \\000075o\\74 e", function(){
	tea.print("color: silver");
});
tea.finish();