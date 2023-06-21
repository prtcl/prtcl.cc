import React from 'react';
import Bio from './components/Bio';
import styles from './App.less';
import Visualization from './components/Visualization';

const App = () => {
  return (
    <div className={styles.container}>
      <div className={styles.visualization}>
        <Visualization />
      </div>
      <div className={styles.bio}>
        <Bio />
      </div>
    </div>
  );
};

export default App;
