teacss.Color = function() {
    var Color = function(r,g,b,a) {
        this.rgb = [r || 0,g || 0,b || 0];
        this.alpha = a != null ? a : 1;
    };

    function clamp(val) {
        return Math.min(1, Math.max(0, val));
    }
    var lookupColors = {
        aqua:[0,255,255],
        azure:[240,255,255],
        beige:[245,245,220],
        black:[0,0,0],
        blue:[0,0,255],
        brown:[165,42,42],
        cyan:[0,255,255],
        darkblue:[0,0,139],
        darkcyan:[0,139,139],
        darkgrey:[169,169,169],
        darkgreen:[0,100,0],
        darkkhaki:[189,183,107],
        darkmagenta:[139,0,139],
        darkolivegreen:[85,107,47],
        darkorange:[255,140,0],
        darkorchid:[153,50,204],
        darkred:[139,0,0],
        darksalmon:[233,150,122],
        darkviolet:[148,0,211],
        fuchsia:[255,0,255],
        gold:[255,215,0],
        green:[0,128,0],
        indigo:[75,0,130],
        khaki:[240,230,140],
        lightblue:[173,216,230],
        lightcyan:[224,255,255],
        lightgreen:[144,238,144],
        lightgrey:[211,211,211],
        lightpink:[255,182,193],
        lightyellow:[255,255,224],
        lime:[0,255,0],
        magenta:[255,0,255],
        maroon:[128,0,0],
        navy:[0,0,128],
        olive:[128,128,0],
        orange:[255,165,0],
        pink:[255,192,203],
        purple:[128,0,128],
        violet:[128,0,128],
        red:[255,0,0],
        silver:[192,192,192],
        white:[255,255,255],
        yellow:[255,255,0]
    };
    Color.parse = function (str) {
        var res, m = function(r,g,b,a){ return new Color(r,g,b,a); }

        // Look for rgb(num,num,num)
        if (res = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(str))
            return m(parseInt(res[1], 10), parseInt(res[2], 10), parseInt(res[3], 10));

        // Look for rgba(num,num,num,num)
        if (res = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(str))
            return m(parseInt(res[1], 10), parseInt(res[2], 10), parseInt(res[3], 10), parseFloat(res[4]));

        // Look for rgb(num%,num%,num%)
        if (res = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(str))
            return m(parseFloat(res[1])*2.55, parseFloat(res[2])*2.55, parseFloat(res[3])*2.55);

        // Look for rgba(num%,num%,num%,num)
        if (res = /rgba\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(str))
            return m(parseFloat(res[1])*2.55, parseFloat(res[2])*2.55, parseFloat(res[3])*2.55, parseFloat(res[4]));

        // Look for #a0b1c2
        if (res = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(str))
            return m(parseInt(res[1], 16), parseInt(res[2], 16), parseInt(res[3], 16));

        // Look for #fff
        if (res = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(str))
            return m(parseInt(res[1]+res[1], 16), parseInt(res[2]+res[2], 16), parseInt(res[3]+res[3], 16));

        // Otherwise, we're most likely dealing with a named color
        var name = str ? teacss.trim(str.toString()).toLowerCase() : false;
        if (name == "transparent")
            return m(255, 255, 255, 0);
        else {
            // default to black
            res = lookupColors[name] || [0, 0, 0];
            return m(res[0], res[1], res[2]);
        }
    },

    Color.prototype = {
        toString: function () {
            if (this.alpha < 1.0) {
                return "rgba(" + this.rgb.map(function (c) {
                    return Math.round(c);
                }).concat(this.alpha).join(', ') + ")";
            } else {
                return '#' + this.rgb.map(function (i) {
                    i = Math.round(i);
                    i = (i > 255 ? 255 : (i < 0 ? 0 : i)).toString(16);
                    return i.length === 1 ? '0' + i : i;
                }).join('');
            }
        },

        toHSL: function () {
            var r = this.rgb[0] / 255,
                g = this.rgb[1] / 255,
                b = this.rgb[2] / 255,
                a = this.alpha;

            var max = Math.max(r, g, b), min = Math.min(r, g, b);
            var h, s, l = (max + min) / 2, d = max - min;

            if (max === min) {
                h = s = 0;
            } else {
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2;               break;
                    case b: h = (r - g) / d + 4;               break;
                }
                h /= 6;
            }
            return { h: h * 360, s: s, l: l, a: a };
        },

        toHSV: function () {
            var red = this.rgb[0];
            var grn = this.rgb[1];
            var blu = this.rgb[2];
            var x, val, f, i, hue, sat, val;
            red/=255;
            grn/=255;
            blu/=255;
            x = Math.min(Math.min(red, grn), blu);
            val = Math.max(Math.max(red, grn), blu);
            if (x==val){
                return({h:0, s:0, v:val*100});
            }
            f = (red == x) ? grn-blu : ((grn == x) ? blu-red : red-grn);
            i = (red == x) ? 3 : ((grn == x) ? 5 : 1);
            hue = Math.floor((i-f/(val-x))*60)%360;
            sat = Math.floor(((val-x)/val)*100);
            val = Math.floor(val*100);
            return({h:hue, s:sat, v:val});
        }
    }

    Color.functions = {
        rgb: function (r, g, b) {
            return this.rgba(r, g, b, 1.0);
        },
        rgba: function (r, g, b, a) {
            return new teacss.Color(r,g,b,a);
        },
        hsl: function (h, s, l) {
            return this.hsla({h:h, s:s, l:l, a:1.0});
        },
        hsla: function (hsla) {
            h = hsla.h;
            s = hsla.s;
            l = hsla.l;
            a = hsla.a;

            h = (h % 360) / 360;

            var m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
            var m1 = l * 2 - m2;

            return this.rgba(hue(h + 1/3) * 255,
                             hue(h)       * 255,
                             hue(h - 1/3) * 255,
                             a);

            function hue(h) {
                h = h < 0 ? h + 1 : (h > 1 ? h - 1 : h);
                if      (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
                else if (h * 2 < 1) return m2;
                else if (h * 3 < 2) return m1 + (m2 - m1) * (2/3 - h) * 6;
                else                return m1;
            }
        },
        hue: function (color) {
            return Math.round(color.toHSL().h);
        },
        saturation: function (color) {
            return Math.round(color.toHSL().s * 100);
        },
        lightness: function (color) {
            return Math.round(color.toHSL().l * 100);
        },
        alpha: function (color) {
            return color.toHSL().a;
        },
        saturate: function (color, amount) {
            var hsl = color.toHSL();

            hsl.s += amount / 100;
            hsl.s = clamp(hsl.s);
            return this.hsla(hsl);
        },
        desaturate: function (color, amount) {
            var hsl = color.toHSL();

            hsl.s -= amount / 100;
            hsl.s = clamp(hsl.s);
            return this.hsla(hsl);
        },
        lighten: function (color, amount) {
            var hsl = color.toHSL();

            hsl.l += amount / 100;
            hsl.l = clamp(hsl.l);
            return this.hsla(hsl);
        },
        darken: function (color, amount) {
            var hsl = color.toHSL();
            hsl.l -= amount / 100;
            hsl.l = clamp(hsl.l);
            return this.hsla(hsl);
        },
        fadein: function (color, amount) {
            var hsl = color.toHSL();

            hsl.a += amount / 100;
            hsl.a = clamp(hsl.a);
            return this.hsla(hsl);
        },
        fadeout: function (color, amount) {
            var hsl = color.toHSL();

            hsl.a -= amount / 100;
            hsl.a = clamp(hsl.a);
            return this.hsla(hsl);
        },
        spin: function (color, amount) {
            var hsl = color.toHSL();
            var hue = (hsl.h + amount) % 360;

            hsl.h = hue < 0 ? 360 + hue : hue;

            return this.hsla(hsl);
        },
        mix: function (color1, color2, weight) {
            if (!(color1 instanceof teacss.Color)) color1 = teacss.Color.parse(color1);
            if (!(color2 instanceof teacss.Color)) color2 = teacss.Color.parse(color2);

            var p = weight / 100.0;
            var w = p * 2 - 1;
            var a = color1.toHSL().a - color2.toHSL().a;

            var w1 = (((w * a == -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
            var w2 = 1 - w1;

            var rgb = [color1.rgb[0] * w1 + color2.rgb[0] * w2,
                       color1.rgb[1] * w1 + color2.rgb[1] * w2,
                       color1.rgb[2] * w1 + color2.rgb[2] * w2];

            var alpha = color1.alpha * p + color2.alpha * (1 - p);
            return new teacss.Color(rgb[0],rgb[1],rgb[2], alpha);
        },
        greyscale: function (color) {
            return this.desaturate(color, 100);
        }
    }
    String.prototype.toHSL = function () { return Color.parse(this).toHSL(); }

    for (var name in Color.functions) {
        teacss.functions[name] = function(func){
            return function () {
                return func.apply(teacss.Color.functions,arguments);
            }
        }(Color.functions[name]);
    }

    return Color;
}();
