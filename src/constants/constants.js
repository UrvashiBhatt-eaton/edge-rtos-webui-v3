Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.REFRESH_MS = exports.CHANNEL_COUNT = exports.ALARM_COUNT = void 0;
var CHANNEL_COUNT = 50;
exports.CHANNEL_COUNT = CHANNEL_COUNT;
var ALARM_COUNT = 35;
exports.ALARM_COUNT = ALARM_COUNT;
var REFRESH_MS = 10000;
exports.REFRESH_MS = REFRESH_MS;

//The number determines the length of the Uri where the channel ids are appended
// eg:(rs/param/values/10014/10015/10016/), length of only channel ids appended should not be > CHANNEL_URI_MAX_SIZE
var CHANNEL_URI_MAX_SIZE = 40;
exports.CHANNEL_URI_MAX_SIZE = CHANNEL_URI_MAX_SIZE;
