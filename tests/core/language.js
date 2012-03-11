test ('Language', function () {
    for (test in samples){
        var output = teacss.parseSheetFile("assets/tea/" + samples[test] + ".tea");
        var sample = teacss.getFile("assets/samples/" + samples[test] + ".js");

        ok(output == sample, samples[test]);
    }
});