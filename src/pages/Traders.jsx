import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

const Traders = () => {
  const [traders, setTraders] = useState([]);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '', balance: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAdmin = !!localStorage.getItem('token');

  useEffect(() => {
    fetchTraders();
  }, []);

  const fetchTraders = async () => {
    try {
      const response = await api.get('/traders');
      setTraders(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/traders', formData);
      setFormData({ name: '', phone: '', balance: 0 });
      await fetchTraders();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('🚨 تحذير خطير: هل أنت متأكد من حذف هذا التاجر نهائياً؟\nسيتم حذف التاجر و**جميع عملياته وإيصالاته** بالكامل، ولن يمكنك التراجع عن هذا الإجراء!')) {
      setIsSubmitting(true);
      try {
        await api.delete(`/traders/${id}`);
        await fetchTraders();
      } catch (error) {
        console.error(error);
        alert('حدث خطأ أثناء محاولة الحذف.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const filteredTraders = traders.filter(t => t.name.includes(search) || t.phone.includes(search));

  if (isLoading) return <LoadingSpinner fullPage size="large" />;

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>إدارة التجار</h2>
      </div>
      
      {isAdmin && (
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
                <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                  {isSubmitting ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'إضافة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                    <div className="d-flex gap-2">
                      <Link to={`/trader/${trader._id}`} className="btn btn-primary btn-sm px-3 d-flex align-items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                        كشف الحساب
                      </Link>
                      {isAdmin && (
                        <button className="btn btn-outline-danger btn-sm px-3 d-flex align-items-center gap-1" onClick={() => handleDelete(trader._id)} title="حذف التاجر">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </button>
                      )}
                    </div>
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
