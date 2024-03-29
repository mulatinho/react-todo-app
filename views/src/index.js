import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Dashboard from './components/dashboard'

function App() {
  return (
    <div className="react-todo-app">
      <Dashboard/>
    </div>
  );
}

export default App;

ReactDOM.render(<App />, document.getElementById('root'));
