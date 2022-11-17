import React, { useCallback } from 'react';
import FileDrop from '../fileDrop/fileDrop';
import Result from '../result/result';
import styles from './imageContainer.module.css';

import useStore from './../../utils/store'

const ImageContainer = ({colNum}) => {
  const { buffer } = useStore((state) => ({
    buffer: state.buffer,
  }))

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
      // Do whatever you want with the file contents
        const data = reader.result
        //useStore.setState({ buffer: data, fileName: file.name })
      }
      reader.readAsArrayBuffer(file)
    })
    console.log(buffer)
  }, [])

  switch(colNum){
    case 2:
      return(
        <section className={styles.twoCol}>
          <div className={styles.twoCol_first}>
            {buffer ? <Result/> : <FileDrop onDrop={onDrop}/>}
          </div>
          <div className={styles.twoCol_second}>
            <FileDrop onDrop={onDrop}/>
          </div>
        </section>
      );
    case 3:
      return(
        <section className={styles.threeCol}>
          <div className={styles.threeCol_first}>
            <FileDrop onDrop={onDrop}/>
          </div>
          <div className={styles.threeCol_second}>
            <FileDrop onDrop={onDrop}/>
          </div>
          <div className={styles.threeCol_third}>
            <FileDrop onDrop={onDrop}/>
          </div>
        </section>
      );
    default:
      return(<h1>choose col</h1>);
  }
};

export default ImageContainer;