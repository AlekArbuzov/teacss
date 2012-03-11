test ('Language.Colors', function() {
    var output = teacss.parseSheetFile("assets/tea/colors.tea");
    var sample = teacss.getFile('assets/samples/colors.js');
    ok(output == sample, 'colors test');
})