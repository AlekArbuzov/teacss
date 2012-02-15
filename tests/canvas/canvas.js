var dir = tea.dir+'../assets/images/';

test('canvas',function(){
    stop();
    teacss.image.load([dir+'square.png'],function(list){
        start();
        var canvas = new Canvas(dir+'square.png');
        canvas.brightnessContrast(0,50);
        $("<img>").attr("src",canvas.toDataURL()).appendTo("body");
    })
})