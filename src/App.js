import React from 'react';
import { useState, useRef, useEffect } from 'react';
import Navbar from './navbar/navbar';
import Section1 from './section1/section1';
import Section2 from './section2/section2';
import Section3 from './section3/section3';
import Section4 from './section4/section4';
import './App.css';

function App() {

  const [activeSelection, setActiveSelection] = useState('section1');
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(true);

  const sectionRefs = {
    section1: useRef(),
    section2: useRef(),
    section3: useRef(),
    section4: useRef(),
  }

  const handleNavbarSectionClcik = (selectionId) => {
    setActiveSelection(selectionId);
  };

  const handleNavbarToggle = () => {
    setIsNavbarExpanded(!isNavbarExpanded);
  };


  useEffect(() => {

    const observerOptions = {
      root: null,
      threshold: 0.5,
    }

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSelection(entry.target.id);
        };
      })
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // observe each section
    Object.values(sectionRefs).forEach((ref) => {
      observer.observe(ref.current);
    })
    
  }, [])


  return (
    <div className={`App ${isNavbarExpanded ? "navbar-expanded" : "navbar-collapsed"}`}>
      <Navbar
        isExpanded={isNavbarExpanded}
        handleExpandChange={handleNavbarToggle}
        onNavbarClick={handleNavbarSectionClcik} 
        activeSelection={activeSelection}
      />
      <div id ="sections" className='sections'>
        <div ref={sectionRefs.section1} id="section1">
          <Section1 id="section1" isActive={activeSelection === "section1"}/>
        </div>
        <div ref={sectionRefs.section2} id="section2">
          <Section2 id="section2" isActive={activeSelection === "section2"}/>
        </div>
        <div ref={sectionRefs.section3} id="section3">
          <Section3 id="section3" isActive={activeSelection === "section3"}/>
        </div>
        <div ref={sectionRefs.section4} id="section4">
          <Section4 id="section4" isActive={activeSelection === "section4"}/>
        </div> 
      </div>
    </div>
  );
  
}

export default App;
