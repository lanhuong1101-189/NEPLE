# BẢN ĐẶC TẢ TOÀN DIỆN (MASTER PROMPT) — DỰ ÁN WEBSITE NEPLE (NẾP LỄ)
> **Hướng dẫn sử dụng cho AI (Antigravity):** 
> Hãy đọc toàn bộ văn bản đặc tả dưới đây và tái tạo lại đầy đủ bộ mã nguồn hoàn chỉnh của dự án **NEPLE (Nếp Lễ)** trong thư mục `scratch/neple-store`.
> - **Bước ưu tiên số 1:** Trước khi tự viết lại từ đầu, hãy kiểm tra xem đường link online chính thức `https://neple-store-vn.vercel.app` (và `/admin.html`, `/app.js`, `/data.js`, `/styles.css`, `/vercel.json`) còn hoạt động không. Nếu còn hoạt động, hãy tải trực tiếp các file đó về `scratch/neple-store`.
> - **Bước dự phòng số 2 (Nếu mất kết nối mạng hoặc mất link):** Hãy khởi tạo lại toàn bộ các file (`index.html`, `admin.html`, `styles.css`, `data.js`, `app.js`, `vercel.json`, `sitemap.xml`, `robots.txt`) theo đúng 100% kiến trúc và dữ liệu chi tiết dưới đây.

---

## 1. ĐỊNH VỊ THƯƠNG HIỆU & HỆ THỐNG THIẾT KẾ (DESIGN SYSTEM)
- **Thương hiệu:** **NEPLE (Nếp Lễ)** — *Trọn Nếp Lễ Xưa, Tinh Gọn Cho Tổ Ấm Nay*.
- **Phong cách chủ đạo:** **Minimalist Cultural** (Kết hợp hài hòa giữa văn hóa truyền thống Việt Nam và ngôn ngữ thiết kế tối giản hiện đại), hướng tới thế hệ trẻ (GenZ, vợ chồng trẻ ở chung cư/đô thị), trang trọng, ấm cúng, không mang màu sắc mê tín nặng nề.
- **Bảng màu bắt buộc (6 màu chủ đạo + nền giấy dó):**
  1. `#0d2931` — **Deep Teal (Xanh Cổ Vịt Trầm)**: Màu chủ đạo (Header, Footer, Background nhấn, Text chính trên nền sáng).
  2. `#691727` — **Deep Burgundy (Đỏ Rượu Vang)**: Màu nhấn thương hiệu (Top bar, thẻ Combo đặc biệt, tiêu đề phụ, điểm nhấn lễ Tết).
  3. `#72826f` — **Sage Green (Xanh Rêu Mộc)**: Màu bổ trợ tự nhiên (Tags chuyên mục Blog, trạng thái hoàn thành, biểu tượng thảo mộc/nhang trầm).
  4. `#f0b45b` — **Warm Gold (Vàng Ấm Sung Túc)**: Màu điểm sáng (Badge "Tiết kiệm X%", "Best Seller", viền thẻ Combo Trọn Tết).
  5. `#ae9984` — **Warm Taupe (Be Nâu Giấy Dó)**: Màu viền thẻ, bề mặt trung tính, phối cùng nền kem giấy dó `#faf7f2` và `#f4efe6`.
  6. `#a94025` — **Terracotta (Đỏ Gạch Ấm)**: Nút hành động chính (Primary CTA: "Đặt Mua Ngay").
- **Hệ thống Font chữ (Typography):**
  - **Display / Heading:** `Barber Fill` (kèm fallback `'Fraunces', Georgia, serif` để hiển thị trọn vẹn dấu tiếng Việt).
  - **Body / UI / Blog SEO:** `Be Vietnam Pro` và `Bellota` (nhúng từ Google Fonts).

---

## 2. KIẾN TRÚC TÁCH BIỆT GIAO DIỆN KHÁCH HÀNG & CỔNG ADMIN BẢO MẬT 2 LỚP
Dự án bắt buộc tách riêng thành **2 cổng độc lập** nhưng dùng chung cơ sở dữ liệu (`NEPLE_STORAGE_KEYS` trong `data.js`) và đồng bộ thời gian thực qua sự kiện `window.addEventListener('storage', ...)`:

1. **Giao diện Khách hàng (`index.html` — `https://neple-store-vn.vercel.app`):**
   - **100% ở trạng thái Khách hàng (Customer Mode)**.
   - **Tuyệt đối KHÔNG hiển thị nút hay đường dẫn "Admin CMS"** trên Top Announcement Bar, Header, Mobile Menu hay Footer.
   - Chỉ hiển thị các khu vực dành cho khách: *Trang Chủ, Bộ Chọn 7 SKU, So Sánh 3 Cấp, Cẩm Nang Tết, Tra Cứu Đơn Hàng bằng SĐT, và Giỏ Lễ*.

2. **Cổng Quản Trị Nội Bộ (`admin.html` — `https://neple-store-vn.vercel.app/admin`):**
   - Định tuyến đường dẫn sạch `/admin` → `/admin.html` thông qua `vercel.json`.
   - **Lớp bảo mật 1:** Tách thành đường link độc lập hoàn toàn khỏi giao diện khách hàng.
   - **Lớp bảo mật 2 (Cổng Đăng Nhập Nhân Viên Công Ty & Phân Quyền RBAC):**
     - Bắt buộc nhập **Email công ty** + **Mật khẩu** mới mở khóa được bảng điều khiển.
     - Có 3 cấp phân quyền mặc định (kèm nút điền nhanh để test và tab Quản lý nhân sự để cấp mới/thu hồi quyền):
       1. **Super Admin (Toàn quyền 5 phân hệ: Đơn hàng, 7 SKU, Blog SEO, Cài đặt VietQR/MoMo/GA4, Phân quyền Nhân viên):**
          - Email: `admin@neple.vn` | Mật khẩu: `Neple@2026`
       2. **Nhân viên Vận hành (Chỉ truy cập phân hệ Đơn hàng & Xuất Excel/Google Sheets):**
          - Email: `vanhanh@neple.vn` | Mật khẩu: `Vanhanh@2026`
       3. **Biên tập viên SEO (Chỉ truy cập phân hệ Blog Cẩm nang SEO):**
          - Email: `content@neple.vn` | Mật khẩu: `Content@2026`
     - Có **Nhật ký hoạt động (Security Audit Log)** ghi nhận thời gian, tài khoản và thao tác chỉnh sửa.
     - Có nút **💾 Xuất Backup (.json)** và **📂 Nhập Backup (.json)** để sao lưu/khôi phục toàn bộ dữ liệu giữa các máy tính.

---

## 3. HỆ SINH THÁI DỮ LIỆU 7 SKU ĐỘC LẬP & LIÊN KẾT THÔNG MINH (`data.js`)
Tất cả đều là đồ lễ khô bảo quản 6 tháng, đóng gói chỉn chu theo 3 cấp độ hộp và giao 1 lần duy nhất trước Tết:

| STT | Mã ID (`id`) | Mã SKU | Tên Gói Lễ | Cấp Độ Hộp (`tier`) | Dịp Lễ (`rituals`) | Giá Bán | Giá Gốc | Tiết Kiệm | Vật Phẩm & Quà Tặng Đặc Trưng |
| :-- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `pack-tien-tao` | `NEPLE-SINGLE-01` | **Pack Tiễn Táo** | `single` (Hộp Đơn 1 Ngăn) | `['tien-tao']` (23 Chạp) | `249.000đ` | `249.000đ` | 0% | Nhang trầm sạch ít khói, Đôi nến bơ, Trà Sen Cổ Thụ, Kẹo lạc & Mứt gừng, Bộ sớ Ông Táo tối giản, Thiệp Văn khấn 23 Chạp. |
| 2 | `pack-giao-thua` | `NEPLE-SINGLE-02` | **Pack Giao Thừa** | `single` (Hộp Đơn 1 Ngăn) | `['giao-thua']` (Đêm 30) | `279.000đ` | `279.000đ` | 0% | Nhang trầm & 5 nụ trầm xông nhà, Đôi nến sen, Trà Ô Long hoa bưởi, Hũ Gạo Nếp & Muối Hồng bọc giấy dó giữ lộc, 2 Thiệp Văn khấn Giao Thừa (Ngoài trời & Trong nhà). |
| 3 | `pack-khai-xuan` | `NEPLE-SINGLE-03` | **Pack Khai Xuân** | `single` (Hộp Đơn 1 Ngăn) | `['khai-xuan']` (Mùng 1) | `259.000đ` | `259.000đ` | 0% | Nhang trầm thanh khiết, Đôi nến bơ, Trà Shan Tuyết Cổ Thụ, Hạt sen sấy & Táo đỏ, Bộ 05 Bao lì xì giấy dó NEPLE, Thiệp Văn khấn Mùng 1 & Khai Xuân. |
| 4 | `combo-ven-nep` | `NEPLE-COMBO-01` | **Combo Vẹn Nếp** | `double` (Hộp Đôi 2 Ngăn) | `['tien-tao', 'giao-thua']` | `459.000đ` | `528.000đ` | `69.000đ` (13%) | Hộp Đôi 2 ngăn độc lập (Tiễn Táo + Giao Thừa) + Cẩm nang Văn khấn 2 dịp + **Tặng Túi thảo mộc Mùi Già tắm tất niên**. |
| 5 | `combo-song-xuan` | `NEPLE-COMBO-02` | **Combo Song Xuân** | `double` (Hộp Đôi 2 Ngăn) | `['giao-thua', 'khai-xuan']` | `469.000đ` | `538.000đ` | `69.000đ` (13%) | Hộp Đôi 2 ngăn độc lập (Giao Thừa + Khai Xuân) + Cẩm nang Văn khấn 2 dịp + **Tặng 06 Bao lì xì giấy dó & Túi thơm thảo mộc**. |
| 6 | `combo-mo-tet` | `NEPLE-COMBO-03` | **Combo Mở Tết** | `double` (Hộp Đôi 2 Ngăn) | `['tien-tao', 'khai-xuan']` | `439.000đ` | `508.000đ` | `69.000đ` (14%) | Hộp Đôi 2 ngăn cho gia đình trẻ về quê đêm 30 (Cúng Ông Táo trước khi về quê + Cúng Khai Xuân khi lên lại thành phố) + **Tặng 06 Bao lì xì & Túi Mùi Già**. |
| 7 | `combo-tron-tet` | `NEPLE-COMBO-FULL` | **Combo Trọn Tết** | `triple` (Hộp Quà Lớn 3 Ngăn) | `['tien-tao', 'giao-thua', 'khai-xuan']` | `649.000đ` | `787.000đ` | `138.000đ` (18% - Best Seller) | Hộp Quà Lớn Đặc Biệt 3 ngăn đánh số (01 - 02 - 03) viền nhũ vàng + Ấn phẩm "Cẩm Nang Nếp Lễ Cổ Truyền Cho Người Trẻ" + 04 Thiệp Văn khấn + **Tặng Đế cắm nhang Gốm Mộc Bát Tràng + Túi Mùi Già + 10 Bao lì xì giấy dó + Freeship**. |

---

## 4. TÍNH NĂNG TRẢI NGHIỆM MUA HÀNG TRỌNG TÂM (UX & CONVERSION)

### 4.1. Bố Cục 2 Cột Tương Tác Trực Tiếp (Split-Screen Interactive 7-SKU & Combo Studio)
> **Yêu cầu quan trọng:** Tuyệt đối KHÔNG hiển thị hình ảnh lặp lại nhàm chán bên dưới từng dòng lựa chọn. Phải thiết kế thành bố cục 2 cột song song:
- **Cột Bên Trái (5/12 cột — Bộ điều khiển chọn gói):**
  - **Cách 1:** 3 nút tích chọn dịp lễ (`Tiễn Táo 23 Chạp`, `Giao Thừa Đêm 30`, `Khai Xuân Mùng 1`).
  - **Cách 2:** Danh sách 7 dòng chọn trực tiếp từng SKU (chia 3 nhóm: *Hộp Quà Lớn 3 Lễ*, *Hộp Đôi 2 Lễ*, *Hộp Đơn 1 Lễ*).
  - Hai bộ chọn này đồng bộ 2 chiều tức thì: bấm vào bất kỳ dòng SKU nào hoặc tích chọn dịp lễ nào sẽ kích hoạt vùng mô phỏng ở cột bên phải.
- **Cột Bên Phải Cố Định (7/12 cột — Sticky Live Pack Visualizer Stage):**
  - Là vùng mô phỏng trực quan sự thay đổi của hộp lễ ngay bên cạnh:
  - **Chế độ 1 — 🍱 Sơ Đồ Ngăn Hộp (`Ngăn 01: Tiễn Táo` • `Ngăn 02: Giao Thừa` • `Ngăn 03: Khai Xuân`):**
    - Ngăn nào thuộc SKU đang chọn sẽ sáng lên kèm danh sách vật phẩm của ngăn đó.
    - Ngăn nào chưa có sẽ hiện ô nét đứt **`+ Bấm thêm ngăn này`** để khách bấm nâng cấp trực tiếp ngay trên sơ đồ hộp.
  - **Chế độ 2 — 🖼️ Hình Bao Bì Hộp:** Minh họa quy cách đóng gói tương ứng (Hộp Đơn / Hộp Đôi 2 Ngăn / Hộp Đặc Biệt 3 Ngăn).
  - Hiển thị **Khay Ấn Phẩm & Quà Tặng Đi Kèm**, **Danh mục vật phẩm chi tiết**, **Gợi ý nâng cấp tiết kiệm (Smart Upsell Banner)** và thanh nút **Đặt Mua Ngay / Thêm Vào Giỏ Lễ**.

### 4.2. Bảng So Sánh Trực Quan 3 Cấp Độ Gói (`#so-sanh`)
- Hiển thị dưới dạng **Bảng đối chiếu 3 cột sạch sẽ** (*Hộp Đơn Mua Lẻ* vs. *Hộp Đôi Combo 2 Ngày* vs. *Hộp Đặc Biệt Trọn Tết 3 Ngày*) theo 6 tiêu chí: Quy cách vỏ hộp, Vật phẩm lễ khô, Ấn phẩm Văn khấn & Cẩm nang, Quà tặng & Ưu đãi, Gia đình phù hợp, Mức giá & Nút nạp cấu hình lên vùng mô phỏng.

### 4.3. Chuyên Mục Blog "Cẩm Nang Nếp Lễ" Chuẩn SEO & Thanh Tìm Kiếm Thông Minh (`#cam-nang`)
- **Smart Search Bar:** Hỗ trợ tìm kiếm tiếng Việt cả có dấu và không dấu (VD: `"cung ong tao"`, `"văn khấn"`, `"chung cư"`, `"mùi già"`), gợi ý tức thì cả **Gói lễ/Combo** lẫn **Bài viết Cẩm nang**.
- **4 Chuyên mục Blog:** *Ý Nghĩa Lễ Tết*, *Hướng Dẫn Bày Lễ Tối Giản*, *Văn Khấn Hiện Đại*, *Chuyện Nếp Nhà*.
- **Trình đọc bài viết:** Tự động sinh **Mục lục (Table of Contents)**, **Khung đọc Văn Khấn Hiện Đại** (có nút phóng to chữ khi đứng cúng & nút Sao chép văn khấn), **Thẻ gắn sản phẩm khéo léo trong bài (In-article Product Card)**, và hiển thị cấu trúc JSON-LD Schema.

### 4.4. Thanh Toán 1 Bước (VietQR + MoMo + COD) & Tra Cứu Đơn Hàng (`#tra-cuu`)
- **Checkout 1 bước (Không bắt đăng ký tài khoản):** Nhập Họ tên, Số điện thoại, Địa chỉ, Ghi chú.
- **3 Phương thức thanh toán:**
  1. **VietQR Ngân hàng tự động:** Tự động sinh mã QR Napas theo đúng số tiền giỏ hàng và nội dung chuyển khoản `NEPLE <SĐT>`.
  2. **Ví MoMo:** Hiển thị mã QR MoMo kèm SĐT nhận và nội dung `NEPLE <SĐT>`.
  3. **Thanh toán khi nhận hàng (COD):** Xác nhận đơn ngay lập tức.
- **Tra cứu đơn hàng bằng Số điện thoại (`#tra-cuu`):** Hiển thị thanh tiến trình 4 bước trực quan: *Đã tiếp nhận → Đang đóng gói hộp lễ → Đang giao hàng → Hoàn thành*.
