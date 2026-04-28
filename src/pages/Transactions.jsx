import { useState, useEffect } from 'react';
import api from '../api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({ name: '', type: 'لينا', amount: '', notes: '' });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transactions', formData);
      setFormData({ name: '', type: 'لينا', amount: '', notes: '' });
      fetchTransactions();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من الحذف؟')) {
      try {
        await api.delete(`/transactions/${id}`);
        fetchTransactions();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <h2 className="mb-4">المعاملات المالية (لينا وعلينا)</h2>
      
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">إضافة معاملة جديدة</h5>
          <form onSubmit={handleAdd} className="row g-3">
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="الاسم (عميل/مورد)" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="col-md-2">
              <select className="form-select" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                <option value="لينا">لينا</option>
                <option value="علينا">علينا</option>
              </select>
            </div>
            <div className="col-md-2">
              <input type="number" className="form-control" placeholder="المبلغ" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
            </div>
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="ملاحظات" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100">إضافة</button>
            </div>
          </form>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>التاريخ</th>
              <th>الاسم</th>
              <th>النوع</th>
              <th>المبلغ</th>
              <th>ملاحظات</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t._id}>
                <td>{new Date(t.date).toLocaleDateString('ar-EG')}</td>
                <td>{t.name}</td>
                <td>
                  <span className={`badge ${t.type === 'لينا' ? 'bg-success' : 'bg-danger'}`}>
                    {t.type}
                  </span>
                </td>
                <td>{t.amount}</td>
                <td>{t.notes || '-'}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t._id)}>حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
