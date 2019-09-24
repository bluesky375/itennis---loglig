(function () {
	angular.module("LogligApp.controllers")
    .controller("msgsSendCtrl", ["appService", "$scope", "$sce", "$state", "notificationsService", "authService", "$cordovaFileTransfer", "$q", "multimediaService", "$ionicPopover", "$translate",
      function (appService, $scope, $sce, $state, notificationsService, authService, $cordovaFileTransfer, $q, multimediaService, $ionicPopover, $translate) {

		$scope.user = authService.getUser();
        // $scope.selectedTeam = fanManageService.getLastTeam();
        $scope.sendUnionUsers = [];
		$scope.sendLeagueUsers = [];
		$scope.sendClubUsers = [];
		$scope.sendTeamUsers = [];
        $scope.sendTeams = [];
        $scope.sendTeamOfficials = [];
		$scope.sendPlayers = [];
		$scope.sendFriends = [];
		$scope.mdaType = 0; //1:img, 2:video
        $scope.receiverId = $state.params.receiverId;
		$scope.sendData = {};
        $scope.themeurl = "lib/videogular-themes-default/videogular.css";
        $scope.poster = "images/videoplay.jpg";

        $scope.toggleIndex = 0;
        $scope.isFriendsShown = false;
        $scope.isClubofficialsSelectAll = false;
        $scope.isLeagueOfficialsSelectAll = false;
        $scope.isUnionOfficialsSelectAll = false;
        $scope.isTeamOfficialsSelectAll = false;
        $scope.isTeamsSelectAll = false;
        $scope.isPlayersSelectAll = false;
        $scope.isFriendSelectAll = false;
        // Pedro : Init $scope.message
        $scope.message = "";
        $scope.receiveStr = "";
        $scope.breceiveTrim = false;
        $scope.countReceives = 0;
        $scope.seemReceives = 2;
        $scope.totalReceives = 0;
        $scope.userJobRole = "";
        $scope.isUserSelectAll = false;

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

        appService.wait(true);
        init();

        function init() {
            notificationsService.getChatUsers().then(function (res) {
                $scope.Friends = res.data.Friends;
                $scope.UnionOfficials = res.data.UnionOfficials;
                $scope.LeagueOfficials = res.data.LeagueOfficials;
                $scope.ClubOfficials = res.data.ClubOfficials;
                $scope.TeamOfficials = res.data.TeamOfficials;
                $scope.Players = res.data.Players;
                // Pedro: Add
                $scope.Teams = res.data.Teams;
                $scope.TeamUsers = res.data.TeamUsers;
                $scope.userJobRole = res.data.JobRole;
                $scope.GameName =  res.data.GameName;
                prevSelectReceivers();
                    appService.wait(false);
                }, function (err) {
                    console.log(err);
                    appService.wait(false);
                    init();
            });            
        }
        
        function prevSelectReceivers()
        {
            if($scope.receiverId != undefined) {
                if( $scope.Friends != undefined && $scope.Friends.length > 0 ) {
                    for (var i in $scope.Friends) {
                        if( $scope.Friends[i].UserId == $scope.receiverId ) {
                            $scope.selectFriend($scope.Friends[i]);
                            break;
                        }
                    }        
                }
            }
        }

        $scope.friendSelectAll = function() {
            $scope.isFriendSelectAll = !$scope.isFriendSelectAll;
            var bSelectAll = $scope.isFriendSelectAll;    
            for (var i in $scope.Friends) {
                if(true /* $scope.Friends[i].UserRole == 'fans' */) { // if not fans, ignored  
                    $scope.Friends[i].checked = $scope.isFriendSelectAll;
                    if(bSelectAll)
                        addToArray($scope.sendFriends, $scope.Friends[i]);
                    else
                        removeFromArray($scope.sendFriends, $scope.Friends[i])
                }
                else
                    $scope.Friends[i].checked = false;
            }
            generateReceivesStr();
        };

        function updateFriendsSelectAllFlag() {
            var flag = true; 
             for (var i in $scope.Friends) {
                if(true /* $scope.Friends[i].UserRole == 'fans' */) { // if not fans, ignored
                    flag = $scope.Friends[i].checked;
                    if(!flag) break;
                }
            }
            $scope.isFriendSelectAll = flag;
            generateReceivesStr();
        }

        $scope.teamOfficialsSelectAll = function() {
            $scope.isTeamOfficialsSelectAll = !$scope.isTeamOfficialsSelectAll;
            var bSelectAll = $scope.isTeamOfficialsSelectAll;
            for (var i in $scope.TeamOfficials) {
                $scope.TeamOfficials[i].checked = $scope.isTeamOfficialsSelectAll;
                if(bSelectAll)
                    addToArray($scope.sendTeamOfficials, $scope.TeamOfficials[i]);
                else
                    removeFromArray($scope.sendTeamOfficials, $scope.TeamOfficials[i])
            }
            generateReceivesStr();
        };
        $scope.teamsSelectAll = function() {
            $scope.isTeamsSelectAll = !$scope.isTeamsSelectAll;
            var bSelectAll = $scope.isTeamsSelectAll;
            for (var i in $scope.Teams) {
                $scope.Teams[i].checked = $scope.isTeamsSelectAll;
                if(bSelectAll)
                    addToArray($scope.sendTeams, $scope.Teams[i]);
                else
                    removeFromArray($scope.sendTeams, $scope.Teams[i])
            }
            generateReceivesStr();
        };
        function updateTeamOfficialsSelectAllFlag() {
            var flag = true; 
             for (var i in $scope.TeamOfficials) {
                flag = $scope.TeamOfficials[i].checked;
                if(!flag) break;
            }
            $scope.isTeamOfficialsSelectAll = flag;
            generateReceivesStr();
        }

        function updateTeamsSelectAllFlag() {
            var flag = true; 
             for (var i in $scope.Teams) {
                flag = $scope.Teams[i].checked;
                if(!flag) break;
            }
            $scope.isTeamsSelectAll = flag;
            generateReceivesStr();
        }

        $scope.userSelectAll = function() {
            $scope.isUserSelectAll = !$scope.isUserSelectAll;
            var bSelAll = $scope.isUserSelectAll;
/*
            if( $scope.userJobRole == 'unionmgr' ) {
                for (var i in $scope.UnionOfficials) {
                    if( bSelAll )
                        addToArray($scope.sendUnionUsers, $scope.UnionOfficials[i]);
                    else
                        removeFromArray($scope.sendUnionUsers, $scope.UnionOfficials[i]);
                }
            }
            else if( $scope.userJobRole == 'clubmgr' ) {
                for (var i in $scope.ClubOfficials) {
                    if( bSelAll )
                        addToArray($scope.sendClubUsers, $scope.ClubOfficials[i]);
                    else
                        removeFromArray($scope.sendClubUsers, $scope.ClubOfficials[i]);       
                }
            }
            else if( $scope.userJobRole == 'leaguemgr' ) {
                for (var i in $scope.LeagueOfficials) {
                    if( bSelAll )
                        addToArray($scope.sendLeagueUsers, $scope.LeagueOfficials[i]);
                    else
                        removeFromArray($scope.sendLeagueUsers, $scope.LeagueOfficials[i]);       
                }
            }
*/          
            if( bSelAll )  {
                $scope.isClubofficialsSelectAll = false; 
                $scope.isTeamOfficialsSelectAll = false; 
                $scope.isTeamsSelectAll = false; 
                $scope.isLeagueOfficialsSelectAll = false; 
                $scope.isPlayersSelectAll = false; 
                $scope.isFriendSelectAll = false; 
                $scope.receiveStr = $scope.GameName;
            }    
            else {
                $scope.isClubofficialsSelectAll = true;
                $scope.isTeamOfficialsSelectAll = true;
                $scope.isTeamsSelectAll = true;
                $scope.isLeagueOfficialsSelectAll = true;
                $scope.isPlayersSelectAll = true;
                $scope.isFriendSelectAll = true;

                generateReceivesStr();
            }   
            $scope.clubofficialsSelectAll();
            $scope.teamOfficialsSelectAll();
            $scope.teamsSelectAll();
            $scope.leagueOfficialsSelectAll();
            $scope.playersSelectAll();
            $scope.friendSelectAll();
        };

        $scope.unionOfficialsSelectAll = function() {
            $scope.isUnionOfficialsSelectAll = !$scope.isUnionOfficialsSelectAll;
            var bSelectAll = $scope.isUnionOfficialsSelectAll;

            for (var i in $scope.UnionOfficials) {
                $scope.UnionOfficials[i].checked = $scope.isUnionOfficialsSelectAll;
                if(bSelectAll)
                    addToArray($scope.sendUnionUsers, $scope.UnionOfficials[i]);
                else
                    removeFromArray($scope.sendUnionUsers, $scope.UnionOfficials[i])
            }
            generateReceivesStr();
        };

        function updateUnionOfficialsSelectAllFlag() {
            var flag = true; 
             for (var i in $scope.UnionOfficials) {
                flag = $scope.UnionOfficials[i].checked;
                if(!flag) break;
            }
            $scope.isUnionOfficialsSelectAll = flag;
            generateReceivesStr();
        }

        $scope.clubofficialsSelectAll = function() {
            $scope.isClubofficialsSelectAll = !$scope.isClubofficialsSelectAll;
            var bSelectAll = $scope.isClubofficialsSelectAll;

            for (var i in $scope.ClubOfficials) {
                $scope.ClubOfficials[i].checked = $scope.isClubofficialsSelectAll;
                if(bSelectAll)
                    addToArray($scope.sendClubUsers, $scope.ClubOfficials[i]);
                else
                    removeFromArray($scope.sendClubUsers, $scope.ClubOfficials[i])
            }
            generateReceivesStr();
        };
        function updateClubOfficialsSelectAllFlag() {
            var flag = true; 
             for (var i in $scope.ClubOfficials) {
                flag = $scope.ClubOfficials[i].checked;
                if(!flag) break;
            }
            $scope.isClubofficialsSelectAll = flag;
            generateReceivesStr();
        }

        $scope.leagueOfficialsSelectAll = function() {
            $scope.isLeagueOfficialsSelectAll = !$scope.isLeagueOfficialsSelectAll;
            var bSelectAll = $scope.isLeagueOfficialsSelectAll;

            for (var i in $scope.LeagueOfficials) {
                $scope.LeagueOfficials[i].checked = $scope.isLeagueOfficialsSelectAll;
                if(bSelectAll)
                    addToArray($scope.sendLeagueUsers, $scope.LeagueOfficials[i]);
                else
                    removeFromArray($scope.sendLeagueUsers, $scope.LeagueOfficials[i])
            }
            generateReceivesStr();
        };
        function updateLeagueOfficialsSelectAllFlag() {
            var flag = true; 
             for (var i in $scope.LeagueOfficials) {
                flag = $scope.LeagueOfficials[i].checked;
                if(!flag) break;
            }
            $scope.isLeagueOfficialsSelectAll = flag;
            generateReceivesStr();
        }

        $scope.playersSelectAll = function() {
            $scope.isPlayersSelectAll = !$scope.isPlayersSelectAll;
            var bSelectAll = $scope.isPlayersSelectAll;

            for (var i in $scope.Players) {
                $scope.Players[i].checked = $scope.isPlayersSelectAll;
                if(bSelectAll)
                    addToArray($scope.sendPlayers, $scope.Players[i]);
                else
                    removeFromArray($scope.sendPlayers, $scope.Players[i])
            }
            generateReceivesStr();
        };
        function updatePlayersSelectAllFlag() {
            var flag = true; 
             for (var i in $scope.Players) {
                flag = $scope.Players[i].checked;
                if(!flag) break;
            }
            $scope.isPlayersSelectAll = flag;
            generateReceivesStr();
        }

        $scope.toggleFriends = function() {
            if ($scope.isFriendsShown)
                $scope.isFriendsShown = false;
            else
                $scope.isFriendsShown = true;
        };

        $scope.selectFriend = function(friend) {
            friend.checked = !friend.checked;
            if (friend.checked) {
                addToArray($scope.sendFriends, friend)
            } else  {
                removeFromArray($scope.sendFriends, friend)
            }
            updateFriendsSelectAllFlag();
        };

        $scope.toggleWorkers = function(idx) {
            if ($scope.toggleIndex == idx)
                $scope.toggleIndex = 0;
            else
                $scope.toggleIndex = idx;
        };

        $scope.selectWorker = function(idx, worker) {
            worker.checked = !worker.checked;

            switch (idx) {
                case 1 : // Union
                    if (worker.checked) {
                        addToArray($scope.sendUnionUsers, worker)
                    } else  {
                        removeFromArray($scope.sendUnionUsers, worker)
                    }
                    updateUnionOfficialsSelectAllFlag();
                    break;
                case 2: // League
                    if (worker.checked) {
                        addToArray($scope.sendLeagueUsers, worker)
                    } else  {
                        removeFromArray($scope.sendLeagueUsers, worker)
                    }
                    updateLeagueOfficialsSelectAllFlag();
                    break;
                case 3: // Club
                    if (worker.checked) {
                        addToArray($scope.sendClubUsers, worker)
                    } else  {
                        removeFromArray($scope.sendClubUsers, worker)
                    }
                    updateClubOfficialsSelectAllFlag();
                    break;
                case 4: // TeamOfficial
                    if (worker.checked) {
                        addToArray($scope.sendTeamOfficials, worker)
                    } else  {
                        removeFromArray($scope.sendTeamOfficials, worker)
                    }
                    updateTeamOfficialsSelectAllFlag();
                    break;
                case 5: // Team
                    if (worker.checked) {
                        addToArray($scope.sendTeams, worker)
                    } else  {
                        removeFromArray($scope.sendTeams, worker)
                    }
                    updateTeamsSelectAllFlag();
                    break;
                default:
                    selectUserForTeam(idx, worker);                    
                    break;
            }
        };

        function updateTeamUsersSelectAllFlag(teamId) {
            var usersOfTeam = [];
            var cnt = 0;
            var flag = true; 
            
            for (cnt in $scope.TeamUsers) {
                if( $scope.TeamUsers[cnt].TeamId == teamId ) {
                    usersOfTeam = $scope.TeamUsers[cnt].Users;
                    break;
                }
            }
            if( usersOfTeam.length ) {
                for (var i in usersOfTeam) {
                    flag = usersOfTeam[i].checked;
                    if(!flag) break;
                }
                $scope.TeamUsers[cnt].IsSelectAll = flag;
                generateReceivesStr();
            }
        }

        function selectUserForTeam(teamId, user) {
            if (user.checked) {
                addToArray($scope.sendTeamUsers, user)
            } else  {
                removeFromArray($scope.sendTeamUsers, user)
            }
            updateTeamUsersSelectAllFlag(teamId);
        }

        $scope.selectAllUsersForTeam= function(teamId) {
            var usersOfTeam = [];
            var cnt = 0;
            var flag = true; 
            
            for (cnt in $scope.TeamUsers) {
                if( $scope.TeamUsers[cnt].TeamId == teamId ) {
                    usersOfTeam = $scope.TeamUsers[cnt].Users;
                    break;
                }
            }

            if(usersOfTeam.length > 0) {
                $scope.TeamUsers[cnt].IsSelectAll = !$scope.TeamUsers[cnt].IsSelectAll;
                var bSelectAll = $scope.TeamUsers[cnt].IsSelectAll;
                for (var i in usersOfTeam) {
                    usersOfTeam[i].checked = bSelectAll;
                    if(bSelectAll)
                        addToArray($scope.sendTeamUsers, usersOfTeam[i]);
                    else
                        removeFromArray($scope.sendTeamUsers, usersOfTeam[i])
                }
                generateReceivesStr();
            }   
        }

        $scope.uploadImage = function(imageURI) {
            if( imageURI == null ) return;
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
            if( fileURI == null ) return;
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
            // test 
                $scope.serverPath = "test.mp4";
                var url = $scope.util.uploadMedia($scope.serverPath);
                console.log("video url = "+url);
                $scope.sources = [
                  {src: $sce.trustAsResourceUrl(url), type: "video/mp4"}
                ];
                return;
            //
            $cordovaFileTransfer.upload(API_UPLOAD_VIDEO, fileURI, options)
                .then(function (result) {
                    console.log('Res:'+result);
                    var serverPath = result.response.replace('"', '');
                    serverPath = serverPath.replace('"', '');
                    $scope.serverPath = serverPath;
                    var url = $scope.util.uploadMedia($scope.serverPath);
                    console.log("video url = "+url);
                    $scope.sources = [
                      {src: $sce.trustAsResourceUrl(url), type: "video/mp4"}
                    ];
                    appService.wait(false);
                    deffered.resolve(result);
                }, function (error) {
                    console.log(error);
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
            $scope.sendData.parent = 0;
            $scope.sendData.SendAllFlag = $scope.isUserSelectAll;

            if( $scope.isUserSelectAll ) {
                $scope.sendData.Users = [];
                $scope.sendData.Users.push($scope.user.Id);    
            }
            else {
                $scope.sendData.Users = $scope.sendUnionUsers
                                    .concat($scope.sendLeagueUsers)
                                    .concat($scope.sendClubUsers)
                                    .concat($scope.sendTeamOfficials)
                                    .concat($scope.sendTeamUsers)
                                    .concat($scope.sendFriends)
                                    .concat($scope.sendPlayers);
            }


            if ($scope.sendData.Users.length == 0) {
                appService.alertPopup($translate.instant('validation_teams_checked'));
                return;
            }
            appService.wait(true);
            notificationsService.sendMsg($scope.sendData).then(function (res) {
              // console.log('Sent messages' + res);
              // Pedro : remove :  
              /** after sending a message gets alert message with the message I sent. 
              No need to show it (I know what I sent). 
              Just show the message that exist "sent message successfully" 
              
              */
              if($scope.sendTeams.length > 0) {
                  $scope.sendData.Users = $scope.sendTeams;
                  notificationsService.sendMsgForTeam($scope.sendData).then(function (res) {
                        appService.alertPopup($translate.instant("sendmsg_successful"));
                        appService.wait(false);
                        $state.go("app.msgs");
                  }, function (res) {
                    appService.wait(false);
                    $state.go("app.msgs");
                   });
              }
              else {
                appService.wait(false);
                appService.alertPopup($translate.instant("sendmsg_successful"));
                $state.go("app.msgs");
              }
            }, function (res) {
                appService.wait(false);
                $state.go("app.msgs");
            });

        };

        $scope.cancel = function() {
            $state.go("app.msgs");
        };

        function generateReceivesStr() {
            if( $scope.isUserSelectAll ) return;
            $scope.countReceives = 0;
            $scope.receiveStr = "";
            var selUers = $scope.sendUnionUsers
                                .concat($scope.sendLeagueUsers)
                                .concat($scope.sendClubUsers)
                                .concat($scope.sendTeamOfficials)
                                .concat($scope.sendTeams)
                                .concat($scope.sendTeamUsers)
                                .concat($scope.sendFriends);
            $scope.totalReceives = selUers.length;
            $scope.breceiveTrim = false;
            if($scope.Friends != null) receiveStrFromArray($scope.Friends);
            if($scope.UnionOfficials != null) receiveStrFromArray($scope.UnionOfficials);
            if($scope.LeagueOfficials != null) receiveStrFromArray($scope.LeagueOfficials);
            if($scope.ClubOfficials != null) receiveStrFromArray($scope.ClubOfficials);
            if($scope.TeamOfficials != null) receiveStrFromArray($scope.TeamOfficials);
            if($scope.Teams != null) receiveStrFromArray($scope.Teams);
            if($scope.TeamUsers != null) receiveStrFromTeamUsers($scope.TeamUsers);
        }

        function receiveStrFromTeamUsers(array) {
            var breakFlag = false;
            var str  = $scope.receiveStr;
            for (var k = 0; k < array.length; k++ ) {
                for (var i = 0; i < array[k].Users.length; i++) {
                    if(!array[k].Users[i].checked) continue;
                    if($scope.countReceives > $scope.seemReceives) { // i = 2; can see max value
                        str = str + "," + "..." + "+" + ($scope.totalReceives-$scope.countReceives);
                        breakFlag = true;
                        break;
                    }
                    if($scope.countReceives > 0) {
                        str = str + ", ";
                    }
                    str = str + array[k].Users[i].UserName;
                    $scope.countReceives ++;
                }     
                if(breakFlag == true) break;      
            }
            $scope.receiveStr = str; 
        }

        function receiveStrFromArray(array) {
            var str  = $scope.receiveStr;
            if($scope.breceiveTrim == true && $scope.totalReceives > $scope.countReceives) {
                return;
            }
            for (var i = 0; i < array.length; i++) {
                if(!array[i].checked) continue;
                if($scope.countReceives > $scope.seemReceives) { // i = 2; can see max value
                    $scope.breceiveTrim = true;
                    str = str + "," + "..." + "+" + ($scope.totalReceives-$scope.countReceives);
                    break;
                }
                if($scope.countReceives > 0) {
                    str = str + ", ";
                }
                str = str + array[i].UserName;
                $scope.countReceives ++;
            }           
            $scope.receiveStr = str; 
        }

        /** Removes first instance of team in array */
        function removeFromArray(arr, user) {
            if (!arr) return;
            var length = arr.length;
            for (var i = 0; i < length; i++) {
                if (arr[i] == user.UserId) {
                    arr.splice(i, 1);
                    return;
                }
            }
        }

        /** */
        function addToArray(arr, user) {
            console.log(arr);
            removeFromArray(arr, user.UserId); //To make sure we don't get duplicate values
            try {
                arr.push(user.UserId);
            }
            catch (x) {
                alert(x);
            }
        }

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
            if($scope.receiveStr != null && $scope.receiveStr != '') {
                $scope.cameraMode = i;
                $scope.popover.show($event);
            }
        };

        $scope.openGallery = function () {
            $scope.popover.hide();
            if ($scope.cameraMode == 2) {
                // test
                //$scope.mdaType = 2;
                //$scope.uploadVideo("file:///C:/Users/Happy/Pictures/test.mp4");   
                // return;             
                //
                multimediaService.getVideoFromGallery()
                    .then(function (imageURI) {
                        $scope.mdaType = 2;
                        appService.wait(true);
                        $scope.uploadVideo(imageURI);
                    }, function (err) {
                        appService.wait(false);
                        $scope.mdaType = 0;
                        //alert('err=' + JSON.stringify(err));
                    });

            } else {
                multimediaService.getImageFromGallery()
                    .then(function (imageURI) {
                        $scope.mdaType = 1;
                        appService.wait(true);
                        $scope.uploadImage(imageURI);
                    }, function (err) {
                        appService.wait(false);
                        $scope.mdaType = 0;
                        //alert('err=' + JSON.stringify(err));
                    });
            }
        };

        $scope.openCamera = function () {
            $scope.popover.hide();
            if ($scope.cameraMode == 1) {
                multimediaService.openCamera()
                    .then(function (imageURI) {
                        appService.wait(true);
                        $scope.mdaType = 1;
                        $scope.uploadImage(imageURI);
                    }, function (err) {
                        appService.wait(false);
                        $scope.mdaType = 0;
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
                        appService.wait(false);
                        $scope.mdaType = 0;
                    });
            }
        };
    }]);
})();
