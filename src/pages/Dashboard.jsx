import { useState, useEffect } from 'react';
import api from '../api';

const Dashboard = () => {
  const [data, setData] = useState({
    totalOwedByTraders: 0,
    totalAlena: 0,
    totalCollected: 0,
    netBalance: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="fade-in">
      <div className="d-flex align-items-center mb-5">
        <h2 className="mb-0">نظرة عامة (Overview)</h2>
      </div>

      <div className="row g-4">
        <div className="col-md-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body d-flex flex-column justify-content-center">
              <h5 className="card-title mb-3">إجمالي لينا بره</h5>
              <div className="metric-value metric-primary">{data.totalOwedByTraders.toLocaleString()} <span className="fs-5 text-secondary fw-normal">ج.م</span></div>
              <p className="text-secondary mt-2 mb-0" style={{fontSize: '0.85rem'}}>إجمالي المديونيات على كل التجار</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body d-flex flex-column justify-content-center">
              <h5 className="card-title mb-3">إجمالي علينا</h5>
              <div className="metric-value metric-danger">{data.totalAlena.toLocaleString()} <span className="fs-5 text-secondary fw-normal">ج.م</span></div>
              <p className="text-secondary mt-2 mb-0" style={{fontSize: '0.85rem'}}>إجمالي ما علينا للموردين/المصروفات</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body d-flex flex-column justify-content-center">
              <h5 className="card-title mb-3">صافي الرصيد</h5>
              <div className={`metric-value ${data.netBalance >= 0 ? 'metric-success' : 'metric-danger'}`}>
                {data.netBalance.toLocaleString()} <span className="fs-5 text-secondary fw-normal">ج.م</span>
              </div>
              <p className="text-secondary mt-2 mb-0" style={{fontSize: '0.85rem'}}>(لينا بره - علينا)</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body d-flex flex-column justify-content-center">
              <h5 className="card-title mb-3">إجمالي التحصيلات</h5>
              <div className="metric-value text-white">{data.totalCollected.toLocaleString()} <span className="fs-5 text-secondary fw-normal">ج.م</span></div>
              <p className="text-secondary mt-2 mb-0" style={{fontSize: '0.85rem'}}>كل الكاش المستلم من التجار</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
