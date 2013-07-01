var crunch = document.getElementById('crunch');
crunch.volume = .5;
var burp = document.getElementById('burp');
burp.volume = .8;
var onlineRef = new Firebase('https://damecupra.firebaseIO.com/online-v2');
var connectedRef = new Firebase('https://damecupra.firebaseIO.com/.info/connected');
connectedRef.on('value', function (snap) {
    if (snap.val() === true) {
        var me = onlineRef.push(true);
        me.onDisconnect().remove();
    }
});
var all = new Firebase('https://damecupra.firebaseIO.com/jidlo');
var DameCupra = ['$scope', function ($scope) {
    $scope.online = 0;
    onlineRef.on('value', function (v) {
        $scope.$apply(function () {
            $scope.online = Object.keys(v.val()).length;
        });
    });
    var updateJidlo = function (v) {
        $scope.$apply(function () {
            var jidlo = v.val();
            var model = [];
            for (var j in jidlo) {
                var index = adresy.indexOf(j);
                if (index > -1) {
                    model.push({jidlo: hlasky[index], pocet: jidlo[j]});
                }
            }
            $scope.jidlo = model;
        });
    };
    all.on('value', updateJidlo);
    all.on('child_changed', updateJidlo);

    $scope.domena = 'Čupra';
    var cuprik = document.getElementById('cuprik');
    var opened = false;
    var hlasky = ['Zmrzku', 'Šáňo', 'Sejra', 'Rejži', 'Kuře', 'Kraba', 'Buřtíky', 'Jabko', 'Donut', 'Polívku', 'PárekVRohlíku'];
    var adresy = ['zmrzku', 'sano', 'sejra', 'rejzi', 'kure', 'kraba', 'burtiky', 'jabko', 'donut', 'polivku', 'parekvrohliku'];
    var queries = ['Zmrzlina', 'Sekt', 'Sýr', 'Rýže', 'Kuře', 'Krab', 'Klobása', 'Jablko', 'Donut', 'Polévka', 'Hot Dog'];
    var domena = document.getElementById('domena');
    var jidlo = document.getElementById('jidlo');
    var first = true;
    var dame = function (coze) {
        var index = adresy.indexOf(coze);
        if (index > -1) {
            var remote = new Firebase('https://damecupra.firebaseIO.com/jidlo/' + coze);
            remote.transaction(function(pocet) {
                return pocet + 1;
            });
            cuprik.classList.add('open');
            $scope.$apply(function () {
                $scope.domena = hlasky[index];
                $scope.link = 'http://www.damejidlo.cz/vyhledavani/?q=' + encodeURIComponent(queries[index]) + '&utm_source=damecupra.cz&utm_medium=banner&utm_term=donut&utm_campaign=damecupra.cz';
            });
            jidlo.className = 'papej jidlo-' + index;
            setTimeout(function () {
                jidlo.className = '';
                cuprik.classList.remove('open');
                if (first) {
                    first = false;
                    crunch.play();
                    return;
                }
                if (Math.random() < .3) {
                    burp.play();
                }
            }, 2000);
        }
    };
    var jedem = function () {
        dame(adresy[Math.floor(Math.random()*adresy.length)]);
        setTimeout(jedem, 3000 + 7000 * Math.random());
    };

    window.onload = function () {
        setTimeout(jedem, 5000);
    };
}];
