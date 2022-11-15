import React from 'react';
import styles from './headerNumPick.module.css';

const HeaderNumPick = ({getColNum}) => {

  return(
    <ul className={styles.options}>
      <li className={styles.two} onClick={()=> getColNum(2)}>2</li>
      <li className={styles.three} onClick={()=> getColNum(3)}>3</li>
    </ul>
  );
};

export default HeaderNumPick;