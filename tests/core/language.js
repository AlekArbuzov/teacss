test ('Language', function () {
    for (var test in samples){
        var source = "assets/tea/" + samples[test] + ".tea";

        var js = teacss.parseSheetFile(source);
        var css = teacss.parseSheet(source)();

        var jssample = teacss.getFile("assets/samples/js/" + samples[test] + ".js");
        var csssample = teacss.getFile("assets/samples/css/" + samples[test] + ".css");

        ok(js == jssample, samples[test] + " js");
        ok(css == csssample, samples[test] + " css");
    }
});