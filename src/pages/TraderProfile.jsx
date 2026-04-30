import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

const TraderProfile = () => {
  const { id } = useParams();
  const [trader, setTrader] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({ type: 'purchase', amount: '', scooterModel: '', notes: '', date: new Date().toISOString().split('T')[0], attachment: '' });
  const [editingTx, setEditingTx] = useState(null);
  const [viewingAttachment, setViewingAttachment] = useState(null);

  const handleImageUpload = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        let scaleSize = 1;
        if (img.width > MAX_WIDTH) {
          scaleSize = MAX_WIDTH / img.width;
        }
        canvas.width = img.width * scaleSize;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const base64String = canvas.toDataURL('image/jpeg', 0.7);
        if (isEdit) {
          setEditingTx(prev => ({...prev, attachment: base64String}));
        } else {
          setFormData(prev => ({...prev, attachment: base64String}));
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

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
      setFormData({ type: 'purchase', amount: '', scooterModel: '', notes: '', date: new Date().toISOString().split('T')[0], attachment: '' });
      fetchTraderData(); // Refresh data
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (tx) => {
    setEditingTx({
      ...tx,
      date: new Date(tx.date).toISOString().split('T')[0]
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/traders/${id}/transactions/${editingTx._id}`, editingTx);
      setEditingTx(null);
      fetchTraderData(); // Refresh data
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClick = async (txId) => {
    if (window.confirm('هل أنت متأكد من حذف هذه العملية نهائياً؟ سيتم إعادة حساب رصيد التاجر تلقائياً.')) {
      try {
        await api.delete(`/traders/${id}/transactions/${txId}`);
        fetchTraderData(); // Refresh data
      } catch (error) {
        console.error(error);
        alert('حدث خطأ أثناء الحذف، يرجى المحاولة مرة أخرى.');
      }
    }
  };

  if (!trader) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-start mb-4 d-print-none">
        <div>
          <Link to="/traders" className="btn btn-outline-secondary btn-sm mb-3">← العودة لقائمة التجار</Link>
          <h2 className="fw-bold text-dark">كشف حساب: <span className="text-primary">{trader.name}</span></h2>
        </div>
        <div className="text-end d-flex flex-column align-items-end gap-3">
          <button className="btn btn-success d-flex align-items-center gap-2 shadow-sm" onClick={() => window.print()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            طباعة كشف الحساب
          </button>
          <div className="text-start bg-light p-3 rounded shadow-sm">
            <p className="text-secondary fw-semibold mb-1">الرصيد الحالي (المديونية)</p>
            <h3 className={`fw-bold mb-0 ${trader.balance > 0 ? 'text-danger' : 'text-success'}`}>
              {trader.balance.toLocaleString()} ج.م
            </h3>
          </div>
        </div>
      </div>
      
      {/* Print Only Header */}
      <div className="d-none d-print-block mb-4 text-center">
        <h2 className="fw-bold mb-3">كشف حساب التاجر: {trader.name}</h2>
        <h4 className={`fw-bold ${trader.balance > 0 ? 'text-danger' : 'text-success'}`}>الرصيد الحالي: {trader.balance.toLocaleString()} ج.م</h4>
        <hr/>
      </div>

      <div className="card mb-5 d-print-none border-0 shadow-sm">
        <div className="card-body p-4">
          <h5 className="card-title mb-4">تسجيل عملية جديدة</h5>
          <form onSubmit={handleAddTransaction} className="row g-3">
            <div className="col-md-2">
              <label className="form-label text-secondary fw-semibold">التاريخ</label>
              <input type="date" className="form-control" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
            </div>
            <div className="col-md-2">
              <label className="form-label text-secondary fw-semibold">نوع العملية</label>
              <select className="form-select fw-bold" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                <option value="purchase">سحب سكوتر</option>
                <option value="payment">دفعة نقدية</option>
              </select>
            </div>
            {formData.type === 'purchase' && (
              <div className="col-md-2 fade-in">
                <label className="form-label text-secondary fw-semibold">الموديل / التفاصيل</label>
                <input type="text" className="form-control" placeholder="SYM ST 200" value={formData.scooterModel} onChange={(e) => setFormData({...formData, scooterModel: e.target.value})} required={formData.type === 'purchase'} />
              </div>
            )}
            <div className="col-md-2">
              <label className="form-label text-secondary fw-semibold">المبلغ</label>
              <input type="number" className="form-control fw-bold text-primary" placeholder="0" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
            </div>
            <div className="col-md-4">
              <label className="form-label text-secondary fw-semibold">ملاحظات (اختياري)</label>
              <input type="text" className="form-control" placeholder="أي تفاصيل أخرى..." value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
            </div>
            <div className="col-md-9">
              <label className="form-label text-secondary fw-semibold">إرفاق إيصال / صورة (اختياري)</label>
              <input type="file" className="form-control" accept="image/*" onChange={(e) => handleImageUpload(e, false)} />
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button type="submit" className={`btn w-100 fw-bold shadow-sm ${formData.type === 'purchase' ? 'btn-danger' : 'btn-success'}`}>
                تسجيل العملية
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
                <th className="text-secondary">التاريخ</th>
                <th className="text-secondary">نوع العملية</th>
                <th className="text-secondary">التفاصيل</th>
                <th className="text-secondary">المبلغ</th>
                <th className="text-secondary">ملاحظات</th>
                <th className="text-secondary">المرفق</th>
                <th className="text-secondary d-print-none">إجراءات</th>
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
                  <td>
                    {tx.attachment ? (
                      <button className="btn btn-sm btn-outline-info d-print-none d-flex align-items-center gap-1" onClick={() => setViewingAttachment(tx.attachment)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        عرض
                      </button>
                    ) : (
                      <span className="text-muted small">-</span>
                    )}
                    {tx.attachment && <span className="d-none d-print-inline text-muted small">مرفق بالسيستم</span>}
                  </td>
                  <td className="d-print-none">
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 px-2" onClick={() => handleEditClick(tx)} title="تعديل">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 px-2" onClick={() => handleDeleteClick(tx._id)} title="حذف">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-secondary">لم يتم تسجيل أي عمليات بعد لهذا التاجر</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingTx && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content text-dark">
              <div className="modal-header">
                <h5 className="modal-title">تعديل العملية</h5>
                <button type="button" className="btn-close" onClick={() => setEditingTx(null)}></button>
              </div>
              <div className="modal-body">
                <form id="editForm" onSubmit={handleEditSubmit}>
                  <div className="mb-3">
                    <label className="form-label">التاريخ</label>
                    <input type="date" className="form-control" value={editingTx.date} onChange={(e) => setEditingTx({...editingTx, date: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">نوع العملية</label>
                    <select className="form-select" value={editingTx.type} onChange={(e) => setEditingTx({...editingTx, type: e.target.value})}>
                      <option value="purchase">سحب سكوتر</option>
                      <option value="payment">دفعة نقدية</option>
                    </select>
                  </div>
                  {editingTx.type === 'purchase' && (
                    <div className="mb-3">
                      <label className="form-label">موديل السكوتر / التفاصيل</label>
                      <input type="text" className="form-control" value={editingTx.scooterModel} onChange={(e) => setEditingTx({...editingTx, scooterModel: e.target.value})} required={editingTx.type === 'purchase'} />
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label">المبلغ</label>
                    <input type="number" className="form-control" value={editingTx.amount} onChange={(e) => setEditingTx({...editingTx, amount: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">ملاحظات (اختياري)</label>
                    <input type="text" className="form-control" value={editingTx.notes} onChange={(e) => setEditingTx({...editingTx, notes: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">إرفاق إيصال / صورة جديد (اختياري)</label>
                    <input type="file" className="form-control" accept="image/*" onChange={(e) => handleImageUpload(e, true)} />
                    {editingTx.attachment && (
                      <div className="mt-2 text-success small fw-bold d-flex align-items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        يوجد مرفق محفوظ مسبقاً (رفع ملف جديد سيستبدله)
                      </div>
                    )}
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingTx(null)}>إلغاء</button>
                <button type="submit" form="editForm" className="btn btn-primary">حفظ التعديلات</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attachment Viewer Modal */}
      {viewingAttachment && (
        <div className="modal show d-block d-print-none" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }} onClick={() => setViewingAttachment(null)}>
          <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content bg-transparent border-0">
              <div className="modal-header border-0 pb-0 justify-content-end">
                <button type="button" className="btn-close btn-close-white" onClick={() => setViewingAttachment(null)}></button>
              </div>
              <div className="modal-body text-center pt-0">
                <img src={viewingAttachment} alt="إيصال / مرفق" className="img-fluid rounded shadow-lg" style={{ maxHeight: '80vh', objectFit: 'contain' }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TraderProfile;
