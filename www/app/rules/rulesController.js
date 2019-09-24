(function(){
	'use strict';

	function RulesCtrl(appService, rulesService, $scope, unionService, $cordovaFileOpener2){
		this._appService = appService;
		this._rulesService = rulesService;
		this._$scope = $scope;
		this.unionService = unionService;
		this.$cordovaFileOpener2 = $cordovaFileOpener2;
		this._init();
	}

	RulesCtrl.$inject = [
		'appService',
		'rulesService',
		'$scope',
		'unionService',
		'$cordovaFileOpener2',
	];

	RulesCtrl.prototype._init = function(){
		var self = this;
		this._appService.wait(true);



        this.unionService.getUnion().then(function (result, error) {
			// result.data;
			self._appService.wait(true);
			var union;
			if(result){
				//console.log("herecheckmerule" + JSON.stringify(result.data));
				union = result.data;
			}
			
			self._$scope.openRules = function() { 
				console.log("herecheckmerule" + JSON.stringify(union.DocId));
				if(union && union.DocId > 0 ) {
					var pdfSrc =  base64ToArrayBuffer(union.DocFile);
					let file = new Blob([pdfSrc], { type: 'application/pdf' });            
					var fileURL = URL.createObjectURL(file);
					alert('fileURL: ' + fileURL);
					window.open(fileURL);
					var folderpath = "";
					console.log("herecheckmerule" + JSON.stringify(union.DocId));
					if (ionic.Platform.isIOS()) {
						folderpath = cordova.file.dataDirectory;
					} else if (ionic.Platform.isAndroid()) {
						folderpath = cordova.file.externalRootDirectory;
					}
					else {
						var pdfSrc =  base64ToArrayBuffer(union.DocFile);
						let file = new Blob([pdfSrc], { type: 'application/pdf' });            
						var fileURL = URL.createObjectURL(file);
						alert('fileURL: ' + fileURL);
						window.open(fileURL);	
						return;
					}
					console.log(folderpath + union.TermsFilePath);
					var filename = union.TermsFilePath;
					savebase64AsPDF(folderpath,filename, union.DocFile, 'application/pdf');
				}
			};

			/**
			 * Convert a base64 string in a Blob according to the data and contentType.
			 * 
			 * @param b64Data {String} Pure base64 string without contentType
			 * @param contentType {String} the content type of the file i.e (application/pdf - text/plain)
			 * @param sliceSize {Int} SliceSize to process the byteCharacters
			 * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
			 * @return Blob
			 */
			function b64toBlob(b64Data, contentType, sliceSize) {
			        contentType = contentType || '';
			        sliceSize = sliceSize || 512;

			        var byteCharacters = atob(b64Data);
			        var byteArrays = [];

			        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
			            var slice = byteCharacters.slice(offset, offset + sliceSize);

			            var byteNumbers = new Array(slice.length);
			            for (var i = 0; i < slice.length; i++) {
			                byteNumbers[i] = slice.charCodeAt(i);
			            }

			            var byteArray = new Uint8Array(byteNumbers);

			            byteArrays.push(byteArray);
			        }

			      var blob = new Blob(byteArrays, {type: contentType});
			      return blob;
			}

			/**
			 * Create a PDF file according to its database64 content only.
			 * 
			 * @param folderpath {String} The folder where the file will be created
			 * @param filename {String} The name of the file that will be created
			 * @param content {Base64 String} Important : The content can't contain the following string (data:application/pdf;base64). Only the base64 string is expected.
			 */
			function savebase64AsPDF(folderpath,filename,content,contentType){
			    // Convert the base64 string in a Blob
			    var DataBlob = b64toBlob(content,contentType);
			    
			    console.log("Starting to write the file :3");
			    window.resolveLocalFileSystemURL(folderpath, function(dir) {
			        console.log("Access to the directory granted succesfully");
					dir.getFile(filename, {create:true}, function(file) {
			            console.log("File created succesfully.");
			            file.createWriter(function(fileWriter) {
			                console.log("Writing content to file");
			                fileWriter.write(DataBlob);
			                openLocalPdf(folderpath+filename)
			            }, function(){
			                alert('Unable to save file in path '+ folderpath);
			            });
					});
			    });
			}

			function base64ToArrayBuffer(base64) {
			    const binary_string = window.atob(base64);
			    const len = binary_string.length;
			    const bytes = new Uint8Array(len);
			    for (let i = 0; i < len; i++) {
			        bytes[i] = binary_string.charCodeAt(i);
			    }
			    return bytes.buffer;
			}			

			function openLocalPdf(pdfFile) {		
	            //window.open(pdfFile);
	            self.$cordovaFileOpener2.open(pdfFile, 'application/pdf')
	            	.then(() => console.log('File is opened'))
  					.catch(e => alert('Error opening file', e));
	
			}

			self._appService.wait(false);
        }, function (err) {
            alert(err);
            self.appService.wait(false);
		});

	};

	angular
		.module('LogligApp.controllers')
		.controller('rulesCtrl', RulesCtrl) 
}());