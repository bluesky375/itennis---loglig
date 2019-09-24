(function () {
	angular.module("LogligApp.controllers")
		.controller("replySendCtrl", ["appService", "$scope", "$sce", "$state", "notificationsService", "authService", "$cordovaFileTransfer", "$q", "multimediaService", "$ionicPopover", "$translate",
			function (appService, $scope, $sce, $state, notificationsService, authService, $cordovaFileTransfer, $q, multimediaService, $ionicPopover, $translate) {

        $scope.messageId = $state.params.messageId;
        $scope.user = authService.getUser();

				$scope.sendData = {};
        $scope.themeurl = "lib/videogular-themes-default/videogular.css";
        // Pedro : Init $scope.message
        $scope.message = "";

        var textarea = document.querySelector('textarea');
        textarea.addEventListener('keydown', autosize);
        function autosize(){
          var el = this;
          setTimeout(function(){
            el.style.cssText = 'height:auto; padding:0';
            // for box-sizing other than "content-box" use:
            // el.style.cssText = '-moz-box-sizing:content-box';
            var realHeight = el.scrollHeight + 10;
            el.style.cssText = 'height:' + realHeight + 'px';
          },0);
        }   

        $scope.uploadImage = function(imageURI) {
            /**
            Pedro Test : If imageURI is null, imageURL is set by image_test.jpg
            */
            if(imageURI == null) {
                imageURI = "image_test.jpg";
                $scope.serverPath = imageURI;
                appService.wait(false);
                return;
            }
            var deffered = $q.defer();
            var token = JSON.parse(localStorage.getItem(TOKEN_KEY));
            var options = {
                fileKey: "avatar",
                fileName: imageURI.substr(imageURI.lastIndexOf('/')+1),
                chunkedMode: false,
                mimeType: 'image/jpeg',
                headers: {
                    Authorization: token.token_type + ' ' + token.access_token
                }
            };
            console.log('options:'+options);
            $cordovaFileTransfer.upload(API_UPLOAD_IMAGE, imageURI, options)
                .then(function (result) {
                    console.log('Res:'+result);
                    var serverPath = result.response.replace('"', '');
                    serverPath = serverPath.replace('"', '');
                    $scope.serverPath = serverPath;
                    appService.wait(false);
                    deffered.resolve(result);
                }, function (error) {
                    $scope.mdaType = 0;
                    console.log('err:'+error);
                    appService.wait(false);
                    deffered.reject(error);
                }, function (progress) {
                });
        };

        $scope.uploadVideo = function(fileURI) {

            var deffered = $q.defer();
            var token = JSON.parse(localStorage.getItem(TOKEN_KEY));
            var options = {
                fileKey: "avatar",
                fileName: fileURI.substr(fileURI.lastIndexOf('/')+1),
                chunkedMode: false,
                mimeType: 'video/mp4',
                headers: {
                    Authorization: token.token_type + ' ' + token.access_token
                }
            };
            console.log('options:'+options);
            $cordovaFileTransfer.upload(API_UPLOAD_VIDEO, fileURI, options)
                .then(function (result) {
                    console.log('Res:'+result);
                    var serverPath = result.response.replace('"', '');
                    serverPath = serverPath.replace('"', '');
                    $scope.serverPath = serverPath;
                    var url = $scope.util.uploadMedia($scope.serverPath);
                    $scope.sources = [
                      {src: $sce.trustAsResourceUrl(url), type: "video/mp4"}
                    ];
                    appService.wait(false);
                    deffered.resolve(result);
                }, function (error) {
                    console.log('err:'+error);
                    $scope.mdaType = 0;
                    appService.wait(false);
                    deffered.reject(error);
                }, function (progress) {
                });
        };

        $scope.sendMsg = function() {

            /** 
            * Pedro :  should be able to send img or video without texting also 
            */
            switch($scope.mdaType) {
                case 1:
                    $scope.sendData.img = $scope.serverPath;
                break;
                case 2:
                    $scope.sendData.video = $scope.serverPath;
                break;
                default:
            if ($scope.message.length == 0){
                      appService.alertPopup($translate.instant("validation_sendmsg_checked"));
                return;
            }
                break;
            }

            $scope.sendData.Message = $scope.message;
            $scope.sendData.parent = $scope.messageId;
            appService.wait(true);
            notificationsService.sendMsg($scope.sendData).then(function (res) {
              // console.log('Sent messages' + res);
              appService.alertPopup($translate.instant("sendmsg_successful"));
              appService.wait(false);
                $state.go("app.msgs");
            }, function (res) {
                appService.wait(false);
                console.log('Bug');
            });

        };

        $scope.cancel = function() {
            $state.go("app.msgs");
        };

        $ionicPopover.fromTemplateUrl('picture-dropdown.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popover = popover;
        });

        // Pedro : add : remove the video preview from message box of all message (replay and send)
        $scope.removeVideo = function() {
            appService.wait(true);                
            $scope.mdaType = 0;
            $scope.serverPath = "";
            appService.wait(false);
        }

        $scope.openPopover = function(i, $event) {
            $scope.cameraMode = i;
            $scope.popover.show($event);
        };

        $scope.openGallery = function () {

            $scope.popover.hide();
            if ($scope.cameraMode == 2) {
                /**
                Pedro Test : If fileURI is null, fileURI is set by video_test.mp4
                */
                {
                    appService.wait(true);                
                    $scope.mdaType = 2;
                    $scope.serverPath = "video_test.mp4";
                    appService.wait(false);
                    return;
                }
                multimediaService.getVideoFromGallery()
                    .then(function (imageURI) {
                        $scope.mdaType = 2;
                        appService.wait(true);
                        $scope.uploadVideo(imageURI);
                    }, function (err) {
                        $scope.mdaType = 0;
                        alert('err=' + JSON.stringify(err));
                    });

            } else {
                multimediaService.getImageFromGallery()
                    .then(function (imageURI) {
                        $scope.mdaType = 1;
                        appService.wait(true);
                        $scope.uploadImage(imageURI);
                    }, function (err) {
                        $scope.mdaType = 0;
                        alert('err=' + JSON.stringify(err));
                    });
            }
        };

        $scope.openCamera = function () {
            $scope.popover.hide();
            if ($scope.cameraMode == 1) {
                multimediaService.openCamera()
                    .then(function (imageURI) {
                        $scope.mdaType = 1;
                        appService.wait(true);
                        $scope.uploadImage(imageURI);
                    }, function (err) {
                        $scope.mdaType = 0;
                        alert('err=' + JSON.stringify(err));
                    });

            } else {
                multimediaService.openRecoder()
                    .then(function (mediaFiles) {
                        var i, path, len;
                        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                            $scope.mdaType = 2;
                            appService.wait(true);
                            $scope.uploadVideo(mediaFiles[i].fullPath);
                            // do something interesting with the file
                        }
                    }, function (err) {
                        $scope.mdaType = 0;
                        appService.alertPopup('Error', err.code, null);
                    });
            }
        };
    }]);
})();
