import { useState, useEffect } from 'react';
import api from '../api';

const GeneralTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({ name: '', amount: '', notes: '' });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/general');
      setTransactions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/general', formData);
      setFormData({ name: '', amount: '', notes: '' });
      fetchTransactions();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من الحذف؟')) {
      try {
        await api.delete(`/general/${id}`);
        fetchTransactions();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>المصروفات والموردين (علينا)</h2>
      </div>
      
      <div className="card mb-5">
        <div className="card-body p-4">
          <h5 className="card-title mb-4">إضافة مصروف أو مستحقات مورد</h5>
          <form onSubmit={handleAdd} className="row g-3">
            <div className="col-md-4">
              <label className="form-label text-secondary">الاسم (الجهة / المورد)</label>
              <input type="text" className="form-control" placeholder="مثال: مصاريف شحن، مورد كذا..." value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="col-md-3">
              <label className="form-label text-secondary">المبلغ المدفوع / المستحق</label>
              <input type="number" className="form-control" placeholder="0" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
            </div>
            <div className="col-md-3">
              <label className="form-label text-secondary">ملاحظات</label>
              <input type="text" className="form-control" placeholder="اختياري..." value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button type="submit" className="btn btn-danger w-100">تسجيل</button>
            </div>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>التاريخ</th>
                <th>الجهة / المورد</th>
                <th>المبلغ</th>
                <th>ملاحظات</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t._id}>
                  <td>{new Date(t.date).toLocaleDateString('ar-EG')}</td>
                  <td className="fw-bold">{t.name}</td>
                  <td className="text-danger fw-bold">{t.amount.toLocaleString()} ج.م</td>
                  <td>{t.notes || '-'}</td>
                  <td>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(t._id)}>حذف</button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-secondary">لا توجد مصروفات مسجلة</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GeneralTransactions;
