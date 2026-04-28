import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

const TraderProfile = () => {
  const { id } = useParams();
  const [trader, setTrader] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({ type: 'purchase', amount: '', scooterModel: '', notes: '' });

  useEffect(() => {
    fetchTraderData();
  }, [id]);

  const fetchTraderData = async () => {
    try {
      const response = await api.get(`/traders/${id}`);
      setTrader(response.data.trader);
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/traders/${id}/transactions`, formData);
      setFormData({ type: 'purchase', amount: '', scooterModel: '', notes: '' });
      fetchTraderData(); // Refresh data
    } catch (error) {
      console.error(error);
    }
  };

  if (!trader) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Link to="/traders" className="btn btn-outline-secondary btn-sm mb-3">← العودة لقائمة التجار</Link>
          <h2>كشف حساب: <span className="text-primary">{trader.name}</span></h2>
        </div>
        <div className="text-end">
          <p className="text-secondary mb-1">الرصيد الحالي (المديونية)</p>
          <h3 className={trader.balance > 0 ? 'text-danger' : 'text-success'}>
            {trader.balance.toLocaleString()} ج.م
          </h3>
        </div>
      </div>

      <div className="card mb-5">
        <div className="card-body p-4">
          <h5 className="card-title mb-4">تسجيل عملية جديدة</h5>
          <form onSubmit={handleAddTransaction} className="row g-3">
            <div className="col-md-3">
              <label className="form-label text-secondary">نوع العملية</label>
              <select className="form-select" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                <option value="purchase">سحب سكوتر (يزيد المديونية)</option>
                <option value="payment">دفعة نقدية (يقلل المديونية)</option>
              </select>
            </div>
            {formData.type === 'purchase' && (
              <div className="col-md-3 fade-in">
                <label className="form-label text-secondary">موديل السكوتر / التفاصيل</label>
                <input type="text" className="form-control" placeholder="مثال: SYM ST 200" value={formData.scooterModel} onChange={(e) => setFormData({...formData, scooterModel: e.target.value})} required={formData.type === 'purchase'} />
              </div>
            )}
            <div className="col-md-2">
              <label className="form-label text-secondary">المبلغ</label>
              <input type="number" className="form-control" placeholder="0" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
            </div>
            <div className="col-md-3">
              <label className="form-label text-secondary">ملاحظات (اختياري)</label>
              <input type="text" className="form-control" placeholder="أي تفاصيل أخرى..." value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
            </div>
            <div className="col-md-1 d-flex align-items-end">
              <button type="submit" className={`btn w-100 ${formData.type === 'purchase' ? 'btn-danger' : 'btn-success'}`}>
                تسجيل
              </button>
            </div>
          </form>
        </div>
      </div>

      <h4 className="mb-4">سجل العمليات (History)</h4>
      <div className="card">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>التاريخ</th>
                <th>نوع العملية</th>
                <th>التفاصيل</th>
                <th>المبلغ</th>
                <th>ملاحظات</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx._id}>
                  <td>{new Date(tx.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' })}</td>
                  <td>
                    {tx.type === 'purchase' ? 
                      <span className="badge bg-danger">سحب سكوتر</span> : 
                      <span className="badge bg-success">دفعة نقدية استلمناها</span>
                    }
                  </td>
                  <td>{tx.type === 'purchase' ? tx.scooterModel : '-'}</td>
                  <td className={`fw-bold ${tx.type === 'purchase' ? 'text-danger' : 'text-success'}`}>
                    {tx.type === 'purchase' ? '+' : '-'}{tx.amount.toLocaleString()} ج.م
                  </td>
                  <td>{tx.notes || '-'}</td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-secondary">لم يتم تسجيل أي عمليات بعد لهذا التاجر</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TraderProfile;
