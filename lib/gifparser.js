"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

/**
 * Gif parser by @gtk2k
 * https://github.com/gtk2k/gtk2k.github.io/tree/master/animation_gif
 *
 * @format
 */
var gifparser = function gifparser(gif) {
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee(resolve, reject) {
      var pos, delayTimes, graphicControl, frames, loopCnt, gifHeader, offset, blockId, label, imageData, frame, imgFrames;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              pos = 0;
              delayTimes = [];
              graphicControl = null;
              frames = [];
              loopCnt = 0;

              if (!(gif[0] === 0x47 && gif[1] === 0x49 && gif[2] === 0x46 && // 'GIF'
              gif[3] === 0x38 && (gif[4] === 0x39 || gif[4] === 0x37) && gif[5] === 0x61)) {
                _context.next = 39;
                break;
              }

              // '89a'
              pos += 13 + +!!(gif[10] & 0x80) * Math.pow(2, (gif[10] & 0x07) + 1) * 3;
              gifHeader = gif.subarray(0, pos);

            case 8:
              if (!(gif[pos] && gif[pos] !== 0x3b)) {
                _context.next = 37;
                break;
              }

              offset = pos, blockId = gif[pos];

              if (!(blockId === 0x21)) {
                _context.next = 23;
                break;
              }

              label = gif[++pos];

              if (!([0x01, 0xfe, 0xf9, 0xff].indexOf(label) !== -1)) {
                _context.next = 19;
                break;
              }

              label === 0xf9 && delayTimes.push((gif[pos + 3] + (gif[pos + 4] << 8)) * 10);
              label === 0xff && (loopCnt = gif[pos + 15] + (gif[pos + 16] << 8));

              while (gif[++pos]) {
                pos += gif[pos];
              }

              label === 0xf9 && (graphicControl = gif.subarray(offset, pos + 1));
              _context.next = 21;
              break;

            case 19:
              reject('parseGIF: unknown label');
              return _context.abrupt("break", 37);

            case 21:
              _context.next = 34;
              break;

            case 23:
              if (!(blockId === 0x2c)) {
                _context.next = 32;
                break;
              }

              pos += 9;
              pos += 1 + +!!(gif[pos] & 0x80) * (Math.pow(2, (gif[pos] & 0x07) + 1) * 3);

              while (gif[++pos]) {
                pos += gif[pos];
              }

              imageData = gif.subarray(offset, pos + 1); // Each frame should have an image and a flag to indicate how to dispose it.

              frame = {
                // http://matthewflickinger.com/lab/whatsinagif/animation_and_transparency.asp
                // Disposal method is a flag stored in the 3rd byte of the graphics control
                // This byte is packed and stores more information, only 3 bits of it represent the disposal
                disposalMethod: graphicControl[3],
                blob: URL.createObjectURL(new Blob([gifHeader, graphicControl, imageData]))
              };
              frames.push(frame);
              _context.next = 34;
              break;

            case 32:
              reject('parseGIF: unknown blockId');
              return _context.abrupt("break", 37);

            case 34:
              pos++;
              _context.next = 8;
              break;

            case 37:
              _context.next = 40;
              break;

            case 39:
              reject('parseGIF: no GIF89a');

            case 40:
              _context.next = 42;
              return frames.reduce(function (promiseChain, currentTask) {
                return promiseChain.then(function (chainResults) {
                  var img = new Image();
                  var loadPromise = new Promise(function (resolve) {
                    img.onload = function (e) {
                      resolve(img);
                    };
                  });
                  img.src = currentTask.blob;
                  img.disposalMethod = currentTask.disposalMethod;
                  return loadPromise.then(function (currentResult) {
                    return [].concat((0, _toConsumableArray2.default)(chainResults), [currentResult]);
                  });
                });
              }, Promise.resolve([]));

            case 42:
              imgFrames = _context.sent;
              resolve({
                delayTimes: delayTimes,
                loopCnt: loopCnt,
                frames: imgFrames
              });

            case 44:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
};

var _default = gifparser;
exports.default = _default;