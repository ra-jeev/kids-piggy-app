import { useRef } from 'react';

import { Storage } from '@aws-amplify/storage';
import { DataStore } from '@aws-amplify/datastore';
import { Flex, Heading, Button } from '@aws-amplify/ui-react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

import { Child } from '../models';
import { Dialog } from './Dialog';

export const AddPhotoDialog = ({ isOpen, onClose, child, dataURL }) => {
  const cropperRef = useRef();

  function toBlob(canvas) {
    return new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg');
    });
  }

  const uploadPhoto = async () => {
    if (cropperRef?.current) {
      const cropper = cropperRef?.current?.cropper;
      const canvas = cropper.getCroppedCanvas({
        minWidth: 240,
        minHeight: 240,
        maxWidth: 1096,
        maxHeight: 1096,
      });
      const blob = await toBlob(canvas);
      if (!blob) {
        console.error('Failed to create blob');
        return;
      }

      const res = await Storage.put(`${child.id}-${Date.now()}.jpeg`, blob, {
        level: 'private',
        contentType: 'image/jpeg',
      });

      await DataStore.save(
        Child.copyOf(child, (item) => {
          item.photoUrlKey = res.key;
        })
      );

      onClose();
    } else {
      console.error('no cropper ref found...');
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <Flex direction='column' textAlign='center'>
        <Heading level={4}>Crop Photo</Heading>

        <Cropper
          src={dataURL}
          style={{ maxHeight: 480, width: '100%' }}
          aspectRatio={1}
          minCropBoxWidth={100}
          ref={cropperRef}
        />

        <Flex>
          <Button variation='primary' onClick={uploadPhoto} isFullWidth>
            Accept & Upload
          </Button>
          <Button onClick={onClose} isFullWidth>
            Cancel
          </Button>
        </Flex>
      </Flex>
    </Dialog>
  );
};
