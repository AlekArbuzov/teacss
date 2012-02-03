var $$;
steal('./ui/jquery/jquery.js')
.then('./ui/jquery/jquery.lang.js')
.then('./ui/jquery/jquery.class.js')
.then('./ui/jquery/jquery.tmpl.js')
.then('./ui/jquery/jquery.ui.js')
.then('./ui/jquery/jquery.colorpicker.js')
.then('./ui/jquery/jquery.json.js')
.then('./ui/jquery/jquery.colorhelpers.js')

.then('./ui/style/jquery.colorpicker.css')
.then('./ui/style/jquery.ui.css')
.then('./ui/style/teacss.ui.css')
.then('./ui/core.js')
.then('./ui/form.js')
.then('./ui/control.js')
.then(
    './ui/controls/colorpicker.js',
    './ui/controls/combo.js',
    './ui/controls/slider.js',
    './ui/controls/label.js',
    './ui/controls/panel.js',
    './ui/controls/sorter.js',
    './ui/controls/check.js',
    './ui/controls/html.js'
)