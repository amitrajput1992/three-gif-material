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

    (0, _classCallCheck2.default)(this, GifMaterial);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(GifMaterial).call(this)); // super props

    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_cnv", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_ctx", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_texture", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_startTime", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_frames", []);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_frameCnt", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_width", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_height", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_loopCnt", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_infinity", false);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_nextFrameTime", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_frameIdx", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_delayTimes", []);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_isPaused", true);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_gifData", {});
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "setParams",
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

                if (url) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt("return");

              case 4:
                _context.prev = 4;

                if (!_this._gifData[url]) {
                  _context.next = 9;
                  break;
                }

                gifData = _this._gifData[url];
                _context.next = 12;
                break;

              case 9:
                _context.next = 11;
                return _this._getGifData(url);

              case 11:
                gifData = _context.sent;

              case 12:
                if (__DEV__) {
                  console.log(gifData);
                } // override with what we have in cache


                _this._gifData[url] = gifData;

                _this._setTexture(gifData);

                autoplay && _this.play();
                _context.next = 21;
                break;

              case 18:
                _context.prev = 18;
                _context.t0 = _context["catch"](4);
                console.error(_context.t0);

              case 21:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[4, 18]]);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_getUnit8Array",
    /*#__PURE__*/
    function () {
      var _ref3 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2(url) {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", new Promise(function (resolve, reject) {
                  var xhr = new XMLHttpRequest();
                  xhr.open('GET', url, true);
                  xhr.responseType = 'arraybuffer';

                  xhr.onload = function () {
                    var uint8Arr = new Uint8Array(this.response);

                    if (!GifMaterial.isGif(uint8Arr)) {
                      reject('Not a gif');
                    }

                    resolve(uint8Arr);
                  };

                  xhr.send();
                }));

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x2) {
        return _ref3.apply(this, arguments);
      };
    }());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_getGifData",
    /*#__PURE__*/
    function () {
      var _ref4 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee3(url) {
        var uint8Array, _ref5, delayTimes, loopCnt, frames;

        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return _this._getUnit8Array(url);

              case 2:
                uint8Array = _context3.sent;
                _context3.next = 5;
                return (0, _gifparser.default)(uint8Array);

              case 5:
                _ref5 = _context3.sent;
                delayTimes = _ref5.delayTimes;
                loopCnt = _ref5.loopCnt;
                frames = _ref5.frames;
                return _context3.abrupt("return", {
                  delayTimes: delayTimes,
                  loopCnt: loopCnt,
                  frames: frames,
                  timestamp: Date.now()
                });

              case 10:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function (_x3) {
        return _ref4.apply(this, arguments);
      };
    }());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_setTexture", function (_ref6) {
      var delayTimes = _ref6.delayTimes,
          loopCnt = _ref6.loopCnt,
          frames = _ref6.frames;

      if (__DEV__) {
        console.log('setting texture');
      }

      _this._delayTimes = delayTimes;
      loopCnt ? _this._loopCnt = loopCnt : _this._infinity = true;
      _this._frames = frames;
      _this._frameCnt = delayTimes.length;
      _this._startTime = Date.now();
      _this._width = floorPowerOfTwo(frames[0].width);
      _this._height = floorPowerOfTwo(frames[0].height);
      _this._cnv.width = _this._width;
      _this._cnv.height = _this._height;

      if (__DEV__) {
        console.log('width: ', _this._width, 'height:', _this._height);
      }

      _this._draw();
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "paused", function () {
      return _this._isPaused;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "playing", function () {
      return !_this._isPaused;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_nextFrame", function () {
      _this._draw(); // create the nextFrameTime here


      _this._nextFrameTime = _this._delayTimes[_this._frameIdx++]; // reached beyond last frame here

      if (_this._nextFrameTime === undefined) {
        _this._nextFrameTime = 0;
      }

      if (_this._frameIdx > _this._frameCnt) {
        _this._frameIdx = 0;
      }

      _this._startTime += _this._nextFrameTime;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_draw", function () {
      if (_this._frameIdx !== 0) {
        var lastFrame = _this._frames[_this._frameIdx - 1];

        if (lastFrame && (lastFrame.disposalMethod === 8 || lastFrame.disposalMethod === 9)) {
          _this._clearCanvas();
        }
      } else {
        _this._clearCanvas();
      }

      var actualFrame = _this._frames[_this._frameIdx];

      if (typeof actualFrame !== 'undefined') {
        if (__DEV__) {// console.log('Drawing frame', this._frameIdx, actualFrame);
        }

        _this._ctx.drawImage(actualFrame, 0, 0, _this._width, _this._height);

        _this._texture.needsUpdate = true;
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_clearCanvas", function () {
      _this._ctx.clearRect(0, 0, _this._width, _this._height);

      _this._texture.needsUpdate = true;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "pause", function () {
      _this._isPaused = true;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "play", function () {
      _this._isPaused = false;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "reset", function () {
      _this.pause();

      _this._clearCanvas();

      _this._startTime = 0;
      _this._nextFrameTime = 0;
      _this._frameIdx = 0;
      _this._frameCnt = 0;
      _this._delayTimes = [];
      _this._infinity = false;
      _this._loopCnt = 0;
      _this._frames = [];
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
      map: _this._texture,
      transparent: true,
      visible: true,
      side: _three.DoubleSide
    });

    return _this;
  }

  (0, _createClass2.default)(GifMaterial, [{
    key: "frame",
    value: function frame() {
      if (!this._frames.length || this.paused()) {
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
    value: function dispose() {
      this._texture.dispose();

      this._texture = null;
    }
  }]);
  return GifMaterial;
}(_three.MeshBasicMaterial);

(0, _defineProperty2.default)(GifMaterial, "isGif", function (buf) {
  var arr = buf.subarray(0, 4);
  var header = '';

  for (var i = 0; i < arr.length; i++) {
    header += arr[i].toString(16);
  }

  return header === '47494638';
});

function floorPowerOfTwo(value) {
  return Math.pow(2, Math.floor(Math.log(value) / Math.LN2));
}

var _default = GifMaterial;
exports.default = _default;