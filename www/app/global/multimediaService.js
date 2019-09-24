(function () {
	"use strict";

	angular.module("LogligApp.services").service("multimediaService", ["$cordovaCamera","$cordovaCapture",
		function ($cordovaCamera, $cordovaCapture) {
			var self = this;

			if (typeof Camera != 'undefined') {
				var cameraOptions = {
          quality: 100,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: false,
          encodingType: Camera.EncodingType.JPEG,
          popoverOptions: CameraPopoverOptions,
          correctOrientation: true,
          saveToPhotoAlbum: false
        };

        var galleryOptions = {
          quality: 100,
          allowEdit: false,
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        };
        var avatarCameraOptions = {
          quality: 50,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: false,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 200,
          targetHeight: 200,
          popoverOptions: CameraPopoverOptions,
          correctOrientation: true,
          saveToPhotoAlbum: false
        };

        var avatarGalleryOptions = {
          quality: 50,
          targetWidth: 200,
          targetHeight: 200,
          allowEdit: false,
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        };
			}

			/** Sets an 'img' element's 'src' with an image taken from the camera */
			this.setImageFromCamera = function (imgElementId) {
				$cordovaCamera.getPicture(cameraOptions).then(function (imageData) {
					var image = document.getElementById(imgElementId);
					image.src = "data:image/jpeg;base64," + imageData;
				}, function (err) {
					// error
				});
			};

			/** Sets an 'img' element's 'src' with an image taken from the gallery */
			this.setImageFromGallery = function (imgElementId) {
				$cordovaCamera.getPicture(galleryOptions).then(function (imageURI) {
					var image = document.getElementById(imgElementId);
					image.src = imageURI;
				}, function (err) {
					// error
				});

				/** only for FILE_URI */
				$cordovaCamera.cleanup().then(function () {

				});
			};

			this.getImageFromGallery = function () {
				return $cordovaCamera.getPicture(galleryOptions);
			};
			/** */
			this.openCamera = function () {
				//var opt = Object.assign({}, cameraOptions); //Cloning the cameraOptions object
				var opt = angular.copy(cameraOptions); //Cloning the cameraOptions object
				opt.destinationType = Camera.DestinationType.FILE_URI;
				return $cordovaCamera.getPicture(opt);
			};

      this.getAvatarImageFromGallery = function () {
        return $cordovaCamera.getPicture(avatarGalleryOptions);
      };

      /** */
      this.openAvatarCamera = function () {
        //var opt = Object.assign({}, cameraOptions); //Cloning the cameraOptions object
        var opt = angular.copy(avatarCameraOptions); //Cloning the cameraOptions object
        opt.destinationType = Camera.DestinationType.FILE_URI;
        return $cordovaCamera.getPicture(opt);
      };

			this.openRecoder = function() {

                var recoderOptions = {
                    limit:1,
                    duration:10
                };
                return $cordovaCapture.captureVideo(recoderOptions);
            };

            this.getVideoFromGallery = function () {
                var videoGalleryOptions = {
                    quality: 50,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    mediaType:Camera.MediaType.VIDEO
                };

                return $cordovaCamera.getPicture(videoGalleryOptions);
            };

		}]);

})();
