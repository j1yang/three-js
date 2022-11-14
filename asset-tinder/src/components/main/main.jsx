import React from 'react';
import ImageContainer from '../imageContainer/imageContainer';
import Sidebar from '../sidebar/sidebar';
import styles from './main.module.css';

const Main = (props) => {
  return(
    <section className={styles.section}>
      <Sidebar/>
      <ImageContainer/>
    </section>
  );
};

export default Main;