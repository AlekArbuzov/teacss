tea.start('from_less/samples/cases/import.tea',1);
/* @import "../import/import_test.js";*/
tea.start('from_less\\samples\\import\\import_test.js',2);
function test_concat (str1, str2) {
    return str1 + ", " + str2;
}

var testvar = "14px";

test_imp_val = ( function() {
        return 100;
})();


tea.finish();

tea.f("#import-test", function(){
    tea.print("width: "+(test_imp_val)+"");
    tea.print("font-family: "+(test_concat("'Trebuchet'", "'Verdana'"))+"");
    tea.print("font-size: "+(testvar)+"");
});
tea.finish();