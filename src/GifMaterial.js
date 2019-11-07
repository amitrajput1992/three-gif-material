/**
 * @format
 * @flow
 */
/* globals __DEV__ */
import { MeshBasicMaterial, Texture, ClampToEdgeWrapping, NearestFilter, DoubleSide } from 'three';
import gifparser from './gifparser';

type Params = {
  url: string,
  autoplay: boolean,
};

type Frame = {
  disposalMethod: number,
  blob: Blob,
  width: number,
  height: number,
};

type GifData = {
  delayTimes: any[],
  loopCnt: number,
  frames: Frame[],
  timestamp: number,
};

class GifMaterial extends MeshBasicMaterial {
  _cnv: HTMLCanvasElement;
  _ctx: CanvasRenderingContext2D;
  _texture: Texture;
  _startTime: number = 0;

  _frames: any[] = [];
  _frameCnt: number = 0;
  _width: number = 0;
  _height: number = 0;
  _loopCnt: number = 0;
  _infinity: boolean = false;
  _nextFrameTime: number = 0;
  _frameIdx: number = 0;
  _delayTimes: number[] = [];
  _isPaused: boolean = true;
  _gifData: Object = {};

  constructor() {
    super();
    // super props
    this.name = 'GifMaterial';

    // internal props
    this._cnv = document.createElement('canvas');
    this._cnv.width = 2;
    this._cnv.height = 2;
    this._ctx = this._cnv.getContext('2d');
    this._texture = new Texture(this._cnv);
    this._texture.wrapS = ClampToEdgeWrapping;
    this._texture.wrapT = ClampToEdgeWrapping;
    this._texture.minFilter = NearestFilter;
    this.setValues({ map: this._texture, transparent: true, visible: true, side: DoubleSide });
  }

  static isGif = (buf: Uint8Array) => {
    const arr = buf.subarray(0, 4);
    let header = '';
    for (let i = 0; i < arr.length; i++) {
      header += arr[i].toString(16);
    }
    return header === '47494638';
  };

  /**
   * Initialize material
   * if gif data is cached, then use it otherwise generate new gif data.
   * then set the texture to start the animation loop.
   * @param url
   * @param autoplay
   * @return {Promise<void>}
   * @private
   */
  setParams = async ({ url, autoplay }: Params) => {
    if (__DEV__) {
      console.log('Initializing material');
    }
    if (!url) {
      return;
    }
    try {
      let gifData;
      // check if we have already cached the data
      if (this._gifData[url]) {
        gifData = this._gifData[url];
      } else {
        gifData = await this._getGifData(url);
      }
      if (__DEV__) {
        console.log(gifData);
      }
      // override with what we have in cache
      this._gifData[url] = gifData;
      this._setTexture(gifData);
      autoplay && this.play();
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * Make a xhr request to get the array buffer of the requested gif.
   * Also validate if the buffer is a gif buffer
   * @param url
   * @return {Promise<*>}
   * @private
   */
  _getUnit8Array = async (url: string): Promise<Uint8Array | string> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function() {
        const uint8Arr = new Uint8Array(this.response);
        if (!GifMaterial.isGif(uint8Arr)) {
          reject('Not a gif');
        }
        resolve(uint8Arr);
      };
      xhr.send();
    });
  };

  /**
   * parse the gif array buffer and generate img data for all frames
   * @param url
   * @return {Promise<void>}
   * @private
   */
  _getGifData = async (url: string): Promise<GifData> => {
    const uint8Array = await this._getUnit8Array(url);
    const { delayTimes, loopCnt, frames } = await gifparser(uint8Array);
    return { delayTimes, loopCnt, frames, timestamp: Date.now() };
  };

  _setTexture = ({ delayTimes, loopCnt, frames }: GifData) => {
    if (__DEV__) {
      console.log('setting texture');
    }
    this._delayTimes = delayTimes;
    loopCnt ? (this._loopCnt = loopCnt) : (this._infinity = true);
    this._frames = frames;
    this._frameCnt = delayTimes.length;
    this._startTime = Date.now();
    this._width = floorPowerOfTwo(frames[0].width);
    this._height = floorPowerOfTwo(frames[0].height);
    this._cnv.width = this._width;
    this._cnv.height = this._height;

    if (__DEV__) {
      console.log('width: ', this._width, 'height:', this._height);
    }

    this._draw();
  };

  paused = () => this._isPaused;
  playing = () => !this._isPaused;

  _nextFrame = () => {
    this._draw();

    // create the nextFrameTime here
    this._nextFrameTime = this._delayTimes[this._frameIdx++];

    // reached beyond last frame here
    if (this._nextFrameTime === undefined) {
      this._nextFrameTime = 0;
    }

    if (this._frameIdx > this._frameCnt) {
      this._frameIdx = 0;
    }

    this._startTime += this._nextFrameTime;
  };

  _draw = () => {
    if (this._frameIdx !== 0) {
      const lastFrame = this._frames[this._frameIdx - 1];
      if (lastFrame && (lastFrame.disposalMethod === 8 || lastFrame.disposalMethod === 9)) {
        this._clearCanvas();
      }
    } else {
      this._clearCanvas();
    }
    const actualFrame = this._frames[this._frameIdx];
    if (typeof actualFrame !== 'undefined') {
      if (__DEV__) {
        // console.log('Drawing frame', this._frameIdx, actualFrame);
      }
      this._ctx.drawImage(actualFrame, 0, 0, this._width, this._height);
      this._texture.needsUpdate = true;
    }
  };

  _clearCanvas = () => {
    this._ctx.clearRect(0, 0, this._width, this._height);
    this._texture.needsUpdate = true;
  };

  pause = () => {
    this._isPaused = true;
  };

  /**
   * Play gif
   * @public
   */
  play = () => {
    this._isPaused = false;
  };

  reset = () => {
    this.pause();
    this._clearCanvas();
    this._startTime = 0;
    this._nextFrameTime = 0;
    this._frameIdx = 0;
    this._frameCnt = 0;
    this._delayTimes = [];
    this._infinity = false;
    this._loopCnt = 0;
    this._frames = [];
  };

  frame() {
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
  dispose() {
    this._texture.dispose();
    this._texture = null;
  }
}

function floorPowerOfTwo(value) {
  return Math.pow( 2, Math.floor( Math.log( value ) / Math.LN2 ) );
}

export default GifMaterial;
