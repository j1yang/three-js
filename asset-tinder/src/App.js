import './App.css';
import Footer from './components/footer/footer';
import Header from './components/header/header';
import Main from './components/main/main';
import { useState } from 'react';

function App() {
  const [colNum, setColNum] = useState(0);
  const getColNum = (colNum) => {
    
    setColNum(colNum);
  }

  console.log(colNum)
  return (
    <>
      <Header getColNum={getColNum} colNum={colNum}/>
      <Main colNum={colNum}/>
      <Footer/>
    </>
  );
}

export default App;
