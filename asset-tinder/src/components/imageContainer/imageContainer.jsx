import React, { useCallback } from 'react';
import styles from './imageContainer.module.css';

import arrayBufferToString from './../../utils/arrayBufferToString';
import FileDrop from '../fileDrop/fileDrop';
import useStore from './../../utils/store';

const ImageContainer = ({colNum}) => {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onabort = () => console.error('file reading was aborted')
      reader.onerror = () => console.error('file reading has failed')
      reader.onload = async () => {
        const data = reader.result
        useStore.setState({ buffer: data, fileName: file.name })
        arrayBufferToString(data, (a) => useStore.setState({ textOriginalFile: a }))
      }
      reader.readAsArrayBuffer(file)
    })
  }, [])

  switch(colNum){
    case 2:
      return(
        <>
          <FileDrop onDrop={onDrop}/>
          <FileDrop onDrop={onDrop}/>
        </>
      );
    case 3:
      return(
        <>
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </>
      );
    default:
      return(<h1>choose col</h1>);
  }
};

export default ImageContainer;