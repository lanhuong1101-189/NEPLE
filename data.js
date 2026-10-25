// ==========================================================================
// NEPLE (Nếp Lễ) — Master Data Architecture (7 SKUs, SEO Blogs, Orders, Config)
// ==========================================================================

const NEPLE_STORAGE_KEYS = {
  PRODUCTS: 'neple_products_v5',
  BLOGS: 'neple_blogs_v1',
  ORDERS: 'neple_orders_v1',
  SETTINGS: 'neple_settings_v1',
  CART: 'neple_cart_v1'
};

// Dynamic Minimalist Cultural Packaging SVG Generator (3 Box Architectures)
function generatePackagingSVG(type, title, subtitle, accentColor, badgeText, ritualsList) {
  const safeRituals = ritualsList || [];
  if (type === 'single') {
    // HỘP ĐƠN MUA LẺ (1 Dịp Lễ - Giấy Dó & Đai Quấn Mộc)
    return `data:image/svg+xml;utf8,` + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 460" width="100%" height="100%">
        <defs>
          <linearGradient id="bgSingle" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#f6f1e7"/>
            <stop offset="100%" stop-color="#e5dac9"/>
          </linearGradient>
          <linearGradient id="boxBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#efe6d5"/>
            <stop offset="100%" stop-color="#dfd1bc"/>
          </linearGradient>
          <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#0d2931" flood-opacity="0.18"/>
          </filter>
        </defs>
        <rect width="600" height="460" rx="24" fill="url(#bgSingle)"/>
        <!-- Subtle traditional circle motif -->
        <circle cx="300" cy="225" r="175" fill="none" stroke="#ae9984" stroke-width="1" stroke-dasharray="5 5" opacity="0.5"/>
        <circle cx="300" cy="225" r="145" fill="#faf7f2" opacity="0.55"/>

        <!-- Single Craft Box (Hộp Đơn Giấy Dó) -->
        <g filter="url(#shadow)">
          <!-- Box Lid & Base -->
          <rect x="165" y="100" width="270" height="250" rx="14" fill="url(#boxBody)" stroke="#ae9984" stroke-width="2"/>
          <rect x="158" y="92" width="284" height="36" rx="8" fill="#e6d8c3" stroke="#ae9984" stroke-width="2"/>
          
          <!-- Belly Band (Đai giấy mỹ thuật) -->
          <rect x="225" y="90" width="150" height="260" fill="${accentColor}"/>
          <rect x="233" y="90" width="134" height="260" fill="none" stroke="#f0b45b" stroke-width="1" opacity="0.7"/>

          <!-- Stamp Seal -->
          <circle cx="300" cy="148" r="24" fill="#faf7f2" stroke="#f0b45b" stroke-width="2"/>
          <text x="300" y="145" text-anchor="middle" font-family="Georgia, serif" font-size="10" font-weight="bold" fill="${accentColor}">NẾP LỄ</text>
          <text x="300" y="158" text-anchor="middle" font-family="sans-serif" font-size="7" fill="#0d2931">HỘP ĐƠN</text>

          <!-- Package Title -->
          <text x="300" y="205" text-anchor="middle" font-family="Georgia, serif" font-size="19" font-weight="bold" fill="#faf7f2" letter-spacing="1">${title}</text>
          <text x="300" y="226" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#f0b45b">${subtitle}</text>

          <!-- Minimalist Lotus/Cloud Line -->
          <line x1="255" y1="242" x2="345" y2="242" stroke="#f0b45b" stroke-width="1" opacity="0.6"/>
          <text x="300" y="264" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#faf7f2" opacity="0.9">Đồ lễ khô • Bảo quản lâu</text>
          <text x="300" y="282" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#faf7f2" opacity="0.9">Kèm Văn Khấn Hiện Đại</text>
        </g>

        <!-- Dried Herbal & Incense Side Props -->
        <rect x="455" y="235" width="70" height="110" rx="8" fill="#0d2931" filter="url(#shadow)"/>
        <text x="490" y="275" text-anchor="middle" font-family="Georgia, serif" font-size="9" fill="#f0b45b">VĂN KHẤN</text>
        <text x="490" y="292" text-anchor="middle" font-family="sans-serif" font-size="8" fill="#faf7f2">&amp; CẨM NANG</text>
        <circle cx="490" cy="316" r="10" fill="none" stroke="#f0b45b" stroke-width="1"/>

        <!-- Top Badge -->
        <rect x="24" y="24" width="165" height="32" rx="16" fill="#0d2931"/>
        <text x="106" y="44" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#f0b45b">${badgeText}</text>
      </svg>
    `);
  }

  if (type === 'double') {
    // HỘP ĐÔI COMBO 2 NGÀY (2 Khay Lễ Độc Lập + Đai Lụa Đỏ Rượu Vang)
    const r1 = safeRituals[0] || 'Lễ 1';
    const r2 = safeRituals[1] || 'Lễ 2';
    return `data:image/svg+xml;utf8,` + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 460" width="100%" height="100%">
        <defs>
          <linearGradient id="bgDouble" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#f3ece1"/>
            <stop offset="100%" stop-color="#dfd2be"/>
          </linearGradient>
          <filter id="shadow2" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#0d2931" flood-opacity="0.24"/>
          </filter>
        </defs>
        <rect width="600" height="460" rx="24" fill="url(#bgDouble)"/>
        <circle cx="300" cy="230" r="185" fill="none" stroke="#691727" stroke-width="1" stroke-dasharray="6 4" opacity="0.35"/>

        <!-- Double Box Outer Case (Hộp Đôi 2 Ngăn) -->
        <g filter="url(#shadow2)">
          <!-- Outer Rigid Box -->
          <rect x="105" y="88" width="390" height="270" rx="16" fill="#0d2931" stroke="#f0b45b" stroke-width="2.5"/>
          
          <!-- Inner Left Tray (Ngăn Lễ 1) -->
          <rect x="122" y="106" width="172" height="234" rx="10" fill="#faf7f2" stroke="#ae9984" stroke-width="1.5"/>
          <rect x="136" y="122" width="144" height="28" rx="6" fill="#691727"/>
          <text x="208" y="140" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#f0b45b">NGĂN 01 • ${r1.toUpperCase()}</text>
          <text x="208" y="176" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#0d2931">• Nhang trầm &amp; Nến bơ</text>
          <text x="208" y="196" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#0d2931">• Trà thượng hạng</text>
          <text x="208" y="216" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#0d2931">• Lễ vật khô truyền thống</text>
          <text x="208" y="236" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#72826f" font-weight="bold">• Văn khấn riêng theo lễ</text>

          <!-- Inner Right Tray (Ngăn Lễ 2) -->
          <rect x="306" y="106" width="172" height="234" rx="10" fill="#faf7f2" stroke="#ae9984" stroke-width="1.5"/>
          <rect x="320" y="122" width="144" height="28" rx="6" fill="#0d2931"/>
          <text x="392" y="140" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#f0b45b">NGĂN 02 • ${r2.toUpperCase()}</text>
          <text x="392" y="176" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#0d2931">• Nhang trầm &amp; Nến bơ</text>
          <text x="392" y="196" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#0d2931">• Trà cổ thụ &amp; Hạt lành</text>
          <text x="392" y="216" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#0d2931">• Lễ vật khô chuẩn nếp</text>
          <text x="392" y="236" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#72826f" font-weight="bold">• Tặng túi thơm Mùi Già</text>

          <!-- Center Gold Band Overlay -->
          <rect x="98" y="255" width="404" height="72" rx="8" fill="#691727" stroke="#f0b45b" stroke-width="2"/>
          <text x="300" y="285" text-anchor="middle" font-family="Georgia, serif" font-size="21" font-weight="bold" fill="#faf7f2" letter-spacing="1.5">${title}</text>
          <text x="300" y="308" text-anchor="middle" font-family="sans-serif" font-size="11.5" fill="#f0b45b">${subtitle}</text>
        </g>

        <!-- Top Badge -->
        <rect x="24" y="24" width="210" height="34" rx="17" fill="#691727" stroke="#f0b45b" stroke-width="1.5"/>
        <text x="129" y="45" text-anchor="middle" font-family="sans-serif" font-size="11.5" font-weight="bold" fill="#f0b45b">${badgeText}</text>
      </svg>
    `);
  }

  // HỘP QUÀ LỚN ĐẶC BIỆT TRỌN TẾT (3 Ngăn Lễ + Quà Tặng Gốm Mộc & Mùi Già)
  return `data:image/svg+xml;utf8,` + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 460" width="100%" height="100%">
      <defs>
        <linearGradient id="bgTriple" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0d2931"/>
          <stop offset="55%" stop-color="#143842"/>
          <stop offset="100%" stop-color="#691727"/>
        </linearGradient>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#e39d3b"/>
          <stop offset="50%" stop-color="#f7ce86"/>
          <stop offset="100%" stop-color="#d8922f"/>
        </linearGradient>
        <filter id="shadow3" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="20" stdDeviation="18" flood-color="#000000" flood-opacity="0.4"/>
        </filter>
      </defs>
      <rect width="600" height="460" rx="24" fill="url(#bgTriple)"/>
      
      <!-- Decorative Sunburst / Lotus Halo -->
      <circle cx="300" cy="230" r="195" fill="none" stroke="#f0b45b" stroke-width="1" stroke-dasharray="4 6" opacity="0.45"/>
      <circle cx="300" cy="230" r="165" fill="none" stroke="#f0b45b" stroke-width="0.75" opacity="0.25"/>

      <!-- Grand Luxury Lacquer-Style Gift Box (Hộp Đặc Biệt 3 Ngăn) -->
      <g filter="url(#shadow3)">
        <rect x="68" y="80" width="464" height="295" rx="18" fill="#faf7f2" stroke="url(#goldGrad)" stroke-width="4"/>
        <rect x="78" y="90" width="444" height="275" rx="12" fill="#f4efe6" stroke="#ae9984" stroke-width="1"/>

        <!-- 3 Compartments for 23 Chạp, 30 Tết, Mùng 1 -->
        <!-- Tray 1 -->
        <rect x="92" y="104" width="132" height="162" rx="8" fill="#ffffff" stroke="#ae9984" stroke-width="1.5"/>
        <rect x="102" y="114" width="112" height="24" rx="5" fill="#0d2931"/>
        <text x="158" y="130" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="bold" fill="#f0b45b">01 • TIỄN TÁO</text>
        <text x="158" y="154" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#0d2931">23 Tháng Chạp</text>
        <text x="158" y="176" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#72826f">Trà Sen • Nhang Trầm</text>
        <text x="158" y="194" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#72826f">Mứt Gừng • Lễ Giấy</text>
        <text x="158" y="212" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#691727" font-weight="bold">Văn Khấn Ông Táo</text>

        <!-- Tray 2 -->
        <rect x="234" y="104" width="132" height="162" rx="8" fill="#ffffff" stroke="#f0b45b" stroke-width="2"/>
        <rect x="244" y="114" width="112" height="24" rx="5" fill="#691727"/>
        <text x="300" y="130" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="bold" fill="#f0b45b">02 • GIAO THỪA</text>
        <text x="300" y="154" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#0d2931">Đêm 30 Tết</text>
        <text x="300" y="176" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#72826f">Trà Hoa Bưởi • Nến Sen</text>
        <text x="300" y="194" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#72826f">Gạo Nếp • Muối Hồng</text>
        <text x="300" y="212" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#691727" font-weight="bold">Văn Khấn Giao Thừa</text>

        <!-- Tray 3 -->
        <rect x="376" y="104" width="132" height="162" rx="8" fill="#ffffff" stroke="#ae9984" stroke-width="1.5"/>
        <rect x="386" y="114" width="112" height="24" rx="5" fill="#0d2931"/>
        <text x="442" y="130" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="bold" fill="#f0b45b">03 • KHAI XUÂN</text>
        <text x="442" y="154" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#0d2931">Mùng 1 Đầu Năm</text>
        <text x="442" y="176" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#72826f">Trà Shan Tuyết • Táo Đỏ</text>
        <text x="442" y="194" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#72826f">Hạt Sen • 10 Lì Xì</text>
        <text x="442" y="212" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#691727" font-weight="bold">Văn Khấn Tân Niên</text>

        <!-- Royal Band Across Bottom -->
        <rect x="64" y="276" width="472" height="86" rx="12" fill="#691727" stroke="url(#goldGrad)" stroke-width="3"/>
        <text x="300" y="308" text-anchor="middle" font-family="Georgia, serif" font-size="23" font-weight="bold" fill="#f0b45b" letter-spacing="2">${title}</text>
        <text x="300" y="330" text-anchor="middle" font-family="sans-serif" font-size="11.5" fill="#faf7f2">${subtitle}</text>
        <text x="300" y="349" text-anchor="middle" font-family="sans-serif" font-size="10.5" fill="#f0b45b" font-weight="bold">TẶNG KÈM: Lư Cắm Nhang Gốm Mộc + Túi Mùi Già + 10 Bao Lì Xì Giấy Dó</text>
      </g>

      <!-- Top Gold Badge -->
      <rect x="24" y="22" width="245" height="36" rx="18" fill="url(#goldGrad)"/>
      <text x="146" y="45" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0d2931">★ ${badgeText}</text>
    </svg>
  `);
}

// 7 SKUs (3 Single Packs + 3 Two-Day Combos + 1 Full Three-Day Combo)
const DEFAULT_PRODUCTS = [
  {
    id: 'pack-tien-tao',
    sku: 'NEPLE-SINGLE-01',
    name: 'Tiễn Táo',
    subtitle: 'Lễ Cúng Ông Công Ông Táo (23 Tháng Chạp)',
    tier: 'single',
    tierLabel: 'Hộp Đơn Mua Lẻ (1 Dịp)',
    rituals: ['tien-tao'],
    ritualNames: ['Tiễn Táo (23 Chạp)'],
    price: 179000,
    originalPrice: 179000,
    discountPercent: 0,
    badge: 'HỘP ĐƠN • 23 CHẠP',
    bestSeller: false,
    packagingSpec: 'Hộp Đơn giấy mỹ thuật bồi cứng tông Kem Giấy Dó, đai quấn Xanh Cổ Vịt, chống ẩm 100%.',
    suitableFor: 'Bạn trẻ ở trọ, căn hộ studio hoặc gia đình chỉ cúng 23 tháng Chạp tại thành phố trước khi về quê.',
    shortDesc: 'Trọn bộ lễ vật khô tinh gọn, thanh sạch để tiễn Ông Công Ông Táo về trời ngày 23 tháng Chạp mà không cần tất bật chạy chợ sớm.',
    image: generatePackagingSVG('single', 'TIỄN TÁO', 'Lễ Ông Công Ông Táo • 23 Tháng Chạp', '#0d2931', 'HỘP ĐƠN • 23 CHẠP', ['Tiễn Táo']),
    items: [
      '01 Hộp nhang trầm hương sạch ít khói (20 nén, an toàn cho chung cư)',
      '01 Đôi nến bơ thực vật nguyên chất cháy êm (không khói đen)',
      '01 Gói Trà Sen Cổ Thụ thượng hạng (35g - pha được 3 ấm cúng)',
      '01 Hộp Kẹo Lạc & Mứt Gừng cổ truyền ngọt lành (120g)',
      '01 Bộ giấy sớ & lễ giấy Ông Công Ông Táo thiết kế tối giản, văn minh',
      '01 Ấn phẩm Cẩm nang bày mâm lễ 5 phút & Thiệp Văn khấn Ông Táo chuẩn'
    ],
    gifts: [
      'Thiệp hướng dẫn giờ đẹp cúng Ông Táo & sơ đồ bày mâm cúng chung cư'
    ],
    upsellHint: {
      addRitual: 'giao-thua',
      targetComboId: 'combo-ven-nep',
      message: 'Thêm lễ Giao Thừa để nâng cấp lên Hộp Combo Vạn Nếp [1+2] và tiết kiệm ngay 109.000đ!'
    }
  },
  {
    id: 'pack-giao-thua',
    sku: 'NEPLE-SINGLE-02',
    name: 'Giao Thừa',
    subtitle: 'Lễ Cúng Đêm 30 Tết (Trừ Tịch Đón Năm Mới)',
    tier: 'single',
    tierLabel: 'Hộp Đơn Mua Lẻ (1 Dịp)',
    rituals: ['giao-thua'],
    ritualNames: ['Giao Thừa (Đêm 30)'],
    price: 139000,
    originalPrice: 139000,
    discountPercent: 0,
    badge: 'HỘP ĐƠN • ĐÊM 30',
    bestSeller: false,
    packagingSpec: 'Hộp Đơn giấy mỹ thuật bồi cứng tông Kem Giấy Dó, đai quấn Đỏ Rượu Vang (#691727).',
    suitableFor: 'Gia đình trẻ đón khoảnh khắc Giao Thừa tại nhà riêng hoặc căn hộ chung cư.',
    shortDesc: 'Gói gọn nghi thức tiễn năm cũ, đón tân niên lúc chuyển giao đất trời với hương trầm ấm và hũ gạo muối giữ lộc đầu năm.',
    image: generatePackagingSVG('single', 'GIAO THỪA', 'Lễ Trừ Tịch Đón Lộc • Đêm 30 Tết', '#691727', 'HỘP ĐƠN • ĐÊM 30', ['Giao Thừa']),
    items: [
      '01 Hộp nhang trầm hương & 05 nụ trầm xông nhà đêm Trừ Tịch',
      '01 Đôi nến bơ hoa sen ấm áp đón giao thời',
      '01 Gói Trà Ô Long ướp hoa bưởi thanh tao (40g)',
      '01 Bộ Hũ Gạo Nếp Cái Hoa Vàng & Muối Hồng bọc giấy dó (nghi thức giữ lộc)',
      '01 Bộ lễ giấy Giao Thừa tối giản, trang nhã',
      '02 Thiệp Văn khấn Giao Thừa (Bản cúng ngoài trời & Bản cúng gia tiên trong nhà)'
    ],
    gifts: [
      'Túi muối gạo lộc bọc giấy dó thắt dây gai mộc'
    ],
    upsellHint: {
      addRitual: 'tien-tao',
      targetComboId: 'combo-ven-nep',
      message: 'Thêm lễ Tiễn Táo để nâng cấp lên Hộp Combo Vạn Nếp [1+2] và tiết kiệm ngay 109.000đ!'
    }
  },
  {
    id: 'pack-khai-xuan',
    sku: 'NEPLE-SINGLE-03',
    name: 'Khai Xuân',
    subtitle: 'Lễ Cúng Mùng 1 Tết & Khai Xuân Đầu Năm',
    tier: 'single',
    tierLabel: 'Hộp Đơn Mua Lẻ (1 Dịp)',
    rituals: ['khai-xuan'],
    ritualNames: ['Khai Xuân (Mùng 1)'],
    price: 129000,
    originalPrice: 129000,
    discountPercent: 0,
    badge: 'HỘP ĐƠN • MÙNG 1',
    bestSeller: false,
    packagingSpec: 'Hộp Đơn giấy mỹ thuật bồi cứng tông Kem Giấy Dó, đai quấn Xanh Rêu Mộc (#72826f).',
    suitableFor: 'Gia đình trẻ cúng sáng Mùng 1 hoặc cúng mở hàng, khai bút đầu xuân.',
    shortDesc: 'Khởi đầu năm mới thanh lành với trà Shan Tuyết cổ thụ, hạt sen, táo đỏ và bộ bao lì xì giấy dó mang đậm hơi thở văn hóa Việt.',
    image: generatePackagingSVG('single', 'KHAI XUÂN', 'Lễ Tân Niên Đắc Lộc • Sáng Mùng 1', '#72826f', 'HỘP ĐƠN • MÙNG 1', ['Khai Xuân']),
    items: [
      '01 Hộp nhang trầm hương thanh khiết khởi đầu năm mới',
      '01 Đôi nến bơ thực vật sắc vàng ấm sung túc',
      '01 Gói Trà Shan Tuyết Cổ Thụ Hà Giang (40g)',
      '01 Hộp Hạt Sen Sấy Giòn & Táo Đỏ Tân Cương (biểu trưng sum vầy, an khang)',
      '01 Bộ 05 Bao lì xì giấy dó NEPLE thiết kế tối giản',
      '01 Thiệp Văn khấn Mùng 1 Tết & Văn khấn Khai Xuân mở lộc'
    ],
    gifts: [
      'Bộ 05 Bao lì xì giấy dó NEPLE in nhũ vàng tinh tế'
    ],
    upsellHint: {
      addRitual: 'giao-thua',
      targetComboId: 'combo-song-xuan',
      message: 'Thêm lễ Giao Thừa để nâng cấp lên Hộp Combo Song Xuân [2+3] và tiết kiệm ngay 109.000đ!'
    }
  },
  {
    id: 'combo-ven-nep',
    sku: 'NEPLE-COMBO-01',
    name: 'Combo Vạn Nếp [1+2]',
    subtitle: 'Trọn Lễ Tiễn Táo (23 Chạp) + Giao Thừa (Đêm 30)',
    tier: 'double',
    tierLabel: 'Hộp Đôi Combo 2 Ngày',
    rituals: ['tien-tao', 'giao-thua'],
    ritualNames: ['Tiễn Táo (23 Chạp)', 'Giao Thừa (Đêm 30)'],
    price: 209000,
    originalPrice: 318000,
    discountPercent: 34,
    badge: 'TIẾT KIỆM 109.000đ (34%)',
    bestSeller: false,
    packagingSpec: 'Hộp Đôi Cứng 2 Ngăn Độc Lập (Ngăn 01: Tiễn Táo • Ngăn 02: Giao Thừa), đóng gói phân tầng giúp lấy từng lễ dễ dàng.',
    suitableFor: 'Gia đình trẻ đón tất niên & Giao Thừa tại nhà riêng trước khi đi chúc Tết nội ngoại sáng Mùng 1.',
    shortDesc: 'Thiết kế Hộp Đôi 2 ngăn thông minh: cúng xong ngày 23 Chạp vẫn giữ nguyên vẹn ngăn lễ Giao Thừa sạch sẽ, trang trọng cho đêm 30.',
    image: generatePackagingSVG('double', 'COMBO VẠN NẾP', 'Hộp Đôi 2 Ngăn: Tiễn Táo (23 Chạp) + Giao Thừa (Đêm 30)', '#0d2931', 'TIẾT KIỆM 109.000đ (-34%)', ['Tiễn Táo', 'Giao Thừa']),
    items: [
      'Ngăn 01 (Tiễn Táo): Nhang trầm sạch, Nến bơ, Trà Sen Cổ Thụ, Kẹo lạc & Mứt gừng, Lễ giấy 23 Chạp',
      'Ngăn 02 (Giao Thừa): Nhang trầm & Nụ trầm xông nhà, Nến sen, Trà Ô Long Hoa Bưởi, Hũ Gạo & Muối lộc, Lễ giấy 30 Tết',
      '01 Sổ tay Cẩm Nang Nếp Lễ & Bộ Văn Khấn Hiện Đại cho cả 2 dịp lễ',
      '01 Túi thảo mộc Mùi Già khô đun nước tắm tất niên thanh tẩy cuối năm'
    ],
    gifts: [
      'Tặng Túi thảo mộc Mùi Già tất niên trị giá 45.000đ',
      'Tiết kiệm ngay 109.000đ so với mua 2 hộp lẻ'
    ],
    upsellHint: {
      addRitual: 'khai-xuan',
      targetComboId: 'combo-tron-tet',
      message: 'Thêm lễ Khai Xuân để nâng cấp lên Hộp Đặc Biệt Combo Trọn Tết (Tiết kiệm 158.000đ + Tặng Lư Gốm Mộc)!'
    }
  },
  {
    id: 'combo-song-xuan',
    sku: 'NEPLE-COMBO-02',
    name: 'Combo Song Xuân [2+3]',
    subtitle: 'Trọn Lễ Giao Thừa (Đêm 30) + Khai Xuân (Mùng 1)',
    tier: 'double',
    tierLabel: 'Hộp Đôi Combo 2 Ngày',
    rituals: ['giao-thua', 'khai-xuan'],
    ritualNames: ['Giao Thừa (Đêm 30)', 'Khai Xuân (Mùng 1)'],
    price: 159000,
    originalPrice: 268000,
    discountPercent: 41,
    badge: 'TIẾT KIỆM 109.000đ (41%)',
    bestSeller: false,
    packagingSpec: 'Hộp Đôi Cứng 2 Ngăn Độc Lập (Ngăn 01: Giao Thừa • Ngăn 02: Khai Xuân), bọc đai Đỏ Rượu Vang mạ kim.',
    suitableFor: 'Gia đình trẻ bận rộn dịp 23 Chạp nhưng muốn chuẩn bị chu toàn cho đêm Giao Thừa và sáng Mùng 1 Tết.',
    shortDesc: 'Kết nối liền mạch nghi thức đón Giao Thừa đêm 30 và dâng trà Khai Xuân sáng Mùng 1 trong một Hộp Đôi chỉn chu.',
    image: generatePackagingSVG('double', 'COMBO SONG XUÂN', 'Hộp Đôi 2 Ngăn: Giao Thừa (Đêm 30) + Khai Xuân (Mùng 1)', '#691727', 'TIẾT KIỆM 109.000đ (-41%)', ['Giao Thừa', 'Khai Xuân']),
    items: [
      'Ngăn 01 (Giao Thừa): Nhang trầm & Nụ trầm, Đôi nến sen, Trà Ô Long Hoa Bưởi, Hũ Gạo Muối giữ lộc',
      'Ngăn 02 (Khai Xuân): Nhang trầm thanh khiết, Nến bơ, Trà Shan Tuyết Cổ Thụ, Hạt sen sấy & Táo đỏ',
      '01 Sổ tay Cẩm Nang Nếp Lễ & Bộ Văn Khấn Giao Thừa + Mùng 1 Tết',
      '01 Bộ 06 Bao lì xì giấy dó NEPLE + 01 Túi thơm thảo mộc treo phòng khách'
    ],
    gifts: [
      'Tặng Bộ 06 Bao lì xì giấy dó + Túi thơm thảo mộc',
      'Tiết kiệm ngay 109.000đ so với mua 2 hộp lẻ'
    ],
    upsellHint: {
      addRitual: 'tien-tao',
      targetComboId: 'combo-tron-tet',
      message: 'Thêm lễ Tiễn Táo (23 Chạp) để nâng cấp lên Combo Trọn Tết (Tiết kiệm 158.000đ + Tặng Lư Gốm Mộc)!'
    }
  },
  {
    id: 'combo-mo-tet',
    sku: 'NEPLE-COMBO-03',
    name: 'Combo Mở Tết [1+3]',
    subtitle: 'Trọn Lễ Tiễn Táo (23 Chạp) + Khai Xuân (Mùng 1)',
    tier: 'double',
    tierLabel: 'Hộp Đôi Combo 2 Ngày',
    rituals: ['tien-tao', 'khai-xuan'],
    ritualNames: ['Tiễn Táo (23 Chạp)', 'Khai Xuân (Mùng 1)'],
    price: 189000,
    originalPrice: 308000,
    discountPercent: 39,
    badge: 'TIẾT KIỆM 119.000đ (39%)',
    bestSeller: false,
    packagingSpec: 'Hộp Đôi Cứng 2 Ngăn Độc Lập (Ngăn 01: Tiễn Táo • Ngăn 02: Khai Xuân), bảo quản khô ráo suốt kỳ nghỉ Tết.',
    suitableFor: 'Gia đình trẻ, vợ chồng trẻ về quê ăn Giao Thừa cùng bố mẹ: cúng Ông Táo trước khi về quê và cúng Khai Xuân khi quay lại thành phố!',
    shortDesc: 'Giải pháp "đo ni đóng giày" cho người trẻ xa quê: cúng Tiễn Táo ngày 23 trước khi khóa cửa về quê, và cúng Khai Xuân ấm cúng khi trở lại nhà.',
    image: generatePackagingSVG('double', 'COMBO MỞ TẾT', 'Hộp Đôi 2 Ngăn: Tiễn Táo (23 Chạp) + Khai Xuân (Tân Niên)', '#0d2931', 'TIẾT KIỆM 119.000đ (-39%)', ['Tiễn Táo', 'Khai Xuân']),
    items: [
      'Ngăn 01 (Tiễn Táo): Nhang trầm ít khói, Nến bơ, Trà Sen Cổ Thụ, Kẹo lạc & Mứt gừng, Lễ giấy Ông Táo',
      'Ngăn 02 (Khai Xuân): Nhang trầm hương, Nến bơ, Trà Shan Tuyết Cổ Thụ, Hạt sen sấy & Táo đỏ',
      '01 Sổ tay Cẩm Nang Nếp Lễ & Bộ Văn Khấn Tiễn Táo + Khai Xuân',
      '01 Bộ 06 Bao lì xì giấy dó NEPLE + 01 Túi Mùi Già khô truyền thống'
    ],
    gifts: [
      'Tặng Bộ 06 Bao lì xì giấy dó + Túi Mùi Già khô',
      'Tiết kiệm ngay 119.000đ so với mua 2 hộp lẻ'
    ],
    upsellHint: {
      addRitual: 'giao-thua',
      targetComboId: 'combo-tron-tet',
      message: 'Thêm lễ Giao Thừa để nâng cấp lên Hộp Đặc Biệt Combo Trọn Tết (Tiết kiệm 158.000đ + Tặng Lư Gốm Mộc)!'
    }
  },
  {
    id: 'combo-tron-tet',
    sku: 'NEPLE-COMBO-FULL',
    name: 'Combo Trọn Tết',
    subtitle: 'Hộp Đặc Biệt Đủ Đầy 3 Lễ: Tiễn Táo • Giao Thừa • Khai Xuân',
    tier: 'triple',
    tierLabel: 'Hộp Đặc Biệt Trọn Tết 3 Ngày',
    rituals: ['tien-tao', 'giao-thua', 'khai-xuan'],
    ritualNames: ['Tiễn Táo (23 Chạp)', 'Giao Thừa (Đêm 30)', 'Khai Xuân (Mùng 1)'],
    price: 289000,
    originalPrice: 447000,
    discountPercent: 35,
    badge: 'BEST SELLER • TIẾT KIỆM 158.000đ (35%)',
    bestSeller: true,
    packagingSpec: 'Hộp Quà Lớn Đặc Biệt 3 Ngăn Độc Lập viền nhũ Vàng Ấm (#f0b45b), có quai xách sang trọng dùng làm quà biếu Tết hoặc giữ trọn nếp nhà.',
    suitableFor: 'Gia đình trẻ muốn chuẩn bị trọn vẹn cả mùa Tết chỉ trong 1 lần đặt hàng, hoặc làm quà biếu tân gia / biếu bố mẹ hai bên cực kỳ ý nghĩa.',
    shortDesc: 'Phiên bản cao cấp và tiết kiệm nhất của NEPLE: 3 ngăn lễ độc lập cho 23 Chạp, Đêm 30 và Mùng 1 Tết, tặng kèm Lư cắm nhang gốm mộc Bát Tràng & ấn phẩm Cẩm Nang Nếp Lễ.',
    image: 'hop-combo-tron-tet.jpg',
    items: [
      'Ngăn 01 (23 Chạp - Tiễn Táo): Nhang trầm sạch, Nến bơ, Trà Sen Cổ Thụ, Kẹo lạc & Mứt gừng, Bộ lễ giấy Ông Táo',
      'Ngăn 02 (Đêm 30 - Giao Thừa): Nhang trầm & Nụ trầm xông nhà, Nến sen, Trà Ô Long Hoa Bưởi, Hũ Gạo Nếp & Muối Hồng giữ lộc',
      'Ngăn 03 (Mùng 1 - Khai Xuân): Nhang trầm thanh khiết, Nến bơ, Trà Shan Tuyết Cổ Thụ, Hạt sen sấy & Táo đỏ thượng hạng',
      'Ấn phẩm đặc biệt "Cẩm Nang Nếp Lễ Cổ Truyền Cho Người Trẻ" (In màu trên giấy mỹ thuật dày dặn)',
      'Đầy đủ 04 Thiệp Văn Khấn Hiện Đại (Tiễn Táo, Giao Thừa Ngoài Trời, Giao Thừa Gia Tiên, Mùng 1 Khai Xuân)'
    ],
    gifts: [
      'Tặng 01 Đế/Lư cắm nhang Gốm Mộc Bát Tràng trị giá 85.000đ',
      'Tặng 01 Túi thảo mộc Mùi Già tắm tất niên + Bộ 10 Bao lì xì giấy dó NEPLE',
      'Ưu đãi cao nhất: Tiết kiệm ngay 158.000đ (-35%) + Miễn phí vận chuyển toàn quốc'
    ],
    upsellHint: null
  }
];

// 3-Tier Visual Comparison Matrix Data (Section 3.2)
const COMPARISON_TIERS = [
  {
    tier: 'single',
    title: 'Hộp Đơn Mua Lẻ',
    subtitle: 'Chọn 1 dịp lễ (Tiễn Táo / Giao Thừa / Khai Xuân)',
    badge: 'Linh hoạt theo nhu cầu',
    accentColor: '#0d2931',
    image: generatePackagingSVG('single', 'HỘP ĐƠN MỘC', '1 Ngăn Lễ Tiêu Chuẩn • Giấy Dó', '#0d2931', '1 DỊP LỄ TỰ CHỌN', ['1 Lễ']),
    packaging: 'Hộp đơn giấy dó bồi cứng kết hợp đai quấn thủ công theo màu từng lễ.',
    components: 'Đầy đủ 5 nhóm lễ vật khô cho 1 ngày lễ: Nhang trầm ít khói, Nến bơ, Trà quý, Đồ lễ khô & Lễ giấy.',
    publications: '01 Thiệp Văn khấn hiện đại & Hướng dẫn bày mâm 5 phút của dịp lễ đó.',
    exclusiveGifts: 'Thiệp tra cứu giờ đẹp cúng lễ.',
    priceRange: '129.000đ – 179.000đ / hộp',
    savings: 'Giá niêm yết tiêu chuẩn',
    bestFor: 'Người độc thân, ở trọ hoặc chỉ cúng 1 lễ duy nhất tại thành phố rồi về quê ăn Tết.',
    ctaRituals: ['tien-tao']
  },
  {
    tier: 'double',
    title: 'Hộp Đôi Combo 2 Ngày',
    subtitle: 'Vạn Nếp [1+2] • Song Xuân [2+3] • Mở Tết [1+3]',
    badge: 'Tiết kiệm từ 109.000đ – 119.000đ',
    accentColor: '#691727',
    image: generatePackagingSVG('double', 'HỘP ĐÔI 2 NGĂN', '2 Khay Lễ Riêng Biệt • Tiện Lợi Bảo Quản', '#691727', 'TIẾT KIỆM ĐẾN 119.000đ', ['Lễ 01', 'Lễ 02']),
    packaging: 'Hộp cứng 2 ngăn kéo/khay độc lập, giúp lấy đồ lễ ngày đầu mà không làm xáo trộn ngày lễ sau.',
    components: 'Trọn bộ 2 khay lễ vật khô riêng biệt (Trà, Nhang trầm, Nến bơ, Mứt/Hạt, Gạo muối lộc tùy cặp lễ).',
    publications: 'Sổ tay Cẩm Nang Nếp Lễ thu gọn + Bộ Thiệp Văn Khấn cho 2 dịp lễ đã chọn.',
    exclusiveGifts: 'Tặng Túi thảo mộc Mùi Già tất niên + Bộ 06 Bao lì xì giấy dó.',
    priceRange: '159.000đ – 209.000đ / hộp đôi',
    savings: 'Tiết kiệm từ 109.000đ – 119.000đ',
    bestFor: 'Vợ chồng trẻ ở chung cư về quê nửa kỳ nghỉ Tết (chỉ cúng 2 trên 3 dịp lễ tại nhà riêng).',
    ctaRituals: ['tien-tao', 'giao-thua']
  },
  {
    tier: 'triple',
    title: 'Hộp Đặc Biệt Trọn Tết',
    subtitle: 'Trọn vẹn 3 lễ: 23 Chạp • Đêm 30 • Mùng 1',
    badge: 'BEST SELLER • Tiết kiệm 158.000đ (35%)',
    accentColor: '#f0b45b',
    featured: true,
    image: 'hop-combo-tron-tet.jpg',
    packaging: 'Hộp Quà Lớn Đặc Biệt 3 ngăn đánh số thứ tự (01 - 02 - 03), ép kim Vàng Ấm (#f0b45b) sang trọng.',
    components: 'Đầy đủ 100% lễ vật khô thượng hạng cho cả 3 dịp lễ lớn nhất Tết Nguyên Đán (Giao 1 lần dùng trọn Tết).',
    publications: 'Ấn phẩm "Cẩm Nang Nếp Lễ Cổ Truyền Cho Người Trẻ" + Trọn bộ 04 Thiệp Văn Khấn Hiện Đại.',
    exclusiveGifts: 'Đế cắm nhang Gốm Mộc Bát Tràng + Túi Mùi Già + 10 Bao lì xì giấy dó + Freeship.',
    priceRange: '289.000đ (Giá lẻ gốc: 447.000đ)',
    savings: 'Tiết kiệm 158.000đ (35%) + Quà tặng 150.000đ',
    bestFor: 'Gia đình trẻ đón Tết tại nhà riêng/chung cư hoặc làm quà biếu bố mẹ, tân gia cực kỳ tinh tế.',
    ctaRituals: ['tien-tao', 'giao-thua', 'khai-xuan']
  }
];

// 4 SEO Blog Articles for GenZ & Young Families (Format chuẩn theo Ấn phẩm Hội Nhà Nếp)
const DEFAULT_BLOGS = [
  {
    id: 'blog-bai-tri-goc-an-yen-phong-tro',
    articleCode: 'BÀI 1: BÀI TRÍ GÓC AN YÊN NƠI PHÒNG TRỌ ĐÔ THỊ',
    category: 'Không gian sống tối giản & Nghi thức đón Tết xa nhà',
    linkedPackName: 'Set Tiễn Táo (23 Tháng Chạp – Tem Xanh)',
    relatedProductId: 'pack-tien-tao',
    slug: 'bai-tri-goc-an-yen-phong-tro',
    title: 'Căn phòng 20m² và góc nhỏ an yên: Người trẻ bài trí bàn lễ đón Tết như thế nào?',
    readTime: '4 phút đọc',
    publishedAt: '2026-01-10',
    author: 'Ban Biên Tập Hội Nhà Nếp',
    excerpt: 'Không có sập gụ tủ chè, cũng chẳng có bàn thờ gia tiên bề thế, những căn phòng trọ hay căn hộ studio của người trẻ xa quê vẫn có cách riêng để nếp nhà hiện diện thật ấm cúng giữa lòng phố thị.',
    coverImage: '',
    tags: ['phòng trọ', 'cúng ông táo', 'không gian tối giản', 'tết xa nhà'],
    seo: {
      metaTitle: 'Bài Trí Bàn Lễ Cúng Tết Tại Phòng Trọ Đô Thị Tinh Gọn | NEPLE',
      metaDescription: 'Cách người trẻ bài trí góc an yên đón Tết tại phòng trọ 20m2: tinh giản, trang nghiêm, ấm cúng và trọn vẹn nếp nhà xưa.',
      keywords: 'bài trí bàn lễ phòng trọ, cúng tết phòng trọ, cúng ông táo chung cư, góc an yên đón tết'
    },
    sections: [
      {
        heading: 'Cội nguồn của phong tục khởi đầu từ sự tĩnh tại',
        content: 'Những ngày cuối năm, khi dãy hành lang bắt đầu vắng bóng người, không gian sống của người trẻ làm việc xa nhà dường như thu lại trong vài chục mét vuông. Chúng ta thường nghĩ cúng lễ cần một không gian thật lớn, mâm cao cỗ đầy thì mới gọi là chu tất. Nhưng thực ra, cội nguồn của mọi phong tục khởi đầu từ sự tĩnh tại và lòng thành kính hướng về cội nguồn.'
      },
      {
        heading: 'Dọn một góc sạch, đón một nếp lành',
        content: 'Chỉ cần lau sạch một góc kệ sách cao ráo, một chiếc bàn làm việc xếp gọn laptop, cắm thêm nhành hoa cúc vàng tươi và chén nước trong. Đó đã là một không gian trang nghiêm đủ để bạn lắng lòng mình lại sau một năm dài bôn ba. Nghi lễ cúng Táo quân ngày 23 tháng Chạp nơi thành phố không cần cầu kỳ phóng sinh cá đỏ hay mâm cỗ linh đình. Điều quan trọng nhất là khoảnh khắc bạn gửi lời cảm ơn đến gian bếp nhỏ – nơi đã nấu cho bạn từng bữa cơm tăng ca, nuôi dưỡng bạn qua bao ngày tháng tự lập.'
      }
    ],
    contentHtml: `<p>Những ngày cuối năm, khi dãy hành lang bắt đầu vắng bóng người, không gian sống của người trẻ làm việc xa nhà dường như thu lại trong vài chục mét vuông. Chúng ta thường nghĩ cúng lễ cần một không gian thật lớn, mâm cao cỗ đầy thì mới gọi là chu tất. Nhưng thực ra, cội nguồn của mọi phong tục khởi đầu từ sự tĩnh tại và lòng thành kính hướng về cội nguồn.</p>

<h3 style="color: #691727; font-weight: 700; font-size: 1.25rem; margin-top: 1.5rem; margin-bottom: 0.75rem;">Dọn một góc sạch, đón một nếp lành</h3>

<p>Chỉ cần lau sạch một góc kệ sách cao ráo, một chiếc bàn làm việc xếp gọn laptop, cắm thêm nhành hoa cúc vàng tươi và chén nước trong. Đó đã là một không gian trang nghiêm đủ để bạn lắng lòng mình lại sau một năm dài bôn ba.</p>

<p>Nghi lễ cúng Táo quân ngày 23 tháng Chạp nơi thành phố không cần cầu kỳ phóng sinh cá đỏ hay mâm cỗ linh đình. Điều quan trọng nhất là khoảnh khắc bạn gửi lời cảm ơn đến gian bếp nhỏ – nơi đã nấu cho bạn từng bữa cơm tăng ca, nuôi dưỡng bạn qua bao ngày tháng tự lập.</p>

<div class="callout-neple-suggest p-5 my-6 rounded-2xl bg-[#0d2931] text-[#faf7f2] border-2 border-[#f0b45b] shadow-lg">
  <div class="flex items-center gap-2 mb-2 text-[#f0b45b] font-bold text-base">
    <span>✨</span>
    <h4>Gợi ý từ Hội Nhà Nếp:</h4>
  </div>
  <p class="text-sm leading-relaxed text-[#faf7f2]/90">
    Để góc phòng trọ không bị ngột ngạt bởi khói hương hay lỉnh kỉnh đồ mã, bạn có thể tham khảo <strong>Set Tiễn Táo (Tem Xanh)</strong> từ NEPLE. Toàn bộ mũ áo Táo quân, hia ngựa truyền thống và sachet gạo muối may mắn được thu gọn mô-đun trong một hộp kraft mộc, đi kèm nhang trầm quế tự nhiên mỏng khói, mang lại sự ấm áp vẹn tròn mà gọn nhẹ tuyệt đối cho không gian sống hiện đại.
  </p>
</div>`,
    prayerTitle: 'Văn Khấn Tiễn Táo Quân 23 Tháng Chạp (Bản Rút Gọn Trang Trọng)',
    prayerText: `Nam mô A Di Đà Phật! (3 lần)
Kính lạy Đông Trù Tư Mệnh Táo Phủ Thần Quân!

Hôm nay là ngày 23 tháng Chạp năm ...,
Tín chủ con là: .................................
Ngụ tại: .................................

Nhân ngày Táo Quân chầu trời, con thành tâm sửa biện hương hoa, trà quả, phẩm vật thanh tịnh dâng lên trước án, kính tiễn Tôn Thần.
Cúi xin Tôn Thần ghi nhận lòng thành, phù hộ cho gia đạo bình an, nơi chốn trọ nhỏ luôn đượm lửa ấm và lòng an yên.

Cúi xin Tôn Thần chứng giám!
Nam mô A Di Đà Phật! (3 lần)`
  },
  {
    id: 'blog-nam-nay-de-con-lo-do-dan-me',
    articleCode: 'BÀI 2: ĐỠ ĐẦN MẸ NGÀY GIÁP TẾT',
    category: 'Trưởng thành, chia sẻ áp lực gia đình',
    linkedPackName: 'Set Giao Thừa (Đêm 30 Tết – Tem Trắng)',
    relatedProductId: 'pack-giao-thua',
    slug: 'nam-nay-de-con-lo-do-dan-me',
    title: '"Mẹ nghỉ tay đi, năm nay để con lo": Khi trưởng thành bắt đầu từ việc gánh bớt âu lo ngày Tết',
    readTime: '5 phút đọc',
    publishedAt: '2026-01-14',
    author: 'Ban Biên Tập Hội Nhà Nếp',
    excerpt: 'Có những mùa Tết đi qua, ký ức đọng lại sâu nhất không phải là tiếng pháo hoa hay những bộ quần áo mới, mà là bóng lưng mẹ tất bật trong gian bếp từ tờ mờ sáng ngày 30.',
    coverImage: '',
    tags: ['đỡ đần mẹ', 'ngày 30 tết', 'cúng giao thừa', 'trưởng thành'],
    seo: {
      metaTitle: 'Mẹ Nghỉ Tay Đi Năm Nay Để Con Lo Ngày Tết | NEPLE',
      metaDescription: 'Khi trưởng thành bắt đầu từ việc gánh bớt âu lo lễ nghi cho mẹ ngày 30 Tết. Giải pháp chuẩn bị mâm cúng Giao Thừa trọn vẹn và an yên.',
      keywords: 'mẹ nghỉ tay đi tết để con lo, cúng giao thừa giúp mẹ, mâm cúng đêm 30 tết, nếp tết gia đình'
    },
    sections: [
      {
        heading: 'Nỗi lo toan của mẹ trong gian bếp ngày 30',
        content: 'Ngày bé, chúng ta chỉ mong nhanh đến Tết để được nghỉ học và xòe tay nhận phong bao đỏ. Lớn lên một chút, tự mình kiếm ra đồng tiền và đối diện với những áp lực công việc, ta mới thấu hiểu: Ngày Tết của mẹ thường bắt đầu bằng danh sách chợ dài dằng dặc, nỗi lo thiếu trước hụt sau và những cơn đau lưng sau hàng giờ chuẩn bị mâm cúng Tất niên. Trưởng thành đôi khi chẳng cần những món quà đắt đỏ. Đó là khoảnh khắc bạn bước vào bếp, cầm lấy tay mẹ và nói: "Năm nay việc lễ nghi cúng kiếng, mẹ cứ để con lo phụ một tay".'
      },
      {
        heading: 'Giao thừa an yên khi lòng bớt âu lo',
        content: 'Thời khắc chuyển giao năm cũ và năm mới là giây phút thiêng liêng nhất, khi cả gia đình cùng lắng lại để cầu mong bình an. Đừng để giây phút ấy bị lấn át bởi sự mệt mỏi vì chạy đôn chạy đáo tìm mua từng món vàng mã hay nén nhang thắp ngoài trời.'
      }
    ],
    contentHtml: `<p>Ngày bé, chúng ta chỉ mong nhanh đến Tết để được nghỉ học và xòe tay nhận phong bao đỏ. Lớn lên một chút, tự mình kiếm ra đồng tiền và đối diện với những áp lực công việc, ta mới thấu hiểu: Ngày Tết của mẹ thường bắt đầu bằng danh sách chợ dài dằng dặc, nỗi lo thiếu trước hụt sau và những cơn đau lưng sau hàng giờ chuẩn bị mâm cúng Tất niên.</p>

<p>Trưởng thành đôi khi chẳng cần những món quà đắt đỏ. Đó là khoảnh khắc bạn bước vào bếp, cầm lấy tay mẹ và nói: <em>"Năm nay việc lễ nghi cúng kiếng, mẹ cứ để con lo phụ một tay"</em>.</p>

<h3 style="color: #691727; font-weight: 700; font-size: 1.25rem; margin-top: 1.5rem; margin-bottom: 0.75rem;">Giao thừa an yên khi lòng bớt âu lo</h3>

<p>Thời khắc chuyển giao năm cũ và năm mới là giây phút thiêng liêng nhất, khi cả gia đình cùng lắng lại để cầu mong bình an. Đừng để giây phút ấy bị lấn át bởi sự mệt mỏi vì chạy đôn chạy đáo tìm mua từng món vàng mã hay nén nhang thắp ngoài trời.</p>

<div class="callout-neple-suggest p-5 my-6 rounded-2xl bg-[#0d2931] text-[#faf7f2] border-2 border-[#f0b45b] shadow-lg">
  <div class="flex items-center gap-2 mb-2 text-[#f0b45b] font-bold text-base">
    <span>✨</span>
    <h4>Gợi ý từ Hội Nhà Nếp:</h4>
  </div>
  <p class="text-sm leading-relaxed text-[#faf7f2]/90">
    Giúp mẹ thảnh thơi trọn vẹn đêm trừ tịch với <strong>Set Giao Thừa (Tem Trắng)</strong>. NEPLE đã chuẩn bị và phân định rõ ràng 2 phần lễ: mâm cúng thiên địa ngoài trời nghinh đón quan Hành khiển mới và mâm cúng gia thần tiên tổ trong nhà. Từng cặp nến đỏ bơ thực vật, vàng mã quy chuẩn đến nén hương quế thanh khiết đều sẵn sàng, giúp bạn tự tin thay mẹ hoàn thành nghi lễ trang trọng nhất năm.
  </p>
</div>`,
    prayerTitle: 'Văn Khấn Giao Thừa Đêm 30 Tết (Thiên Địa & Gia Tiên)',
    prayerText: `Nam mô A Di Đà Phật! (3 lần)
Kính lạy Hoàng Thiên Hậu Thổ chư vị Tôn Thần,
Kính lạy Bản cảnh Thành Hoàng, Thổ Địa, Táo Quân cùng chư vị Tôn Thần,
Kính lạy Tổ Tiên nội ngoại gia tộc họ .................

Đêm trừ tịch phút thiêng Giao Thừa vừa tới,
Tín chủ chúng con thành tâm dâng nén tâm hương, chén trà thanh khiết, xin kính cẩn tạ ơn Ân Trên và Tiên Tổ đã che chở cho gia đình suốt một năm qua.
Cầu mong năm mới gia đạo bình an, mẹ cha mạnh khỏe, vạn sự hanh thông, nếp nhà êm ấm.

Tâm thành kính lễ, cúi xin chứng giám!
Nam mô A Di Đà Phật! (3 lần)`
  },
  {
    id: 'blog-giai-ma-nghi-le-khai-xuan',
    articleCode: 'BÀI 3: MÂM CỖ CÚNG & NỖI SỢ "SAI NGHI LỄ" CỦA GEN Z',
    category: 'Hướng dẫn văn hóa, xóa bỏ nỗi sợ tâm linh',
    linkedPackName: 'Set Khai Xuân (Mùng 1 Tết – Tem Đỏ)',
    relatedProductId: 'pack-khai-xuan',
    slug: 'giai-ma-nghi-le-khai-xuan',
    title: 'Lần đầu làm chủ lễ Mùng 1: Giữ trọn lòng thành mà không sợ "cúng sai phong tục"',
    readTime: '5 phút đọc',
    publishedAt: '2026-01-18',
    author: 'Ban Biên Tập Hội Nhà Nếp',
    excerpt: 'Đứng trước bàn thờ gia tiên ngày đầu năm, nhiều người trẻ mang tâm lý e dè: Sợ đọc văn khấn vấp, sợ đặt sai vị trí đồ lễ, sợ sơ suất làm mất đi vượng khí đầu xuân.',
    coverImage: '',
    tags: ['cúng mùng 1', 'văn khấn khai xuân', 'giải mã nghi lễ', 'gen z'],
    seo: {
      metaTitle: 'Lần Đầu Làm Chủ Lễ Mùng 1: Giữ Trọn Lòng Thành Không Sợ Sai | NEPLE',
      metaDescription: 'Giải mã nghi lễ cúng Mùng 1 Tết dành cho GenZ: không cần cầu kỳ phức tạp, khởi đầu hanh thông bằng lòng thành kính và sự tinh giản.',
      keywords: 'cúng mùng 1 tết, văn khấn khai xuân, cúng tết cho người trẻ, nghi lễ đầu năm'
    },
    sections: [
      {
        heading: 'Tâm xuất thì Phật chứng, lễ bạc nhưng lòng thành',
        content: 'Chúng ta sinh ra trong thời đại số, quen với sự chuẩn xác của công nghệ, nên khi đối diện với thế giới tâm linh truyền thống giàu tính biểu tượng, cảm giác lúng túng là điều khó tránh khỏi. Không ít bạn trẻ từng băn khoăn: Gà cúng quay đầu hướng nào, thắp mấy nén hương, và bài văn khấn Mùng 1 có cần học thuộc lòng từng câu từng chữ? Người xưa có câu: "Tâm xuất thì Phật chứng, lễ bạc nhưng lòng thành". Nghi lễ thờ cúng tổ tiên của người Việt bản chất là một nét đẹp văn hóa tri ân nguồn cội, không phải một bài kiểm tra chấm điểm khắt khe để phạt những lỗi nhỏ vô tình. Sự trang nghiêm không nằm ở mâm cỗ thịnh soạn hàng chục món, mà nằm ở sự kính cẩn, tề chỉnh và tâm thế hướng thiện của người thắp hương.'
      },
      {
        heading: 'Khởi đầu hanh thông bằng sự tinh giản',
        content: 'Buổi sáng Mùng 1 Tết, sau khi thắp nén nhang thơm mời ông bà tổ tiên về ngự thụ lộc xuân, lòng người tự khắc cảm thấy an yên, nhẹ nhõm, sẵn sàng cho một năm mới đầy hy vọng.'
      }
    ],
    contentHtml: `<p>Chúng ta sinh ra trong thời đại số, quen với sự chuẩn xác của công nghệ, nên khi đối diện với thế giới tâm linh truyền thống giàu tính biểu tượng, cảm giác lúng túng là điều khó tránh khỏi. Không ít bạn trẻ từng băn khoăn: Gà cúng quay đầu hướng nào, thắp mấy nén hương, và bài văn khấn Mùng 1 có cần học thuộc lòng từng câu từng chữ?</p>

<p>Người xưa có câu: <em>"Tâm xuất thì Phật chứng, lễ bạc nhưng lòng thành"</em>. Nghi lễ thờ cúng tổ tiên của người Việt bản chất là một nét đẹp văn hóa tri ân nguồn cội, không phải một bài kiểm tra chấm điểm khắt khe để phạt những lỗi nhỏ vô tình. Sự trang nghiêm không nằm ở mâm cỗ thịnh soạn hàng chục món, mà nằm ở sự kính cẩn, tề chỉnh và tâm thế hướng thiện của người thắp hương.</p>

<h3 style="color: #691727; font-weight: 700; font-size: 1.25rem; margin-top: 1.5rem; margin-bottom: 0.75rem;">Khởi đầu hanh thông bằng sự tinh giản</h3>

<p>Buổi sáng Mùng 1 Tết, sau khi thắp nén nhang thơm mời ông bà tổ tiên về ngự thụ lộc xuân, lòng người tự khắc cảm thấy an yên, nhẹ nhõm, sẵn sàng cho một năm mới đầy hy vọng.</p>

<div class="callout-neple-suggest p-5 my-6 rounded-2xl bg-[#0d2931] text-[#faf7f2] border-2 border-[#f0b45b] shadow-lg">
  <div class="flex items-center gap-2 mb-2 text-[#f0b45b] font-bold text-base">
    <span>✨</span>
    <h4>Gợi ý từ Hội Nhà Nếp:</h4>
  </div>
  <p class="text-sm leading-relaxed text-[#faf7f2]/90">
    Xóa bỏ hoàn toàn nỗi âu lo sắm thiếu lễ vật với <strong>Set Khai Xuân (Tem Đỏ)</strong>. Bộ lễ tích hợp đầy đủ vàng mã nghinh lộc, trà thơm, nến đỏ may mắn cùng tờ thiệp in sẵn bài văn khấn chữ to dễ đọc, giúp bạn tự tin làm chủ nghi thức mở đầu năm mới một cách chỉn chu, trọn vẹn phong tục.
  </p>
</div>`,
    prayerTitle: 'Văn Khấn Sáng Mùng 1 Tết (Khai Xuân Đắc Lộc)',
    prayerText: `Nam mô A Di Đà Phật! (3 lần)
Kính lạy Chư vị Tôn Thần, Bản gia Đông Trù Tư Mệnh Táo Phủ Thần Quân,
Kính lạy Liệt vị Gia Tiên tiền tổ nội ngoại.

Hôm nay là ngày Mùng 1 tháng Giêng, Tết Nguyên Đán đầu xuân,
Tín chủ con kính cẩn dâng nén tâm hương, trà thơm phẩm ngọt, kính mời Chư vị và Tiên Tổ về ngự thụ lộc xuân.
Cầu mong năm mới khai xuân đắc lộc, gia đạo bình an, trí tuệ minh mẫn, vạn sự cát tường như ý!

Cúi xin chứng giám!
Nam mô A Di Đà Phật! (3 lần)`
  },
  {
    id: 'blog-nghi-le-xanh-giu-nep-an-yen',
    articleCode: 'BÀI 4: VĂN HÓA THẮP HƯƠNG & XU HƯỚNG SỐNG XANH ĐÔ THỊ',
    category: 'Lối sống bền vững, tâm linh văn minh',
    linkedPackName: 'Bộ sưu tập Ready-to-Ritual trọn gói (Bộ 3 Pack All-in-One)',
    relatedProductId: 'combo-tron-tet',
    slug: 'nghi-le-xanh-giu-nep-an-yen',
    title: 'Hành lễ văn minh: Khi phong tục nghìn năm hòa nhịp cùng phong cách sống xanh',
    readTime: '6 phút đọc',
    publishedAt: '2026-01-21',
    author: 'Ban Biên Tập Hội Nhà Nếp',
    excerpt: 'Làm sao để vừa vẹn tròn đạo hiếu với tổ tiên, vừa bảo vệ môi trường sống và không gian sinh hoạt của các gia đình đô thị? Câu trả lời nằm ở tư duy "nghi lễ tinh gọn".',
    coverImage: '',
    tags: ['sống xanh', 'nghi lễ văn minh', 'ít khói', 'bền vững'],
    seo: {
      metaTitle: 'Hành Lễ Văn Minh: Phong Tục Nghìn Năm Cùng Phong Cách Sống Xanh | NEPLE',
      metaDescription: 'Xu hướng thờ cúng văn minh đô thị: nhang sạch thảo mộc ít khói, hóa vàng tượng trưng, bao bì giấy kraft sinh học thân thiện môi trường.',
      keywords: 'văn hóa thắp hương xanh, nhang sạch ít khói, cúng lễ văn minh, nếp lễ sống xanh'
    },
    sections: [
      {
        heading: 'Nghi lễ tinh gọn giữa không gian đô thị',
        content: 'Hình ảnh những lò hóa vàng đỏ lửa rợp phố, những cuộn khói hương mù mịt trong căn hộ chung cư khép kín từng là nỗi trăn trở của không ít người mỗi mùa Tết. Người trẻ hiện đại trân trọng văn hóa cội nguồn, nhưng đồng thời cũng ý thức sâu sắc về sức khỏe gia đình, an toàn phòng cháy chữa cháy và việc giảm thiểu rác thải ra môi trường.'
      },
      {
        heading: '3 chuyển mình văn minh trong thực hành nghi lễ',
        content: 'Hóa vàng tượng trưng, Nhang sạch ít khói từ thảo mộc tự nhiên trầm quế khuynh diệp an toàn hệ hô hấp, và Bao bì tái chế giấy kraft mộc loại bỏ khay nhựa dùng một lần.'
      }
    ],
    contentHtml: `<p>Hình ảnh những lò hóa vàng đỏ lửa rợp phố, những cuộn khói hương mù mịt trong căn hộ chung cư khép kín từng là nỗi trăn trở của không ít người mỗi mùa Tết. Người trẻ hiện đại trân trọng văn hóa cội nguồn, nhưng đồng thời cũng ý thức sâu sắc về sức khỏe gia đình, an toàn phòng cháy chữa cháy và việc giảm thiểu rác thải ra môi trường.</p>

<p>Thực hành nghi lễ ngày nay đang dần chuyển mình theo xu hướng văn minh hơn:</p>

<ul class="my-3 space-y-2 pl-4 list-disc text-sm sm:text-base leading-relaxed">
  <li><strong>Hóa vàng tượng trưng:</strong> Đốt lượng tiền vàng vừa đủ biểu trưng cho lòng thành, tránh đốt hàng tá hình nhân, xe cộ tốn kém và ô nhiễm.</li>
  <li><strong>Nhang sạch ít khói:</strong> Thay thế nhang tẩm hóa chất cuốn tàn bằng dòng nhang thảo mộc tự nhiên từ trầm, quế, khuynh diệp an toàn cho hệ hô hấp của người già và trẻ nhỏ.</li>
  <li><strong>Bao bì tái chế:</strong> Sử dụng hộp giấy kraft mộc, loại bỏ các khay nhựa dùng một lần.</li>
</ul>

<p>Nếp xưa chỉ thực sự sống mãi khi nó biết thích nghi và mang lại giá trị tích cực cho cuộc sống hiện tại.</p>

<div class="callout-neple-suggest p-5 my-6 rounded-2xl bg-[#0d2931] text-[#faf7f2] border-2 border-[#f0b45b] shadow-lg">
  <div class="flex items-center gap-2 mb-2 text-[#f0b45b] font-bold text-base">
    <span>✨</span>
    <h4>Gợi ý từ Hội Nhà Nếp:</h4>
  </div>
  <p class="text-sm leading-relaxed text-[#faf7f2]/90">
    Đón nhận phong cách sống an lành cùng <strong>Trọn bộ sưu tập Ready-to-Ritual (Đủ 3 Pack Tiễn Táo – Giao Thừa – Khai Xuân)</strong>. Toàn bộ ấn phẩm bao bì đều sử dụng chất liệu giấy kraft sinh học thân thiện môi trường, kết hợp cùng dòng nhang trầm quế cao cấp tự nhiên, đem đến một mùa Tết thảnh thơi, văn minh và thanh sạch cho mọi tổ ấm.
  </p>
</div>`,
    prayerTitle: 'Lời Nguyện Cầu Bình An & Giữ Vẹn Nếp Nhà',
    prayerText: `Nam mô A Di Đà Phật! (3 lần)
Kính lạy Chư vị Tôn Thần, Tiên Tổ nội ngoại,

Chúng con thành tâm dâng hương hoa tinh sạch, kính cẩn tri ân nguồn cội.
Nguyện cầu cho môi trường sống an lành, muôn nhà hòa thuận, nếp xưa gìn giữ thắm tươi theo cách văn minh, thanh sạch.

Cúi xin chứng giám!
Nam mô A Di Đà Phật! (3 lần)`
  }
];

// Default Store Settings (VietQR, MoMo, Social Hub, Analytics)
const DEFAULT_SETTINGS = {
  brandName: 'NEPLE — Nếp Lễ',
  tagline: 'Trọn Nếp Lễ Xưa • Tinh Gọn Cho Nay',
  bankId: 'MB',
  bankName: 'MB Bank (Ngân hàng Quân Đội)',
  accountNumber: '090123456789',
  accountName: 'CONG TY TNHH NEP LE VIET NAM',
  momoPhone: '0901234567',
  momoName: 'NEPLE STORE - NẾP LỄ VIỆT NAM',
  customQrImage: '',
  hotline: '0901 234 567',
  email: 'chao@neple.vn',
  address: 'Số 28 Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh',
  socials: {
    zalo: 'https://zalo.me/0901234567',
    messenger: 'https://m.me/neple.vn',
    facebook: 'https://www.facebook.com/share/19jikPGxG6/?mibextid=wwXIfr',
    tiktok: 'https://www.tiktok.com/@neple.modern.ritu?_r=1&_t=ZS-9AlxBYoWB3k',
    youtube: 'https://youtube.com/@neple9999?si=p6U8Ii_e4K4U4HVN'
  },
  analytics: {
    ga4Id: '',
    clarityId: ''
  },
  shipping: {
    innerCityFee: 25000,
    suburbanFee: 30000,
    interprovincialFee: 35000,
    freeShipThreshold: 200000,
    freeShipCombo: true
  },
  googleSheets: {
    syncUrl: '',
    enabled: false
  }
};

// Default Sample Orders for Instant Order Lookup (/tra-cuu-don-hang) & Admin Testing
const DEFAULT_ORDERS = [
  {
    id: 'NP-260188',
    customerName: 'Nguyễn Minh Anh',
    phone: '0901234567',
    address: 'Căn hộ B12.08, Vinhomes Central Park, Bình Thạnh, TP.HCM',
    note: 'Giao giờ hành chính trước 20 tháng Chạp giúp mình nhé.',
    paymentMethod: 'VIETQR',
    paymentLabel: 'Chuyển khoản VietQR Ngân hàng',
    status: 'Đang đóng gói hộp lễ',
    createdAt: '2026-10-19 14:20',
    subtotal: 289000,
    shippingFee: 0,
    shippingLabel: 'Miễn phí (0đ) — Ưu đãi Combo Trọn Tết',
    total: 289000,
    items: [
      { id: 'combo-tron-tet', name: 'Combo Trọn Tết (Hộp Đặc Biệt 3 Ngày)', price: 289000, qty: 1 }
    ]
  },
  {
    id: 'NP-260192',
    customerName: 'Trần Hoàng Long',
    phone: '0987654321',
    address: 'Tòa S2.05 Vinhomes Smart City, Nam Từ Liêm, Hà Nội',
    note: 'Mình về quê tối 28 Tết, giao sớm giúp mình.',
    paymentMethod: 'COD',
    paymentLabel: 'Thanh toán khi nhận hàng (COD)',
    status: 'Đang giao hàng',
    createdAt: '2026-10-20 09:15',
    subtotal: 378000,
    shippingFee: 0,
    shippingLabel: 'Miễn phí (0đ) — Đơn từ 200.000đ',
    total: 378000,
    items: [
      { id: 'combo-mo-tet', name: 'Combo Mở Tết [1+3] (Tiễn Táo + Khai Xuân)', price: 189000, qty: 2 }
    ]
  }
];
