/**
 *
 * Gif parser by @gtk2k
 * https://github.com/gtk2k/gtk2k.github.io/tree/master/animation_gif
 *
 */

const gifparser = (gif) => {
  return new Promise(async (resolve, reject) => {
    let pos = 0;
    let delayTimes = [];
    let graphicControl = null;
    let frames = [];
    let loopCnt = 0;
    if (gif[0] === 0x47 && gif[1] === 0x49 && gif[2] === 0x46 && // 'GIF'
      gif[3] === 0x38 && (gif[4] === 0x39 || gif[4] === 0x37) && gif[5] === 0x61) { // '89a'

      pos += 13 + (+!!(gif[10] & 0x80) * Math.pow(2, (gif[10] & 0x07) + 1) * 3);
      let gifHeader = gif.subarray(0, pos);
      while (gif[pos] && gif[pos] !== 0x3b) {
        let offset = pos, blockId = gif[pos];
        if (blockId === 0x21) {
          let label = gif[++pos];
          if ([0x01, 0xfe, 0xf9, 0xff].indexOf(label) !== -1) {
            label === 0xf9 && (delayTimes.push((gif[pos + 3] + (gif[pos + 4] << 8)) * 10));
            label === 0xff && (loopCnt = gif[pos + 15] + (gif[pos + 16] << 8));
            while (gif[++pos]) pos += gif[pos];
            label === 0xf9 && (graphicControl = gif.subarray(offset, pos + 1));
          } else {
            reject('parseGIF: unknown label');
            break;
          }
        } else if (blockId === 0x2c) {
          pos += 9;
          pos += 1 + (+!!(gif[pos] & 0x80) * (Math.pow(2, (gif[pos] & 0x07) + 1) * 3));
          while (gif[++pos]) {
            pos += gif[pos];
          }
          let imageData = gif.subarray(offset, pos + 1);
          // Each frame should have an image and a flag to indicate how to dispose it.
          let frame = {
            // http://matthewflickinger.com/lab/whatsinagif/animation_and_transparency.asp
            // Disposal method is a flag stored in the 3rd byte of the graphics control
            // This byte is packed and stores more information, only 3 bits of it represent the disposal
            disposalMethod: graphicControl[3],
            blob: URL.createObjectURL(new Blob([gifHeader, graphicControl, imageData]))
          };
          frames.push(frame);
        } else {
          reject('parseGIF: unknown blockId');
          break;
        }
        pos++;
      }
    } else {
      reject('parseGIF: no GIF89a');
    }

    const imgFrames = await frames.reduce((promiseChain, currentTask) => {
      return promiseChain.then(chainResults => {
        const img = new Image();
        const loadPromise = new Promise(resolve => {
          img.onload = function(e) {
            resolve(img);
          }
        });
        img.src = currentTask.blob;
        img.disposalMethod = currentTask.disposalMethod;
        return loadPromise.then(currentResult =>
          [...chainResults, currentResult]
        );
      });
    }, Promise.resolve([]));
    resolve({delayTimes, loopCnt, frames: imgFrames});
  });
};

export default gifparser;
