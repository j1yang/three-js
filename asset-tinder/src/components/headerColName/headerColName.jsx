import React from 'react';

const HeaderColName = ({colNum}) => {
  switch(colNum){
    case 2:
      return(<h1>2</h1>);
    case 3:
      return(<h1>3</h1>);
    default:
      return(<h1>choose col</h1>);
  }
};

export default HeaderColName;