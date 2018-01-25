import itkreadImageFile from 'itk/readImageFile';
import itkreadImageDICOMFileSeries from 'itk/readImageDICOMFileSeries';

import viewers from './viewers';
import userInterface from './userInterface';
import convertItkImageToVtkImage from './convertItkImageToVtkImage';

const processFiles = (container, { files, use2D }) => {
  userInterface.emptyContainer(container);
  userInterface.createLoadingProgress(container);

  /* eslint-disable new-cap */
  return new Promise((resolve, reject) => {
    let reader = null;
    let arg = files;
    if (files.length === 1) {
      reader = itkreadImageFile;
      arg = files[0];
    } else {
      reader = itkreadImageDICOMFileSeries;
    }
    reader(arg).then((itkImage) => {
      const imageData = convertItkImageToVtkImage(itkImage);
      const is3D = itkImage.imageType.dimension === 3 && !use2D;

      resolve(
        viewers.createViewer(container, {
          type: is3D ? 'volumeRendering' : 'imageRendering',
          image: imageData,
        })
      );
    });
  });
};

export default processFiles;
