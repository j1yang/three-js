import React from 'react';
import {useDropzone} from 'react-dropzone';
import styles from './fileDrop.module.css';

const FileDrop = ({onDrop}) => {
  
  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    // maxFiles: 2,
    // accept: '.gltf, .glb',
  })
  return(
    <div className={styles.container} {...getRootProps()}>
      <input {...getInputProps()} directory="" webkitdirectory="" type="file" />

      {isDragActive ? (
        <p className={styles.text_drop_file_here}>Drop the files here ...</p>
      ) : (
        <p className={styles.text_drop_file_here}>
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