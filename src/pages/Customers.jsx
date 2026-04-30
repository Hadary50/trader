import { useState, useEffect } from 'react';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/customers', formData);
      setFormData({ name: '', phone: '', address: '' });
      fetchCustomers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من الحذف؟')) {
      try {
        await api.delete(`/customers/${id}`);
        fetchCustomers();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const filteredCustomers = customers.filter(c => c.name.includes(search) || c.phone.includes(search));

  if (isLoading) return <LoadingSpinner fullPage size="large" />;

  return (
    <div>
      <h2 className="mb-4">إدارة العملاء</h2>
      
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">إضافة عميل جديد</h5>
          <form onSubmit={handleAdd} className="row g-3">
            <div className="col-md-4">
              <input type="text" className="form-control" placeholder="الاسم" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="col-md-4">
              <input type="text" className="form-control" placeholder="رقم الهاتف" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
            </div>
            <div className="col-md-4">
              <input type="text" className="form-control" placeholder="العنوان (اختياري)" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary">إضافة العميل</button>
            </div>
          </form>
        </div>
      </div>

      <div className="mb-3">
        <input type="text" className="form-control" placeholder="بحث بالاسم أو رقم الهاتف..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>الاسم</th>
              <th>رقم الهاتف</th>
              <th>العنوان</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(customer => (
              <tr key={customer._id}>
                <td>{customer.name}</td>
                <td>{customer.phone}</td>
                <td>{customer.address || '-'}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(customer._id)}>حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
