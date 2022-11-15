import React from 'react';
import Button from '../button/button';
import HeaderNumPick from '../headeNumPick/headerNumPick';
import HeaderColName from '../headerColName/headerColName';
import HeaderProgress from '../headerProgress/headerProgress';
import styles from './header.module.css';

const Header = ({getColNum}) => {

  

  return(
    <div className={styles.header}>
      <div className={styles.title}>
        <div className={styles.logo}><i  class="fa-solid fa-images"></i></div>
        <h1 className={styles.name}>Compare Assets</h1>
      </div>
      <div className={styles.settings}>
        <div className={styles.numPic}>
          <HeaderNumPick getColNum={getColNum}/>
        </div>
        <div className={styles.colNames}>
          <HeaderColName/>
        </div>
        <div className={styles.enter}>
          <Button name={'Enter'}/>
        </div>
      </div>
      <div className={styles.progress}>
        <HeaderProgress/>
      </div>
    </div>
  );
};

export default Header;