
var prtcl = angular.module('prtcl', [])

    .directive('processing', function() {
        return function (scope, el, attr) {
            var sketch = scope[attr.processing] || function () {},
                processing = new Processing(el[0], sketch);
            scope.$processing = processing;
        };
    })

    .controller('Info', function ($scope, $http) {
        $scope.cvVisible = false;
        $http.get('/data/cv.json')
            .success(function (data) {
                $scope.cv = data || {};
            });
    })

    .controller('Lines', function ($scope) {
        $scope.sketch = function (ps) {
            function e (n) { return Math.pow(n, Math.E); }
            var n1 = 1000, n2 = 1;
            ps.setup = function () {
                ps.frameRate(30);
                ps.background(0, 0, 0);
                ps.noFill();
                function resize () {
                    var w = window.innerWidth,
                        h = window.innerHeight;
                    ps.size(w, h);
                }
                window.addEventListener('resize', resize);
                resize();
            };
            ps.draw = function () {
                var c = 0, v = 0, o = 255,
                    x = (ps.height / 2) + (ps.mouseX * 0.01),
                    y = (ps.width / 2) + (ps.mouseY * 0.01);
                for (var i = ps.width - Math.round(ps.width / 5); i >= 0; i = i - ps.map(e(Math.random()), 1, 0, 0, 59)) {
                    n1 = n1 + 0.01;
                    n2 = n2 + 0.1;
                    if (Math.round(Math.random()) == 0) {
                        c = ps.map(e(ps.noise(n1, n2)), 0, 1, 10, 0);
                    } else {
                        c = ps.map(e(ps.noise(n2, n1)), 0, 1, 255, 230);
                    }
                    if (Math.round(ps.random(0, 10)) != 0) {
                        o = ps.map(e(Math.random()), 0, 1, 99, 255);
                    } else {
                        o = ps.map(e(Math.random()), 0, 1, 20, 0);
                    }
                    ps.stroke(c, c, c, o);
                    ps.ellipse(x, y, i + (Math.random() * 2), i + (Math.random() * 2));
                }
            };
        };
    });
