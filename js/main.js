var app = angular.module('myApp', ['Volume', 'Progress']);


app.controller('PlayerController', ['$scope', '$http', function($scope, $http) {
        $scope.correctTime = function(time) {
            var hours = Math.floor(time / 3600);
            time -= hours * 3600;
            var minutes = Math.floor(time / 60);
            time -= minutes * 60;
            var seconds = parseInt(time % 60, 10);
            return ((hours > 0 ? hours + ':' : "") + (minutes < 10 ? '0' + minutes : minutes) + ':'
                    + (seconds < 10 ? '0' + seconds : seconds));
        };
        $scope.volumenBar = {
            max: 100,
            at: 100,
            enabled: true
        };

        $scope.progressBar = {
            max: 100,
            at: 0,
            enabled: true
        };

        $scope.playlist = {};
        $scope.currentIndex = 0;

         $http.get("http://openweathermap.org/data/2.3/forecast/city?id=524901&APPID=1111111111")
         .success(function(data, status, headers, config) {
         $scope.data = data;
         }).error(function(data, status, headers, config) {
         $scope.status = status;
         });
        /*
         $.ajax({
         url: "/Angulartest/json/test.txt",
         type: "GET",
         dataType: "json",
         success: function(source)
         {
         $scope.data2 = source;
         },
         error: function(data) {
         $scope.data2 = data;
         }
         
         $http({
         url: "http://api.lyricsnmusic.com/songs",
         method: "GET",
         dataType: "json",
         params:{
         api_key:'aaa33449081584517c4e3263beed44',
         artist:'black sabbath',
         track:'paranoid'  
         }
         }).success(function(data, status, headers, config) {
         $scope.data = data;
         }).error(function(data, status, headers, config) {
         $scope.data = status;
         });*/


        $scope.loadSongs = function() {
            var fromServer = angular.toJson({
                'songs':
                        [
                            {'title': 'End Of The Beginning', 'artist': 'Black Sabbath', 'image': "13.jpg", 'file': "01 - End Of The Beginning.mp3"},
                            {'title': 'God Is Dead', 'artist': 'Black Sabbath', 'image': "paranoid.jpg", 'file': "02 - God Is Dead.mp3"}

                        ],
                'total': 2
            });
            $scope.playlist = angular.fromJson(fromServer);
        };

        $scope.loadSongs();
        $scope.currentSong = $scope.playlist.songs[$scope.currentIndex].title;
        $scope.currentArtist = $scope.playlist.songs[$scope.currentIndex].artist;
        $scope.playing = false;
        $scope.progress = 0;
        $scope.audio = document.getElementById('myaudio');
        $scope.duration = $scope.correctTime($scope.audio.duration);
        $scope.current = $scope.correctTime($scope.audio.currentTime);
        $scope.audio.src = 'playlist/' + $scope.playlist.songs[$scope.currentIndex].file;
        $scope.audio.volume = 1;

        $scope.play = function() {
            $scope.audio.play();
        };

        $scope.pause = function() {
            $scope.audio.pause();
        };

        $scope.changeTrack = function() {
            $scope.pause();
            $scope.audio.src = 'playlist/' + $scope.playlist.songs[$scope.currentIndex].file;
            $scope.duration = $scope.correctTime($scope.audio.duration);
            $scope.current = $scope.correctTime($scope.audio.currentTime);
            $scope.progress = 0;
            $scope.changeCover();
            $scope.play();
        };

        $scope.changeCover = function() {
            $('#cover').css({
                'background-image': 'url(' + 'images/covers/'
                        + ($scope.currentArtist.toLowerCase()).split(" ").join("") + '/'
                        + $scope.playlist.songs[$scope.currentIndex].image + ')'
            });
        };

        $scope.next = function() {
            if (($scope.currentIndex + 1) === $scope.playlist.total) {
                $scope.currentIndex = 0;
                $scope.currentSong = $scope.playlist.songs[$scope.currentIndex].title;
                $scope.currentArtist = $scope.playlist.songs[$scope.currentIndex].artist;
                $scope.changeTrack();


            }
            else {
                $scope.currentIndex += 1;
                $scope.currentSong = $scope.playlist.songs[$scope.currentIndex].title;
                $scope.currentArtist = $scope.playlist.songs[$scope.currentIndex].artist;
                $scope.changeTrack();
            }
        };

        $scope.prev = function() {
            if ($scope.currentIndex === 0) {
                $scope.currentIndex = $scope.playlist.total - 1;
                $scope.currentSong = $scope.playlist.songs[$scope.currentIndex].title;
                $scope.currentArtist = $scope.playlist.songs[$scope.currentIndex].artist;
                $scope.changeTrack();
            }
            else {
                $scope.currentIndex -= 1;
                $scope.currentSong = $scope.playlist.songs[$scope.currentIndex].title;
                $scope.currentArtist = $scope.playlist.songs[$scope.currentIndex].artist;
                $scope.changeTrack();
            }

        };


        $scope.setCurrent = function(value) {
            $scope.audio.currentTime = value;
        };

        $scope.audio.addEventListener("loadedmetadata", function(_event) {
            $scope.$apply(function() {
                $scope.duration = $scope.correctTime($scope.audio.duration);
                $scope.progressBar.max = $scope.audio.duration;
                $scope.changeCover();
            });
        });

        $scope.audio.addEventListener('play', function() {
            $scope.$apply(function() {
                $scope.play();
                $scope.playing = true;
                $scope.duration = $scope.correctTime($scope.audio.duration);
            });
        });

        $scope.audio.addEventListener('timeupdate', function() {
            $scope.$apply(function() {
                $scope.current = $scope.correctTime($scope.audio.currentTime);
                $scope.progress = $scope.audio.currentTime / $scope.audio.duration;
                $scope.progressBar.at = $scope.audio.currentTime;
            });
        });

        $scope.audio.addEventListener('pause', function() {
            $scope.$apply(function() {
                $scope.pause();
                $scope.playing = false;
                $scope.current = $scope.correctTime($scope.audio.currentTime);
            });
        });

        $scope.audio.addEventListener('ended', function() {
            $scope.$apply(function() {
                $scope.next();
            });
        });
    }]);

