import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Traders from './pages/Traders';
import TraderProfile from './pages/TraderProfile';
import GeneralTransactions from './pages/GeneralTransactions';
import Stock from './pages/Stock';
import Login from './pages/Login';

function App() {
  const isAdmin = !!localStorage.getItem('token');
  return (
    <Router>
      <Navbar />
      <div className="container pb-5 fade-in">
        <Routes>
          <Route path="/" element={isAdmin ? <Dashboard /> : <Stock />} />
          <Route path="/traders" element={<Traders />} />
          <Route path="/trader/:id" element={<TraderProfile />} />
          <Route path="/general" element={<GeneralTransactions />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
