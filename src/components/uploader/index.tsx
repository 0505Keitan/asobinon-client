/**
* Copied from
https://github.com/fris-fruitig/react-firebase-file-uploader

Thank you for awesome package!
*/

import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';
// import resizeAndCropImage from './image';

const generateRandomFilename = (): string => uuidv4();

function extractExtension(filename: string): string {
  let ext = /(?:\.([^.]+))?$/.exec(filename);
  if (ext != null && ext[0] != null) {
    return ext[0];
  } else {
    return '';
  }
}

type fileType = (file: File) => string;
export type Props = {
  storageRef: any;
  onUploadStart?: (file: Object, task: Object) => void;
  onProgress?: (progress: number, task: Object) => void;
  onUploadSuccess?: (filename: string, task: Object) => void;
  onUploadError?: (error: Object, task: Object) => void;
  filename?: string | fileType;
  metadata?: Object;
  randomizeFilename?: boolean;
  as?: any;
  // maxWidth: number;
  style?: Object;
  hidden?: boolean;
  // default input props
  id?: string;
  accept?: string;
  disabled?: boolean;
  form?: string;
  formNoValidate?: boolean;
  name?: string;
  readOnly?: boolean;
  required?: boolean;
  value?: string;
  multiple?: boolean;
};

export default class FirebaseFileUploaderModifiedBySasigume extends Component<Props> {
  uploadTasks: Array<any> = [];

  // Cancel all running uploads before unmount
  componentWillUnmount() {
    this.cancelRunningUploads();
  }

  cancelRunningUploads() {
    while (this.uploadTasks.length > 0) {
      const task = this.uploadTasks.pop();
      if (task && task.snapshot.state === 'running') {
        task.cancel();
      }
    }
  }

  // Remove a specific task from the uploadTasks
  removeTask(task: any) {
    for (let i = 0; i < this.uploadTasks.length; i++) {
      if (this.uploadTasks[i] === task) {
        this.uploadTasks.splice(i, 1);
        return;
      }
    }
  }

  startUpload(file: File) {
    const { onUploadStart, storageRef, metadata, randomizeFilename, filename } = this.props;

    let filenameToUse: string;
    if (filename) {
      filenameToUse = typeof filename === 'function' ? filename(file) : filename;
    } else {
      filenameToUse = randomizeFilename ? generateRandomFilename() : file.name;
    }

    // Ensure there is an extension in the filename
    if (!extractExtension(filenameToUse)) {
      filenameToUse += extractExtension(file.name);
    }

    Promise.resolve()
      .then(() => {
        //const shouldResize = file.type.match(/image.*/) && this.props.maxWidth;
        //if (shouldResize) {
        //  return resizeAndCropImage(file, this.props.maxWidth);
        //}
        return file;
      })
      .then((file) => {
        const task = storageRef.child(filenameToUse).put(file, metadata);

        if (onUploadStart) {
          onUploadStart(file, task);
        }

        task.on(
          'state_changed',
          (snapshot: any) =>
            this.props.onProgress &&
            this.props.onProgress(
              Math.round((100 * snapshot.bytesTransferred) / snapshot.totalBytes),
              task,
            ),
          (error: any) => this.props.onUploadError && this.props.onUploadError(error, task),
          () => {
            this.removeTask(task);
            return (
              this.props.onUploadSuccess &&
              this.props.onUploadSuccess(task.snapshot.metadata.name, task)
            );
          },
        );
        this.uploadTasks.push(task);
      });
  }

  handleFileSelection = (event: any) => {
    const {
      target: { files },
    } = event;
    for (let i = 0; i < files.length; i++) {
      this.startUpload(files[i]);
    }
  };

  render() {
    const {
      storageRef,
      onUploadStart,
      onProgress,
      onUploadSuccess,
      onUploadError,
      randomizeFilename,
      metadata,
      filename,
      //maxWidth,
      hidden,
      as: Input = 'input',
      ...props
    } = this.props;

    const inputStyle = hidden
      ? Object.assign({}, props.style, {
          width: '0.1px',
          height: '0.1px',
          opacity: 0,
          overflow: 'hidden',
          position: 'absolute',
          zIndex: -1,
        })
      : props.style;

    return <Input type="file" onChange={this.handleFileSelection} {...props} style={inputStyle} />;
  }
}
