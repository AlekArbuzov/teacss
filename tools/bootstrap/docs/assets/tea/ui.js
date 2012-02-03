$(".navbar,.subnav").addClass("fixed_fix");

var form = ui.form("body",function(){
    ui.group('Bootstrap options'); {
        ui.fieldset("Hyperlinks"); {
            ui.label({value:"linkColor:",width:200});
            ui.colorPicker({name:"linkColor",width:100,height:20});
            ui.html({html:"<br>"});
            ui.label({value:"linkColorHover:",width:200});
            ui.colorPicker({name:"linkColorHover",width:100,height:20});
        }
        ui.fieldset("Grid system"); {
            ui.label({value:"gridColumns:",width:150});
            ui.slider({name:"gridColumns",margin:"0 20px",min:6,max:24});
            ui.label({value:"gridWidth:",width:150});
            ui.slider({name:"gridWidth",margin:"0 20px",min:800,max:1200});
            ui.label({value:"gridRatio:",width:150});
            ui.slider({name:"gridRatio",margin:"0 20px",min:0,max:1.0,step:0.05});
        }
        ui.fieldset("Typography"); {
            ui.label({value:"textColor:",width:200});
            ui.colorPicker({name:"textColor",width:100,height:20});
            ui.label({value:"baseFontSize:",width:150});
            ui.slider({name:"baseFontSize",margin:"0 20px",min:10,max:20});
            ui.label({value:"baseLineHeight:",width:150});
            ui.slider({name:"baseLineHeight",margin:"0 20px",min:10,max:20});
        }

    }

},{
    width: 355,
    height: 800,
    align: 'left',
    value: {
        linkColor: 'red',
        linkColorHover: {func:'darken',args:[{ref:'linkColor'},15]},

        gridColumns: 12,
        gridWidth: 940,
        gridRatio: 0.25,

        baseFontSize: 13,
        baseLineHeight: 18,
        textColor: '#333'
    }
})

var data = form.value;

linkColor = data.linkColor;
linkColorHover = data.linkColorHover;

var x = Math.floor((data.gridWidth) / (data.gridColumns-data.gridRatio));
gridColumns = data.gridColumns;
gridGutterWidth = Math.floor(x * data.gridRatio);
gridColumnWidth = x - gridGutterWidth;

baseFontSize = data.baseFontSize+'px';
baseLineHeight = data.baseLineHeight+'px';
textColor = data.textColor;

