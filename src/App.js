import React from "react";
import Quiz from "./components/Quiz";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Quiz App</h1>
      </header>
      <Quiz />
    </div>
  );
}

export default App;
