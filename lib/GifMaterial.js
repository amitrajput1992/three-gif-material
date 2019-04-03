"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _three = require("three");

var _gifparser = _interopRequireDefault(require("./gifparser"));

/**
 * @format
 * 
 */

/* globals __DEV__ */
var GifMaterial =
/*#__PURE__*/
function (_MeshBasicMaterial) {
  (0, _inherits2.default)(GifMaterial, _MeshBasicMaterial);

  function GifMaterial() {
    var _this;

    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, GifMaterial);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(GifMaterial).call(this)); // super props

    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_cnv", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_ctx", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_texture", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_startTime", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_endTime", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_frames", []);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_frameCnt", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_width", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_height", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_loopCnt", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_infinity", false);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_nextFrameTime", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_frameIdx", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_delayTimes", []);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_isPaused", false);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_gifData", {});
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_init",
    /*#__PURE__*/
    function () {
      var _ref2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(_ref) {
        var url, autoplay, gifData;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                url = _ref.url, autoplay = _ref.autoplay;

                if (__DEV__) {
                  console.log('Initializing material');
                }

                _context.prev = 2;

                if (!_this._gifData[url]) {
                  _context.next = 7;
                  break;
                }

                gifData = _this._gifData[url];
                _context.next = 10;
                break;

              case 7:
                _context.next = 9;
                return _this._getGifData(url);

              case 9:
                gifData = _context.sent;

              case 10:
                // override with what we have in cache
                _this._gifData[url] = gifData;

                _this._setTexture(gifData);

                _context.next = 17;
                break;

              case 14:
                _context.prev = 14;
                _context.t0 = _context["catch"](2);
                console.error(_context.t0);

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[2, 14]]);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_getUnit8Array", function (url) {
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'arraybuffer';
        xhr.addEventListener('load', function (e) {
          var uint8Arr = new Uint8Array(e.target.response); // extract header to test if this is a gif of not

          if (!GifMaterial.isGif(uint8Arr)) {
            reject('Not a gif');
          }

          resolve(uint8Arr);
        });
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_getGifData", function (url) {
      return new Promise(
      /*#__PURE__*/
      function () {
        var _ref3 = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/
        _regenerator.default.mark(function _callee2(resolve, reject) {
          var uint8Array, _ref4, delayTimes, loopCnt, frames;

          return _regenerator.default.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.prev = 0;
                  _context2.next = 3;
                  return _this._getUnit8Array(url);

                case 3:
                  uint8Array = _context2.sent;
                  _context2.next = 6;
                  return (0, _gifparser.default)(uint8Array);

                case 6:
                  _ref4 = _context2.sent;
                  delayTimes = _ref4.delayTimes;
                  loopCnt = _ref4.loopCnt;
                  frames = _ref4.frames;
                  resolve({
                    delayTimes: delayTimes,
                    loopCnt: loopCnt,
                    frames: frames,
                    timestamp: Date.now()
                  });
                  _context2.next = 16;
                  break;

                case 13:
                  _context2.prev = 13;
                  _context2.t0 = _context2["catch"](0);
                  reject(_context2.t0);

                case 16:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, null, [[0, 13]]);
        }));

        return function (_x2, _x3) {
          return _ref3.apply(this, arguments);
        };
      }());
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_setTexture", function (_ref5) {
      var delayTimes = _ref5.delayTimes,
          loopCnt = _ref5.loopCnt,
          frames = _ref5.frames;

      if (__DEV__) {
        console.log('setting texture');
      }

      _this._delayTimes = delayTimes;
      loopCnt ? _this._loopCnt = loopCnt : _this._infinity = true;
      _this._frames = frames;
      _this._frameCnt = delayTimes.length;
      _this._startTime = Date.now();
      _this._width = _three.Math.floorPowerOfTwo(frames[0].width);
      _this._height = _three.Math.floorPowerOfTwo(frames[0].height);
      _this._cnv.width = _this._width;
      _this._cnv.height = _this._height;

      _this._draw(); // todo start from herhehreh

    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_paused", function () {
      return _this._isPaused;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_nextFrame", function () {
      _this._draw();

      while (Date.now() - _this._startTime >= _this._nextFrameTime) {
        _this._nextFrameTime += _this._delayTimes[_this._frameIdx++];
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_draw", function () {
      if (_this._frameIdx !== 0) {
        var lastFrame = _this._frames[_this._frameIdx - 1];

        if (lastFrame.disposalMethod === 8 || lastFrame.disposalMethod === 9) {// this._clearCanvas()
        }
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_clearCanvas", function () {
      _this._ctx.clearRect(0, 0, _this._width, _this._height);

      _this._texture.needsUpdate = true;
    });
    _this.name = 'GifMaterial'; // internal props

    _this._cnv = document.createElement('canvas');
    _this._cnv.width = 2;
    _this._cnv.height = 2;
    _this._ctx = _this._cnv.getContext('2d');
    _this._texture = new _three.Texture(_this._cnv);
    _this._texture.wrapS = _three.ClampToEdgeWrapping;
    _this._texture.wrapT = _three.ClampToEdgeWrapping;
    _this._texture.minFilter = _three.NearestFilter;

    _this.setValues({
      map: _this._texture
    });

    _this._init(params);

    return _this;
  }

  (0, _createClass2.default)(GifMaterial, [{
    key: "frame",
    value: function frame(ms) {
      if (!this._frames.length || this._paused()) {
        return;
      }

      if (Date.now() - this._startTime >= this._nextFrameTime) {
        this._nextFrame();
      }
    }
    /**
     * @override
     */

  }, {
    key: "dispose",
    value: function dispose() {}
  }]);
  return GifMaterial;
}(_three.MeshBasicMaterial);

(0, _defineProperty2.default)(GifMaterial, "isGif", function (buf) {
  var p = 0; // - Header (GIF87a or GIF89a).

  if (buf[p++] !== 0x47 || buf[p++] !== 0x49 || buf[p++] !== 0x46 || buf[p++] !== 0x38 || (buf[p++] + 1 & 0xfd) !== 0x38 || buf[p++] !== 0x61) {
    return false;
  }
});
var _default = GifMaterial;
exports.default = _default;