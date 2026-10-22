// ==========================================================================
// NEPLE (Nếp Lễ) — Master Data Architecture (7 SKUs, SEO Blogs, Orders, Config)
// ==========================================================================

const NEPLE_STORAGE_KEYS = {
  PRODUCTS: 'neple_products_v1',
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
        <text x="300" y="349" text-anchor="middle" font-family="sans-serif" font-size="10.5" fill="#f0b45b" font-weight="bold">🎁 TẶNG KÈM: Lư Cắm Nhang Gốm Mộc + Túi Mùi Già + 10 Bao Lì Xì Giấy Dó</text>
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
    price: 249000,
    originalPrice: 249000,
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
      message: 'Thêm lễ Giao Thừa để nâng cấp lên Hộp Combo Vẹn Nếp và tiết kiệm ngay 69.000đ!'
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
    price: 279000,
    originalPrice: 279000,
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
      message: 'Thêm lễ Tiễn Táo để nâng cấp lên Hộp Combo Vẹn Nếp và tiết kiệm ngay 69.000đ!'
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
    price: 259000,
    originalPrice: 259000,
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
      message: 'Thêm lễ Giao Thừa để nâng cấp lên Hộp Combo Song Xuân và tiết kiệm ngay 69.000đ!'
    }
  },
  {
    id: 'combo-ven-nep',
    sku: 'NEPLE-COMBO-01',
    name: 'Combo Vẹn Nếp',
    subtitle: 'Trọn Lễ Tiễn Táo (23 Chạp) + Giao Thừa (Đêm 30)',
    tier: 'double',
    tierLabel: 'Hộp Đôi Combo 2 Ngày',
    rituals: ['tien-tao', 'giao-thua'],
    ritualNames: ['Tiễn Táo (23 Chạp)', 'Giao Thừa (Đêm 30)'],
    price: 459000,
    originalPrice: 528000,
    discountPercent: 13,
    badge: 'TIẾT KIỆM 69.000đ (13%)',
    bestSeller: false,
    packagingSpec: 'Hộp Đôi Cứng 2 Ngăn Độc Lập (Ngăn 01: Tiễn Táo • Ngăn 02: Giao Thừa), đóng gói phân tầng giúp lấy từng lễ dễ dàng.',
    suitableFor: 'Gia đình trẻ đón tất niên & Giao Thừa tại nhà riêng trước khi đi chúc Tết nội ngoại sáng Mùng 1.',
    shortDesc: 'Thiết kế Hộp Đôi 2 ngăn thông minh: cúng xong ngày 23 Chạp vẫn giữ nguyên vẹn ngăn lễ Giao Thừa sạch sẽ, trang trọng cho đêm 30.',
    image: generatePackagingSVG('double', 'COMBO VẸN NẾP', 'Hộp Đôi 2 Ngăn: Tiễn Táo (23 Chạp) + Giao Thừa (Đêm 30)', '#0d2931', 'TIẾT KIỆM 69.000đ (-13%)', ['Tiễn Táo', 'Giao Thừa']),
    items: [
      'Ngăn 01 (Tiễn Táo): Nhang trầm sạch, Nến bơ, Trà Sen Cổ Thụ, Kẹo lạc & Mứt gừng, Lễ giấy 23 Chạp',
      'Ngăn 02 (Giao Thừa): Nhang trầm & Nụ trầm xông nhà, Nến sen, Trà Ô Long Hoa Bưởi, Hũ Gạo & Muối lộc, Lễ giấy 30 Tết',
      '01 Sổ tay Cẩm Nang Nếp Lễ & Bộ Văn Khấn Hiện Đại cho cả 2 dịp lễ',
      '01 Túi thảo mộc Mùi Già khô đun nước tắm tất niên thanh tẩy cuối năm'
    ],
    gifts: [
      'Tặng Túi thảo mộc Mùi Già tất niên trị giá 45.000đ',
      'Tiết kiệm ngay 69.000đ so với mua 2 hộp lẻ'
    ],
    upsellHint: {
      addRitual: 'khai-xuan',
      targetComboId: 'combo-tron-tet',
      message: 'Thêm lễ Khai Xuân để nâng cấp lên Hộp Đặc Biệt Combo Trọn Tết (Tiết kiệm 138.000đ + Tặng Lư Gốm Mộc)!'
    }
  },
  {
    id: 'combo-song-xuan',
    sku: 'NEPLE-COMBO-02',
    name: 'Combo Song Xuân',
    subtitle: 'Trọn Lễ Giao Thừa (Đêm 30) + Khai Xuân (Mùng 1)',
    tier: 'double',
    tierLabel: 'Hộp Đôi Combo 2 Ngày',
    rituals: ['giao-thua', 'khai-xuan'],
    ritualNames: ['Giao Thừa (Đêm 30)', 'Khai Xuân (Mùng 1)'],
    price: 469000,
    originalPrice: 538000,
    discountPercent: 13,
    badge: 'TIẾT KIỆM 69.000đ (13%)',
    bestSeller: false,
    packagingSpec: 'Hộp Đôi Cứng 2 Ngăn Độc Lập (Ngăn 01: Giao Thừa • Ngăn 02: Khai Xuân), bọc đai Đỏ Rượu Vang mạ kim.',
    suitableFor: 'Gia đình trẻ bận rộn dịp 23 Chạp nhưng muốn chuẩn bị chu toàn cho đêm Giao Thừa và sáng Mùng 1 Tết.',
    shortDesc: 'Kết nối liền mạch nghi thức đón Giao Thừa đêm 30 và dâng trà Khai Xuân sáng Mùng 1 trong một Hộp Đôi chỉn chu.',
    image: generatePackagingSVG('double', 'COMBO SONG XUÂN', 'Hộp Đôi 2 Ngăn: Giao Thừa (Đêm 30) + Khai Xuân (Mùng 1)', '#691727', 'TIẾT KIỆM 69.000đ (-13%)', ['Giao Thừa', 'Khai Xuân']),
    items: [
      'Ngăn 01 (Giao Thừa): Nhang trầm & Nụ trầm, Đôi nến sen, Trà Ô Long Hoa Bưởi, Hũ Gạo Muối giữ lộc',
      'Ngăn 02 (Khai Xuân): Nhang trầm thanh khiết, Nến bơ, Trà Shan Tuyết Cổ Thụ, Hạt sen sấy & Táo đỏ',
      '01 Sổ tay Cẩm Nang Nếp Lễ & Bộ Văn Khấn Giao Thừa + Mùng 1 Tết',
      '01 Bộ 06 Bao lì xì giấy dó NEPLE + 01 Túi thơm thảo mộc treo phòng khách'
    ],
    gifts: [
      'Tặng Bộ 06 Bao lì xì giấy dó + Túi thơm thảo mộc',
      'Tiết kiệm ngay 69.000đ so với mua 2 hộp lẻ'
    ],
    upsellHint: {
      addRitual: 'tien-tao',
      targetComboId: 'combo-tron-tet',
      message: 'Thêm lễ Tiễn Táo (23 Chạp) để nâng cấp lên Combo Trọn Tết (Tiết kiệm 138.000đ + Tặng Lư Gốm Mộc)!'
    }
  },
  {
    id: 'combo-mo-tet',
    sku: 'NEPLE-COMBO-03',
    name: 'Combo Mở Tết',
    subtitle: 'Trọn Lễ Tiễn Táo (23 Chạp) + Khai Xuân (Mùng 1)',
    tier: 'double',
    tierLabel: 'Hộp Đôi Combo 2 Ngày',
    rituals: ['tien-tao', 'khai-xuan'],
    ritualNames: ['Tiễn Táo (23 Chạp)', 'Khai Xuân (Mùng 1)'],
    price: 439000,
    originalPrice: 508000,
    discountPercent: 14,
    badge: 'TIẾT KIỆM 69.000đ (14%)',
    bestSeller: false,
    packagingSpec: 'Hộp Đôi Cứng 2 Ngăn Độc Lập (Ngăn 01: Tiễn Táo • Ngăn 02: Khai Xuân), bảo quản khô ráo suốt kỳ nghỉ Tết.',
    suitableFor: 'Gia đình trẻ, vợ chồng trẻ về quê ăn Giao Thừa cùng bố mẹ: cúng Ông Táo trước khi về quê và cúng Khai Xuân khi quay lại thành phố!',
    shortDesc: 'Giải pháp "đo ni đóng giày" cho người trẻ xa quê: cúng Tiễn Táo ngày 23 trước khi khóa cửa về quê, và cúng Khai Xuân ấm cúng khi trở lại nhà.',
    image: generatePackagingSVG('double', 'COMBO MỞ TẾT', 'Hộp Đôi 2 Ngăn: Tiễn Táo (23 Chạp) + Khai Xuân (Tân Niên)', '#0d2931', 'TIẾT KIỆM 69.000đ (-14%)', ['Tiễn Táo', 'Khai Xuân']),
    items: [
      'Ngăn 01 (Tiễn Táo): Nhang trầm ít khói, Nến bơ, Trà Sen Cổ Thụ, Kẹo lạc & Mứt gừng, Lễ giấy Ông Táo',
      'Ngăn 02 (Khai Xuân): Nhang trầm hương, Nến bơ, Trà Shan Tuyết Cổ Thụ, Hạt sen sấy & Táo đỏ',
      '01 Sổ tay Cẩm Nang Nếp Lễ & Bộ Văn Khấn Tiễn Táo + Khai Xuân',
      '01 Bộ 06 Bao lì xì giấy dó NEPLE + 01 Túi Mùi Già khô truyền thống'
    ],
    gifts: [
      'Tặng Bộ 06 Bao lì xì giấy dó + Túi Mùi Già khô',
      'Tiết kiệm ngay 69.000đ so với mua 2 hộp lẻ'
    ],
    upsellHint: {
      addRitual: 'giao-thua',
      targetComboId: 'combo-tron-tet',
      message: 'Thêm lễ Giao Thừa để nâng cấp lên Hộp Đặc Biệt Combo Trọn Tết (Tiết kiệm 138.000đ + Tặng Lư Gốm Mộc)!'
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
    price: 649000,
    originalPrice: 787000,
    discountPercent: 18,
    badge: 'BEST SELLER • TIẾT KIỆM 138.000đ (18%)',
    bestSeller: true,
    packagingSpec: 'Hộp Quà Lớn Đặc Biệt 3 Ngăn Độc Lập viền nhũ Vàng Ấm (#f0b45b), có quai xách sang trọng dùng làm quà biếu Tết hoặc giữ trọn nếp nhà.',
    suitableFor: 'Gia đình trẻ muốn chuẩn bị trọn vẹn cả mùa Tết chỉ trong 1 lần đặt hàng, hoặc làm quà biếu tân gia / biếu bố mẹ hai bên cực kỳ ý nghĩa.',
    shortDesc: 'Phiên bản cao cấp và tiết kiệm nhất của NEPLE: 3 ngăn lễ độc lập cho 23 Chạp, Đêm 30 và Mùng 1 Tết, tặng kèm Lư cắm nhang gốm mộc Bát Tràng & ấn phẩm Cẩm Nang Nếp Lễ.',
    image: generatePackagingSVG('triple', 'COMBO TRỌN TẾT', '3 Ngăn Lễ Độc Lập: Tiễn Táo • Giao Thừa • Khai Xuân', '#691727', 'BEST SELLER • TIẾT KIỆM 138.000đ', ['Tiễn Táo', 'Giao Thừa', 'Khai Xuân']),
    items: [
      'Ngăn 01 (23 Chạp - Tiễn Táo): Nhang trầm sạch, Nến bơ, Trà Sen Cổ Thụ, Kẹo lạc & Mứt gừng, Bộ lễ giấy Ông Táo',
      'Ngăn 02 (Đêm 30 - Giao Thừa): Nhang trầm & Nụ trầm xông nhà, Nến sen, Trà Ô Long Hoa Bưởi, Hũ Gạo Nếp & Muối Hồng giữ lộc',
      'Ngăn 03 (Mùng 1 - Khai Xuân): Nhang trầm thanh khiết, Nến bơ, Trà Shan Tuyết Cổ Thụ, Hạt sen sấy & Táo đỏ thượng hạng',
      'Ấn phẩm đặc biệt "Cẩm Nang Nếp Lễ Cổ Truyền Cho Người Trẻ" (In màu trên giấy mỹ thuật dày dặn)',
      'Đầy đủ 04 Thiệp Văn Khấn Hiện Đại (Tiễn Táo, Giao Thừa Ngoài Trời, Giao Thừa Gia Tiên, Mùng 1 Khai Xuân)'
    ],
    gifts: [
      '🎁 Tặng 01 Đế/Lư cắm nhang Gốm Mộc Bát Tràng trị giá 85.000đ',
      '🎁 Tặng 01 Túi thảo mộc Mùi Già tắm tất niên + Bộ 10 Bao lì xì giấy dó NEPLE',
      '✨ Ưu đãi cao nhất: Tiết kiệm ngay 138.000đ (-18%) + Miễn phí vận chuyển toàn quốc'
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
    priceRange: '249.000đ – 279.000đ / hộp',
    savings: 'Giá niêm yết tiêu chuẩn',
    bestFor: 'Người độc thân, ở trọ hoặc chỉ cúng 1 lễ duy nhất tại thành phố rồi về quê ăn Tết.',
    ctaRituals: ['tien-tao']
  },
  {
    tier: 'double',
    title: 'Hộp Đôi Combo 2 Ngày',
    subtitle: 'Vẹn Nếp • Song Xuân • Mở Tết',
    badge: 'Tiết kiệm 69.000đ (13% - 14%)',
    accentColor: '#691727',
    image: generatePackagingSVG('double', 'HỘP ĐÔI 2 NGĂN', '2 Khay Lễ Riêng Biệt • Tiện Lợi Bảo Quản', '#691727', 'TIẾT KIỆM 69.000đ', ['Lễ 01', 'Lễ 02']),
    packaging: 'Hộp cứng 2 ngăn kéo/khay độc lập, giúp lấy đồ lễ ngày đầu mà không làm xáo trộn ngày lễ sau.',
    components: 'Trọn bộ 2 khay lễ vật khô riêng biệt (Trà, Nhang trầm, Nến bơ, Mứt/Hạt, Gạo muối lộc tùy cặp lễ).',
    publications: 'Sổ tay Cẩm Nang Nếp Lễ thu gọn + Bộ Thiệp Văn Khấn cho 2 dịp lễ đã chọn.',
    exclusiveGifts: '🎁 Tặng Túi thảo mộc Mùi Già tất niên + Bộ 06 Bao lì xì giấy dó.',
    priceRange: '439.000đ – 469.000đ / hộp đôi',
    savings: 'Tiết kiệm ngay 69.000đ (13% - 14%)',
    bestFor: 'Vợ chồng trẻ ở chung cư về quê nửa kỳ nghỉ Tết (chỉ cúng 2 trên 3 dịp lễ tại nhà riêng).',
    ctaRituals: ['tien-tao', 'giao-thua']
  },
  {
    tier: 'triple',
    title: 'Hộp Đặc Biệt Trọn Tết',
    subtitle: 'Trọn vẹn 3 lễ: 23 Chạp • Đêm 30 • Mùng 1',
    badge: 'BEST SELLER • Tiết kiệm 138.000đ (18%)',
    accentColor: '#f0b45b',
    featured: true,
    image: generatePackagingSVG('triple', 'HỘP QUÀ TRỌN TẾT', '3 Ngăn Lễ Độc Lập • Quà Tặng Gốm Mộc', '#691727', 'ƯU ĐÃI CAO NHẤT -18%', ['Tiễn Táo', 'Giao Thừa', 'Khai Xuân']),
    packaging: 'Hộp Quà Lớn Đặc Biệt 3 ngăn đánh số thứ tự (01 - 02 - 03), ép kim Vàng Ấm (#f0b45b) sang trọng.',
    components: 'Đầy đủ 100% lễ vật khô thượng hạng cho cả 3 dịp lễ lớn nhất Tết Nguyên Đán (Giao 1 lần dùng trọn Tết).',
    publications: 'Ấn phẩm "Cẩm Nang Nếp Lễ Cổ Truyền Cho Người Trẻ" + Trọn bộ 04 Thiệp Văn Khấn Hiện Đại.',
    exclusiveGifts: '🎁 Đế cắm nhang Gốm Mộc Bát Tràng + Túi Mùi Già + 10 Bao lì xì giấy dó + Freeship.',
    priceRange: '649.000đ (Giá lẻ gốc: 787.000đ)',
    savings: 'Tiết kiệm 138.000đ (18%) + Quà tặng 150.000đ',
    bestFor: 'Gia đình trẻ đón Tết tại nhà riêng/chung cư hoặc làm quà biếu bố mẹ, tân gia cực kỳ tinh tế.',
    ctaRituals: ['tien-tao', 'giao-thua', 'khai-xuan']
  }
];

// 4 SEO Blog Articles for GenZ & Young Families (Section 3.3)
const DEFAULT_BLOGS = [
  {
    id: 'blog-cung-ong-tao-chung-cu',
    slug: 'huong-dan-cung-ong-cong-ong-tao-toi-gian-cho-gia-dinh-tre-o-chung-cu',
    title: 'Cúng Ông Công Ông Táo Ở Chung Cư: Bày Mâm Tối Giản Trong 10 Phút Mà Vẫn Đủ Đầy Nếp Xưa',
    category: 'Hướng Dẫn Bày Lễ Tối Giản',
    readTime: '5 phút đọc',
    publishedAt: '2026-01-10',
    author: 'Ban Biên Tập Nếp Lễ',
    excerpt: 'Ở căn hộ chung cư không tiện đốt nhiều vàng mã hay thả cá chép ra hồ? Đây là cẩm nang giúp người trẻ giữ trọn lễ Tiễn Táo ngày 23 tháng Chạp văn minh, ấm cúng và không lo báo khói.',
    coverImage: generatePackagingSVG('single', 'CẨM NANG 23 CHẠP', 'Cúng Ông Táo Tối Giản Tại Chung Cư', '#0d2931', 'HƯỚNG DẪN BÀY LỄ', ['Tiễn Táo']),
    relatedProductId: 'pack-tien-tao',
    tags: ['cúng ông táo', 'bày mâm cúng chung cư', '23 tháng chạp', 'tối giản'],
    seo: {
      metaTitle: 'Cách Cúng Ông Công Ông Táo Ở Chung Cư Tối Giản Cho Người Trẻ | NEPLE',
      metaDescription: 'Hướng dẫn chuẩn bị mâm cúng Ông Công Ông Táo ngày 23 tháng Chạp tại chung cư: tinh gọn, ít khói, văn minh kèm bài văn khấn hiện đại dễ đọc.',
      keywords: 'cúng ông táo, bày mâm cúng chung cư, văn khấn ông công ông táo, lễ 23 tháng chạp tối giản'
    },
    sections: [
      {
        heading: '1. Vì sao người trẻ ở chung cư không cần mâm cao cỗ đầy khi cúng 23 tháng Chạp?',
        content: 'Trong văn hóa Việt, Ông Công Ông Táo là vị thần giữ lửa ấm và ghi nhận nếp sống thiện lành của mỗi gia đình suốt một năm. Với nhịp sống hiện đại tại các căn hộ chung cư, điều cốt lõi không nằm ở mâm cỗ sát sinh cầu kỳ hay xấp tiền vàng dày cộp, mà ở sự thành tâm, gian bếp sạch sẽ và nén nhang thơm tiễn Táo Quân về trời.'
      },
      {
        heading: '2. Checklist 5 vật phẩm khô tinh gọn cho mâm lễ Ông Táo hiện đại',
        content: 'Thay vì vội vã đi chợ từ 5 giờ sáng, bạn hoàn toàn có thể chuẩn bị một mâm lễ chay/ngọt thanh tịnh gồm: (1) Nhang trầm hương sạch ít khói để không kích hoạt chuông báo cháy chung cư; (2) Đôi nến bơ thực vật tạo ánh lửa ấm; (3) Một ấm Trà Sen Cổ Thụ thơm dịu; (4) Đĩa kẹo lạc, mứt gừng truyền thống; và (5) Bộ lễ giấy tối giản tượng trưng.'
      },
      {
        heading: '3. Cúng Ông Táo ở bàn thờ hay trong bếp? Giờ nào tốt nhất?',
        content: 'Theo các nhà nghiên cứu văn hóa, nếu căn hộ đã có bàn thờ Gia Tiên hoặc bàn thờ Thần Tài, bạn nên đặt mâm lễ tại bàn thờ chính cho trang trọng. Nếu căn hộ studio chưa lập bàn thờ, bạn có thể trải khăn sạch trên bàn ăn gần khu vực bếp, hướng về phía sáng sủa. Thời gian đẹp nhất là từ chiều ngày 22 đến trước 12h trưa ngày 23 tháng Chạp.'
      }
    ],
    prayerTitle: 'Văn Khấn Ông Công Ông Táo Ngắn Gọn & Trang Trọng (Bản Hiện Đại)',
    prayerText: `Nam mô A Di Đà Phật! (3 lần)
Kính lạy Đông Trù Tư Mệnh Táo Phủ Thần Quân!

Hôm nay là ngày 23 tháng Chạp năm ...,
Tín chủ chúng con là: .................................
Cùng gia quyến hiện cư ngụ tại: .................................

Một năm cũ sắp qua, ngày lành tháng Chạp đã tới. Chúng con thành tâm sửa biện hương hoa, trà quả, phẩm vật thanh tịnh dâng lên trước án, kính tiễn Tôn Thần lên chầu Thượng Đế.

Cúi xin Tôn Thần gia ân xá주 những điều còn thiếu sót của gia đình trẻ chúng con trong việc bếp núc, giữ gìn nếp nhà suốt năm qua; đồng thời ban phước lành cho gia đạo năm mới bình an, hòa thuận, lửa ấm luôn đượm, công việc hanh thông.

Chúng con lễ bạc tâm thành, cúi xin Tôn Thần chứng giám!
Nam mô A Di Đà Phật! (3 lần)`
  },
  {
    id: 'blog-van-khan-giao-thua-genz',
    slug: 'van-khan-giao-thua-hien-dai-de-doc-cho-gia-dinh-tre',
    title: 'Văn Khấn Giao Thừa Hiện Đại & Cách Bày Mâm Lễ Đêm 30 Tết Không Nặng Nề Mê Tín',
    category: 'Văn Khấn Hiện Đại',
    readTime: '6 phút đọc',
    publishedAt: '2026-01-14',
    author: 'Ban Biên Tập Nếp Lễ',
    excerpt: 'Đêm 30 Tết là khoảnh khắc thiêng liêng nhất chuyển giao hai năm. Lưu ngay bản văn khấn Giao Thừa thuần Việt, dễ hiểu cùng nghi thức giữ Hũ Gạo - Muối Hồng đón lộc cho tổ ấm nhỏ.',
    coverImage: generatePackagingSVG('single', 'NGHI THỨC ĐÊM 30', 'Văn Khấn Giao Thừa & Giữ Lộc Đầu Năm', '#691727', 'VĂN KHẤN HIỆN ĐẠI', ['Giao Thừa']),
    relatedProductId: 'combo-ven-nep',
    tags: ['văn khấn', 'giao thừa', 'đêm 30 tết', 'muối gạo đầu năm'],
    seo: {
      metaTitle: 'Văn Khấn Giao Thừa Hiện Đại Ngắn Gọn Dễ Đọc Đêm 30 Tết | NEPLE',
      metaDescription: 'Tổng hợp văn khấn Giao Thừa ngoài trời và trong nhà dành cho gia đình trẻ, giải thích ý nghĩa hũ gạo muối đêm 30 Tết chuẩn văn hóa Việt.',
      keywords: 'văn khấn giao thừa, cúng giao thừa chung cư, văn khấn đêm 30 tết ngắn gọn, muối gạo giao thừa'
    },
    sections: [
      {
        heading: '1. Ý nghĩa thực sự của lễ Trừ Tịch (Giao Thừa) dưới góc nhìn văn hóa',
        content: '"Trừ Tịch" nghĩa là khép lại những muộn phiền của năm cũ để đón nguồn năng lượng trong lành của năm mới. Với thế hệ trẻ, lễ cúng Giao Thừa là một khoảng lặng chánh niệm: tắt bớt màn hình điện thoại, thắp nén nhang trầm, pha ấm trà hoa bưởi và gửi gắm lời chúc bình an cho những người thân yêu.'
      },
      {
        heading: '2. Nghi thức Hũ Gạo Nếp & Muối Hồng giữ lộc đêm 30 Tết',
        content: 'Ông bà xưa có câu "Đầu năm mua muối, cuối năm mua vôi". Trong gói Giao Thừa của NEPLE, hũ gạo nếp cái hoa vàng và muối hồng được gói trong giấy dó mộc mạc. Khi cúng Giao Thừa xong, gia chủ giữ lại hũ gạo muối này nơi góc bếp hoặc bàn thờ để biểu trưng cho sự no ấm, đậm đà tình thân suốt cả năm.'
      },
      {
        heading: '3. Ở chung cư không có sân thượng thì cúng Giao Thừa ngoài trời thế nào?',
        content: 'Nếu sống tại chung cư, bạn có thể đặt một bàn nhỏ sạch sẽ hướng ra ban công thoáng gió hoặc cửa sổ lớn nhất của phòng khách để thực hiện nghi thức đón khí lành đất trời trước, sau đó thắp hương tại bàn thờ trong nhà.'
      }
    ],
    prayerTitle: 'Văn Khấn Giao Thừa Đón Tân Niên (Dùng Cho Cả Chung Cư & Nhà Riêng)',
    prayerText: `Nam mô A Di Đà Phật! (3 lần)
Kính lạy Hoàng Thiên Hậu Thổ chư vị Tôn Thần,
Kính lạy Bản cảnh Thành Hoàng, Thổ Địa, Táo Quân cùng chư vị Tôn Thần cai quản trong xứ này,
Kính lạy Tổ Tiên nội ngoại gia tộc họ .................

Phút thiêng Giao Thừa vừa tới, năm cũ đã qua, năm mới vừa sang.
Tín chủ chúng con là: .................................
Ngụ tại: .................................

Đêm nay đất trời giao hòa, chúng con thành tâm thắp nén tâm hương, dâng phẩm trà thanh khiết, gạo lành muối đượm cùng lễ vật tinh sạch, cảm tạ Ân Trên và Tổ Tiên đã che chở cho gia đình chúng con suốt một năm qua.

Bước sang năm mới, nguyện cầu cho quốc thái dân an, gia đình nhỏ của chúng con luôn mạnh khỏe, tâm trí sáng trong, việc làm thuận lợi, giữ vẹn đạo hiếu và nếp nhà êm ấm.

Tâm thành kính lễ, cúi xin chứng giám!
Nam mô A Di Đà Phật! (3 lần)`
  },
  {
    id: 'blog-y-nghia-3-ngay-le-tet',
    slug: 'y-nghia-3-nghi-le-quan-trong-nhat-dip-tet-tien-tao-giao-thua-khai-xuan',
    title: 'Vì Sao Chỉ Cần Chu Toàn 3 Nghi Lễ Này Là Đã Giữ Trọn "Nếp Tết" Việt Nam?',
    category: 'Ý Nghĩa Lễ Tết',
    readTime: '4 phút đọc',
    publishedAt: '2026-01-18',
    author: 'Ban Biên Tập Nếp Lễ',
    excerpt: 'Giữa hàng chục tục lệ Tết dễ khiến GenZ bối rối, hiểu đúng hành trình 3 cột mốc: Tiễn Táo (Khép lại) — Giao Thừa (Chuyển giao) — Khai Xuân (Khởi đầu) sẽ giúp bạn đón Tết nhẹ nhõm mà sâu sắc.',
    coverImage: generatePackagingSVG('triple', 'HÀNH TRÌNH 3 LỄ TẾT', 'Tiễn Táo • Giao Thừa • Khai Xuân', '#0d2931', 'Ý NGHĨA LỄ TẾT', ['Tiễn Táo', 'Giao Thừa', 'Khai Xuân']),
    relatedProductId: 'combo-tron-tet',
    tags: ['ý nghĩa lễ tết', 'khai xuân', 'trọn tết', 'văn hóa việt'],
    seo: {
      metaTitle: 'Ý Nghĩa 3 Ngày Lễ Quan Trọng Nhất Dịp Tết: Tiễn Táo, Giao Thừa, Khai Xuân | NEPLE',
      metaDescription: 'Khám phá triết lý văn hóa đằng sau 3 cột mốc lễ Tết quan trọng nhất của người Việt: 23 tháng Chạp, Đêm 30 Giao Thừa và Mùng 1 Khai Xuân.',
      keywords: 'ý nghĩa lễ tết, cúng khai xuân mùng 1, các lễ cúng tết nguyên đán, nếp lễ tết việt'
    },
    sections: [
      {
        heading: '1. Cột mốc 1 — Tiễn Táo (23 Tháng Chạp): Nghi thức biết ơn & thu vén',
        content: 'Ngày 23 tháng Chạp là lời nhắc dịu dàng để mỗi gia đình bắt đầu dọn dẹp lại không gian sống, lau dọn gian bếp và nhìn lại hành trình một năm đã qua với lòng biết ơn.'
      },
      {
        heading: '2. Cột mốc 2 — Giao Thừa (Đêm 30 Tết): Khoảnh khắc tĩnh lặng chuyển giao',
        content: 'Khi kim đồng hồ chạm 0h00, hương trầm ấm áp cùng nước tắm thảo mộc mùi già giúp gột rửa mọi bộn bề, đưa tâm thế mỗi người về sự tĩnh tại, sẵn sàng đón nhận khởi đầu mới.'
      },
      {
        heading: '3. Cột mốc 3 — Khai Xuân (Sáng Mùng 1): Gieo mầm may mắn & ngọt lành',
        content: 'Sáng Mùng 1 Tết, chén trà Shan Tuyết cổ thụ sóng sánh cùng hạt sen, táo đỏ dâng lên ông bà tổ tiên là lời chúc cho một năm mới sum vầy, vạn sự hanh thông.'
      }
    ],
    prayerTitle: 'Văn Khấn Sáng Mùng 1 Tết & Khai Xuân Đắc Lộc',
    prayerText: `Nam mô A Di Đà Phật! (3 lần)
Kính lạy Chư vị Tôn Thần, Bản gia Đông Trù Tư Mệnh Táo Phủ Thần Quân,
Kính lạy liệt vị Gia Tiên nội ngoại.

Hôm nay là ngày Mùng 1 tháng Giêng năm mới, nguyên đán đầu xuân.
Tín chủ chúng con là: .................................
Ngụ tại: .................................

Nhân ngày Tân Niên cát nhật, chúng con thành tâm dâng trà quý, hương trầm, quả ngọt hạt lành lên trước án. Kính mời Chư vị Tôn Thần cùng Gia Tiên về thụ hưởng lễ vật, chứng giám lòng thành.

Cầu xin năm mới gia đạo bình an, sức khỏe dồi dào, trí tuệ minh mẫn, khai xuân đắc lộc, vạn sự cát tường như ý!
Nam mô A Di Đà Phật! (3 lần)`
  },
  {
    id: 'blog-chuyen-nep-nha-mui-gia',
    slug: 'huong-mui-gia-va-chen-tra-tet-ky-uc-nep-nha-cua-the-he-tre',
    title: 'Hương Mùi Già Đêm 30 & Chén Trà Đầu Xuân: Khi Người Trẻ Tự Tay Giữ Ấm Nếp Nhà',
    category: 'Chuyện Nếp Nhà',
    readTime: '4 phút đọc',
    publishedAt: '2026-01-21',
    author: 'Ban Biên Tập Nếp Lễ',
    excerpt: 'Có một thời chúng ta nghĩ Tết là việc của mẹ, của bà. Cho đến năm đầu tiên tự đứng trước ban thờ trong căn hộ nhỏ của chính mình, ta mới hiểu "Nếp Lễ" chính là sợi dây nối dài ký ức gia đình.',
    coverImage: generatePackagingSVG('double', 'CHUYỆN NẾP NHÀ', 'Hương Mùi Già & Chén Trà Đầu Xuân', '#72826f', 'CHUYỆN NẾP NHÀ', ['Giao Thừa', 'Khai Xuân']),
    relatedProductId: 'combo-song-xuan',
    tags: ['chuyện nếp nhà', 'mùi già tết', 'trà tết', 'gia đình trẻ'],
    seo: {
      metaTitle: 'Hương Mùi Già Đêm 30 & Chuyện Giữ Nếp Nhà Của Người Trẻ | NEPLE',
      metaDescription: 'Tản văn về ký ức nồi nước tắm mùi già chiều 30 Tết, chén trà sen đầu xuân và cách thế hệ GenZ, gia đình trẻ gìn giữ văn hóa Tết Việt theo cách tinh gọn.',
      keywords: 'nước mùi già chiều 30 tết, chuyện nếp nhà, tết của người trẻ, trà cúng tết'
    },
    sections: [
      {
        heading: '1. Lần đầu tiên tự chuẩn bị lễ Tết ở tuổi đôi mươi, ba mươi',
        content: 'Rất nhiều bạn trẻ chia sẻ với NEPLE rằng: khi ra ở riêng hoặc mới lập gia đình, mỗi dịp 23 tháng Chạp hay 30 Tết đều vừa háo hức vừa lúng túng. Không biết mua lễ vật ở đâu cho sạch, bày biện thế nào cho đúng mà không bị rườm rà.'
      },
      {
        heading: '2. Nồi nước mùi già và nén trầm sạch: Đánh thức mọi giác quan ngày Tết',
        content: 'Chỉ cần một túi mùi già khô đun sôi trên bếp điện, hương thơm thảo mộc dịu nhẹ lan tỏa khắp căn hộ nhỏ cũng đủ khiến chiều 30 Tết trở nên trọn vẹn. Tết không nằm ở sự phô trương, Tết nằm ở cảm giác bình yên khi ta chăm chút cho tổ ấm.'
      }
    ],
    prayerTitle: null,
    prayerText: null
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
  hotline: '0901 234 567',
  email: 'chao@neple.vn',
  address: 'Số 28 Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh',
  socials: {
    zalo: 'https://zalo.me/0901234567',
    messenger: 'https://m.me/neple.vn',
    facebook: 'https://facebook.com/neple.vn',
    instagram: 'https://instagram.com/neple.vn',
    tiktok: 'https://tiktok.com/@neple.vn',
    threads: 'https://threads.net/@neple.vn'
  },
  analytics: {
    ga4Id: '',
    clarityId: ''
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
    total: 649000,
    items: [
      { id: 'combo-tron-tet', name: 'Combo Trọn Tết (Hộp Đặc Biệt 3 Ngày)', price: 649000, qty: 1 }
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
    total: 439000,
    items: [
      { id: 'combo-mo-tet', name: 'Combo Mở Tết (Tiễn Táo + Khai Xuân)', price: 439000, qty: 1 }
    ]
  }
];
