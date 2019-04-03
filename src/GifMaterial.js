/**
 * @format
 * @flow
 */
/* globals __DEV__ */
import {
  MeshBasicMaterial,
  Texture,
  ClampToEdgeWrapping,
  NearestFilter,
  Math
} from 'three';
import gifparser from "./gifparser";

type Params = {
  url: string,
  autoplay: boolean
};

type Frame = {
  disposalMethod: number,
  blob: Blob,
  width: number,
  height: number
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
  _endTime: number = 0;

  _frames: any[] = [];
  _frameCnt: number = 0;
  _width: number = 0;
  _height: number = 0;
  _loopCnt: number = 0;
  _infinity: boolean = false;
  _nextFrameTime: number = 0;
  _frameIdx: number = 0;
  _delayTimes: number[] = [];

  _isPaused: boolean = false;
  _gifData: Object = {};

  constructor(params: Params = {}) {
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
    this.setValues({map: this._texture});
    this._init(params);
  }

  static isGif = (buf: Uint8Array) => {
    let p =0;
    // - Header (GIF87a or GIF89a).
    if (buf[p++] !== 0x47 ||            buf[p++] !== 0x49 || buf[p++] !== 0x46 ||
      buf[p++] !== 0x38 || (buf[p++]+1 & 0xfd) !== 0x38 || buf[p++] !== 0x61) {
      return false;
    }
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
  _init = async ({url, autoplay}: Params) => {
    if(__DEV__) {
      console.log('Initializing material');
    }
    try {
      let gifData;
      // check if we have already cached the data
      if(this._gifData[url]) {
        gifData = this._gifData[url];
      } else {
        gifData = await this._getGifData(url);
      }
      // override with what we have in cache
      this._gifData[url] = gifData;
      this. _setTexture(gifData);
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
  _getUnit8Array = (url: string): Promise<Uint8Array | string> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'arraybuffer';
      xhr.addEventListener('load', (e: any) => {
        const uint8Arr = new Uint8Array(e.target.response);
        // extract header to test if this is a gif of not
        if(!GifMaterial.isGif(uint8Arr)) {
          reject('Not a gif');
        }
        resolve(uint8Arr);
      });
    });
  };

  /**
   * parse the gif array buffer and generate img data for all frames
   * @param url
   * @return {Promise<void>}
   * @private
   */
  _getGifData = (url: string): Promise<GifData> => {
    return new Promise(async (resolve, reject) => {
      try {
        const uint8Array = await this._getUnit8Array(url);
        const {delayTimes, loopCnt, frames} = await gifparser(uint8Array);
        resolve({delayTimes, loopCnt, frames, timestamp: Date.now()});
      } catch (e) {
        reject(e);
      }
    });
  };

  _setTexture = ({delayTimes, loopCnt, frames}: GifData) => {
    if(__DEV__) {
      console.log('setting texture');
    }
    this._delayTimes = delayTimes;
    loopCnt? (this._loopCnt = loopCnt): (this._infinity = true);
    this._frames = frames;
    this._frameCnt = delayTimes.length;
    this._startTime = Date.now();
    this._width = Math.floorPowerOfTwo(frames[0].width);
    this._height = Math.floorPowerOfTwo(frames[0].height);
    this._cnv.width = this._width;
    this._cnv.height = this._height;

    this._draw();
    // todo start from herhehreh
  };

  _paused = () => this._isPaused;

  _nextFrame = () => {
    this._draw();

    while((Date.now() - this._startTime) >= this._nextFrameTime) {
      this._nextFrameTime += this._delayTimes[this._frameIdx++];
    }
  };

  _draw = () => {
    if(this._frameIdx !== 0) {
      const lastFrame = this._frames[this._frameIdx - 1];
      if(lastFrame.disposalMethod === 8 || lastFrame.disposalMethod === 9) {
        // this._clearCanvas()
      }
    }
  };

  _clearCanvas = () => {
    this._ctx.clearRect(0, 0, this._width, this._height);
    this._texture.needsUpdate = true
  };

  frame(ms: number) {
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
  dispose() {

  }
}

export default GifMaterial;
