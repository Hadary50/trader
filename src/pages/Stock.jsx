import { useState, useEffect } from 'react';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

const Stock = () => {
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState('all'); // all, consignment, sold
  const [formData, setFormData] = useState({
    model: '',
    color: '',
    chassisNumber: '',
    engineNumber: '',
    showroomName: '',
    status: 'consignment',
    notes: ''
  });
  const [editingItem, setEditingItem] = useState(null);
  const isAdmin = !!localStorage.getItem('token');

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      const response = await api.get('/stock');
      setStockItems(response.data);
    } catch (error) {
      console.error('Error fetching stock:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/stock', formData);
      setFormData({
        model: '',
        color: '',
        chassisNumber: '',
        engineNumber: '',
        showroomName: '',
        status: 'consignment',
        notes: ''
      });
      fetchStock();
    } catch (error) {
      console.error('Error adding stock:', error);
      alert('حدث خطأ أثناء الإضافة. تأكد من عدم تكرار رقم الشاسيه أو الماتور.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.put(`/stock/${editingItem._id}`, editingItem);
      setEditingItem(null);
      fetchStock();
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('حدث خطأ أثناء التحديث.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا السكوتر من الاستوك؟')) {
      try {
        await api.delete(`/stock/${id}`);
        fetchStock();
      } catch (error) {
        console.error('Error deleting stock:', error);
      }
    }
  };

  const filteredItems = stockItems.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const stats = {
    total: stockItems.length,
    consignment: stockItems.filter(i => i.status === 'consignment').length,
    sold: stockItems.filter(i => i.status === 'sold').length
  };

  if (loading) return <LoadingSpinner fullPage size="large" />;

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark mb-0">إدارة الاستوك (المخزن)</h2>
        <div className="badge bg-primary p-2 px-3 rounded-pill shadow-sm">إجمالي: {stats.total}</div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-5">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm bg-info text-white h-100">
            <div className="card-body p-4">
              <h6 className="text-uppercase fw-bold opacity-75">سكوترات (أمانة)</h6>
              <h2 className="fw-bold mb-0">{stats.consignment}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm bg-success text-white h-100">
            <div className="card-body p-4">
              <h6 className="text-uppercase fw-bold opacity-75">سكوترات (مباعة)</h6>
              <h2 className="fw-bold mb-0">{stats.sold}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Add Form */}
      {isAdmin && (
        <div className="card mb-5 border-0 shadow-sm">
          <div className="card-body p-4">
            <h5 className="card-title mb-4 fw-bold">إضافة سكوتر جديد</h5>
            <form onSubmit={handleAddSubmit} className="row g-3">
              <div className="col-md-3">
                <label className="form-label fw-semibold text-secondary">الموديل</label>
                <input type="text" className="form-control" value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} required placeholder="SYM ST 200" />
              </div>
              <div className="col-md-2">
                <label className="form-label fw-semibold text-secondary">اللون</label>
                <input type="text" className="form-control" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} placeholder="أبيض" />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold text-secondary">رقم الشاسيه</label>
                <input type="text" className="form-control" value={formData.chassisNumber} onChange={(e) => setFormData({...formData, chassisNumber: e.target.value})} required />
              </div>
              <div className="col-md-2">
                <label className="form-label fw-semibold text-secondary">رقم الماتور</label>
                <input type="text" className="form-control" value={formData.engineNumber} onChange={(e) => setFormData({...formData, engineNumber: e.target.value})} required />
              </div>
              <div className="col-md-2">
                <label className="form-label fw-semibold text-secondary">اسم المعرض</label>
                <input type="text" className="form-control" value={formData.showroomName} onChange={(e) => setFormData({...formData, showroomName: e.target.value})} required placeholder="معرض النور" />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold text-secondary">الحالة</label>
                <select className="form-select fw-bold" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option value="consignment">أمانة</option>
                  <option value="sold">مباع</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold text-secondary">ملاحظات</label>
                <input type="text" className="form-control" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} placeholder="أي ملاحظات إضافية..." />
              </div>
              <div className="col-md-3 d-flex align-items-end">
                <button type="submit" className="btn btn-primary w-100 fw-bold py-2 shadow-sm" disabled={isSubmitting}>
                  {isSubmitting ? <span className="spinner-border spinner-border-sm"></span> : 'إضافة للاستوك'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter and List */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">قائمة الاستوك</h4>
        <div className="btn-group shadow-sm">
          <button className={`btn btn-sm ${filter === 'all' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setFilter('all')}>الكل</button>
          <button className={`btn btn-sm ${filter === 'consignment' ? 'btn-info text-white' : 'btn-outline-info'}`} onClick={() => setFilter('consignment')}>أمانة</button>
          <button className={`btn btn-sm ${filter === 'sold' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => setFilter('sold')}>مباع</button>
        </div>
      </div>

      <div className="card border-0 shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3 text-secondary">الموديل / اللون</th>
                <th className="py-3 text-secondary">الأرقام (شاسيه/ماتور)</th>
                <th className="py-3 text-secondary">المعرض</th>
                <th className="py-3 text-secondary">الحالة</th>
                <th className="py-3 text-secondary">ملاحظات</th>
                <th className="px-4 py-3 text-secondary text-end">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item._id}>
                  <td className="px-4">
                    <div className="fw-bold text-dark">{item.model}</div>
                    <div className="small text-secondary">{item.color || '-'}</div>
                  </td>
                  <td>
                    <div className="small fw-semibold text-primary">شاسيه: {item.chassisNumber}</div>
                    <div className="small fw-semibold text-secondary">ماتور: {item.engineNumber}</div>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border">{item.showroomName}</span>
                  </td>
                  <td>
                    {item.status === 'consignment' ? 
                      <span className="badge bg-info text-white rounded-pill px-3">أمانة</span> :
                      <span className="badge bg-success rounded-pill px-3">مباع</span>
                    }
                  </td>
                  <td className="small text-muted">{item.notes || '-'}</td>
                  <td className="px-4 text-end">
                    {isAdmin && (
                      <div className="d-flex gap-2 justify-content-end">
                        <button className="btn btn-sm btn-outline-primary p-1 px-2" onClick={() => setEditingItem(item)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button className="btn btn-sm btn-outline-danger p-1 px-2" onClick={() => handleDelete(item._id)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-secondary">لا يوجد سكوترات في الاستوك حالياً</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">تعديل بيانات السكوتر</h5>
                <button type="button" className="btn-close" onClick={() => setEditingItem(null)}></button>
              </div>
              <div className="modal-body">
                <form id="editForm" onSubmit={handleEditSubmit} className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">الموديل</label>
                    <input type="text" className="form-control" value={editingItem.model} onChange={(e) => setEditingItem({...editingItem, model: e.target.value})} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">اللون</label>
                    <input type="text" className="form-control" value={editingItem.color} onChange={(e) => setEditingItem({...editingItem, color: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">رقم الشاسيه</label>
                    <input type="text" className="form-control" value={editingItem.chassisNumber} onChange={(e) => setEditingItem({...editingItem, chassisNumber: e.target.value})} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">رقم الماتور</label>
                    <input type="text" className="form-control" value={editingItem.engineNumber} onChange={(e) => setEditingItem({...editingItem, engineNumber: e.target.value})} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">اسم المعرض</label>
                    <input type="text" className="form-control" value={editingItem.showroomName} onChange={(e) => setEditingItem({...editingItem, showroomName: e.target.value})} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">الحالة</label>
                    <select className="form-select fw-bold" value={editingItem.status} onChange={(e) => setEditingItem({...editingItem, status: e.target.value})}>
                      <option value="consignment">أمانة</option>
                      <option value="sold">مباع</option>
                    </select>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">ملاحظات</label>
                    <input type="text" className="form-control" value={editingItem.notes} onChange={(e) => setEditingItem({...editingItem, notes: e.target.value})} />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingItem(null)}>إلغاء</button>
                <button type="submit" form="editForm" className="btn btn-primary px-4" disabled={isSubmitting}>حفظ التعديلات</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stock;
