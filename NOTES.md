# MVP User Stories — Family Finance (5 người: 2 vợ chồng, 2 con nhỏ, 1 mẹ già)

> 🎯 Nguyên tắc: **Dễ nhập – Offline-first – Local-only – Không lộ thông tin**

---

### 1. Là người vợ/chồng, tôi muốn **ghi lại các khoản chi tiêu hàng ngày** để **nắm được dòng tiền gia đình mà không cần kết nối internet**

→ *Implementation hint*:  
Dùng **localStorage** (hoặc IndexedDB nếu >1000 giao dịch) — dữ liệu chỉ lưu trên thiết bị, không gửi server. Form nhập ≤3 field, submit bằng phím Enter.

---

### 2. Là người vợ/chồng, tôi muốn **phân loại chi tiêu theo các mục chính (tiền ăn, học phí, y tế, nhà cửa)** để **biết được khoản nào đang chi tiêu nhiều nhất và điều chỉnh ngân sách**

→ *Implementation hint*:  
Danh mục **fixed list** (không cho tự nhập — tránh sai chính tả, dễ thống kê):
- `Ăn uống`  
- `Học phí`  
- `Thuốc men`  
- `Tiền chợ`  
- `Nhà cửa`  
- `Khác`  
→ Dùng dropdown (select) — không input text.

---

### 3. Là người vợ/chồng, tôi muốn **xem lại chi tiêu theo tuần/tháng** để **đánh giá tình hình tài chính tổng thể và đưa ra quyết định chi tiêu hợp lý hơn**

→ *Implementation hint*:  
- Báo cáo **client-side only** (không API)  
- Dùng `date-fns` để group theo `startOfWeek`, `startOfMonth`  
- Hiển thị: tổng chi, top 3 danh mục — không cần biểu đồ phức tạp ban đầu.

---

## 🛡️ Security & Privacy by Design (Zero Trust áp dụng cho offline app)
- ✅ **Không lưu bất kỳ dữ liệu nào lên server** → giảm 90% rủi ro  
- ✅ **Không yêu cầu đăng nhập** → dùng luôn thiết bị cá nhân (mỗi người dùng trên điện thoại riêng)  
- ✅ **Backup thủ công**: nút “Xuất CSV” → tải file về máy — không tự động sync  
- ⚠️ **Cảnh báo khi clear cache**: “Bạn sẽ mất toàn bộ dữ liệu — xác nhận?”