import React from 'react';
import Bio from './components/Bio';
import styles from './App.less';
import Canvas from './components/Canvas';

const App = () => {
  return (
    <div className={styles.container}>
      <Bio />
      <Canvas draw={() => null} />
    </div>
  );
};

export default App;
