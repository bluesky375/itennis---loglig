(function () {
	angular.module("LogligApp.controllers")
    .controller("msgsCtrl", ["appService", "$scope", "$state", "$ionicModal", "notificationsService", "authService", "userManagmentService", "$sce", "$translate", "$ionicScrollDelegate",
      function (appService, $scope, $state, $ionicModal, notificationsService, authService, userManagmentService, $sce, $translate, $ionicScrollDelegate) {

        $scope.themeurl = "lib/videogular-themes-default/videogular.css";
        $scope.fwData = [];
        $scope.fwData.Friends = [];
        $scope.fwData.MsgId = $state.params.messageId;
        $scope.receives = "";
        $scope.sendUnionUsers = [];
        $scope.sendLeagueUsers = [];
        $scope.sendClubUsers = [];
        $scope.sendTeamUsers = [];
        $scope.sendTeams = [];
        $scope.sendTeamOfficials = [];
        $scope.sendPlayers = [];
        $scope.sendFriends = [];
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
        $scope.countReceives = 0;
        $scope.seemReceives = 2;
        $scope.totalReceives = 0;
        $scope.userJobRole = "";
        $scope.isUserSelectAll = false;
        $scope.breceiveTrim = false;

				$scope.user = authService.getUser();

        if($scope.fwData.MsgId != undefined) {
            appService.wait(true);
            notificationsService.getChatUsers().then(function (res) {
                $scope.Friends = res.data.Friends;
                $scope.UnionOfficials = res.data.UnionOfficials;
                $scope.LeagueOfficials = res.data.LeagueOfficials;
                $scope.ClubOfficials = res.data.ClubOfficials;
                $scope.TeamOfficials = res.data.TeamOfficials;
                $scope.Players = res.data.Players;
                $scope.Teams = res.data.Teams;
                $scope.TeamUsers = res.data.TeamUsers;
                $scope.userJobRole = res.data.JobRole;
                $scope.GameName =  res.data.GameName;
                    appService.wait(false);
                }, function (err) {
                    console.log(err);
                    appService.wait(false);
            });
        }
				$scope.teamChanged = function (team) {
					$scope.selectedTeam = team;
					$scope.$broadcast('scroll.refreshComplete');
				};

				$scope.trustSrc = function(src) {
          var ss = $sce.trustAsResourceUrl($scope.util.uploadMedia(src));
          return ss;
        };

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

        $scope.init = function () {
            appService.wait(true);
            notificationsService.getMsgs().then(function (res) {
                $scope.messages = res.data;
                for (var i in $scope.messages) {
                    if ($scope.messages[i].video) {
                        var src = $scope.trustSrc($scope.messages[i].video);
                        $scope.messages[i].video = [];
                        var ss = {};
                        ss.src = src;
                        ss.type = "video/mp4";
                        $scope.messages[i].video.push(ss);
                    }
                    // Pedro : Add : set showAllSubMessage flag
                    $scope.messages[i].bShowAllSubMessage = false;
                    // Pedro : Add : get receives lists
                    $scope.messages[i].receivesStr = "";
                    $scope.messages[i].bShowAllSameSender = false;
                    $scope.messages[i].sameSenderId = -1;
                    $scope.messages[i].compareValue = $scope.messages[i].SendDate;
                    generateMsgReceivesStr($scope.messages[i]);
                    findMessageWithSameSender($scope.messages[i], i);
                    for (var ii in $scope.messages[i].Childs) {
                      if ($scope.messages[i].Childs[ii].video) {
                        var src = $scope.trustSrc($scope.messages[i].Childs[ii].video);
                        $scope.messages[i].Childs[ii].video = [];
                        var ss = {};
                        ss.src = src;
                        ss.type = "video/mp4";
                        $scope.messages[i].Childs[ii].video.push(ss);
                      }
                    }
                }
                $scope.messages.sort(messageCompare);
                
                for (var i in $scope.messages) {
                    unifyMessageWithSameSender($scope.messages[i], i);
                }

                appService.wait(false);
            }, function(err){
                console.log(err);
                appService.wait(false);
            });
        };

        if($scope.fwData.MsgId == undefined) {
        $scope.init();
        }

        $scope.showFullMessage = function(message){
            if( message.sameSenderId >= 0)
                message = $scope.messages[message.sameSenderId];
            message.bShowAllSameSender = !message.bShowAllSameSender
        };

        $scope.replyMessage = function(message){
            $state.go("app.sendreply", {messageId:message.MsgId});
        };

        $scope.deleteMessage = function(message){
            appService.wait(true);
            notificationsService.removeNotification(message.MsgId).then(function () {
                $scope.init();
            }, function(err){
                console.log(err);
                appService.wait(false);
            });
        };

        //Setting up modal view
        $ionicModal.fromTemplateUrl('app/notifications/modal-friends-list.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.initMessageData = function() {
            $scope.isFriendsShown = false;
            $scope.isClubofficialsSelectAll = false;
            $scope.isLeagueOfficialsSelectAll = false;
            $scope.isUnionOfficialsSelectAll = false;
            $scope.isTeamOfficialsSelectAll = false;
            $scope.isPlayersSelectAll = false;
            $scope.isFriendSelectAll = false;
            // Pedro : Init $scope.message
            $scope.message = "";
            $scope.receiveStr = "";
            $scope.countReceives = 0;
            $scope.seemReceives = 2;
            $scope.totalReceives = 0;
            $scope.userJobRole = "";
            $scope.isUserSelectAll = false;
            $scope.breceiveTrim = false;
        }
        $scope.shareMessage = function(message){
/*
            $scope.initMessageData();
            $scope.fwData.MsgId = message.MsgId;
            appService.wait(true);
            notificationsService.getChatUsers().then(function (res) {
                $scope.Friends = res.data.Friends;
                $scope.UnionOfficials = res.data.UnionOfficials;
                $scope.LeagueOfficials = res.data.LeagueOfficials;
                $scope.ClubOfficials = res.data.ClubOfficials;
                $scope.TeamOfficials = res.data.TeamOfficials;
                $scope.Players = res.data.Players;
                $scope.TeamUsers = res.data.TeamUsers;
                $scope.userJobRole = res.data.JobRole;
                $scope.GameName =  res.data.GameName;
                    appService.wait(false);
                }, function (err) {
                    console.log(err);
                    appService.wait(false);
            });
*/            
            $state.go("app.fwdmsgs", {messageId:message.MsgId});
        };


        function generateReceivesStr() {
            if( $scope.isUserSelectAll ) return;
            $scope.countReceives = 0;
            $scope.receiveStr = "";
            $scope.breceiveTrim = false;
            var selUers = $scope.sendUnionUsers
                                .concat($scope.sendLeagueUsers)
                                .concat($scope.sendClubUsers)
                                .concat($scope.sendTeamOfficials)
                                .concat($scope.sendTeams)
                                .concat($scope.sendTeamUsers)
                                .concat($scope.sendFriends);
            $scope.totalReceives = selUers.length;

            if($scope.Friends != null) receiveStrFromArray($scope.Friends);
            if($scope.UnionOfficials != null) receiveStrFromArray($scope.UnionOfficials);
            if($scope.LeagueOfficials != null) receiveStrFromArray($scope.LeagueOfficials);
            if($scope.ClubOfficials != null) receiveStrFromArray($scope.ClubOfficials);
            if($scope.TeamOfficials != null) receiveStrFromArray($scope.TeamOfficials);
            if($scope.Teams != null) receiveStrFromArray($scope.Teams);
            if($scope.TeamUsers != null) receiveStrFromTeamUsers($scope.TeamUsers);
        }

        function generateMsgReceivesStr(message) {
            if(message.Receives == undefined || message.Receives == null)
                return;
            var totalcnt = message.Receives.length;
            var seemReceives = 1;
            var str  = "";
            for (var i = 0; i < totalcnt; i++) {
                if(i > seemReceives) { // i = 2; can see max value
                    var s = "," + "..." + "+" + (totalcnt-i);
                    str = str + s;
                    break;
                }
                if(i > 0) {
                    str = str + ", ";
                }
                str = str + (message.Receives[i].receiveName != null ? message.Receives[i].receiveName : message.Receives[i].shortName);
            }           
            message.receivesStr = str
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

        function findMessageWithSameSender(message, index) {
            for(var i = 0; i < index; i ++) {
                if( $scope.messages[i].sameSenderId < 0 ) {
                    if( $scope.messages[i].receivesStr == message.receivesStr ) {
                        message.compareValue = $scope.messages[i].compareValue;
                        break;
                    }
                }
            }
        }

        function unifyMessageWithSameSender(message, index) {
            for(var i = 0; i < index; i ++) {
                if( $scope.messages[i].sameSenderId < 0 ) {
                    if( $scope.messages[i].receivesStr == message.receivesStr ) {
                        message.sameSenderId = i;
                    }
                }
            }
        }        

         function messageCompare(a, b) {
            if (a.compareValue > b.compareValue)
                return -1;
            if (a.compareValue < b.compareValue)
                return 1;
            if ( a.SendDate > b.SendDate ) 
                return -1;
            if ( a.SendDate < b.SendDate ) 
                return 1;

          return 0;
        }       
        /** Removes first instance of team in array */
        function removeFromArray(arr, userId) {
            if (!arr) return;
            var length = arr.length;
            for (var i = 0; i < length; i++) {
                if (arr[i] == userId) {
                    arr.splice(i, 1);
                    return;
                }
            }
        }

        /** */
        function addToArray(arr, userId) {
            console.log(arr);
            removeFromArray(arr, userId); //To make sure we don't get duplicate values
            try {
                arr.push(userId);
            }
            catch (x) {
              // alert(x);
            }
        }

        $scope.closeModal = function () {
            $state.go("app.msgs");
        };

        $scope.forwardMsg = function () {
            if( $scope.isUserSelectAll ) {
                $scope.fwData.Friends = [];
                $scope.fwData.Friends.push($scope.user.Id);
            }
            else {
                $scope.fwData.Friends = $scope.sendUnionUsers
                                    .concat($scope.sendLeagueUsers)
                                    .concat($scope.sendClubUsers)
                                    .concat($scope.sendTeamOfficials)
                                    .concat($scope.sendTeamUsers)
                                    .concat($scope.sendFriends)
                                    .concat($scope.sendPlayers);
            }            

            if ($scope.fwData.Friends.length == 0) {
              appService.alertPopup($translate.instant("validation_sendmsg_checked"));
                return;
            }
            appService.wait(true);
            if( $scope.isUserSelectAll == false) {
                notificationsService.fwMsg($scope.fwData).then(function (res) {
                    if($scope.sendTeams.length > 0) {
                        $scope.fwData.Friends = $scope.sendTeams;
                        notificationsService.fwMsgForTeam($scope.fwData).then(function (res) {
                            appService.alertPopup($translate.instant("sendmsg_successful"));
                    appService.wait(false);
                    $state.go("app.msgs");
                }, function (res) {
                    appService.wait(false);
                            $state.go("app.msgs");
                       });
                    }
                    else {
                        appService.alertPopup($translate.instant("sendmsg_successful"));
                        appService.wait(false);
                        $state.go("app.msgs");
                    }

                }, function (res) {
                    appService.wait(false);
                    $state.go("app.msgs");
                });                
            }
            else {
                notificationsService.fwAllMsg($scope.fwData.MsgId).then(function (res) {
                    appService.alertPopup($translate.instant("sendmsg_successful"));
                    appService.wait(false);
                    $state.go("app.msgs");
                }, function (res) {
                    appService.wait(false);
                    $state.go("app.msgs");
                });
            }


            $scope.modal.hide();
        };

        $scope.report = function(message) {
          userManagmentService.reportChatMessage(message.SenderName, message.SendDate, message.Message, message.imgUrl, message.videoUrl).then(function () {
            appService.alertPopup($translate.instant("mail_sent_successful"));
          }, function (err) {
            appService.alertPopup("Error during reporting");
          });
        }

        $scope.showHideAllSubuMessage = function(message) {
            message.bShowAllSubMessage = !message.bShowAllSubMessage;
        }

			}]);
})();
