test ('From less', function () {
    for (var test in samples){
        var source = "from_less/samples/cases/" + samples[test] + ".tea";

        var js = teacss.parseSheetFile(source);
        var css = teacss.parseSheet(source)();

        var jssample = teacss.getFile("from_less/samples/js/" + samples[test] + ".js");
        var csssample = teacss.getFile("from_less/samples/css/" + samples[test] + ".css");

        ok(js == jssample, samples[test] + " js");
        ok(css == csssample, samples[test] + " css");
    }
});