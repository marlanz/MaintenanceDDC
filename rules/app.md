# MAINTENANCE-DDC WEB

## 1. Authentication

### First Login

Nếu người dùng đăng nhập lần đầu và chưa có thông tin trên hệ thống, hệ thống yêu cầu khai báo:

- Họ và tên
- Mã nhân viên
- Vai trò
- Xưởng làm việc hiện tại
- Tổ làm việc hiện tại

Sau khi hoàn thành sẽ tạo hồ sơ người dùng (User Profile).

> **Lưu ý**
>
> - Chỉ các role `WORKER` và `TECHNICIAN` được phép tự chọn khi đăng nhập lần đầu.
> - Các role `TEAM_LEADER`, `ASSET_MANAGER`, `MAINTENANCE_MANAGER` phải được `ADMIN` cấp quyền.

---

# 2. Roles & Responsibilities

## WORKER

### Chức năng

- Cập nhật thông tin cá nhân (Xưởng/Tổ làm việc)
- Tạo yêu cầu sửa chữa
- Xem danh sách ticket do mình tạo
- Xem chi tiết ticket

### Tạo yêu cầu sửa chữa

Thông tin yêu cầu gồm:

#### Người yêu cầu

- Họ tên *(tự động lấy từ User Profile)*
- Mã nhân viên *(tự động lấy từ User Profile)*

#### Máy cần sửa

- Tìm kiếm theo:
  - Mã máy
  - Tên máy
- Chọn máy từ danh sách kết quả

#### Thông tin sự cố

- Xưởng hiện tại của máy
- Vị trí chính xác của máy *(tùy chọn)*
- Mô tả hỏng hóc
- Tối đa **02 hình ảnh**
  - PNG
  - JPG
  - JPEG

---

## TECHNICIAN

### Chức năng

- Xem danh sách ticket được phân công
- Nhận ticket để bắt đầu sửa chữa
- Cập nhật tiến độ sửa chữa
- Cập nhật nội dung sửa chữa
- Xem lịch bảo trì được giao
- Xem lịch sử bảo trì của máy

### Trạng thái ticket

```
PENDING
    ↓
IN_MAINTENANCE
    ↓
INSPECTION
    ↓
CLOSED
```

Sau khi hoàn thành sửa chữa:

- Cập nhật nội dung sửa chữa
- Chuyển trạng thái sang `INSPECTION`

---

## TEAM_LEADER

> Cần được ADMIN cấp quyền.

### Chức năng

- Tiếp nhận ticket của tổ phụ trách
- Tạo ticket thay cho Worker (nếu cần)
- Đánh giá mức độ ưu tiên
  - High
  - Normal
- Phân công một hoặc nhiều Technician
- Điều phối lại Technician
- Nghiệm thu sau sửa chữa
- Đóng ticket
- Tạo lịch bảo trì định kỳ
- Xem Dashboard của tổ

---

## ASSET_MANAGER

> Cần được ADMIN cấp quyền.

### Chức năng

#### Quản lý máy móc thiết bị

CRUD

- Máy
- Thông tin máy
- Chu kỳ bảo trì

#### Quản lý công cụ dụng cụ (CCDC)

CRUD

- Công cụ
- Vật tư
- Thiết bị

#### Quản lý lịch bảo trì

- Tạo lịch bảo trì
- Chỉnh sửa lịch
- Xem toàn bộ lịch

---

## MAINTENANCE_MANAGER

> Cần được ADMIN cấp quyền.

### Chức năng

- Tiếp nhận ticket
- Tạo ticket
- Đánh giá Priority
- Phân công nhiều Technician
- Điều phối Technician
- Nghiệm thu
- Đóng ticket
- CRUD Máy móc thiết bị
- Tạo lịch bảo trì
- Xem Dashboard toàn nhà máy

---

## ADMIN

### Chức năng

- Quản lý người dùng
- Quản lý Role
- Phân quyền
- Phê duyệt quyền:
  - TEAM_LEADER
  - ASSET_MANAGER
  - MAINTENANCE_MANAGER
- Bao gồm toàn bộ quyền của các role khác

---

# 3. Business Flow

## 3.1 Repair Ticket Flow

### Người được phép tạo Ticket

- WORKER
- TEAM_LEADER
- ASSET_MANAGER
- MAINTENANCE_MANAGER

---

### Người được phép tiếp nhận Ticket

- TEAM_LEADER
- ASSET_MANAGER
- MAINTENANCE_MANAGER

---

### Flow

```
Worker

↓

Create Repair Ticket

↓

Team Leader / Maintenance Manager

↓

Review Ticket

↓

Set Priority
(High | Normal)

↓

Assign Technician(s)

↓

Technician nhận Ticket

↓

IN_MAINTENANCE

↓

Technician cập nhật nội dung sửa chữa

↓

INSPECTION

↓

Team Leader / Maintenance Manager nghiệm thu

↓

Nếu đạt

↓

CLOSED

Nếu chưa đạt

↓

Quay lại IN_MAINTENANCE
```

---

### Business Rules

- Một ticket có thể phân công nhiều Technician.
- Ticket ID sử dụng MongoDB ObjectId.
- Chỉ có 2 mức ưu tiên:
  - High
  - Normal
- Sau mỗi lần cập nhật trạng thái sẽ lưu Audit Log.
- Có thể gửi thông báo Telegram khi:
  - Có ticket mới
  - Được phân công sửa chữa
  - Chuyển sang Inspection
  - Ticket Closed

---

# 3.2 Preventive Maintenance Flow

### Người được tạo lịch

- TEAM_LEADER
- ASSET_MANAGER
- MAINTENANCE_MANAGER

---

### Chu kỳ bảo trì

Hệ thống hỗ trợ:

- Theo tuần
- Theo tháng
- Theo ngày cố định trong tháng

---

### Flow

```
Create Maintenance Schedule

↓

Chọn Máy

↓

Thiết lập Chu kỳ

↓

Lưu lịch

↓

Hiển thị lịch

↓

Team Leader / Maintenance Manager

↓

Assign Technician(s)

↓

Đến ngày bảo trì

↓

System tự động sinh Maintenance Ticket

↓

Technician thực hiện bảo trì

↓

INSPECTION

↓

CLOSED
```

---

### Business Rules

- Hệ thống tự động sinh Maintenance Ticket khi đến hạn.
- Một lịch bảo trì có thể giao nhiều Technician.
- Technician chỉ nhìn thấy lịch được giao.
- Toàn bộ lịch sử bảo trì được lưu theo từng máy.

---

# 4. Machine Management

Quản lý:

- CRUD Máy móc thiết bị
- Tìm kiếm máy
- Xem lịch sử sửa chữa
- Xem lịch sử bảo trì
- Quản lý chu kỳ bảo trì

> Trạng thái máy sẽ được xác định ở giai đoạn thiết kế chi tiết.

---

# 5. Tool (CCDC) Management

Quản lý Công cụ dụng cụ (CCDC)

Bao gồm:

- CRUD Công cụ
- CRUD Vật tư
- Theo dõi sử dụng trong quá trình sửa chữa *(dự kiến mở rộng)*

---

# 6. Dashboard

Dashboard hỗ trợ thống kê:

## Ticket

- Tổng số ticket
- Ticket đang xử lý
- Ticket chờ nghiệm thu
- Ticket hoàn thành
- Ticket quá SLA

## Machine

- Máy sửa nhiều nhất
- Máy sắp đến hạn bảo trì
- Máy đang bảo trì

## Technician KPI

- Ticket đã xử lý
- Ticket đang xử lý
- Thời gian sửa trung bình
- Tỷ lệ hoàn thành đúng SLA

---

# 7. Audit Log

Hệ thống lưu lịch sử thao tác:

- Người thực hiện
- Thời gian
- Hành động
- Trạng thái trước
- Trạng thái sau

---

# 8. General Business Rules

- Ticket ID sử dụng MongoDB ObjectId.
- Chỉ có 2 mức Priority:
  - High
  - Normal
- Mỗi ticket tối đa upload 02 ảnh.
- Định dạng ảnh:
  - PNG
  - JPG
  - JPEG
- Worker chỉ xem ticket của mình.
- Technician chỉ xem ticket được giao.
- Team Leader quản lý ticket thuộc tổ mình.
- Chỉ Worker, Technician và Team Leader được phép thay đổi Xưởng/Tổ làm việc.
- Team Leader và Maintenance Manager có quyền nghiệm thu ticket.
- Hệ thống lưu toàn bộ lịch sử sửa chữa và bảo trì của từng máy.
- Hệ thống hỗ trợ gửi thông báo Telegram cho các sự kiện quan trọng.