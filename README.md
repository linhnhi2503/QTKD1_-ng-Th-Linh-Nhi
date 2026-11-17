# Hệ Thống AI Agent Xử Lý Cơ Hội Bán Hàng B2B (Công Ty Thiên Minh)

Ứng dụng vận hành trực tiếp trên **Localhost:8000**, mô phỏng và tự động hóa toàn bộ quy trình xử lý 20 bộ yêu cầu chào giá (RFP) mỗi tháng của Công ty Thiên Minh dựa trên sơ đồ quy trình nghiệp vụ chuẩn.

---

## 1. Cấu Trúc Thư Mục Hệ Thống

```
New folder/
├── data/
│   ├── catalog_solutions.json   # Danh mục giải pháp mạng (Switch, AP, Firewall), đặc tính kỹ thuật, tồn kho, giá
│   ├── schedule_capacity.json   # Năng lực và lịch thi công của các đội kỹ thuật Thiên Minh
│   ├── approval_policies.json   # Ma trận thẩm quyền duyệt giá, trần chiết khấu và điều kiện ngoại lệ
│   └── sample_rfps.json         # 4 bộ hồ sơ mẫu mô phỏng các tình huống thực tế
├── agents/
│   ├── intake_agent.py          # Bắt đầu: Tiếp nhận & bóc tách yêu cầu, điều kiện bắt buộc
│   ├── qualification_agent.py   # Kiểm tra tính đầy đủ thông tin; Tự động soạn Thư làm rõ nếu thiếu
│   ├── technical_agent.py       # Khớp catalog & Thẩm định tính năng (Chống chọn gói rẻ thiếu tính năng)
│   ├── capacity_agent.py        # Thẩm định kho & Đối soát lịch triển khai (Chống xung đột tiến độ)
│   ├── pricing_agent.py         # Tính giá, chiết khấu & Kiểm tra thẩm quyền phê duyệt
│   ├── proposal_agent.py        # Lập Báo giá (BOQ) & Dự thảo đề xuất kỹ thuật
│   └── orchestrator.py          # Điều phối luồng làm việc theo đúng sơ đồ
├── static/
│   └── index.html               # Giao diện Dashboard trực quan với Sơ đồ quy trình tương tác
├── app.py                       # FastAPI Web Server chạy trên localhost
├── start.bat                    # Script khởi chạy 1-click trên Windows
└── README.md
```

---

## 2. Cách Khởi Động Trên Localhost

1. Nhấp đúp chuột vào file **`start.bat`** (hoặc mở PowerShell tại thư mục này và gõ:
   ```powershell
   & "C:\Users\DANG KHOA\AppData\Local\Programs\Python\Python312\python.exe" app.py
   ```
2. Mở trình duyệt web và truy cập địa chỉ:
   ```
   http://localhost:8000
   ```

---

## 3. Các Kịch Bản Kiểm Thử Có Sẵn Trên Giao Diện

1. **Kịch bản 1: Khách sạn Biển Xanh (Thành công chuẩn)**
   - Đủ thông tin, đạt 100% tiêu chí kỹ thuật, lịch trình 25 ngày khả thi, chiết khấu 5% nằm trong thẩm quyền của NVKD.
   - Kết quả: Hệ thống tự động sinh bảng dự toán BOQ và xuất bản chào giá.

2. **Kịch bản 2: Tòa nhà TechLand (Thiếu thông tin)**
   - Yêu cầu chung chung, thiếu số lượng node, loại switch, ngày bàn giao.
   - Kết quả: Rẽ nhánh **"Không đủ thông tin"**, tự động soạn thảo Email làm rõ gửi cho khách hàng.

3. **Kịch bản 3: Bệnh viện Phúc An (Vượt thẩm quyền & SLA 24/7)**
   - Bắt buộc Switch Core Layer 3 nguồn kép, Firewall HA 1Gbps, yêu cầu chiết khấu 12% (> 8%) và SLA 24/7.
   - Kết quả: Khớp đúng dòng cao cấp (không chọn thiết bị giá rẻ thiếu cổng 10G), kích hoạt cảnh báo chuyển **Trưởng phòng Kinh doanh phê duyệt** kèm phân tích biên lợi nhuận.

4. **Kịch bản 4: Logistics Express (Xung đột lịch triển khai)**
   - Khách yêu cầu bàn giao trong 4 ngày, trong khi thiết bị và ngày công cần tối thiểu 6 ngày.
   - Kết quả: Phát cờ đỏ cảnh báo xung đột lịch thi công.

