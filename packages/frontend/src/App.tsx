import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/challenges" element={<div>Challenges Page</div>} />
        <Route path="/challenges/:id" element={<div>Challenge Detail Page</div>} />
      </Routes>
    </div>
  );
}

export default App;
