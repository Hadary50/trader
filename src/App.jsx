import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Traders from './pages/Traders';
import TraderProfile from './pages/TraderProfile';
import GeneralTransactions from './pages/GeneralTransactions';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container pb-5 fade-in">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/traders" element={<Traders />} />
          <Route path="/trader/:id" element={<TraderProfile />} />
          <Route path="/general" element={<GeneralTransactions />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
