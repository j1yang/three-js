import React, { useCallback } from 'react';
import FileDrop from '../fileDrop/fileDrop';
import styles from './imageContainer.module.css';


const ImageContainer = ({colNum}) => {
  const onDrop = useCallback((acceptedFiles) => {
    console.log('hi')
  }, [])

  switch(colNum){
    case 2:
      return(
        <section className={styles.twoCol}>
          <div className={styles.twoCol_first}>
            <FileDrop onDrop={onDrop}/>
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