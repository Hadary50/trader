import { useState, useEffect } from 'react';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    scooterModel: '',
    totalPrice: '',
    paidAmount: '',
    paymentType: 'cash',
    months: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchSales(), fetchCustomers()]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await api.get('/sales');
      setSales(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/sales', formData);
      setFormData({
        customerName: '', scooterModel: '', totalPrice: '',
        paidAmount: '', paymentType: 'cash', months: ''
      });
      fetchSales();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه العملية؟')) {
      try {
        await api.delete(`/sales/${id}`);
        fetchSales();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handlePayInstallment = async (id) => {
    const amount = prompt('أدخل المبلغ المدفوع:');
    if (amount && !isNaN(amount)) {
      try {
        await api.put(`/sales/${id}/pay`, { paymentAmount: amount });
        fetchSales();
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (isLoading) return <LoadingSpinner fullPage size="large" />;

  return (
    <div>
      <h2 className="mb-4">المبيعات ونظام الأقساط</h2>
      
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">إضافة عملية بيع جديدة</h5>
          <form onSubmit={handleAdd} className="row g-3">
            <div className="col-md-3">
              <label>اسم العميل</label>
              <select className="form-select" value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} required>
                <option value="">اختر العميل...</option>
                {customers.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label>موديل السكوتر</label>
              <input type="text" className="form-control" value={formData.scooterModel} onChange={(e) => setFormData({...formData, scooterModel: e.target.value})} required />
            </div>
            <div className="col-md-3">
              <label>السعر الإجمالي</label>
              <input type="number" className="form-control" value={formData.totalPrice} onChange={(e) => setFormData({...formData, totalPrice: e.target.value})} required />
            </div>
            <div className="col-md-3">
              <label>المبلغ المدفوع (المقدم)</label>
              <input type="number" className="form-control" value={formData.paidAmount} onChange={(e) => setFormData({...formData, paidAmount: e.target.value})} required />
            </div>
            <div className="col-md-3">
              <label>طريقة الدفع</label>
              <select className="form-select" value={formData.paymentType} onChange={(e) => setFormData({...formData, paymentType: e.target.value})}>
                <option value="cash">كاش</option>
                <option value="installment">قسط</option>
              </select>
            </div>
            {formData.paymentType === 'installment' && (
              <div className="col-md-3">
                <label>عدد الشهور</label>
                <input type="number" className="form-control" value={formData.months} onChange={(e) => setFormData({...formData, months: e.target.value})} required={formData.paymentType === 'installment'} />
              </div>
            )}
            <div className="col-12 mt-4">
              <button type="submit" className="btn btn-primary">تسجيل عملية البيع</button>
            </div>
          </form>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>العميل</th>
              <th>السكوتر</th>
              <th>طريقة الدفع</th>
              <th>الإجمالي</th>
              <th>المدفوع</th>
              <th>المتبقي</th>
              <th>القسط الشهري</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(s => (
              <tr key={s._id} className={s.remainingAmount > 0 && s.nextPaymentDate && new Date(s.nextPaymentDate) < new Date() ? 'table-danger' : ''}>
                <td>{s.customerName}</td>
                <td>{s.scooterModel}</td>
                <td>{s.paymentType === 'cash' ? 'كاش' : 'قسط'}</td>
                <td>{s.totalPrice}</td>
                <td>{s.paidAmount}</td>
                <td>{s.remainingAmount}</td>
                <td>{s.monthlyAmount > 0 ? s.monthlyAmount.toFixed(2) : '-'}</td>
                <td>
                  {s.remainingAmount > 0 && (
                    <button className="btn btn-success btn-sm me-2" onClick={() => handlePayInstallment(s._id)}>دفع قسط</button>
                  )}
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id)}>حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sales;
