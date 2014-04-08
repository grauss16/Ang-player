var app = angular.module('myApp', ['Volume','Progress']);

app.run(function($rootScope) {
    $rootScope.name = "Nombre X ";
    });

app.controller('MyController', function($scope) {
    $scope.person = {
        name: "Otro nombre X"
    };
});

app.controller('ParentController', function($scope) {
    $scope.person = {greeted: false, count: 0};

});

app.controller('ChildController', function($scope) {
    $scope.sayHello = function() {
        if (typeof $scope.person.name !== "undefined") {
            if ($scope.person.name !== "") {
                $scope.person.greeted = true;
                $scope.person.count += 1;
                alert('hello ' + $scope.person.name);
            }
            else {
                alert("type a name");
            }
        }
        else {
            alert("type a name");
        }
    };
});

app.controller('PlayerController', ['$scope', function($scope) {
        $scope.correctTime = function(time) {
            var hours = Math.floor(time / 3600);
            time -= hours * 3600;
            var minutes = Math.floor(time / 60);
            time -= minutes * 60;
            var seconds = parseInt(time % 60, 10);
            return (hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':'
                    + (seconds < 10 ? '0' + seconds : seconds));
        };
        $scope.volumenBar = {
            max: 100,
            at: 50,
            enabled: true
        };

        $scope.progressBar = {
            start: 0,
            end: 100,
            enabled: true
        };

        $scope.audio = document.getElementById('myaudio');
        $scope.playing = false;
        $scope.audio.src = 'http://pd.npr.org/npr-mp4/npr/sf/2013/07/20130726_sf_05.mp4?orgId=1&topicId=1032&ft=3&f=61';        
        $scope.audio.volume =0.5;
        $scope.duration = $scope.correctTime($scope.audio.duration);
        $scope.current = $scope.correctTime($scope.audio.currentTime);
        $scope.progress = 0;

        $scope.play = function() {
            $scope.audio.play();
            $scope.playing = true;
        };

        $scope.pause = function() {
            $scope.audio.pause();
            $scope.playing = false;
        };

        $scope.audio.addEventListener("loadedmetadata", function(_event) {
             $scope.$apply(function() {
             $scope.duration = $scope.correctTime($scope.audio.duration);
              $scope.progressBar.end=$scope.audio.duration;
            });
        });

        $scope.audio.addEventListener('play', function() {
            $scope.$apply(function() {
                $scope.play();
                $scope.duration = $scope.correctTime($scope.audio.duration);
            });
        });

        $scope.audio.addEventListener('timeupdate', function() {
            $scope.$apply(function() {
                $scope.current = $scope.correctTime($scope.audio.currentTime);
                $scope.progress = $scope.audio.currentTime / $scope.audio.duration;
                $scope.progressBar.start=$scope.audio.currentTime;
            });
        });

        $scope.audio.addEventListener('pause', function() {
            $scope.$apply(function() {
                $scope.pause();
                $scope.current = $scope.correctTime($scope.audio.currentTime);
            });
        });
        $scope.audio.addEventListener('ended', function() {
            $scope.$apply(function() {
                $scope.pause();
            });
        });

    }]);

