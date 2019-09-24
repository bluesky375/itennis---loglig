(function () {
  "use strict";
  angular.module("LogligApp.services").service("unionService", ["apiService",
    function (apiService) {

      this.getUnion = function () {
        return apiService.getByUrl(API_UNION_PAGE + UNION_ID);
      };

      this.getBanners = function () {
        return apiService.getByUrl(API_UNION_BANNERS + UNION_ID);
      };

      this.getActivities = function () {
        return apiService.getByUrl(API_UNION_ACTIVITIES + UNION_ID);
      }

      this.getClubs = function (area = 1) {
        switch (area) {
          case 1:
              return apiService.getByUrl(API_UNION_CLUBSAREA1 + UNION_ID);
            break;
          case 2:
              return apiService.getByUrl(API_UNION_CLUBSAREA2 + UNION_ID);
            break;
          case 3:
              return apiService.getByUrl(API_UNION_CLUBSAREA3 + UNION_ID);
            break;
          case 4:
              return apiService.getByUrl(API_UNION_CLUBSAREA4 + UNION_ID);
            break;
          case 5:
              return apiService.getByUrl(API_UNION_CLUBSAREA5 + UNION_ID);
            break;
          default:
              // return apiService.getByUrl(API_UNION_CLUBSAREA1 + UNION_ID);
            break;
        }
      }
      this.increaseBannerVisit = function (bannerId) {
        return apiService.getByUrl(API_INCREASE_BANNER + bannerId);
      };

      this.getClub = function (clubId) {
        return apiService.getByUrl(API_CLUB_PAGE + clubId + '?UnionId=' + UNION_ID);
      }
      this.getPlayersForClub = function (clubId) {
        return apiService.getByUrl(API_CLUB_PAGE + "players/" + clubId + '?UnionId=' + UNION_ID);
      };

      this.getFansForClub = function (clubId) {
        return apiService.getByUrl(API_CLUB_PAGE + "fans/" + clubId + '?UnionId=' + UNION_ID);
      };

      this.getCompetitionAgeList = function () {
        return apiService.getByUrl(API_RANKINGS_AGE_LIST + UNION_ID);
      };

      this.getUnionRanks = function (ageId) {
        return apiService.getByUrl(API_UNION_RANKINGS + UNION_ID + '/ageId/' + ageId);
      };
    }
  ]);
})();
