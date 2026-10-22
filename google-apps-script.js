// ==============================================================================
// NEPLE (Nếp Lễ) — GOOGLE APPS SCRIPT ĐỒNG BỘ 2 CHIỀU GOOGLE SHEETS
// ==============================================================================
// HƯỚNG DẪN CÀI ĐẶT 1 LẦN DUY NHẤT (MẤT 2 PHÚT):
// 1. Mở một trang tính Google Sheets mới (Đặt tên: "NEPLE - Quản Lý Đơn Hàng 2026")
// 2. Đặt tiêu đề cho Dòng 1 (hoặc để trống, script sẽ tự động tạo tiêu đề chuẩn):
//    A: Mã Đơn | B: Ngày Đặt | C: Khách Hàng | D: Số Điện Thoại | E: Địa Chỉ |
//    F: Hộp Lễ Đặt Mua | G: Tiền Hàng | H: Phí Vận Chuyển | I: Tổng Thanh Toán |
//    J: Hình Thức TT | K: Trạng Thái | L: Ghi Chú
// 3. Vào menu: Tiện ích mở rộng (Extensions) -> Apps Script
// 4. Xóa hết code cũ trong file Code.gs, DÁN TOÀN BỘ CODE BÊN DƯỚI VÀO -> Bấm Lưu (Ctrl+S)
// 5. Bấm nút: Triển khai (Deploy) -> Tùy chọn triển khai mới (New deployment)
//    - Loại: Ứng dụng web (Web app)
//    - Thực thi dưới dạng (Execute as): Tôi (My account)
//    - Ai có quyền truy cập (Who has access): Bất kỳ ai (Anyone) -> RẤT QUAN TRỌNG
// 6. Bấm Triển khai (Deploy) -> Cấp quyền truy cập nếu Google hỏi
// 7. Copy link "URL của ứng dụng web" (kết thúc bằng /exec) và dán vào ô cài đặt trên Admin NEPLE!
// ==============================================================================

function getOrInitSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Đơn Hàng') || ss.getActiveSheet();
  
  // Tự động tạo dòng tiêu đề nếu trang tính đang trống
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Mã Đơn',
      'Ngày Đặt',
      'Khách Hàng',
      'Số Điện Thoại',
      'Địa Chỉ Nhận Hàng',
      'Hộp Lễ Đặt Mua',
      'Tiền Hàng (VNĐ)',
      'Phí Vận Chuyển',
      'Tổng Thanh Toán (VNĐ)',
      'Hình Thức Thanh Toán',
      'Trạng Thái Tiến Trình',
      'Ghi Chú Khách Hàng'
    ]);
    sheet.getRange(1, 1, 1, 12).setBackground('#0d2931').setFontColor('#f0b45b').setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// 1. GET: Lấy danh sách toàn bộ đơn hàng từ Google Sheets về Web Admin
function doGet(e) {
  try {
    var sheet = getOrInitSheet();
    var data = sheet.getDataRange().getValues();
    var orders = [];

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var orderId = String(row[0] || '').trim();
      if (!orderId) continue;

      orders.push({
        id: orderId,
        createdAt: String(row[1] || ''),
        customerName: String(row[2] || ''),
        phone: String(row[3] || '').replace(/^'/, ''),
        address: String(row[4] || ''),
        itemsSummary: String(row[5] || ''),
        subtotal: Number(row[6] || 0),
        shippingLabel: String(row[7] || ''),
        total: Number(row[8] || 0),
        paymentLabel: String(row[9] || ''),
        status: String(row[10] || 'Đã tiếp nhận'),
        note: String(row[11] || '')
      });
    }

    // Đảo ngược để đơn mới nhất lên đầu
    orders.reverse();

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      totalOrders: orders.length,
      orders: orders
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 2. POST: Khách đặt đơn mới HOẶC Admin cập nhật trạng thái đơn
function doPost(e) {
  try {
    var sheet = getOrInitSheet();
    var payload = {};
    if (e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    }

    var action = payload.action || 'create_order';

    // A. Khách tạo đơn hàng mới trên website
    if (action === 'create_order' && payload.order) {
      var o = payload.order;
      var itemsText = (o.items || []).map(function(it) {
        return it.name + ' (x' + it.qty + ')';
      }).join('; ');

      sheet.appendRow([
        o.id,
        o.createdAt || new Date().toLocaleString('vi-VN'),
        o.customerName,
        "'" + (o.phone || ''),
        o.address,
        itemsText,
        Number(o.subtotal || o.total || 0),
        o.shippingLabel || (o.shippingFee ? String(o.shippingFee) : 'Miễn phí'),
        Number(o.total || 0),
        o.paymentLabel || o.paymentMethod,
        o.status || 'Đã tiếp nhận',
        o.note || ''
      ]);

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Đã lưu đơn ' + o.id + ' vào Google Sheets!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // B. Nhân sự Admin cập nhật trạng thái đơn hàng (Đang đóng gói, Đang giao, Hoàn thành)
    if (action === 'update_status' && payload.orderId && payload.status) {
      var data = sheet.getDataRange().getValues();
      var found = false;

      for (var i = 1; i < data.length; i++) {
        if (String(data[i][0]).trim() === String(payload.orderId).trim()) {
          sheet.getRange(i + 1, 11).setValue(payload.status); // Cột 11: Trạng Thái
          found = true;
          break;
        }
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: found ? 'success' : 'not_found',
        message: found ? 'Đã cập nhật trạng thái thành công' : 'Không tìm thấy mã đơn'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: 'ignored',
      message: 'Không có hành động phù hợp'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
