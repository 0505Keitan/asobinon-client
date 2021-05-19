import addToBlobPolyfill from './polyfill';

export default function resizeAndCropImage(file: File, w: number): Promise<Blob> {
  if (!HTMLCanvasElement.prototype.toBlob) {
    addToBlobPolyfill();
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const image = new Image();
      image.onload = () => {
        // ここを自分で修正した
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        let drawWidth = image.width;
        let drawHeight = image.height;
        const scale = w / image.width;
        let horizontalOffset = (scale * image.width) / w;
        let verticalOffset = (scale * image.height) / w;
        if (scale < 1) {
          drawWidth = w;
          drawHeight = scale * image.height;
          canvas.width = w;
          canvas.height = scale * image.height;
        }

        const context = canvas.getContext('2d');
        if (!context) {
          return reject('Could not get the context of the canvas element');
        }
        context.drawImage(image, horizontalOffset, verticalOffset, drawWidth, drawHeight);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          }
        }, file.type);
      };
      if (readerEvent.target && typeof readerEvent.target.result === 'string') {
        image.src = readerEvent.target.result;
      }
    };
    reader.readAsDataURL(file);
  });
}
