import React from 'react';
import { useState } from 'react';
import Navbar from './navbar/navbar';
import Section from './section/section';
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
        <Section id="section1" isActive={activeSelection === "section1"}/>
        <Section id="section2" isActive={activeSelection === "section2"}/>
        <Section id="section3" isActive={activeSelection === "section3"}/>
        <Section id="section4" isActive={activeSelection === "section4"}/>

      </div>
     
    </div>
  );
}

export default App;
