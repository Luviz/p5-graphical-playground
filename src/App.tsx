import { useState } from "react";
import p5Logo from "./assets/p5.svg";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://p5js.org/" target="_blank">
          <img src={p5Logo} className="logo p5" alt="p5 logo" />
        </a>
      </div>
      <h1>Luviz's P5 Playground</h1>
      <a className="sketch-link" href="./sketch">
        To sketches
      </a>
    </div>
  );
}

export default App;
