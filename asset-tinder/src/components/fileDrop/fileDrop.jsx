import React from 'react';
import {useDropzone} from 'react-dropzone';
import styles from './fileDrop.module.css';

const FileDrop = ({onDrop}) => {
  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: '.gltf, .glb',
  })
  return(
    <div className="h-full w-screen flex flex-col items-center justify-center text-center" {...getRootProps()}>
      <input {...getInputProps()} />

      {isDragActive ? (
        <p className="text-4xl font-bold text-blue-600">Drop the files here ...</p>
      ) : (
        <p className="text-4xl font-bold ">
          Drag and drop your GLTF file <span className={styles.text_blue}>here</span>
        </p>
      )}
      {fileRejections.length ? (
        <p className="block text-center text-xl pt-4 text-red-300">Only .gltf or .glb files are accepted</p>
      ) : null}
    </div>
  );
}

export default FileDrop;