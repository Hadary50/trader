import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Traders = () => {
  const [traders, setTraders] = useState([]);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '', balance: 0 });

  useEffect(() => {
    fetchTraders();
  }, []);

  const fetchTraders = async () => {
    try {
      const response = await api.get('/traders');
      setTraders(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/traders', formData);
      setFormData({ name: '', phone: '', balance: 0 });
      fetchTraders();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredTraders = traders.filter(t => t.name.includes(search) || t.phone.includes(search));

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>إدارة التجار</h2>
      </div>
      
      <div className="card mb-5">
        <div className="card-body p-4">
          <h5 className="card-title mb-4">إضافة تاجر جديد</h5>
          <form onSubmit={handleAdd} className="row g-3">
            <div className="col-md-4">
              <label className="form-label text-secondary">اسم التاجر</label>
              <input type="text" className="form-control" placeholder="أدخل اسم التاجر" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="col-md-4">
              <label className="form-label text-secondary">رقم الهاتف</label>
              <input type="text" className="form-control" placeholder="01xxxxxxxxx" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
            </div>
            <div className="col-md-3">
              <label className="form-label text-secondary">الرصيد الافتتاحي (عليه)</label>
              <input type="number" className="form-control" placeholder="الرصيد إن وجد" value={formData.balance} onChange={(e) => setFormData({...formData, balance: e.target.value})} />
            </div>
            <div className="col-md-1 d-flex align-items-end">
              <button type="submit" className="btn btn-primary w-100">إضافة</button>
            </div>
          </form>
        </div>
      </div>

      <div className="mb-4">
        <input type="text" className="form-control form-control-lg" placeholder="ابحث عن تاجر بالاسم أو الرقم..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>اسم التاجر</th>
                <th>رقم الهاتف</th>
                <th>إجمالي المديونية (المتبقي عليه)</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredTraders.map(trader => (
                <tr key={trader._id}>
                  <td className="fw-bold">{trader.name}</td>
                  <td>{trader.phone}</td>
                  <td>
                    <span className={`badge px-3 py-2 ${trader.balance > 0 ? 'bg-danger' : 'bg-success'}`} style={{fontSize: '0.9rem'}}>
                      {trader.balance.toLocaleString()} ج.م
                    </span>
                  </td>
                  <td>
                    <Link to={`/trader/${trader._id}`} className="btn btn-primary btn-sm px-4">
                      فتح كشف الحساب
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredTraders.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-secondary">لا يوجد تجار لعرضهم</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Traders;
