import React from 'react';
import { useState } from 'react';
import Navbar from './navbar/navbar';
import Section1 from './prevelance_around_the_world/section1';
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
        <Section1 id="section2" isActive={activeSelection === "section2"}/>
        <Section1 id="section3" isActive={activeSelection === "section3"}/>
        <Section1 id="section4" isActive={activeSelection === "section4"}/>

      </div>
     
    </div>
  );
}

export default App;
