
define(function (require) {

    function yesNo () {
        return (Math.round(Math.random()) == 0);
    }

    function yesNoTen () {
        return (Math.round(plonk.rand(0, 10)) != 0);
    }

    return function (ps) {

        var n1 = 1000,
            n2 = 1,
            posXDrunk = plonk.drunk(-75, 75, 0.01),
            posYDrunk = plonk.drunk(-75, 75, 0.01),
            posX, posY;
        
        ps.setup = function () {
            ps.frameRate(60);
            ps.background(0, 0, 0);
            ps.noFill();
            function resize () {
                var w = window.innerWidth,
                    h = window.innerHeight;
                ps.size(w, h);
                posX = Math.min(ps.width, ps.height) / 2;
                posY = Math.max(ps.width, ps.height) / 2;
            }
            resize();
            window.addEventListener('resize', resize);
        };

        ps.draw = function () {
            var x = posX + posXDrunk(),
                y = posY + posYDrunk(),
                c, o;
            var cord = Math.max(ps.width, ps.height);
            for (var i = cord - Math.round(cord / 5); i >= 0; i = i - plonk.scale(plonk.log(Math.random()), 1, 0, 0, 59)) {
                n1 = n1 + 0.01;
                n2 = n2 + 0.1;
                if (yesNo()) {
                    c = plonk.scale(plonk.log(ps.noise(n1, n2)), 0, 1, 10, 0);
                } else {
                    c = plonk.scale(plonk.log(ps.noise(n2, n1)), 0, 1, 255, 230);
                }
                if (yesNoTen()) {
                    o = plonk.scale(plonk.log(Math.random()), 0, 1, 99, 255);
                } else {
                    o = plonk.scale(plonk.log(Math.random()), 0, 1, 20, 0);
                }
                ps.stroke(c, c, c, o);
                ps.ellipse(x, y, i + (Math.random() * 2), i + (Math.random() * 2));
            }
        };

    };

});
