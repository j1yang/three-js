import React from 'react';
import styles from './header.module.css';

const Header = (props) => {
  return(
    <div className={styles.header}>
      <div className={styles.title}>
        <div className={styles.logo}><i  class="fa-solid fa-images"></i></div>
        <h1 className={styles.name}>Compare Assets</h1>
      </div>
      <div className={styles.settings}>
        <div className={styles.numPic}>
          <div className={styles.two}>2</div>
          <div className={styles.three}>3</div>
        </div>
        <div className={styles.colNames}>
          names
        </div>
        <div className={styles.enter}>
          submit
        </div>
      </div>
      <div className={styles.progress}>
        progress
      </div>
    </div>
  );
};

export default Header;