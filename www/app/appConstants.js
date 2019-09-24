var SPORT_TYPE = 'Tennis';
var UNION_ID = '38';
var LANGUAGE = 'iw';
//var PUSH_NUMBER = "943145511185";
var PUSH_NUMBER = "352609738091";

var TOKEN_KEY = 'token';
var USER_INFO_KEY = 'userInfo';
var MAX_TEAM_SELECTION = 3;

var USER_TYPE_GUEST = 0;
var USER_TYPE_FAN = 1;
var USER_TYPE_WORKER = 2;
var USER_TYPE_ADMIN = 3;
var USER_TYPE_EDITOR = 4;

var LOGIN_TYPE_UP = 1;
var LOGIN_TYPE_FB = 2;
var LOGIN_TYPE_WORKER = 3;

var HTTP_STATUS_OK = 200;
var HTTP_STATUS_CREATED = 202;
var HTTP_STATUS_BAD_REQUEST = 400;
var HTTP_STATUS_NOT_FOUND = 404;
var HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

var REGEX_VALIDATION_ID = /^[0-9]{7,10}$/g;
var DEEP_LINK =  "http://itennis-loglig.app.link/NYixQeXORZ"
var _env = 'local';//production, dev, local
var CMS_URL = 'http://loglig.com';
var BASE_API_URL = 'http://loglig.com:8080'; // production
var ASSETS_URL = 'http://loglig.com/assets/';
switch (_env){
    case 'local' :
        CMS_URL = 'http://localhost:6464';
        BASE_API_URL = 'http://localhost:6565';
        ASSETS_URL = 'http://localhost:6464/assets/';
        break;
    case 'dev' :
        CMS_URL = 'http://52.50.14.212';
        BASE_API_URL = 'http://52.50.14.212:8080';
        ASSETS_URL = 'http://52.50.14.212/assets/';
        break;
    default :
        break;
}

var PUSH_TOKEN_REGISTER_URL = "http://ipadservicestest.yit.co.il/WcfRestServiceIphoneIpadMessages/ServiceIphoneIpadMessages/tokens/"; //qa
//var PUSH_TOKEN_REGISTER_URL = "http://ipadservices.yit.co.il/WcfRestServiceIphoneIpadMessages/ServiceIphoneIpadMessages/tokens/"; //production

var LEAGUE_DEFAULT_IMAGE = "images/league-default.png";
var FAN_DEFAULT_IMAGE = "images/fan-default.jpg";
var TEAM_DEFAULT_IMAGE = "images/league-default.png";

//Union
var API_UNION_PAGE = BASE_API_URL + '/api/Union/';
var API_UNION_BANNERS = BASE_API_URL + '/api/Banners/Union/';
var API_UNION_ACTIVITIES = BASE_API_URL + '/api/Union/Activities/';
var API_UNION_CLUBS = BASE_API_URL + '/api/Union/Clubs/';
var API_UNION_CLUBSAREA1 = BASE_API_URL + '/api/Union/ClubsArea1/';
var API_UNION_CLUBSAREA2 = BASE_API_URL + '/api/Union/ClubsArea2/';
var API_UNION_CLUBSAREA3 = BASE_API_URL + '/api/Union/ClubsArea3/';
var API_UNION_CLUBSAREA4 = BASE_API_URL + '/api/Union/ClubsArea4/';
var API_UNION_CLUBSAREA5 = BASE_API_URL + '/api/Union/ClubsArea5/';
var API_INCREASE_BANNER = BASE_API_URL + '/api/Banners/IncreaseVisit/';
var API_UNION_DISCIPLINES = BASE_API_URL + '/api/Union/Disciplines/';

//-- Competition
var API_COMPETITION_DISCIPLINES = BASE_API_URL + '/api/Union/Competitions/';
var API_COMPETITION_DISCIPLINESYOUTH = BASE_API_URL + '/api/Union/CompetitionsYouth/';
var API_COMPETITION_DISCIPLINESDAILY = BASE_API_URL + '/api/Union/CompetitionsDaily/';
var API_COMPETITION_DISCIPLINESSENIOR = BASE_API_URL + '/api/Union/CompetitionsSenior/';
//event
var API_EVENTS = BASE_API_URL + '/api/Union/Events/';
var API_EVENT = BASE_API_URL + '/api/Union/Event/';
// Rankings
var API_RANKINGS_AGE_LIST = BASE_API_URL + '/api/Union/CompetitionAges/';
var API_UNION_RANKINGS = BASE_API_URL + '/api/Union/UnionRankings/';

// -- Club
var API_CLUB_PAGE = BASE_API_URL + '/api/Clubs/';

//-- Referee
var API_REFEREE_PAGE = BASE_API_URL + '/api/referee/';
var API_GAMESETS = BASE_API_URL + '/api/GameSets/';
//-- Leagues
var API_UNION_LEAGUES = BASE_API_URL +'/api/Union/LeaguesList/';
var API_LEAGUE_PAGE = BASE_API_URL + '/api/Leauges';
var API_LEAGUES_TOTALS = BASE_API_URL + '/api/Leauges/Section/' + SPORT_TYPE;
var API_LEAGUE_TEAMS = BASE_API_URL + '/api/Teams/Section/' + SPORT_TYPE;
var API_CLUB_TEAMS = BASE_API_URL + '/api/Teams/Clubs';
var API_TEAM_PAGE = BASE_API_URL + "/api/Teams";
var API_GAME_PAGE = BASE_API_URL + "/api/Games";
var API_GAME_PAGE_TENNIS = BASE_API_URL + "/api/Games/TennisCompetition";
var API_END_GAME_SUFFIX = '/Actions/EndGame';
var API_TECHNICAL_WIN_SUFFIX = '/Actions/TechnicalWin';
var API_GAME_FANS = BASE_API_URL + "/api/Games/Fans";
//-- Account
var API_TOKEN = BASE_API_URL + '/token';
var API_REGISTER_FAN = BASE_API_URL + '/api/Account/RegisterFan';
var API_REGISTER_FAN_FB = BASE_API_URL + '/api/Account/RegisterFanFB';
var API_UPLOAD_PROFILE_PICTURE = BASE_API_URL + '/api/Account/UploadProfilePicture';
var API_UPLOAD_MCFILE = BASE_API_URL + '/api/Account/UploadMCFile';
var API_USER_INFO = BASE_API_URL + '/api/Account/ClubUserInfo';
var API_FB_ACCOUNT_EXIST = BASE_API_URL + '/api/Account/FBAccountExists';
var API_ACCOUNT_FORGOT_PASS = BASE_API_URL + '/api/Account/ForgotPassword';
var API_REPORT_CHAT_MESSAGE = BASE_API_URL + '/api/Account/ReportChatMessage';
var API_REPORT_GALLERY = BASE_API_URL + '/api/Account/ReportImageGallery';
var API_ACCOUNT_GET_DETAILS = BASE_API_URL + '/api/Account/Details';
var API_ACCOUNT_UPDATE_DETAILS = BASE_API_URL + '/api/Account/Update';
var API_GET_CUR_ACTIVITYID = BASE_API_URL + '/api/Account/Activity';
//-- Fan
var API_FAN_GET = BASE_API_URL + "/api/Fans";
var API_FAN_EDIT = BASE_API_URL + "/api/Fans/Edit";
var API_FAN_TEAM = BASE_API_URL + "/api/Fans/Home";
var API_FAN_GAME = BASE_API_URL + "/api/Fans/Game";
var API_FAN_GAMETENNIS = BASE_API_URL + "/api/Fans/GameTennis";
var API_FAN_CLUBINFO = BASE_API_URL + "/api/Fans/MyClubInfo";
var API_FAN_ARCHIEVEMENTS = BASE_API_URL + "/api/Fans/Archievements";
var API_GOING_FOR_TENNIS_COMPETITION = BASE_API_URL + "/api/Fans/GoingForTennis";
var API_GOING = BASE_API_URL + "/api/Fans/Going";
var API_FAN_NOTE = "scripts/static/notification.json";
var API_FAN_UNFRIEND = BASE_API_URL + "/api/Friends/Unfriend";
var API_FAN_REQUEST = BASE_API_URL + "/api/Friends/Request";
var API_FAN_CANCEL = BASE_API_URL + "/api/Friends/CancelFriendRequest";
var API_FAN_PENDING = BASE_API_URL + "/api/Friends/PendingFriendshipRequests";
var API_FAN_CONFIRM = BASE_API_URL + "/api/Friends/ConfirmRequest";
var API_FAN_REJECT = BASE_API_URL + "/api/Friends/RejectFriendRequest";
var API_GAME_SCHEDULE = BASE_API_URL + "/api/Games/Schedule";
//-- Player
var API_PLAYER = BASE_API_URL + "/api/Player";
var API_PLAYER_GAMES = BASE_API_URL + "/api/Player/Games";
var API_PLAYER_RANKED = BASE_API_URL + "/api/Player/Ranked";
var API_PLAYER_FOR_TENNIS_GAMESHISTORY = BASE_API_URL + "/api/Player/TennisGamesHistory";
//-- Notifications and Messages
var API_NOTIFICATIONS_GET = BASE_API_URL + "/api/Notifications/list";
var API_NOTIFICATIONS_READ = BASE_API_URL + "/api/Notifications/readAll";
var API_NOTIFICATIONS_REMOVE = BASE_API_URL + "/api/Notifications/delete";
var API_NOTIFICATIONS_REMOVE_ALL = BASE_API_URL + "/api/Notifications/deleteAll";
var API_NOTIFICATIONS_SAVE_TOKEN = BASE_API_URL + "/api/Notifications/saveToken";
var API_NOTIFICATIONS_DEL_TOKEN = BASE_API_URL + "/api/Notifications/deleteToken";
var API_NOTIFICATIONS_ADD_REMINDER = BASE_API_URL + "/api/Notifications/reminder";
var API_MSGS_GET = BASE_API_URL + "/api/Notifications/chats/list"; //scripts/static/messages.json";
var API_RECEIVES_GET = BASE_API_URL + "/api/Notifications/chats/receives"; //scripts/static/messages.json";
var API_MSGS_GET_FAN_USERS = BASE_API_URL + "/api/Notifications/chats/users";
var API_MSGS_SEND = BASE_API_URL + "/api/Notifications/chats/send";
var API_MSGS_SEND_TEAM = BASE_API_URL + "/api/Notifications/chats/sendTeam";
var API_MSGS_FW = BASE_API_URL + "/api/Notifications/chats/forward";
var API_MSGS_FW_TEAM = BASE_API_URL + "/api/Notifications/chats/forwardTeam";
var API_MSGS_FW_ALL = BASE_API_URL + "/api/Notifications/chats/forwardAll";
var API_UPLOAD_IMAGE = BASE_API_URL + "/api/Notifications/chats/uploadImage";
var API_UPLOAD_VIDEO = BASE_API_URL + "/api/Notifications/chats/uploadVideo";

var API_UPLOAD_IMAGE_GALLERY = BASE_API_URL + "/api/Notifications/gallery/";

//-- Push
var PUSH_APNS_BUNDLEID = "com.yit.loglig.apns";
var PUSH_GCM_BUNDLEID = "com.yit.loglig.gcm";
var REGISTRATIONID_TOKEN_KEY = "push_reg_id";
//-- Eilat Tournoment
var API_GET_EILAT_TOURNAMENT_LIST = BASE_API_URL + '/api/Leauges/SectionET/' + SPORT_TYPE;
var API_GET_EILAT_TOURNAMENT_PDF = BASE_API_URL + '/api/Union/Leagues/';
//-- App Rules (PDF File)
var APP_RULES_FILE = BASE_API_URL + '/takanon_israel_handicap_basketball.pdf';

var GOOGLE_ANALYTICS_TRACK_ID = 'UA-77710442-1';
