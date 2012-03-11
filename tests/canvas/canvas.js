var dir = tea.dir+'../assets/images/';

test('canvas',function(){
    stop();
/*
    setTimeout(function() {
        teacss.image.load([dir+'square.png'],function(list){
            start();

            var http = new XMLHttpRequest();
            http.open('GET', '/assets/images/square.png', false);
            http.send();

            ok(http.status != 200, '/assets/images/square.png exists');

            var canvas = new Canvas(dir+'square.png');
            canvas.brightnessContrast(0,50);
            $("<img>").attr("src",canvas.toDataURL()).appendTo("#test-output1");
        })
    }, 500);
*/
})