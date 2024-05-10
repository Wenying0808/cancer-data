import React from 'react';
import { useState } from 'react';
import Navbar from './navbar/navbar';
import Section1 from './section1/section1';
import Section2 from './section2/section2';
import Section3 from './section3/section3';
import Section4 from './section4/section4';
import './App.css';

function App() {

  const [activeSelection, setActiveSelection] = useState('section1');
  const handleNavbarClcik = (selectionId) => {
    setActiveSelection(selectionId);
  }

  return (
    <div className="App">
      <Navbar onNavbarClick={handleNavbarClcik}/>
      <div className='sections'>
        <Section1 id="section1" isActive={activeSelection === "section1"}/>
        <Section2 id="section2" isActive={activeSelection === "section2"}/>
        <Section3 id="section3" isActive={activeSelection === "section3"}/>
        <Section4 id="section4" isActive={activeSelection === "section4"}/>
      </div>
    </div>
  );
}

export default App;
