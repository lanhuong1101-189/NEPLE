// ==========================================================================
// NEPLE (Nếp Lễ) — Core Interactive Application & Admin CMS Engine
// ==========================================================================

const NepleApp = {
  state: {
    activeView: 'home', // 'home' | 'cam-nang' | 'tra-cuu' | 'admin'
    selectedRituals: ['tien-tao', 'giao-thua', 'khai-xuan'], // Default: Combo Trọn Tết
    activeSkuId: 'combo-tron-tet',
    stageTab: 'exterior', // 'exterior' | 'interior'
    blogCategory: 'Tất cả',
    activeBlogId: null,
    prayerFontSize: 'normal', // 'normal' | 'large'
    adminTab: 'orders', // 'orders' | 'products' | 'blogs' | 'settings'
    editingProductId: null,
    editingBlogId: null,
    paymentMethod: 'VIETQR', // 'VIETQR' | 'MOMO' | 'COD'
    checkoutPhonePreview: '',
    products: [],
    blogs: [],
    orders: [],
    settings: {},
    cart: []
  },

  init() {
    this.loadState();
    this.injectAnalytics();
    this.bindGlobalEvents();
    this.handleHashRoute();
    this.renderAll();
  },

  loadState() {
    try {
      const savedProducts = localStorage.getItem(NEPLE_STORAGE_KEYS.PRODUCTS);
      this.state.products = (savedProducts ? JSON.parse(savedProducts) : JSON.parse(JSON.stringify(DEFAULT_PRODUCTS))).map(p => ({
        ...p,
        name: (p.name || '').replace(/^Pack\s+/i, ''),
        image: typeof p.image === 'string' && p.image.startsWith('data:image/svg+xml') ? p.image.replace(/PACK%20/gi, '') : p.image,
        gifts: (p.gifts || []).map(g => g.replace(/^[🎁✨💡👑★•\s]+/u, ''))
      }));

      const savedBlogs = localStorage.getItem(NEPLE_STORAGE_KEYS.BLOGS);
      this.state.blogs = savedBlogs ? JSON.parse(savedBlogs) : JSON.parse(JSON.stringify(DEFAULT_BLOGS));

      const savedOrders = localStorage.getItem(NEPLE_STORAGE_KEYS.ORDERS);
      this.state.orders = savedOrders ? JSON.parse(savedOrders) : JSON.parse(JSON.stringify(DEFAULT_ORDERS));

      const savedSettings = localStorage.getItem(NEPLE_STORAGE_KEYS.SETTINGS);
      this.state.settings = savedSettings
        ? { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) }
        : JSON.parse(JSON.stringify(DEFAULT_SETTINGS));

      const savedCart = localStorage.getItem(NEPLE_STORAGE_KEYS.CART);
      this.state.cart = savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.warn('Fallback to default state:', e);
      this.state.products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
      this.state.blogs = JSON.parse(JSON.stringify(DEFAULT_BLOGS));
      this.state.orders = JSON.parse(JSON.stringify(DEFAULT_ORDERS));
      this.state.settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
      this.state.cart = [];
    }
  },

  saveProducts() {
    localStorage.setItem(NEPLE_STORAGE_KEYS.PRODUCTS, JSON.stringify(this.state.products));
  },
  saveBlogs() {
    localStorage.setItem(NEPLE_STORAGE_KEYS.BLOGS, JSON.stringify(this.state.blogs));
  },
  saveOrders() {
    localStorage.setItem(NEPLE_STORAGE_KEYS.ORDERS, JSON.stringify(this.state.orders));
  },
  saveSettings() {
    localStorage.setItem(NEPLE_STORAGE_KEYS.SETTINGS, JSON.stringify(this.state.settings));
  },
  saveCart() {
    localStorage.setItem(NEPLE_STORAGE_KEYS.CART, JSON.stringify(this.state.cart));
    this.renderCartBadge();
  },

  resetAllData() {
    if (!confirm('Bạn có chắc muốn khôi phục dữ liệu mẫu gốc của NEPLE (Sản phẩm, Bài viết, Đơn hàng mẫu)?')) return;
    localStorage.removeItem(NEPLE_STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(NEPLE_STORAGE_KEYS.BLOGS);
    localStorage.removeItem(NEPLE_STORAGE_KEYS.ORDERS);
    localStorage.removeItem(NEPLE_STORAGE_KEYS.SETTINGS);
    this.loadState();
    this.renderAll();
    this.showToast('Đã khôi phục dữ liệu gốc thành công!');
  },

  exportFullBackupJSON() {
    const backup = {
      exportedAt: new Date().toISOString(),
      products: this.state.products,
      blogs: this.state.blogs,
      orders: this.state.orders,
      settings: this.state.settings
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `NEPLE-Backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    this.showToast('Đã tải file Backup toàn bộ dữ liệu (.json) về máy!');
  },

  importFullBackupJSON(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.products) {
          this.state.products = data.products;
          this.saveProducts();
        }
        if (data.blogs) {
          this.state.blogs = data.blogs;
          this.saveBlogs();
        }
        if (data.orders) {
          this.state.orders = data.orders;
          this.saveOrders();
        }
        if (data.settings) {
          this.state.settings = data.settings;
          this.saveSettings();
        }
        this.renderAll();
        this.showToast('Đã khôi phục dữ liệu từ file Backup thành công!');
      } catch (err) {
        this.showToast('File Backup không hợp lệ!');
      }
    };
    reader.readAsText(file);
  },

  formatVND(amount) {
    return Number(amount || 0).toLocaleString('vi-VN') + 'đ';
  },

  normalizeVN(str) {
    return (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .trim();
  },

  injectAnalytics() {
    const { ga4Id, clarityId } = this.state.settings.analytics || {};
    if (ga4Id && !document.getElementById('neple-ga4')) {
      const s1 = document.createElement('script');
      s1.id = 'neple-ga4';
      s1.async = true;
      s1.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`;
      document.head.appendChild(s1);

      const s2 = document.createElement('script');
      s2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${ga4Id}');
      `;
      document.head.appendChild(s2);
    }
    if (clarityId && !document.getElementById('neple-clarity')) {
      const s = document.createElement('script');
      s.id = 'neple-clarity';
      s.innerHTML = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${clarityId}");
      `;
      document.head.appendChild(s);
    }
  },

  bindGlobalEvents() {
    window.addEventListener('hashchange', () => this.handleHashRoute());

    // Live cross-tab sync when Admin edits data in admin.html
    window.addEventListener('storage', () => {
      this.loadState();
      this.renderAll();
    });

    document.addEventListener('click', (e) => {
      const searchContainers = document.querySelectorAll('.smart-search-wrapper');
      let clickedInside = false;
      searchContainers.forEach(c => {
        if (c.contains(e.target)) clickedInside = true;
      });
      if (!clickedInside) {
        document.querySelectorAll('.smart-search-results').forEach(el => el.classList.add('hidden'));
      }
    });
  },

  handleHashRoute() {
    const hash = (window.location.hash || '#home').replace('#', '');
    if (['home', 'cam-nang', 'tra-cuu'].includes(hash)) {
      this.switchView(hash, false);
    } else if (hash === 'admin') {
      // Redirect to dedicated Admin Portal
      window.location.href = 'admin.html';
    } else if (hash.startsWith('blog/')) {
      const slug = hash.replace('blog/', '');
      const blog = this.state.blogs.find(b => b.slug === slug || b.id === slug);
      this.switchView('cam-nang', false);
      if (blog) this.openBlogArticle(blog.id);
    } else if (hash === 'combo-selector' || hash === 'san-pham' || hash === 'so-sanh') {
      this.switchView('home', false);
      setTimeout(() => {
        const el = document.getElementById(hash === 'san-pham' ? 'combo-selector' : hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    }
  },

  switchView(viewName, updateHash = true) {
    this.state.activeView = viewName;
    if (updateHash) {
      window.location.hash = viewName === 'home' ? '' : `#${viewName}`;
    }
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.toggle('hidden', sec.id !== `view-${viewName}`);
    });
    document.querySelectorAll('.nav-link-item').forEach(btn => {
      const isMatch = btn.dataset.view === viewName;
      btn.classList.toggle('underline', isMatch);
      btn.classList.toggle('underline-offset-4', isMatch);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.renderAll();
  },

  renderAll() {
    this.renderCartBadge();
    this.renderInteractiveSkuStudio();
    this.renderComparisonMatrix();
    this.renderHomeBlogPreview();
    this.renderBlogPage();
    this.renderOrderLookupSampleList();
    this.renderAdminPanel();
    this.renderFloatingSocials();
  },

  // ========================================================================
  // 2 & 3.1. SPLIT-SCREEN INTERACTIVE SKU & COMBO STUDIO
  // Left Panel: Select SKU or Toggle Rituals (Clean, No Repetitive Images)
  // Right Panel: Live Pack Visualizer Stage (Shows Dynamic Changes Instantly)
  // ========================================================================
  selectSkuDirectly(skuId, scrollIfNeeded = false) {
    const product = this.state.products.find(p => p.id === skuId);
    if (!product) return;
    this.state.activeSkuId = product.id;
    this.state.selectedRituals = [...(product.rituals || ['tien-tao'])];
    this.state.stageTab = 'exterior';
    this.renderInteractiveSkuStudio();
    this.renderComparisonMatrix();
    if (scrollIfNeeded) {
      const el = document.getElementById('combo-selector');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  toggleRitual(ritualKey) {
    const idx = this.state.selectedRituals.indexOf(ritualKey);
    if (idx > -1) {
      if (this.state.selectedRituals.length === 1) {
        this.showToast('Cần chọn ít nhất 1 dịp lễ trong hộp Nếp Lễ!');
        return;
      }
      this.state.selectedRituals.splice(idx, 1);
    } else {
      this.state.selectedRituals.push(ritualKey);
    }
    const matched = this.getMatchedProductByRituals(this.state.selectedRituals);
    this.state.activeSkuId = matched.id;
    this.state.stageTab = 'exterior';
    this.renderInteractiveSkuStudio();
    this.renderComparisonMatrix();
  },

  setRitualsPreset(ritualsArray) {
    this.state.selectedRituals = [...ritualsArray];
    const matched = this.getMatchedProductByRituals(this.state.selectedRituals);
    this.state.activeSkuId = matched.id;
    this.state.stageTab = 'exterior';
    this.renderInteractiveSkuStudio();
    this.renderComparisonMatrix();
    const el = document.getElementById('combo-selector');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  setStageTab(tabName) {
    this.state.stageTab = tabName;
    this.renderInteractiveSkuStudio();
  },

  getInteriorPreviewSVG(product) {
    const tier = product?.tier || 'single';
    const title = product?.name || 'Set Lễ NEPLE';

    if (tier === 'single') {
      return `data:image/svg+xml;utf8,` + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 460" width="100%" height="100%">
          <rect width="600" height="460" rx="24" fill="#f4efe6"/>
          <!-- Open Box Outer Frame -->
          <rect x="65" y="45" width="470" height="370" rx="18" fill="#0d2931" stroke="#f0b45b" stroke-width="3"/>
          <rect x="82" y="62" width="436" height="336" rx="12" fill="#faf7f2" stroke="#ae9984" stroke-width="1.5"/>

          <!-- Header Label Inside Box -->
          <rect x="180" y="76" width="240" height="28" rx="14" fill="#691727"/>
          <text x="300" y="94" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#f0b45b">BÊN TRONG HỘP • ${title.toUpperCase()}</text>

          <!-- Compartment 1: Tea Tin -->
          <rect x="102" y="118" width="128" height="125" rx="10" fill="#f4ebd0" stroke="#ae9984" stroke-width="1.5"/>
          <circle cx="166" cy="166" r="30" fill="#0d2931" stroke="#f0b45b" stroke-width="2"/>
          <text x="166" y="170" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="bold" fill="#f0b45b">TRÀ THƯỢNG HẠNG</text>
          <text x="166" y="224" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="bold" fill="#0d2931">Hộp Trà Cúng</text>

          <!-- Compartment 2: Dried Offerings / Seeds / Salt-Rice -->
          <rect x="244" y="118" width="128" height="125" rx="10" fill="#f4ebd0" stroke="#ae9984" stroke-width="1.5"/>
          <rect x="272" y="140" width="72" height="52" rx="8" fill="#691727" stroke="#f0b45b" stroke-width="1.5"/>
          <text x="308" y="170" text-anchor="middle" font-family="sans-serif" font-size="9.5" font-weight="bold" fill="#faf7f2">LỄ VẬT KHÔ</text>
          <text x="308" y="224" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="bold" fill="#0d2931">Mứt / Hạt / Gạo Muối</text>

          <!-- Compartment 3: Pair of Butter Candles -->
          <rect x="386" y="118" width="112" height="125" rx="10" fill="#f4ebd0" stroke="#ae9984" stroke-width="1.5"/>
          <circle cx="422" cy="168" r="18" fill="#f0b45b" stroke="#691727" stroke-width="1.5"/>
          <circle cx="462" cy="168" r="18" fill="#f0b45b" stroke="#691727" stroke-width="1.5"/>
          <text x="442" y="224" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="bold" fill="#0d2931">Đôi Nến Bơ</text>

          <!-- Compartment 4: Incense Tube (Long Horizontal) -->
          <rect x="102" y="256" width="270" height="54" rx="10" fill="#0d2931" stroke="#f0b45b" stroke-width="1.5"/>
          <text x="237" y="287" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#f0b45b">ỐNG NHANG TRẦM HƯƠNG SẠCH ÍT KHÓI</text>

          <!-- Compartment 5: Prayer Card & Handbook -->
          <rect x="386" y="256" width="112" height="122" rx="10" fill="#691727" stroke="#f0b45b" stroke-width="1.5"/>
          <text x="442" y="305" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="bold" fill="#f0b45b">THIỆP VĂN KHẤN</text>
          <text x="442" y="324" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#faf7f2">&amp; Cẩm Nang Lễ</text>

          <!-- Compartment 6: Minimalist Paper Offerings -->
          <rect x="102" y="322" width="270" height="56" rx="10" fill="#efe9e0" stroke="#ae9984" stroke-width="1.5"/>
          <text x="237" y="354" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="bold" fill="#691727">Bộ Sớ &amp; Lễ Giấy Tối Giản Chuẩn Nếp</text>
        </svg>
      `);
    }

    if (tier === 'double') {
      return `data:image/svg+xml;utf8,` + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 460" width="100%" height="100%">
          <rect width="600" height="460" rx="24" fill="#f4efe6"/>
          <!-- Open Double Box Outer Frame -->
          <rect x="48" y="42" width="504" height="376" rx="18" fill="#0d2931" stroke="#f0b45b" stroke-width="3"/>
          <text x="300" y="72" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#f0b45b">BÊN TRONG HỘP ĐÔI 2 KHAY LỄ • ${title.toUpperCase()}</text>

          <!-- Left Tray (Ritual 1) -->
          <rect x="68" y="88" width="224" height="248" rx="12" fill="#faf7f2" stroke="#f0b45b" stroke-width="1.5"/>
          <rect x="84" y="102" width="192" height="28" rx="6" fill="#0d2931"/>
          <text x="180" y="120" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="bold" fill="#f0b45b">KHAY LỄ 01 • ĐÓNG GÓI RIÊNG</text>
          <rect x="84" y="140" width="90" height="72" rx="8" fill="#f4ebd0" stroke="#ae9984"/>
          <text x="129" y="180" text-anchor="middle" font-family="sans-serif" font-size="9.5" font-weight="bold" fill="#0d2931">Trà &amp; Nến</text>
          <rect x="186" y="140" width="90" height="72" rx="8" fill="#f4ebd0" stroke="#ae9984"/>
          <text x="231" y="180" text-anchor="middle" font-family="sans-serif" font-size="9.5" font-weight="bold" fill="#691727">Lễ Vật Khô</text>
          <rect x="84" y="222" width="192" height="44" rx="8" fill="#163d48"/>
          <text x="180" y="248" text-anchor="middle" font-family="sans-serif" font-size="9.5" font-weight="bold" fill="#f0b45b">Nhang Trầm &amp; Lễ Giấy</text>
          <rect x="84" y="276" width="192" height="44" rx="8" fill="#efe9e0" stroke="#ae9984"/>
          <text x="180" y="302" text-anchor="middle" font-family="sans-serif" font-size="9.5" font-weight="bold" fill="#0d2931">Thiệp Văn Khấn Dịp 1</text>

          <!-- Right Tray (Ritual 2) -->
          <rect x="308" y="88" width="224" height="248" rx="12" fill="#faf7f2" stroke="#f0b45b" stroke-width="1.5"/>
          <rect x="324" y="102" width="192" height="28" rx="6" fill="#691727"/>
          <text x="420" y="120" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="bold" fill="#f0b45b">KHAY LỄ 02 • ĐÓNG GÓI RIÊNG</text>
          <rect x="324" y="140" width="90" height="72" rx="8" fill="#f4ebd0" stroke="#ae9984"/>
          <text x="369" y="180" text-anchor="middle" font-family="sans-serif" font-size="9.5" font-weight="bold" fill="#0d2931">Trà &amp; Nến</text>
          <rect x="426" y="140" width="90" height="72" rx="8" fill="#f4ebd0" stroke="#ae9984"/>
          <text x="471" y="180" text-anchor="middle" font-family="sans-serif" font-size="9.5" font-weight="bold" fill="#691727">Lộc / Hạt</text>
          <rect x="324" y="222" width="192" height="44" rx="8" fill="#691727"/>
          <text x="420" y="248" text-anchor="middle" font-family="sans-serif" font-size="9.5" font-weight="bold" fill="#f0b45b">Nhang Trầm &amp; Nụ Trầm</text>
          <rect x="324" y="276" width="192" height="44" rx="8" fill="#efe9e0" stroke="#ae9984"/>
          <text x="420" y="302" text-anchor="middle" font-family="sans-serif" font-size="9.5" font-weight="bold" fill="#0d2931">Thiệp Văn Khấn Dịp 2</text>

          <!-- Bottom Gift Tray -->
          <rect x="68" y="348" width="464" height="52" rx="10" fill="#fdf3e1" stroke="#f0b45b" stroke-width="2"/>
          <text x="300" y="379" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#691727">NGĂN QUÀ TẶNG: Túi Thảo Mộc Mùi Già Tất Niên &amp; Sổ Tay Cẩm Nang Nếp Lễ</text>
        </svg>
      `);
    }

    // Triple Combo Interior Open Box
    return `data:image/svg+xml;utf8,` + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 460" width="100%" height="100%">
        <rect width="600" height="460" rx="24" fill="#f4efe6"/>
        <!-- Open Luxury Box Frame -->
        <rect x="36" y="34" width="528" height="392" rx="20" fill="#0d2931" stroke="#f0b45b" stroke-width="3.5"/>
        <text x="300" y="64" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#f0b45b">BÊN TRONG HỘP ĐẶC BIỆT 3 NGĂN • ${title.toUpperCase()}</text>

        <!-- Tray 1: Tiễn Táo -->
        <rect x="54" y="80" width="154" height="248" rx="12" fill="#faf7f2" stroke="#f0b45b" stroke-width="1.5"/>
        <rect x="66" y="92" width="130" height="26" rx="6" fill="#0d2931"/>
        <text x="131" y="109" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="bold" fill="#f0b45b">KHAY 1 • TIỄN TÁO</text>
        <rect x="66" y="128" width="130" height="42" rx="6" fill="#f4ebd0"/>
        <text x="131" y="153" text-anchor="middle" font-family="sans-serif" font-size="9.5" font-weight="bold" fill="#0d2931">Trà Sen Cổ Thụ</text>
        <rect x="66" y="178" width="130" height="42" rx="6" fill="#f4ebd0"/>
        <text x="131" y="203" text-anchor="middle" font-family="sans-serif" font-size="9.5" font-weight="bold" fill="#691727">Kẹo Lạc &amp; Mứt Gừng</text>
        <rect x="66" y="228" width="130" height="40" rx="6" fill="#163d48"/>
        <text x="131" y="252" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="bold" fill="#f0b45b">Nhang • Nến • Sớ Táo</text>
        <rect x="66" y="276" width="130" height="38" rx="6" fill="#efe9e0"/>
        <text x="131" y="299" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="bold" fill="#0d2931">Văn Khấn 23 Chạp</text>

        <!-- Tray 2: Giao Thừa -->
        <rect x="223" y="80" width="154" height="248" rx="12" fill="#faf7f2" stroke="#f0b45b" stroke-width="2"/>
        <rect x="235" y="92" width="130" height="26" rx="6" fill="#691727"/>
        <text x="300" y="109" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="bold" fill="#f0b45b">KHAY 2 • GIAO THỪA</text>
        <rect x="235" y="128" width="130" height="42" rx="6" fill="#f4ebd0"/>
        <text x="300" y="153" text-anchor="middle" font-family="sans-serif" font-size="9.5" font-weight="bold" fill="#0d2931">Trà Hoa Bưởi</text>
        <rect x="235" y="178" width="130" height="42" rx="6" fill="#f4ebd0"/>
        <text x="300" y="203" text-anchor="middle" font-family="sans-serif" font-size="9.5" font-weight="bold" fill="#691727">Hũ Gạo &amp; Muối Lộc</text>
        <rect x="235" y="228" width="130" height="40" rx="6" fill="#691727"/>
        <text x="300" y="252" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="bold" fill="#f0b45b">Nến Sen &amp; 5 Nụ Trầm</text>
        <rect x="235" y="276" width="130" height="38" rx="6" fill="#efe9e0"/>
        <text x="300" y="299" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="bold" fill="#0d2931">2 Văn Khấn Đêm 30</text>

        <!-- Tray 3: Khai Xuân -->
        <rect x="392" y="80" width="154" height="248" rx="12" fill="#faf7f2" stroke="#f0b45b" stroke-width="1.5"/>
        <rect x="404" y="92" width="130" height="26" rx="6" fill="#72826f"/>
        <text x="469" y="109" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="bold" fill="#faf7f2">KHAY 3 • KHAI XUÂN</text>
        <rect x="404" y="128" width="130" height="42" rx="6" fill="#f4ebd0"/>
        <text x="469" y="153" text-anchor="middle" font-family="sans-serif" font-size="9.5" font-weight="bold" fill="#0d2931">Trà Shan Tuyết</text>
        <rect x="404" y="178" width="130" height="42" rx="6" fill="#f4ebd0"/>
        <text x="469" y="203" text-anchor="middle" font-family="sans-serif" font-size="9.5" font-weight="bold" fill="#691727">Hạt Sen &amp; Táo Đỏ</text>
        <rect x="404" y="228" width="130" height="40" rx="6" fill="#163d48"/>
        <text x="469" y="252" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="bold" fill="#f0b45b">Nhang Trầm &amp; Nến Bơ</text>
        <rect x="404" y="276" width="130" height="38" rx="6" fill="#efe9e0"/>
        <text x="469" y="299" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="bold" fill="#0d2931">Văn Khấn Mùng 1</text>

        <!-- Bottom Royal Gift Tray -->
        <rect x="54" y="340" width="492" height="66" rx="12" fill="#fdf3e1" stroke="#f0b45b" stroke-width="2"/>
        <text x="300" y="366" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#691727">KHAY QUÀ TẶNG ĐẶC BIỆT TRONG HỘP TRỌN TẾT:</text>
        <text x="300" y="388" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="bold" fill="#0d2931">Lư Gốm Mộc Bát Tràng • Túi Mùi Già Tất Niên • 10 Bao Lì Xì Giấy Dó</text>
      </svg>
    `);
  },

  getMatchedProductByRituals(rituals) {
    const hasTienTao = rituals.includes('tien-tao');
    const hasGiaoThua = rituals.includes('giao-thua');
    const hasKhaiXuan = rituals.includes('khai-xuan');

    let matchedId = 'combo-tron-tet';
    if (hasTienTao && hasGiaoThua && hasKhaiXuan) {
      matchedId = 'combo-tron-tet';
    } else if (hasTienTao && hasGiaoThua) {
      matchedId = 'combo-ven-nep';
    } else if (hasGiaoThua && hasKhaiXuan) {
      matchedId = 'combo-song-xuan';
    } else if (hasTienTao && hasKhaiXuan) {
      matchedId = 'combo-mo-tet';
    } else if (hasTienTao) {
      matchedId = 'pack-tien-tao';
    } else if (hasGiaoThua) {
      matchedId = 'pack-giao-thua';
    } else if (hasKhaiXuan) {
      matchedId = 'pack-khai-xuan';
    }
    return this.state.products.find(p => p.id === matchedId) || this.state.products[0];
  },

  renderInteractiveSkuStudio() {
    const leftMount = document.getElementById('sku-selector-left-mount');
    const rightMount = document.getElementById('live-pack-stage-mount');
    if (!leftMount || !rightMount) return;

    const rituals = this.state.selectedRituals;
    const matched = this.state.products.find(p => p.id === this.state.activeSkuId) || this.getMatchedProductByRituals(rituals);
    const savings = Math.max(0, (matched.originalPrice || matched.price) - matched.price);

    // Render Left Selector Panel (Redistributed layout for Ritual Selection without Cách 2)
    const ritualOptions = [
      {
        key: 'tien-tao',
        title: 'Gói Tiễn Táo',
        sub: '23 Tháng Chạp',
        desc: 'Bộ lễ Táo Quân • Nhang • Nến • Giấy tiền vàng mã'
      },
      {
        key: 'giao-thua',
        title: 'Gói Giao Thừa',
        sub: 'Đêm 30 Tết',
        desc: 'Lễ vật giao thừa • Nhang • Nến • Gạo muối'
      },
      {
        key: 'khai-xuan',
        title: 'Gói Khai Xuân',
        sub: 'Mùng 1 Tết',
        desc: 'Lễ vật khai xuân • Hương hoa • Lễ phẩm đầu năm'
      }
    ];

    leftMount.innerHTML = `
      <div class="p-5 sm:p-6 rounded-3xl bg-[#f4efe6] border-2 border-[#ae9984] shadow-lg space-y-5">
        <div class="pb-3 border-b border-[#ae9984]/40">
          <span class="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#0d2931] block">
            Chọn gói lễ hoặc Tự tay phối set theo nhu cầu của bạn
          </span>
          <span class="text-xs text-[#0d2931]/70">Bạn có thể chọn từng gói hoặc kết hợp thành Combo</span>
        </div>

        <div class="space-y-3">
          ${ritualOptions
            .map(r => {
              const active = rituals.includes(r.key);
              return `
              <button type="button" onclick="NepleApp.toggleRitual('${r.key}')"
                class="ritual-chip w-full p-4 rounded-2xl border-2 text-left transition flex items-start justify-between gap-3 ${
                  active ? 'active' : 'bg-[#fffdf9] border-[#ae9984]/60 text-[#0d2931] hover:border-[#0d2931]'
                }">
                <div class="space-y-1 min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <span style="font-family: 'Be Vietnam Pro', sans-serif; font-weight: 700;" class="text-base sm:text-lg font-bold leading-tight uppercase">
                      ${r.title}
                    </span>
                  </div>
                  <div style="font-family: 'Be Vietnam Pro', sans-serif; font-weight: 400;" class="text-xs sm:text-sm font-normal ${
                    active ? 'text-[#faf7f2]/85' : 'text-[#0d2931]/75'
                  }">
                    ${r.desc}
                  </div>
                </div>
                <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5 ${
                  active ? 'bg-[#f0b45b] text-[#0d2931]' : 'border-2 border-[#ae9984] text-transparent'
                }">✓</span>
              </button>
            `;
            })
            .join('')}
        </div>

        <!-- Quick Select All / Summary Card -->
        <div class="p-4 rounded-2xl bg-[#fffdf9] border border-[#ae9984]/60 space-y-3">
          <div class="flex items-center justify-between gap-2">
            <div>
              <span class="text-[11px] font-bold uppercase tracking-wider text-[#72826f] block">Gói lễ bạn đang chọn</span>
              <span style="font-family: 'Be Vietnam Pro', sans-serif; font-weight: 700;" class="text-base sm:text-lg font-bold text-[#0d2931]">
                ${matched.name}
              </span>
            </div>
            <div class="text-right">
              <div class="text-base sm:text-lg font-extrabold text-[#a94025]">${this.formatVND(matched.price)}</div>
              ${
                savings > 0
                  ? `<div class="text-[11px] font-bold text-[#691727]">Tiết kiệm ${this.formatVND(savings)} (-${matched.discountPercent}%)</div>`
                  : `<div class="text-[11px] text-[#72826f]">Hộp đơn 1 ngăn</div>`
              }
            </div>
          </div>

          ${
            rituals.length < 3
              ? `
            <button type="button" onclick="NepleApp.setRitualsPreset(['tien-tao', 'giao-thua', 'khai-xuan'])"
              class="w-full py-2.5 px-4 rounded-xl bg-[#691727] hover:bg-[#4d0f1b] text-[#f0b45b] text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm">
              <span>Chọn đủ 3 dịp lễ (Combo Trọn Tết • 219.000đ)</span>
            </button>
          `
              : `
            <div class="py-2 px-3 rounded-xl bg-[#f0b45b]/25 border border-[#f0b45b] text-xs font-bold text-[#0d2931] text-center">
              Full combo: Tiết kiệm ${matched.discountPercent}%
            </div>
          `
          }
        </div>
      </div>
    `;

    // Define the 3 Ritual Compartments for the Live Interactive Blueprint on the Right
    const interiorImgSrc = matched.interiorImage || this.getInteriorPreviewSVG(matched);
    const activeGalleryView = this.state.stageTab === 'interior' ? 'interior' : 'exterior';

    // Upsell suggestion banner inside Right Stage
    let upsellBannerHTML = '';
    if (matched.upsellHint) {
      const addKey = matched.upsellHint.addRitual;
      upsellBannerHTML = `
        <div class="p-3.5 rounded-2xl bg-[#691727]/10 border border-[#691727]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p class="text-xs sm:text-sm text-[#691727] font-semibold leading-snug">
            ${matched.upsellHint.message}
          </p>
          <button onclick="NepleApp.toggleRitual('${addKey}')" 
            class="shrink-0 px-3.5 py-2 rounded-xl bg-[#691727] text-[#f0b45b] hover:bg-[#4d0f1b] text-xs font-bold transition shadow-sm">
            + Nâng cấp hộp ngay
          </button>
        </div>
      `;
    } else {
      upsellBannerHTML = `
        <div class="p-3.5 rounded-2xl bg-[#f0b45b]/25 border border-[#f0b45b]">
          <p class="text-xs sm:text-sm text-[#0d2931] font-semibold">
            Bạn đang chọn <strong>Hộp Quà Lớn Combo Trọn Tết (Đủ 3 Ngăn Lễ)</strong> — Tiết kiệm cao nhất <strong>${this.formatVND(savings)} (-${matched.discountPercent}%)</strong> + Tặng kèm <strong>Lư Gốm Mộc Bát Tràng</strong>!
          </p>
        </div>
      `;
    }

    // Render Right Live Pack Visualizer Stage
    rightMount.innerHTML = `
      <div class="stage-animate rounded-3xl bg-[#fffdf9] border-2 ${
        matched.tier === 'triple' ? 'border-[#f0b45b] gold-glow-card' : 'border-[#ae9984] shadow-xl'
      } overflow-hidden">
        <!-- Top Dark Header Bar of Live Stage -->
        <div class="p-5 sm:p-6 ${
          matched.tier === 'triple'
            ? 'bg-gradient-to-r from-[#0d2931] via-[#163d48] to-[#691727]'
            : matched.tier === 'double'
            ? 'bg-[#0d2931]'
            : 'bg-[#163d48]'
        } text-[#faf7f2]">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <span class="text-[#f4ebd0] text-xs font-extrabold uppercase tracking-wide">
              ${matched.tierLabel}
            </span>
            ${
              savings > 0
                ? `<span class="px-3 py-1 rounded-full bg-[#691727] border border-[#f0b45b] text-[#f0b45b] text-xs font-extrabold">
                     Tiết kiệm ${this.formatVND(savings)} (-${matched.discountPercent}%)
                   </span>`
                : ''
            }
          </div>

          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-1">
            <div>
              <h3 style="font-family: 'Be Vietnam Pro', sans-serif !important; font-weight: 700 !important;" class="text-2xl sm:text-3xl font-bold text-[#faf7f2]">${matched.name}</h3>
              <p class="text-xs sm:text-sm text-[#f0b45b] font-medium mt-0.5">${matched.subtitle}</p>
            </div>
            <div class="sm:text-right">
              <div class="text-2xl sm:text-3xl font-extrabold text-[#f0b45b]">${this.formatVND(matched.price)}</div>
              ${
                savings > 0
                  ? `<div class="text-xs text-white/60 line-through">Giá mua lẻ: ${this.formatVND(matched.originalPrice)}</div>`
                  : ''
              }
            </div>
          </div>
        </div>

        <!-- Stage Body: Visual Exterior & Interior Set Preview -->
        <div class="p-5 sm:p-6 space-y-4">
          <div class="flex items-center justify-start">
            <div class="flex rounded-xl bg-[#efe9e0] p-1 text-xs font-bold">
              <button onclick="NepleApp.setStageTab('exterior')"
                class="px-4 py-2 rounded-lg transition ${
                  activeGalleryView === 'exterior' ? 'bg-[#0d2931] text-[#f0b45b] shadow' : 'text-[#0d2931]'
                }">
                Bên ngoài hộp
              </button>
              <button onclick="NepleApp.setStageTab('interior')"
                class="px-4 py-2 rounded-lg transition ${
                  activeGalleryView === 'interior' ? 'bg-[#0d2931] text-[#f0b45b] shadow' : 'text-[#0d2931]'
                }">
                Bên trong set lễ
              </button>
            </div>
          </div>

          <!-- Exterior / Interior Single Active Showcase -->
          <div class="p-4 rounded-2xl bg-[#f4efe6] border-2 ${
            matched.tier === 'triple' ? 'border-[#f0b45b]' : 'border-[#ae9984]'
          } space-y-3.5">
            ${
              activeGalleryView === 'exterior'
                ? `
              <div class="rounded-2xl bg-[#fffdf9] border border-[#ae9984]/60 p-4">
                <div class="aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#faf7f2] flex items-center justify-center">
                  <img src="${matched.image}" alt="${matched.name} - Bên ngoài" class="w-full h-full object-contain" />
                </div>
              </div>

              <!-- Packaging Features Only (Exterior Tab) -->
              <div class="p-4 rounded-2xl bg-[#faf7f2] border border-[#ae9984]/50 space-y-2.5">
                <div class="text-xs font-extrabold uppercase tracking-wider text-[#0d2931]">
                  Đặc điểm thiết kế &amp; quy cách bao bì:
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#0d2931]">
                  <div class="bg-white p-2.5 rounded-xl border border-[#ae9984]/30 sm:col-span-2">
                    <strong>Quy cách vỏ hộp:</strong> ${matched.packagingSpec}
                  </div>
                  <div class="bg-white p-2.5 rounded-xl border border-[#ae9984]/30">
                    Giấy mỹ thuật bồi cứng cáp, chống ẩm &amp; giữ form sang trọng
                  </div>
                  <div class="bg-white p-2.5 rounded-xl border border-[#ae9984]/30">
                    Đóng gói chống sốc kỹ lưỡng, chỉn chu để dâng lễ hoặc biếu tặng
                  </div>
                </div>
              </div>
            `
                : `
              <div class="rounded-2xl bg-[#fffdf9] border border-[#ae9984]/60 p-4">
                <div class="aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#faf7f2] flex items-center justify-center">
                  <img src="${interiorImgSrc}" alt="${matched.name} - Bên trong set" class="w-full h-full object-contain" />
                </div>
              </div>

              <!-- Detailed Checklist Inside Selected SKU (Only visible in Interior Tab) -->
              <div class="p-4 rounded-2xl bg-[#faf7f2] border border-[#ae9984]/50">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="text-xs font-extrabold uppercase tracking-wider text-[#0d2931]">
                    Danh mục vật phẩm đóng gói trong ${matched.name}:
                  </h4>
                  <span class="text-xs font-semibold text-[#72826f]">Đồ lễ khô bảo quản 6 tháng</span>
                </div>
                <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  ${matched.items
                    .map(
                      item => `
                    <li class="text-xs text-[#0d2931] bg-white p-2.5 rounded-xl border border-[#ae9984]/30 leading-snug">
                      ${item}
                    </li>`
                    )
                    .join('')}
                </ul>
              </div>

              <!-- Dynamic Bonus Gift & Publication Tray (Only visible in Interior Tab) -->
              <div class="p-3.5 rounded-xl bg-[#fdf3e1] border border-[#f0b45b] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span class="text-[11px] font-extrabold uppercase tracking-wider text-[#691727] block">
                    Ấn Phẩm &amp; Quà Tặng Đi Kèm Trong Set:
                  </span>
                  <div class="text-xs sm:text-sm text-[#0d2931] font-semibold mt-0.5">
                    ${(matched.gifts || []).join(' • ')}
                  </div>
                </div>
                <button onclick="NepleApp.openProductModal('${matched.id}')" class="shrink-0 text-xs font-bold text-[#a94025] underline hover:text-[#691727]">
                  Xem đầy đủ định lượng →
                </button>
              </div>
            `
            }
          </div>

          <!-- Smart Upsell Banner -->
          ${upsellBannerHTML}

          <!-- Primary CTA Bar -->
          <div class="pt-1 flex flex-col sm:flex-row gap-3">
            <button onclick="NepleApp.buyNow('${matched.id}')" 
              class="flex-1 py-4 px-6 rounded-2xl btn-terracotta font-bold text-sm sm:text-base flex items-center justify-center gap-2">
              <span>Đặt Mua ${matched.name} — ${this.formatVND(matched.price)}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
            <button onclick="NepleApp.addToCart('${matched.id}')" 
              class="py-4 px-5 rounded-2xl bg-[#0d2931] hover:bg-[#163d48] text-[#faf7f2] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition">
              <span>+ Thêm Vào Giỏ Lễ</span>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // ========================================================================
  // 3.2. VISUAL COMPARISON MATRIX (Clean Interactive Table Without Redundant Images)
  // ========================================================================
  renderComparisonMatrix() {
    const container = document.getElementById('comparison-matrix-mount');
    if (!container) return;

    const currentProduct = this.state.products.find(p => p.id === this.state.activeSkuId) || this.state.products[6];
    const activeTier = currentProduct.tier;

    container.innerHTML = `
      <div class="overflow-x-auto rounded-3xl border-2 border-[#ae9984] bg-[#fffdf9] shadow-xl">
        <table class="w-full text-left border-collapse min-w-[720px]">
          <thead>
            <tr class="border-b-2 border-[#ae9984]/50">
              <th class="p-5 w-1/4 bg-[#f4efe6] text-[#0d2931]">
                <span class="text-xs font-extrabold uppercase tracking-wider text-[#72826f] block">Tiêu chí đối chiếu</span>
                <span class="font-display text-xl font-bold mt-1 block">3 Cấp Độ Hộp Nếp Lễ</span>
              </th>
              ${COMPARISON_TIERS.map(tier => {
                const isSelectedTier = tier.tier === activeTier;
                return `
                  <th onclick='NepleApp.setRitualsPreset(${JSON.stringify(tier.ctaRituals)})'
                      class="p-5 w-1/4 cursor-pointer transition ${
                        tier.featured
                          ? 'bg-[#0d2931] text-[#faf7f2]'
                          : isSelectedTier
                          ? 'bg-[#efe9e0] text-[#0d2931]'
                          : 'bg-[#fffdf9] text-[#0d2931] hover:bg-[#f4efe6]'
                      }">
                    <div class="flex items-center justify-between gap-2 mb-1.5">
                      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        tier.featured ? 'bg-[#f0b45b] text-[#0d2931]' : 'bg-[#691727]/15 text-[#691727]'
                      }">${tier.badge}</span>
                      ${isSelectedTier ? `<span class="text-xs font-bold text-[#a94025]">● Đang xem</span>` : ''}
                    </div>
                    <div class="font-display text-lg sm:text-xl font-bold ${tier.featured ? 'text-[#f0b45b]' : 'text-[#0d2931]'}">${tier.title}</div>
                    <div class="text-xs font-normal ${tier.featured ? 'text-[#faf7f2]/80' : 'text-[#691727]'} mt-0.5">${tier.subtitle}</div>
                  </th>
                `;
              }).join('')}
            </tr>
          </thead>
          <tbody class="divide-y divide-[#ae9984]/30 text-xs sm:text-sm">
            <tr>
              <td class="p-4 font-bold bg-[#f4efe6]/60 text-[#0d2931]">Quy cách vỏ hộp</td>
              ${COMPARISON_TIERS.map(t => `<td class="p-4 ${t.featured ? 'bg-[#0d2931]/5 font-medium' : ''}">${t.packaging}</td>`).join('')}
            </tr>
            <tr>
              <td class="p-4 font-bold bg-[#f4efe6]/60 text-[#0d2931]">Vật phẩm lễ khô</td>
              ${COMPARISON_TIERS.map(t => `<td class="p-4 ${t.featured ? 'bg-[#0d2931]/5 font-medium' : ''}">${t.components}</td>`).join('')}
            </tr>
            <tr>
              <td class="p-4 font-bold bg-[#f4efe6]/60 text-[#0d2931]">Ấn phẩm Văn khấn &amp; Cẩm nang</td>
              ${COMPARISON_TIERS.map(t => `<td class="p-4 ${t.featured ? 'bg-[#0d2931]/5 font-medium' : ''}">${t.publications}</td>`).join('')}
            </tr>
            <tr>
              <td class="p-4 font-bold bg-[#f4efe6]/60 text-[#0d2931]">Quà tặng &amp; Ưu đãi</td>
              ${COMPARISON_TIERS.map(t => `<td class="p-4 font-semibold text-[#691727] ${t.featured ? 'bg-[#fdf3e1]' : ''}">${t.exclusiveGifts}</td>`).join('')}
            </tr>
            <tr>
              <td class="p-4 font-bold bg-[#f4efe6]/60 text-[#0d2931]">Gia đình phù hợp</td>
              ${COMPARISON_TIERS.map(t => `<td class="p-4 ${t.featured ? 'bg-[#0d2931]/5' : ''}">${t.bestFor}</td>`).join('')}
            </tr>
            <tr>
              <td class="p-4 font-bold bg-[#f4efe6]/60 text-[#0d2931]">Mức giá</td>
              ${COMPARISON_TIERS.map(t => `
                <td class="p-4 ${t.featured ? 'bg-[#0d2931]/5' : ''}">
                  <div class="text-base font-extrabold text-[#a94025]">${t.priceRange}</div>
                </td>
              `).join('')}
            </tr>
          </tbody>
        </table>
        <div class="p-5 bg-[#f4efe6]/50 border-t border-[#ae9984]/40 flex justify-center">
          <button onclick="document.getElementById('combo-selector').scrollIntoView({behavior:'smooth'})"
            class="py-3.5 px-12 rounded-2xl btn-terracotta text-white font-bold text-sm sm:text-base transition shadow-md">
            Mua ngay
          </button>
        </div>
      </div>
    `;
  },

  openProductModal(productId) {
    const product = this.state.products.find(p => p.id === productId);
    if (!product) return;
    const savings = Math.max(0, (product.originalPrice || product.price) - product.price);
    const modal = document.getElementById('product-detail-modal');
    const content = document.getElementById('product-detail-modal-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div class="md:col-span-5">
          <div class="rounded-2xl overflow-hidden bg-[#f4efe6] border border-[#ae9984] p-3">
            <img src="${product.image}" alt="${product.name}" class="w-full aspect-[4/3] object-contain" />
          </div>
          <div class="mt-3 p-3.5 rounded-xl bg-[#faf7f2] border border-[#ae9984]/50 text-xs space-y-1.5">
            <div><strong class="text-[#0d2931]">Mã SKU:</strong> ${product.sku}</div>
            <div><strong class="text-[#0d2931]">Quy cách hộp:</strong> ${product.packagingSpec}</div>
            <div><strong class="text-[#0d2931]">Phù hợp với:</strong> ${product.suitableFor}</div>
          </div>
        </div>

        <div class="md:col-span-7 flex flex-col justify-between">
          <div>
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <span class="px-3 py-1 rounded-full bg-[#0d2931] text-[#f0b45b] text-xs font-bold">${product.tierLabel}</span>
              ${
                savings > 0
                  ? `<span class="px-3 py-1 rounded-full bg-[#f0b45b] text-[#0d2931] text-xs font-extrabold">Tiết kiệm ${this.formatVND(savings)} (-${product.discountPercent}%)</span>`
                  : ''
              }
            </div>
            <h3 class="font-display text-2xl sm:text-3xl font-bold text-[#0d2931]">${product.name}</h3>
            <p class="text-sm font-semibold text-[#691727] mt-1">${product.subtitle}</p>
            <p class="text-sm text-[#0d2931]/80 mt-2 leading-relaxed">${product.shortDesc}</p>

            <div class="mt-4 flex items-baseline gap-3">
              <span class="text-2xl sm:text-3xl font-extrabold text-[#a94025]">${this.formatVND(product.price)}</span>
              ${
                savings > 0
                  ? `<span class="text-sm text-[#0d2931]/50 line-through">${this.formatVND(product.originalPrice)}</span>`
                  : ''
              }
            </div>

            <div class="mt-4">
              <h4 class="text-xs font-bold uppercase tracking-wider text-[#72826f] mb-2">Danh sách chi tiết vật phẩm bên trong hộp lễ:</h4>
              <ul class="space-y-2 bg-[#faf7f2] p-4 rounded-xl border border-[#ae9984]/40">
                ${product.items
                  .map(
                    it => `
                  <li class="flex items-start gap-2 text-xs sm:text-sm text-[#0d2931]">
                    <span class="text-[#72826f] font-bold">✓</span>
                    <span>${it}</span>
                  </li>
                `
                  )
                  .join('')}
              </ul>
            </div>

            <div class="mt-3 p-3.5 rounded-xl bg-[#fdf3e1] border border-[#f0b45b]">
              <div class="text-xs font-bold text-[#691727] uppercase mb-1">Quà tặng &amp; Ấn phẩm đi kèm:</div>
              ${(product.gifts || []).map(g => `<div class="text-xs sm:text-sm text-[#0d2931] font-medium">${g}</div>`).join('')}
            </div>
          </div>

          <div class="mt-6 flex flex-col sm:flex-row gap-3">
            <button onclick="NepleApp.closeProductModal(); NepleApp.buyNow('${product.id}');"
              class="flex-1 py-3.5 px-5 rounded-xl btn-terracotta font-bold text-sm">
              Đặt Mua Ngay — ${this.formatVND(product.price)}
            </button>
            <button onclick="NepleApp.addToCart('${product.id}'); NepleApp.closeProductModal();"
              class="py-3.5 px-5 rounded-xl bg-[#0d2931] text-white font-semibold text-sm hover:bg-[#163d48] transition">
              + Thêm Vào Giỏ Hàng
            </button>
          </div>
        </div>
      </div>
    `;
    modal.classList.remove('hidden');
  },

  closeProductModal() {
    const modal = document.getElementById('product-detail-modal');
    if (modal) modal.classList.add('hidden');
  },

  // ========================================================================
  // 3.3. SMART SEARCH BAR & GENZ CULTURAL BLOG ("CẨM NANG NẾP LỄ")
  // ========================================================================
  handleSmartSearch(query, resultContainerId) {
    const container = document.getElementById(resultContainerId);
    if (!container) return;

    const cleanQ = this.normalizeVN(query);
    if (!cleanQ) {
      container.classList.add('hidden');
      return;
    }

    const matchedProducts = this.state.products.filter(p => {
      const haystack = this.normalizeVN(
        `${p.name} ${p.subtitle} ${p.shortDesc} ${(p.items || []).join(' ')} ${(p.ritualNames || []).join(' ')}`
      );
      return haystack.includes(cleanQ);
    });

    const matchedBlogs = this.state.blogs.filter(b => {
      const haystack = this.normalizeVN(
        `${b.title} ${b.category} ${b.excerpt} ${(b.tags || []).join(' ')} ${b.seo?.keywords || ''} ${b.prayerText || ''}`
      );
      return haystack.includes(cleanQ);
    });

    container.classList.remove('hidden');
    container.innerHTML = `
      <div class="p-3 sm:p-4 max-h-[70vh] overflow-y-auto space-y-4">
        <div>
          <div class="text-[11px] font-bold uppercase tracking-wider text-[#72826f] mb-2">
            📦 Gói Lễ &amp; Combo Phù Hợp (${matchedProducts.length})
          </div>
          ${
            matchedProducts.length === 0
              ? `<div class="text-xs text-[#0d2931]/60 italic py-1">Không tìm thấy gói lễ khớp từ khóa "${query}".</div>`
              : `<div class="space-y-2">
                  ${matchedProducts
                    .slice(0, 4)
                    .map(
                      p => `
                    <div onclick="NepleApp.switchView('home'); NepleApp.selectSkuDirectly('${p.id}', true); document.getElementById('${resultContainerId}').classList.add('hidden');"
                         class="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#faf7f2] hover:bg-[#efe9e0] border border-[#ae9984]/40 cursor-pointer transition">
                      <div class="min-w-0">
                        <div class="text-xs sm:text-sm font-bold text-[#0d2931] truncate">${p.name} <span class="text-[10px] font-normal text-[#72826f]">(${p.tierLabel})</span></div>
                        <div class="text-[11px] text-[#691727] truncate">${p.subtitle}</div>
                      </div>
                      <div class="text-xs font-extrabold text-[#a94025] shrink-0">${this.formatVND(p.price)}</div>
                    </div>
                  `
                    )
                    .join('')}
                </div>`
          }
        </div>

        <div class="pt-2 border-t border-[#ae9984]/30">
          <div class="text-[11px] font-bold uppercase tracking-wider text-[#691727] mb-2">
            📖 Bài Viết Cẩm Nang &amp; Văn Khấn (${matchedBlogs.length})
          </div>
          ${
            matchedBlogs.length === 0
              ? `<div class="text-xs text-[#0d2931]/60 italic py-1">Không tìm thấy bài cẩm nang khớp từ khóa "${query}".</div>`
              : `<div class="space-y-2">
                  ${matchedBlogs
                    .map(
                      b => `
                    <div onclick="NepleApp.switchView('cam-nang'); NepleApp.openBlogArticle('${b.id}'); document.getElementById('${resultContainerId}').classList.add('hidden');"
                         class="p-2.5 rounded-xl bg-[#faf7f2] hover:bg-[#efe9e0] border border-[#ae9984]/40 cursor-pointer transition">
                      <span class="inline-block px-2 py-0.5 rounded bg-[#72826f] text-white text-[10px] font-semibold mb-1">${b.category}</span>
                      <div class="text-xs sm:text-sm font-bold text-[#0d2931] line-clamp-1">${b.title}</div>
                      <div class="text-[11px] text-[#0d2931]/70 line-clamp-1 mt-0.5">${b.excerpt}</div>
                    </div>
                  `
                    )
                    .join('')}
                </div>`
          }
        </div>
      </div>
    `;
  },

  renderHomeBlogPreview() {
    const container = document.getElementById('home-blog-preview-mount');
    if (!container) return;

    container.innerHTML = this.state.blogs
      .slice(0, 3)
      .map(blog => this.renderBlogCardHTML(blog))
      .join('');
  },

  renderBlogCardHTML(blog) {
    const relatedProduct = this.state.products.find(p => p.id === blog.relatedProductId);
    return `
      <article class="paper-card rounded-2xl overflow-hidden flex flex-col justify-between p-5">
        <div>
          <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span class="px-3 py-1 rounded-full bg-[#72826f] text-white text-[11px] font-semibold">
              ${blog.category}
            </span>
            <div class="flex items-center gap-1.5 text-[11px] text-[#0d2931]/60">
              <span>⏱ ${blog.readTime}</span>
              ${blog.prayerText ? `<span class="px-2 py-0.5 rounded bg-[#f0b45b]/40 text-[#0d2931] font-bold">Có Văn Khấn</span>` : ''}
            </div>
          </div>

          <h3 class="font-display text-lg sm:text-xl font-bold text-[#0d2931] hover:text-[#691727] cursor-pointer leading-snug"
              onclick="NepleApp.switchView('cam-nang'); NepleApp.openBlogArticle('${blog.id}')">
            ${blog.title}
          </h3>
          <p class="text-xs sm:text-sm text-[#0d2931]/75 mt-2.5 line-clamp-3 leading-relaxed">
            ${blog.excerpt}
          </p>
        </div>

        <div class="pt-4 mt-4 border-t border-[#ae9984]/30">
          ${
            relatedProduct
              ? `<div class="mb-3 p-2.5 rounded-xl bg-[#f4efe6] border border-[#ae9984]/50 flex items-center justify-between gap-2">
                   <div class="min-w-0">
                     <span class="text-[10px] uppercase tracking-wider text-[#72826f] font-bold block">Gói lễ gắn kèm bài viết:</span>
                     <span class="text-xs font-bold text-[#0d2931] truncate block">${relatedProduct.name} — ${this.formatVND(relatedProduct.price)}</span>
                   </div>
                   <button onclick="NepleApp.switchView('home'); NepleApp.selectSkuDirectly('${relatedProduct.id}', true);" class="px-2.5 py-1.5 rounded-lg bg-[#0d2931] text-[#f0b45b] hover:bg-[#691727] text-[11px] font-bold shrink-0 transition">
                     Xem hộp lễ
                   </button>
                 </div>`
              : ''
          }
          <button onclick="NepleApp.switchView('cam-nang'); NepleApp.openBlogArticle('${blog.id}')"
                  class="text-xs font-bold text-[#a94025] hover:text-[#691727] inline-flex items-center gap-1">
            <span>Đọc hướng dẫn &amp; bài văn khấn</span>
            <span>→</span>
          </button>
        </div>
      </article>
    `;
  },

  setBlogCategory(cat) {
    this.state.blogCategory = cat;
    this.state.activeBlogId = null;
    this.renderBlogPage();
  },

  renderBlogPage() {
    const listContainer = document.getElementById('blog-list-mount');
    const readerContainer = document.getElementById('blog-reader-mount');
    if (!listContainer || !readerContainer) return;

    const categories = ['Tất cả', 'Ý Nghĩa Lễ Tết', 'Hướng Dẫn Bày Lễ Tối Giản', 'Văn Khấn Hiện Đại', 'Chuyện Nếp Nhà'];
    const catMount = document.getElementById('blog-category-pills');
    if (catMount) {
      catMount.innerHTML = categories
        .map(cat => {
          const active = this.state.blogCategory === cat;
          return `
          <button onclick="NepleApp.setBlogCategory('${cat}')"
            class="${
              active
                ? 'px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-[#72826f] text-white shadow-sm'
                : 'px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-[#efe9e0] text-[#0d2931] hover:bg-[#72826f]/20'
            } transition">
            ${cat}
          </button>
        `;
        })
        .join('');
    }

    const filteredBlogs = this.state.blogs.filter(b =>
      this.state.blogCategory === 'Tất cả' ? true : b.category === this.state.blogCategory
    );

    listContainer.innerHTML = filteredBlogs.map(b => this.renderBlogCardHTML(b)).join('');

    if (this.state.activeBlogId) {
      this.renderActiveBlogArticle();
    } else {
      readerContainer.classList.add('hidden');
    }
  },

  openBlogArticle(blogId) {
    this.state.activeBlogId = blogId;
    this.renderActiveBlogArticle();
    const reader = document.getElementById('blog-reader-mount');
    if (reader) {
      reader.classList.remove('hidden');
      setTimeout(() => reader.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  },

  closeBlogArticle() {
    this.state.activeBlogId = null;
    const reader = document.getElementById('blog-reader-mount');
    if (reader) reader.classList.add('hidden');
  },

  togglePrayerFontSize() {
    this.state.prayerFontSize = this.state.prayerFontSize === 'normal' ? 'large' : 'normal';
    this.renderActiveBlogArticle();
  },

  copyPrayerText(blogId) {
    const blog = this.state.blogs.find(b => b.id === blogId);
    if (!blog || !blog.prayerText) return;
    navigator.clipboard?.writeText(blog.prayerText);
    this.showToast('Đã sao chép toàn bộ bài Văn Khấn vào bộ nhớ tạm!');
  },

  renderActiveBlogArticle() {
    const readerContainer = document.getElementById('blog-reader-mount');
    if (!readerContainer) return;

    const blog = this.state.blogs.find(b => b.id === this.state.activeBlogId);
    if (!blog) {
      readerContainer.classList.add('hidden');
      return;
    }

    const relatedProduct = this.state.products.find(p => p.id === blog.relatedProductId) || this.state.products[6];
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: blog.seo?.metaTitle || blog.title,
      description: blog.seo?.metaDescription || blog.excerpt,
      author: { '@type': 'Organization', name: 'NEPLE (Nếp Lễ)' },
      datePublished: blog.publishedAt,
      mainEntityOfPage: `https://neple.vn/cam-nang/${blog.slug}`
    };

    readerContainer.classList.remove('hidden');
    readerContainer.innerHTML = `
      <div class="rounded-3xl bg-[#fffdf9] border-2 border-[#ae9984] shadow-xl p-6 sm:p-10 mb-10">
        <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#ae9984]/40">
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 rounded-full bg-[#72826f] text-white text-xs font-bold">${blog.category}</span>
            <span class="text-xs text-[#0d2931]/60">📅 ${blog.publishedAt} • ⏱ ${blog.readTime}</span>
          </div>
          <button onclick="NepleApp.closeBlogArticle()" class="px-3.5 py-1.5 rounded-xl bg-[#efe9e0] hover:bg-[#0d2931] hover:text-white text-xs font-bold transition">
            ✕ Đóng bài viết
          </button>
        </div>

        <h1 class="font-display text-2xl sm:text-4xl font-bold text-[#0d2931] mt-5 leading-tight">
          ${blog.title}
        </h1>
        <p class="text-sm sm:text-base text-[#691727] font-medium mt-3 leading-relaxed">
          ${blog.excerpt}
        </p>

        <!-- Auto Table of Contents -->
        <div class="mt-6 p-4 sm:p-5 rounded-2xl bg-[#f4efe6] border border-[#ae9984]/60">
          <div class="text-xs font-extrabold uppercase tracking-wider text-[#0d2931] mb-2.5 flex items-center gap-2">
            <span>📑 Mục Lục Bài Viết Tự Động (Table of Contents)</span>
          </div>
          <ol class="space-y-1.5 text-xs sm:text-sm text-[#0d2931]">
            ${(blog.sections || [])
              .map(
                (sec, idx) => `
              <li>
                <a href="#sec-${idx}" onclick="event.preventDefault(); document.getElementById('sec-${idx}')?.scrollIntoView({behavior:'smooth'});"
                   class="hover:text-[#a94025] hover:underline font-medium">
                  ${sec.heading}
                </a>
              </li>
            `
              )
              .join('')}
            ${
              blog.prayerText
                ? `<li>
                     <a href="#sec-prayer" onclick="event.preventDefault(); document.getElementById('sec-prayer')?.scrollIntoView({behavior:'smooth'});"
                        class="text-[#691727] font-bold hover:underline">
                       🙏 ${blog.prayerTitle || 'Bản Văn Khấn Hiện Đại Dễ Đọc'}
                     </a>
                   </li>`
                : ''
            }
          </ol>
        </div>

        <!-- Article Body Sections -->
        <div class="mt-8 space-y-6">
          ${(blog.sections || [])
            .map(
              (sec, idx) => `
            <div id="sec-${idx}" class="scroll-mt-24">
              <h2 class="font-display text-xl sm:text-2xl font-bold text-[#0d2931] mb-2">${sec.heading}</h2>
              <p class="text-sm sm:text-base text-[#0d2931]/85 leading-relaxed">${sec.content}</p>
            </div>
          `
            )
            .join('')}
        </div>

        <!-- Modern Prayer Box -->
        ${
          blog.prayerText
            ? `
          <div id="sec-prayer" class="mt-8 p-6 sm:p-8 rounded-2xl prayer-box scroll-mt-24">
            <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#ae9984]/50">
              <div>
                <span class="text-[11px] font-bold uppercase tracking-wider text-[#691727] block">Ấn Phẩm Văn Khấn Chuẩn Nếp Lễ</span>
                <h3 class="font-display text-xl sm:text-2xl font-bold text-[#0d2931]">${blog.prayerTitle}</h3>
              </div>
              <div class="flex items-center gap-2">
                <button onclick="NepleApp.togglePrayerFontSize()" 
                  class="px-3 py-1.5 rounded-lg bg-[#0d2931] text-[#f0b45b] text-xs font-semibold">
                  🔍 ${this.state.prayerFontSize === 'large' ? 'Thu nhỏ chữ' : 'Phóng to chữ để đọc khi cúng'}
                </button>
                <button onclick="NepleApp.copyPrayerText('${blog.id}')" 
                  class="px-3 py-1.5 rounded-lg bg-[#a94025] text-white text-xs font-semibold">
                  📋 Sao chép văn khấn
                </button>
              </div>
            </div>
            <pre class="mt-5 whitespace-pre-wrap font-sans ${
              this.state.prayerFontSize === 'large' ? 'text-lg sm:text-xl leading-loose' : 'text-sm sm:text-base leading-relaxed'
            } text-[#0d2931] font-medium">${blog.prayerText}</pre>
          </div>
        `
            : ''
        }

        <!-- In-Article Product Card -->
        ${
          relatedProduct
            ? `
          <div class="mt-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0d2931] to-[#163d48] text-[#faf7f2] border-2 border-[#f0b45b] shadow-lg">
            <div class="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span class="px-2.5 py-0.5 rounded-full bg-[#f0b45b] text-[#0d2931] text-[11px] font-extrabold uppercase">
                  Thẻ gắn sản phẩm liên quan trong bài viết
                </span>
                <h4 class="font-display text-xl sm:text-2xl font-bold text-[#f0b45b] mt-1.5">${relatedProduct.name} — ${this.formatVND(relatedProduct.price)}</h4>
                <p class="text-xs sm:text-sm text-[#faf7f2]/85 mt-1">${relatedProduct.shortDesc}</p>
              </div>
              <div class="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                <button onclick="NepleApp.buyNow('${relatedProduct.id}')" class="flex-1 px-5 py-3 rounded-xl btn-terracotta text-xs sm:text-sm font-bold whitespace-nowrap">
                  Đặt Mua Ngay
                </button>
                <button onclick="NepleApp.switchView('home'); NepleApp.selectSkuDirectly('${relatedProduct.id}', true);" class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold whitespace-nowrap">
                  Mô phỏng hộp lễ này
                </button>
              </div>
            </div>
          </div>
        `
            : ''
        }

        <!-- SEO Metadata & JSON-LD Schema Preview -->
        <details class="mt-6 rounded-xl bg-[#f4efe6] p-4 border border-[#ae9984]/50 text-xs">
          <summary class="font-bold text-[#0d2931] cursor-pointer">
            🔍 Xem Cấu Trúc Chuẩn SEO Google &amp; JSON-LD Schema Của Bài Viết
          </summary>
          <div class="mt-3 space-y-1.5 text-[#0d2931]/80">
            <div><strong>URL Slug:</strong> <code>/cam-nang/${blog.slug}</code></div>
            <div><strong>Meta Title:</strong> ${blog.seo?.metaTitle || blog.title}</div>
            <div><strong>Meta Description:</strong> ${blog.seo?.metaDescription || blog.excerpt}</div>
            <div><strong>Keywords:</strong> ${blog.seo?.keywords || (blog.tags || []).join(', ')}</div>
            <pre class="mt-2 p-2.5 rounded bg-[#0d2931] text-[#f0b45b] overflow-x-auto text-[11px]">${JSON.stringify(jsonLd, null, 2)}</pre>
          </div>
        </details>
      </div>
    `;
  },

  // ========================================================================
  // 3.4. CART & 1-STEP CHECKOUT (VietQR + MoMo + COD) + ORDER TRACKING
  // ========================================================================
  renderCartBadge() {
    const count = this.state.cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll('.cart-count-badge').forEach(el => {
      el.textContent = count;
      el.classList.toggle('hidden', count === 0);
    });
  },

  addToCart(productId, showNotification = true) {
    const product = this.state.products.find(p => p.id === productId);
    if (!product) return;
    const existing = this.state.cart.find(item => item.id === productId);
    if (existing) {
      existing.qty += 1;
    } else {
      this.state.cart.push({
        id: product.id,
        name: product.name,
        tierLabel: product.tierLabel,
        price: product.price,
        image: product.image,
        qty: 1
      });
    }
    this.saveCart();
    if (showNotification) {
      this.showToast(`Đã thêm "${product.name}" vào giỏ lễ!`);
    }
  },

  buyNow(productId) {
    this.addToCart(productId, false);
    this.openCheckoutModal();
  },

  updateCartQty(productId, delta) {
    const idx = this.state.cart.findIndex(i => i.id === productId);
    if (idx === -1) return;
    this.state.cart[idx].qty += delta;
    if (this.state.cart[idx].qty <= 0) {
      this.state.cart.splice(idx, 1);
    }
    this.saveCart();
    this.renderCheckoutModalContent();
  },

  getCartTotal() {
    return this.state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  },

  openCheckoutModal() {
    if (this.state.cart.length === 0) {
      const matched = this.state.products.find(p => p.id === this.state.activeSkuId) || this.getMatchedProductByRituals(this.state.selectedRituals);
      if (matched) this.addToCart(matched.id, false);
    }
    const modal = document.getElementById('checkout-modal');
    if (modal) {
      modal.classList.remove('hidden');
      this.renderCheckoutModalContent();
    }
  },

  closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.classList.add('hidden');
  },

  setPaymentMethod(method) {
    this.state.paymentMethod = method;
    this.renderPaymentMethodDetails();
  },

  onCheckoutPhoneInput(val) {
    this.state.checkoutPhonePreview = (val || '').replace(/[^0-9]/g, '');
    this.renderPaymentMethodDetails();
  },

  renderCheckoutModalContent() {
    const container = document.getElementById('checkout-modal-body');
    if (!container) return;

    if (this.state.cart.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12">
          <div class="text-4xl mb-3">🧺</div>
          <h4 class="font-display text-xl font-bold text-[#0d2931]">Giỏ lễ của bạn đang trống</h4>
          <p class="text-xs sm:text-sm text-[#0d2931]/70 mt-1">Hãy chọn gói lẻ hoặc Combo Nếp Lễ phù hợp với gia đình bạn nhé.</p>
          <button onclick="NepleApp.closeCheckoutModal()" class="mt-4 px-5 py-2.5 rounded-xl btn-terracotta text-xs font-bold">
            Quay lại chọn gói lễ
          </button>
        </div>
      `;
      return;
    }

    const total = this.getCartTotal();

    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-7 space-y-5">
          <div>
            <h4 class="text-xs font-extrabold uppercase tracking-wider text-[#72826f] mb-2.5">
              1. Gói Lễ Đã Chọn (Giao 1 lần trước Tết)
            </h4>
            <div class="space-y-2.5 max-h-52 overflow-y-auto pr-1">
              ${this.state.cart
                .map(
                  item => `
                <div class="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#faf7f2] border border-[#ae9984]/50">
                  <div class="min-w-0">
                    <div class="text-sm font-bold text-[#0d2931] truncate">${item.name}</div>
                    <div class="text-xs text-[#a94025] font-semibold">${this.formatVND(item.price)}</div>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <button onclick="NepleApp.updateCartQty('${item.id}', -1)" class="w-7 h-7 rounded-lg bg-[#efe9e0] hover:bg-[#0d2931] hover:text-white font-bold text-xs">-</button>
                    <span class="text-xs font-bold w-5 text-center">${item.qty}</span>
                    <button onclick="NepleApp.updateCartQty('${item.id}', 1)" class="w-7 h-7 rounded-lg bg-[#efe9e0] hover:bg-[#0d2931] hover:text-white font-bold text-xs">+</button>
                  </div>
                </div>
              `
                )
                .join('')}
            </div>
          </div>

          <form id="neple-checkout-form" onsubmit="NepleApp.submitOrder(event)" class="space-y-3.5">
            <h4 class="text-xs font-extrabold uppercase tracking-wider text-[#72826f]">
              2. Thông Tin Nhận Hộp Lễ (Không cần đăng ký tài khoản)
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-[#0d2931] mb-1">Họ và tên người nhận *</label>
                <input type="text" id="chk-name" required placeholder="VD: Nguyễn Minh Anh"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#ae9984] text-sm focus:outline-none focus:border-[#0d2931]" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-[#0d2931] mb-1">Số điện thoại (Dùng tra cứu đơn) *</label>
                <input type="tel" id="chk-phone" required placeholder="VD: 0901234567"
                  value="${this.state.checkoutPhonePreview}"
                  oninput="NepleApp.onCheckoutPhoneInput(this.value)"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#ae9984] text-sm focus:outline-none focus:border-[#0d2931]" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#0d2931] mb-1">Địa chỉ nhận hàng chi tiết *</label>
              <input type="text" id="chk-address" required placeholder="Số nhà, tòa chung cư, phường/xã, quận/huyện, tỉnh/thành..."
                class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#ae9984] text-sm focus:outline-none focus:border-[#0d2931]" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#0d2931] mb-1">Ghi chú giao hàng (Tùy chọn)</label>
              <input type="text" id="chk-note" placeholder="VD: Giao trước ngày 20 tháng Chạp, gọi trước khi giao..."
                class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#ae9984] text-sm focus:outline-none focus:border-[#0d2931]" />
            </div>
          </form>
        </div>

        <div class="lg:col-span-5 flex flex-col justify-between bg-[#f4efe6] p-4 sm:p-5 rounded-2xl border border-[#ae9984]">
          <div>
            <h4 class="text-xs font-extrabold uppercase tracking-wider text-[#0d2931] mb-3">
              3. Chọn Phương Thức Thanh Toán
            </h4>
            <div class="grid grid-cols-3 gap-2 mb-4" id="payment-method-tabs"></div>
            <div id="payment-method-box"></div>
          </div>

          <div class="mt-5 pt-4 border-t border-[#ae9984]/50">
            <div class="flex items-center justify-between text-xs text-[#0d2931]/80 mb-1">
              <span>Phí vận chuyển toàn quốc:</span>
              <span class="font-bold text-[#72826f]">Miễn phí (0đ)</span>
            </div>
            <div class="flex items-baseline justify-between">
              <span class="text-sm font-bold text-[#0d2931]">Tổng thanh toán:</span>
              <span class="text-2xl font-extrabold text-[#a94025]">${this.formatVND(total)}</span>
            </div>

            <button type="submit" form="neple-checkout-form"
              class="mt-4 w-full py-3.5 px-6 rounded-xl btn-terracotta font-bold text-sm sm:text-base shadow-lg">
              ✓ Hoàn Tất Đặt Hộp Nếp Lễ
            </button>
          </div>
        </div>
      </div>
    `;
    this.renderPaymentMethodDetails();
  },

  renderPaymentMethodDetails() {
    const tabsEl = document.getElementById('payment-method-tabs');
    const boxEl = document.getElementById('payment-method-box');
    if (!tabsEl || !boxEl) return;

    const method = this.state.paymentMethod;
    const total = this.getCartTotal();
    const phone = this.state.checkoutPhonePreview || '0901234567';
    const transferContent = `NEPLE ${phone}`;
    const s = this.state.settings;

    const methods = [
      { id: 'VIETQR', label: '🏦 VietQR' },
      { id: 'MOMO', label: '🌸 Ví MoMo' },
      { id: 'COD', label: '📦 COD' }
    ];

    tabsEl.innerHTML = methods
      .map(
        m => `
      <button type="button" onclick="NepleApp.setPaymentMethod('${m.id}')"
        class="py-2 px-2 rounded-xl text-xs font-bold border transition ${
          method === m.id
            ? 'bg-[#0d2931] text-[#f0b45b] border-[#0d2931] shadow'
            : 'bg-white text-[#0d2931] border-[#ae9984]/60 hover:bg-[#efe9e0]'
        }">
        ${m.label}
      </button>
    `
      )
      .join('');

    if (method === 'VIETQR') {
      const vietQrUrl = `https://img.vietqr.io/image/${encodeURIComponent(s.bankId)}-${encodeURIComponent(
        s.accountNumber
      )}-compact2.png?amount=${total}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(
        s.accountName
      )}`;

      boxEl.innerHTML = `
        <div class="p-3.5 rounded-xl bg-white border border-[#ae9984]/60 text-center">
          <div class="text-xs font-bold text-[#0d2931] mb-2">Mã QR Ngân Hàng Tự Động (Chuẩn Napas VietQR)</div>
          <div class="w-44 h-44 mx-auto rounded-xl overflow-hidden border border-[#ae9984]/40 bg-[#faf7f2] flex items-center justify-center p-1">
            <img src="${vietQrUrl}" alt="VietQR NEPLE" class="w-full h-full object-contain"
                 onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 200 200\\'><rect width=\\'200\\' height=\\'200\\' fill=\\'#faf7f2\\'/><rect x=\\'20\\' y=\\'20\\' width=\\'50\\' height=\\'50\\' fill=\\'#0d2931\\'/><rect x=\\'130\\' y=\\'20\\' width=\\'50\\' height=\\'50\\' fill=\\'#0d2931\\'/><rect x=\\'20\\' y=\\'130\\' width=\\'50\\' height=\\'50\\' fill=\\'#0d2931\\'/><rect x=\\'80\\' y=\\'80\\' width=\\'40\\' height=\\'40\\' fill=\\'#691727\\'/><text x=\\'100\\' y=\\'192\\' text-anchor=\\'middle\\' font-size=\\'11\\' font-family=\\'sans-serif\\' fill=\\'#0d2931\\'>VIETQR NAPAS</text></svg>');" />
          </div>
          <div class="mt-2.5 text-left text-xs space-y-1 bg-[#faf7f2] p-2.5 rounded-lg border border-[#ae9984]/30">
            <div><span class="text-[#0d2931]/60">Ngân hàng:</span> <strong>${s.bankName}</strong></div>
            <div><span class="text-[#0d2931]/60">Số TK:</span> <strong>${s.accountNumber}</strong></div>
            <div><span class="text-[#0d2931]/60">Chủ TK:</span> <strong>${s.accountName}</strong></div>
            <div><span class="text-[#0d2931]/60">Số tiền:</span> <strong class="text-[#a94025]">${this.formatVND(total)}</strong></div>
            <div><span class="text-[#0d2931]/60">Nội dung CK:</span> <strong class="text-[#691727] bg-[#f0b45b]/30 px-1.5 py-0.5 rounded">${transferContent}</strong></div>
          </div>
        </div>
      `;
    } else if (method === 'MOMO') {
      const momoQrSvg =
        `data:image/svg+xml;utf8,` +
        encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220">
          <rect width="220" height="220" rx="16" fill="#a50064"/>
          <rect x="14" y="14" width="192" height="192" rx="12" fill="#ffffff"/>
          <rect x="28" y="28" width="46" height="46" rx="6" fill="#a50064"/>
          <rect x="146" y="28" width="46" height="46" rx="6" fill="#a50064"/>
          <rect x="28" y="146" width="46" height="46" rx="6" fill="#a50064"/>
          <rect x="85" y="85" width="50" height="50" rx="8" fill="#a50064"/>
          <text x="110" y="115" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">MoMo</text>
          <text x="110" y="176" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="bold" fill="#a50064">${s.momoPhone}</text>
        </svg>
      `);
      boxEl.innerHTML = `
        <div class="p-3.5 rounded-xl bg-white border border-[#ae9984]/60 text-center">
          <div class="text-xs font-bold text-[#a50064] mb-2">Quét Mã QR Ví Điện Tử MoMo</div>
          <div class="w-40 h-40 mx-auto rounded-xl overflow-hidden border border-[#ae9984]/40">
            <img src="${momoQrSvg}" alt="MoMo QR" class="w-full h-full object-contain" />
          </div>
          <div class="mt-2.5 text-left text-xs space-y-1 bg-[#faf7f2] p-2.5 rounded-lg border border-[#ae9984]/30">
            <div><span class="text-[#0d2931]/60">SĐT Ví MoMo:</span> <strong>${s.momoPhone}</strong></div>
            <div><span class="text-[#0d2931]/60">Tên người nhận:</span> <strong>${s.momoName}</strong></div>
            <div><span class="text-[#0d2931]/60">Số tiền:</span> <strong class="text-[#a94025]">${this.formatVND(total)}</strong></div>
            <div><span class="text-[#0d2931]/60">Lời nhắn:</span> <strong class="text-[#691727] bg-[#f0b45b]/30 px-1.5 py-0.5 rounded">${transferContent}</strong></div>
          </div>
        </div>
      `;
    } else {
      boxEl.innerHTML = `
        <div class="p-4 rounded-xl bg-white border border-[#ae9984]/60 space-y-2 text-xs text-[#0d2931]">
          <div class="font-bold text-sm text-[#0d2931] flex items-center gap-2">
            <span>📦 Thanh toán khi nhận hàng (COD)</span>
          </div>
          <p class="leading-relaxed text-[#0d2931]/80">
            Bạn được mở hộp kiểm tra quy cách đóng gói và ấn phẩm trước khi thanh toán tiền mặt hoặc quét mã với shipper.
          </p>
          <div class="p-2.5 rounded-lg bg-[#72826f]/15 text-[#72826f] font-semibold">
            ✓ Xác nhận đơn tức thì • Giao 1 lần duy nhất trước Tết.
          </div>
        </div>
      `;
    }
  },

  submitOrder(e) {
    e.preventDefault();
    const name = document.getElementById('chk-name')?.value.trim();
    const phone = document.getElementById('chk-phone')?.value.trim();
    const address = document.getElementById('chk-address')?.value.trim();
    const note = document.getElementById('chk-note')?.value.trim();

    if (!name || !phone || !address) {
      this.showToast('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng!');
      return;
    }

    const paymentLabels = {
      VIETQR: 'Chuyển khoản VietQR Ngân hàng',
      MOMO: 'Thanh toán Ví MoMo',
      COD: 'Thanh toán khi nhận hàng (COD)'
    };

    const newOrder = {
      id: 'NP-' + Math.floor(100000 + Math.random() * 900000),
      customerName: name,
      phone: phone.replace(/\s+/g, ''),
      address,
      note: note || 'Giao tiêu chuẩn trước Tết',
      paymentMethod: this.state.paymentMethod,
      paymentLabel: paymentLabels[this.state.paymentMethod],
      status: 'Đã tiếp nhận',
      createdAt: new Date().toLocaleString('vi-VN'),
      total: this.getCartTotal(),
      items: this.state.cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty }))
    };

    this.state.orders.unshift(newOrder);
    this.saveOrders();
    this.state.cart = [];
    this.saveCart();
    this.closeCheckoutModal();

    this.switchView('tra-cuu');
    const phoneInput = document.getElementById('order-lookup-phone');
    if (phoneInput) phoneInput.value = newOrder.phone;
    this.lookupOrderByPhone(newOrder.phone);
    this.showToast(`🎉 Đặt đơn ${newOrder.id} thành công! Cảm ơn gia đình bạn đã chọn NEPLE.`);
  },

  renderOrderLookupSampleList() {
    const sampleEl = document.getElementById('lookup-sample-phones');
    if (!sampleEl) return;
    const uniquePhones = [...new Set(this.state.orders.map(o => o.phone))].slice(0, 3);
    sampleEl.innerHTML = uniquePhones
      .map(
        ph => `
      <button onclick="document.getElementById('order-lookup-phone').value='${ph}'; NepleApp.lookupOrderByPhone('${ph}');"
        class="px-2.5 py-1 rounded-lg bg-[#efe9e0] hover:bg-[#0d2931] hover:text-[#f0b45b] text-xs font-semibold transition">
        SĐT mẫu: ${ph}
      </button>
    `
      )
      .join('');
  },

  lookupOrderByPhone(phoneParam) {
    const inputEl = document.getElementById('order-lookup-phone');
    const rawPhone = (phoneParam !== undefined ? phoneParam : inputEl?.value || '').replace(/\s+/g, '');
    const mount = document.getElementById('order-lookup-results');
    if (!mount) return;

    if (!rawPhone) {
      this.showToast('Vui lòng nhập Số điện thoại đặt hàng để tra cứu!');
      return;
    }

    const matchedOrders = this.state.orders.filter(o => o.phone.includes(rawPhone));
    if (matchedOrders.length === 0) {
      mount.innerHTML = `
        <div class="p-8 rounded-2xl paper-card text-center">
          <div class="text-3xl mb-2">🔍</div>
          <h4 class="font-display text-lg font-bold text-[#0d2931]">Không tìm thấy đơn hàng với SĐT "${rawPhone}"</h4>
          <p class="text-xs sm:text-sm text-[#0d2931]/70 mt-1">Vui lòng kiểm tra lại số điện thoại hoặc bấm vào SĐT mẫu bên trên để xem thử tiến trình.</p>
        </div>
      `;
      return;
    }

    const stages = ['Đã tiếp nhận', 'Đang đóng gói hộp lễ', 'Đang giao hàng', 'Hoàn thành'];

    mount.innerHTML = matchedOrders
      .map(order => {
        const currentStageIdx = Math.max(0, stages.indexOf(order.status));
        return `
        <div class="p-6 rounded-2xl paper-card border-2 border-[#ae9984] space-y-5">
          <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#ae9984]/40">
            <div>
              <span class="px-3 py-1 rounded-full bg-[#0d2931] text-[#f0b45b] text-xs font-bold">Mã đơn: ${order.id}</span>
              <span class="text-xs text-[#0d2931]/70 ml-2">Đặt lúc: ${order.createdAt}</span>
            </div>
            <div class="text-sm font-extrabold text-[#a94025]">
              Tổng cộng: ${this.formatVND(order.total)} (${order.paymentLabel})
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
            ${stages
              .map((st, idx) => {
                const isDone = idx <= currentStageIdx;
                const isCurrent = idx === currentStageIdx;
                return `
                <div class="p-3.5 rounded-xl border ${
                  isCurrent
                    ? 'bg-[#0d2931] text-[#f0b45b] border-[#f0b45b] shadow-md'
                    : isDone
                    ? 'bg-[#72826f]/15 text-[#0d2931] border-[#72826f]'
                    : 'bg-white/60 text-[#0d2931]/40 border-[#ae9984]/30'
                }">
                  <div class="flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCurrent
                        ? 'bg-[#f0b45b] text-[#0d2931]'
                        : isDone
                        ? 'bg-[#72826f] text-white'
                        : 'bg-[#efe9e0] text-[#0d2931]/50'
                    }">
                      ${isDone ? '✓' : idx + 1}
                    </span>
                    <span class="text-xs font-bold">${st}</span>
                  </div>
                </div>
              `;
              })
              .join('')}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm bg-[#faf7f2] p-4 rounded-xl border border-[#ae9984]/40">
            <div class="space-y-1">
              <div><strong>Người nhận:</strong> ${order.customerName} (${order.phone})</div>
              <div><strong>Địa chỉ nhận lễ:</strong> ${order.address}</div>
              <div><strong>Ghi chú:</strong> ${order.note}</div>
            </div>
            <div>
              <div class="font-bold text-[#0d2931] mb-1">Chi tiết hộp lễ:</div>
              ${(order.items || [])
                .map(
                  it => `
                <div class="flex justify-between py-0.5">
                  <span>• ${it.name} (x${it.qty})</span>
                  <span class="font-semibold">${this.formatVND(it.price * it.qty)}</span>
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        </div>
      `;
      })
      .join('');
  },

  // ========================================================================
  // 4. ADMIN CMS (/admin)
  // ========================================================================
  setAdminTab(tab) {
    this.state.adminTab = tab;
    this.renderAdminPanel();
  },

  renderAdminPanel() {
    const mount = document.getElementById('admin-panel-mount');
    if (!mount) return;

    const tab = this.state.adminTab;
    const tabs = [
      { id: 'orders', label: `📦 Đơn Hàng (${this.state.orders.length})` },
      { id: 'products', label: `🎁 Sản Phẩm & 7 SKU (${this.state.products.length})` },
      { id: 'blogs', label: `📝 Blog SEO (${this.state.blogs.length})` },
      { id: 'settings', label: `⚙️ Cài Đặt VietQR / MoMo / GA4` }
    ];

    const navHTML = `
      <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div class="flex flex-wrap gap-2">
          ${tabs
            .map(
              t => `
            <button onclick="NepleApp.setAdminTab('${t.id}')"
              class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                tab === t.id
                  ? 'bg-[#0d2931] text-[#f0b45b] shadow'
                  : 'bg-[#efe9e0] text-[#0d2931] hover:bg-[#ae9984]/40'
              }">
              ${t.label}
            </button>
          `
            )
            .join('')}
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button onclick="NepleApp.exportFullBackupJSON()" class="px-3.5 py-2 rounded-xl bg-[#72826f] text-white text-xs font-bold hover:opacity-90 transition">
            💾 Xuất File Backup (.json)
          </button>
          <label class="px-3.5 py-2 rounded-xl bg-[#0d2931] text-[#f0b45b] text-xs font-bold cursor-pointer hover:opacity-90 transition">
            📂 Nhập File Backup
            <input type="file" accept=".json" class="hidden" onchange="NepleApp.importFullBackupJSON(event)" />
          </label>
          <button onclick="NepleApp.resetAllData()" class="px-3.5 py-2 rounded-xl border border-[#691727]/40 text-[#691727] hover:bg-[#691727] hover:text-white text-xs font-semibold transition">
            ↺ Khôi phục gốc
          </button>
        </div>
      </div>
    `;

    if (tab === 'orders') {
      mount.innerHTML = navHTML + this.renderAdminOrdersTab();
    } else if (tab === 'products') {
      mount.innerHTML = navHTML + this.renderAdminProductsTab();
    } else if (tab === 'blogs') {
      mount.innerHTML = navHTML + this.renderAdminBlogsTab();
    } else {
      mount.innerHTML = navHTML + this.renderAdminSettingsTab();
    }
  },

  renderAdminOrdersTab() {
    const stages = ['Đã tiếp nhận', 'Đang đóng gói hộp lễ', 'Đang giao hàng', 'Hoàn thành'];
    const totalRevenue = this.state.orders.reduce((sum, o) => sum + Number(o.total || 0), 0);

    return `
      <div class="space-y-5">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="p-4 rounded-2xl paper-card">
            <span class="text-xs text-[#72826f] font-bold uppercase">Tổng số đơn hàng</span>
            <div class="text-2xl font-extrabold text-[#0d2931] mt-1">${this.state.orders.length} đơn</div>
          </div>
          <div class="p-4 rounded-2xl paper-card">
            <span class="text-xs text-[#72826f] font-bold uppercase">Doanh thu ghi nhận</span>
            <div class="text-2xl font-extrabold text-[#a94025] mt-1">${this.formatVND(totalRevenue)}</div>
          </div>
          <div class="p-4 rounded-2xl paper-card flex flex-col justify-between">
            <span class="text-xs text-[#72826f] font-bold uppercase">Xuất Dữ Liệu &amp; Đồng Bộ</span>
            <div class="flex flex-wrap gap-2 mt-2">
              <button onclick="NepleApp.exportOrdersCSV()" class="px-3 py-2 rounded-xl bg-[#0d2931] text-[#f0b45b] text-xs font-bold">
                ⬇ Xuất File Excel / CSV
              </button>
              <button onclick="NepleApp.copyOrdersForGoogleSheets()" class="px-3 py-2 rounded-xl bg-[#72826f] text-white text-xs font-bold">
                📋 Copy Dán Google Sheets
              </button>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto rounded-2xl paper-card">
          <table class="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr class="bg-[#0d2931] text-[#f0b45b]">
                <th class="p-3.5">Mã Đơn</th>
                <th class="p-3.5">Khách Hàng &amp; SĐT</th>
                <th class="p-3.5">Gói Lễ Đặt Mua</th>
                <th class="p-3.5">Tổng Tiền / Thanh Toán</th>
                <th class="p-3.5">Trạng Thái Tiến Trình</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#ae9984]/30">
              ${this.state.orders
                .map(
                  o => `
                <tr class="hover:bg-[#f4efe6]/70">
                  <td class="p-3.5 font-bold text-[#0d2931]">
                    ${o.id}
                    <div class="text-[11px] font-normal text-[#0d2931]/60">${o.createdAt}</div>
                  </td>
                  <td class="p-3.5">
                    <div class="font-bold text-[#0d2931]">${o.customerName}</div>
                    <div class="text-xs text-[#691727] font-semibold">${o.phone}</div>
                    <div class="text-xs text-[#0d2931]/70 max-w-xs truncate">${o.address}</div>
                  </td>
                  <td class="p-3.5">
                    ${(o.items || []).map(i => `<div>• ${i.name} (x${i.qty})</div>`).join('')}
                  </td>
                  <td class="p-3.5">
                    <div class="font-extrabold text-[#a94025]">${this.formatVND(o.total)}</div>
                    <div class="text-[11px] text-[#0d2931]/70">${o.paymentLabel}</div>
                  </td>
                  <td class="p-3.5">
                    <select onchange="NepleApp.updateOrderStatus('${o.id}', this.value)"
                      class="px-3 py-1.5 rounded-lg bg-white border border-[#ae9984] text-xs font-bold text-[#0d2931]">
                      ${stages
                        .map(st => `<option value="${st}" ${o.status === st ? 'selected' : ''}>${st}</option>`)
                        .join('')}
                    </select>
                  </td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  updateOrderStatus(orderId, newStatus) {
    const order = this.state.orders.find(o => o.id === orderId);
    if (!order) return;
    order.status = newStatus;
    this.saveOrders();
    this.showToast(`Đã cập nhật trạng thái đơn ${orderId} → "${newStatus}"`);
  },

  exportOrdersCSV() {
    const headers = ['Mã Đơn', 'Ngày Đặt', 'Họ Tên', 'Số Điện Thoại', 'Địa Chỉ', 'Sản Phẩm', 'Tổng Tiền', 'Thanh Toán', 'Trạng Thái', 'Ghi Chú'];
    const rows = this.state.orders.map(o => [
      o.id,
      o.createdAt,
      `"${(o.customerName || '').replace(/"/g, '""')}"`,
      `'${o.phone}`,
      `"${(o.address || '').replace(/"/g, '""')}"`,
      `"${(o.items || []).map(i => `${i.name} (x${i.qty})`).join('; ')}"`,
      o.total,
      `"${o.paymentLabel}"`,
      `"${o.status}"`,
      `"${(o.note || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NEPLE-Don-Hang-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('Đã xuất danh sách đơn hàng ra file Excel/CSV!');
  },

  copyOrdersForGoogleSheets() {
    const headers = ['Mã Đơn', 'Ngày Đặt', 'Họ Tên', 'Số Điện Thoại', 'Địa Chỉ', 'Sản Phẩm', 'Tổng Tiền', 'Thanh Toán', 'Trạng Thái'];
    const rows = this.state.orders.map(o =>
      [
        o.id,
        o.createdAt,
        o.customerName,
        o.phone,
        o.address,
        (o.items || []).map(i => `${i.name} (x${i.qty})`).join('; '),
        o.total,
        o.paymentLabel,
        o.status
      ].join('\t')
    );
    const tsv = [headers.join('\t'), ...rows].join('\n');
    navigator.clipboard?.writeText(tsv);
    this.showToast('Đã sao chép định dạng bảng! Bạn có thể bấm Ctrl+V trực tiếp vào Google Sheets.');
  },

  renderAdminProductsTab() {
    const editingId = this.state.editingProductId || this.state.products[0]?.id;
    const p = this.state.products.find(item => item.id === editingId) || this.state.products[0];

    return `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-4 space-y-2">
          <div class="text-xs font-bold uppercase tracking-wider text-[#72826f] mb-2">Chọn 1 trong 7 SKU để chỉnh sửa:</div>
          ${this.state.products
            .map(
              prod => `
            <button onclick="NepleApp.state.editingProductId='${prod.id}'; NepleApp.renderAdminPanel();"
              class="w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between gap-2 ${
                prod.id === p.id
                  ? 'bg-[#0d2931] text-[#f0b45b] border-[#0d2931] shadow'
                  : 'paper-card text-[#0d2931]'
              }">
              <div>
                <div class="text-sm font-bold">${prod.name}</div>
                <div class="text-[11px] opacity-80">${prod.sku} • ${prod.tierLabel}</div>
              </div>
              <div class="text-xs font-extrabold">${this.formatVND(prod.price)}</div>
            </button>
          `
            )
            .join('')}
        </div>

        <div class="lg:col-span-8 p-6 rounded-2xl paper-card">
          <h3 class="font-display text-xl font-bold text-[#0d2931] mb-4">
            Chỉnh sửa gói lễ: ${p.name} (${p.sku})
          </h3>
          <form onsubmit="NepleApp.saveProductFromAdmin(event, '${p.id}')" class="space-y-4 text-xs sm:text-sm">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block font-bold mb-1">Tên gói lễ</label>
                <input type="text" id="adm-prod-name" value="${p.name}" required class="w-full px-3 py-2 rounded-xl border border-[#ae9984] bg-white" />
              </div>
              <div>
                <label class="block font-bold mb-1">Giá bán (VNĐ)</label>
                <input type="number" id="adm-prod-price" value="${p.price}" required class="w-full px-3 py-2 rounded-xl border border-[#ae9984] bg-white font-bold text-[#a94025]" />
              </div>
              <div>
                <label class="block font-bold mb-1">Giá gốc (VNĐ)</label>
                <input type="number" id="adm-prod-orig" value="${p.originalPrice}" required class="w-full px-3 py-2 rounded-xl border border-[#ae9984] bg-white" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold mb-1">Tiêu đề phụ (Dịp lễ)</label>
                <input type="text" id="adm-prod-sub" value="${p.subtitle}" class="w-full px-3 py-2 rounded-xl border border-[#ae9984] bg-white" />
              </div>
              <div>
                <label class="block font-bold mb-1">Phần trăm giảm giá (%)</label>
                <input type="number" id="adm-prod-disc" value="${p.discountPercent}" class="w-full px-3 py-2 rounded-xl border border-[#ae9984] bg-white" />
              </div>
            </div>

            <div>
              <label class="block font-bold mb-1">Mô tả ngắn</label>
              <textarea id="adm-prod-desc" rows="2" class="w-full px-3 py-2 rounded-xl border border-[#ae9984] bg-white">${p.shortDesc}</textarea>
            </div>

            <div>
              <label class="block font-bold mb-1">Danh sách vật phẩm bên trong hộp (Mỗi dòng 1 vật phẩm)</label>
              <textarea id="adm-prod-items" rows="5" class="w-full px-3 py-2 rounded-xl border border-[#ae9984] bg-white">${(p.items || []).join('\n')}</textarea>
            </div>

            <div>
              <label class="block font-bold mb-1">URL Hình ảnh bao bì (Hoặc tải ảnh từ máy tính bên dưới)</label>
              <div class="flex flex-col sm:flex-row gap-2">
                <input type="text" id="adm-prod-img" value="${p.image}" class="flex-1 px-3 py-2 rounded-xl border border-[#ae9984] bg-white text-xs" />
                <label class="px-3.5 py-2 rounded-xl bg-[#72826f] text-white text-xs font-bold cursor-pointer shrink-0 text-center">
                  📷 Tải ảnh lên
                  <input type="file" accept="image/*" class="hidden" onchange="NepleApp.uploadProductImage(event)" />
                </label>
              </div>
            </div>

            <div class="pt-2 flex justify-end">
              <button type="submit" class="px-6 py-3 rounded-xl btn-terracotta font-bold text-sm">
                💾 Lưu Thay Đổi Sản Phẩm
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  uploadProductImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const input = document.getElementById('adm-prod-img');
      if (input) input.value = reader.result;
      this.showToast('Đã nạp ảnh bao bì mới! Hãy bấm "Lưu Thay Đổi Sản Phẩm" để áp dụng.');
    };
    reader.readAsDataURL(file);
  },

  saveProductFromAdmin(e, productId) {
    e.preventDefault();
    const prod = this.state.products.find(p => p.id === productId);
    if (!prod) return;

    prod.name = document.getElementById('adm-prod-name').value.trim();
    prod.price = Number(document.getElementById('adm-prod-price').value) || prod.price;
    prod.originalPrice = Number(document.getElementById('adm-prod-orig').value) || prod.price;
    prod.subtitle = document.getElementById('adm-prod-sub').value.trim();
    prod.discountPercent = Number(document.getElementById('adm-prod-disc').value) || 0;
    prod.shortDesc = document.getElementById('adm-prod-desc').value.trim();
    prod.image = document.getElementById('adm-prod-img').value.trim() || prod.image;
    prod.items = document
      .getElementById('adm-prod-items')
      .value.split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    this.saveProducts();
    this.renderAll();
    this.showToast(`Đã lưu cập nhật cho "${prod.name}"!`);
  },

  renderAdminBlogsTab() {
    const editingId = this.state.editingBlogId || this.state.blogs[0]?.id;
    const blog = this.state.blogs.find(b => b.id === editingId) || this.state.blogs[0];

    return `
      <div class="space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl paper-card">
          <div>
            <h4 class="font-bold text-sm text-[#0d2931]">Công cụ SEO Tự Động: Sitemap.xml &amp; Robots.txt</h4>
            <p class="text-xs text-[#0d2931]/70">Tự động kết xuất cấu trúc chuẩn Google Search Console từ danh sách sản phẩm &amp; bài viết hiện tại.</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button onclick="NepleApp.createNewBlogPost()" class="px-3.5 py-2 rounded-xl btn-terracotta text-xs font-bold">
              + Viết Bài Cẩm Nang Mới
            </button>
            <button onclick="NepleApp.downloadSitemapXML()" class="px-3.5 py-2 rounded-xl bg-[#0d2931] text-[#f0b45b] text-xs font-bold">
              ⬇ Tải sitemap.xml
            </button>
            <button onclick="NepleApp.downloadRobotsTXT()" class="px-3.5 py-2 rounded-xl bg-[#72826f] text-white text-xs font-bold">
              ⬇ Tải robots.txt
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-4 space-y-2">
            ${this.state.blogs
              .map(
                b => `
              <div onclick="NepleApp.state.editingBlogId='${b.id}'; NepleApp.renderAdminPanel();"
                class="p-3.5 rounded-xl border cursor-pointer transition ${
                  b.id === blog?.id ? 'bg-[#0d2931] text-[#f0b45b] border-[#0d2931]' : 'paper-card text-[#0d2931]'
                }">
                <span class="text-[10px] uppercase font-bold opacity-80">${b.category}</span>
                <div class="text-xs sm:text-sm font-bold line-clamp-2 mt-0.5">${b.title}</div>
              </div>
            `
              )
              .join('')}
          </div>

          <div class="lg:col-span-8 p-6 rounded-2xl paper-card">
            ${
              blog
                ? `
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-display text-xl font-bold text-[#0d2931]">Trình Soạn Thảo Bài Viết &amp; SEO</h3>
                <button onclick="NepleApp.deleteBlogPost('${blog.id}')" class="px-3 py-1.5 rounded-lg bg-[#691727]/15 text-[#691727] text-xs font-bold hover:bg-[#691727] hover:text-white transition">
                  🗑 Xóa bài viết
                </button>
              </div>
              <form onsubmit="NepleApp.saveBlogFromAdmin(event, '${blog.id}')" class="space-y-3.5 text-xs sm:text-sm">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block font-bold mb-1">Tiêu đề bài viết (H1)</label>
                    <input type="text" id="adm-blog-title" value="${blog.title}" required class="w-full px-3 py-2 rounded-xl border border-[#ae9984] bg-white" />
                  </div>
                  <div>
                    <label class="block font-bold mb-1">Chuyên mục</label>
                    <select id="adm-blog-cat" class="w-full px-3 py-2 rounded-xl border border-[#ae9984] bg-white">
                      ${['Ý Nghĩa Lễ Tết', 'Hướng Dẫn Bày Lễ Tối Giản', 'Văn Khấn Hiện Đại', 'Chuyện Nếp Nhà']
                        .map(c => `<option value="${c}" ${blog.category === c ? 'selected' : ''}>${c}</option>`)
                        .join('')}
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block font-bold mb-1">Đường dẫn chuẩn SEO (Slug)</label>
                    <input type="text" id="adm-blog-slug" value="${blog.slug}" required class="w-full px-3 py-2 rounded-xl border border-[#ae9984] bg-white" />
                  </div>
                  <div>
                    <label class="block font-bold mb-1">Gắn thẻ Sản phẩm / Combo trong bài</label>
                    <select id="adm-blog-prod" class="w-full px-3 py-2 rounded-xl border border-[#ae9984] bg-white">
                      ${this.state.products
                        .map(
                          p =>
                            `<option value="${p.id}" ${blog.relatedProductId === p.id ? 'selected' : ''}>${p.name} (${this.formatVND(p.price)})</option>`
                        )
                        .join('')}
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block font-bold mb-1">Tóm tắt bài viết (Excerpt)</label>
                  <textarea id="adm-blog-excerpt" rows="2" class="w-full px-3 py-2 rounded-xl border border-[#ae9984] bg-white">${blog.excerpt}</textarea>
                </div>

                <div>
                  <label class="block font-bold mb-1">Bản Văn Khấn Hiện Đại đi kèm (Để trống nếu bài không có văn khấn)</label>
                  <textarea id="adm-blog-prayer" rows="4" class="w-full px-3 py-2 rounded-xl border border-[#ae9984] bg-white">${blog.prayerText || ''}</textarea>
                </div>

                <div class="p-4 rounded-xl bg-[#f4efe6] border border-[#ae9984]/60 space-y-3">
                  <div class="font-bold text-xs uppercase tracking-wider text-[#691727]">Cấu hình SEO Thủ Công (Meta Title, Description, Keywords)</div>
                  <div>
                    <label class="block text-xs font-semibold mb-1">Meta Title</label>
                    <input type="text" id="adm-blog-mtitle" value="${blog.seo?.metaTitle || blog.title}" class="w-full px-3 py-2 rounded-lg border border-[#ae9984] bg-white" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold mb-1">Meta Description</label>
                    <textarea id="adm-blog-mdesc" rows="2" class="w-full px-3 py-2 rounded-lg border border-[#ae9984] bg-white">${blog.seo?.metaDescription || blog.excerpt}</textarea>
                  </div>
                  <div>
                    <label class="block text-xs font-semibold mb-1">Từ khóa SEO (Keywords cách nhau dấu phẩy)</label>
                    <input type="text" id="adm-blog-mkey" value="${blog.seo?.keywords || ''}" class="w-full px-3 py-2 rounded-lg border border-[#ae9984] bg-white" />
                  </div>
                </div>

                <div class="pt-2 flex justify-end">
                  <button type="submit" class="px-6 py-3 rounded-xl btn-terracotta font-bold text-sm">
                    💾 Lưu Bài Viết &amp; Cấu Hình SEO
                  </button>
                </div>
              </form>
            `
                : ''
            }
          </div>
        </div>
      </div>
    `;
  },

  createNewBlogPost() {
    const newId = 'blog-' + Date.now();
    const newBlog = {
      id: newId,
      slug: 'bai-viet-cam-nang-nep-le-' + Date.now(),
      title: 'Bài Viết Cẩm Nang Nếp Lễ Mới',
      category: 'Hướng Dẫn Bày Lễ Tối Giản',
      readTime: '4 phút đọc',
      publishedAt: new Date().toISOString().slice(0, 10),
      author: 'Ban Biên Tập Nếp Lễ',
      excerpt: 'Hướng dẫn chuẩn bị mâm lễ Tết tinh gọn, hiện đại dành cho gia đình trẻ.',
      coverImage: generatePackagingSVG('single', 'CẨM NANG NẾP LỄ', 'Bài Viết Văn Hóa Tết Mới', '#0d2931', 'CẨM NANG MỚI', ['Nếp Lễ']),
      relatedProductId: 'combo-tron-tet',
      tags: ['nếp lễ', 'cẩm nang tết'],
      seo: {
        metaTitle: 'Bài Viết Cẩm Nang Nếp Lễ Mới | NEPLE',
        metaDescription: 'Hướng dẫn chuẩn bị mâm lễ Tết tinh gọn, hiện đại dành cho gia đình trẻ.',
        keywords: 'nếp lễ, cẩm nang tết, cúng tết tối giản'
      },
      sections: [
        {
          heading: '1. Tinh thần giữ trọn nếp xưa theo cách tối giản hiện đại',
          content: 'Nội dung chi tiết hướng dẫn người trẻ chuẩn bị lễ Tết trang trọng, ấm cúng.'
        }
      ],
      prayerTitle: 'Văn Khấn Hiện Đại Tham Khảo',
      prayerText: 'Nam mô A Di Đà Phật! (3 lần)\nKính lạy Chư vị Tôn Thần cùng Gia Tiên nội ngoại...'
    };
    this.state.blogs.unshift(newBlog);
    this.state.editingBlogId = newId;
    this.saveBlogs();
    this.renderAll();
    this.showToast('Đã tạo bài viết mới! Bạn có thể chỉnh sửa nội dung ngay.');
  },

  saveBlogFromAdmin(e, blogId) {
    e.preventDefault();
    const blog = this.state.blogs.find(b => b.id === blogId);
    if (!blog) return;
    blog.title = document.getElementById('adm-blog-title').value.trim();
    blog.category = document.getElementById('adm-blog-cat').value;
    blog.slug = document.getElementById('adm-blog-slug').value.trim();
    blog.relatedProductId = document.getElementById('adm-blog-prod').value;
    blog.excerpt = document.getElementById('adm-blog-excerpt').value.trim();
    blog.prayerText = document.getElementById('adm-blog-prayer').value.trim();
    if (blog.prayerText && !blog.prayerTitle) {
      blog.prayerTitle = 'Văn Khấn Hiện Đại Chuẩn Nếp Lễ';
    }
    blog.seo = {
      metaTitle: document.getElementById('adm-blog-mtitle').value.trim(),
      metaDescription: document.getElementById('adm-blog-mdesc').value.trim(),
      keywords: document.getElementById('adm-blog-mkey').value.trim()
    };
    this.saveBlogs();
    this.renderAll();
    this.showToast('Đã lưu bài viết cẩm nang & cấu hình SEO!');
  },

  deleteBlogPost(blogId) {
    if (this.state.blogs.length <= 1) {
      this.showToast('Cần giữ lại ít nhất 1 bài viết trong chuyên mục Cẩm nang!');
      return;
    }
    if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return;
    this.state.blogs = this.state.blogs.filter(b => b.id !== blogId);
    this.state.editingBlogId = this.state.blogs[0]?.id || null;
    this.saveBlogs();
    this.renderAll();
    this.showToast('Đã xóa bài viết.');
  },

  downloadSitemapXML() {
    const baseUrl = 'https://neple.vn';
    const urls = [
      `${baseUrl}/`,
      `${baseUrl}/cam-nang`,
      `${baseUrl}/tra-cuu-don-hang`,
      ...this.state.products.map(p => `${baseUrl}/san-pham/${p.id}`),
      ...this.state.blogs.map(b => `${baseUrl}/cam-nang/${b.slug}`)
    ];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map(
        u => `  <url>\n    <loc>${u}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`
      )
      .join('\n')}\n</urlset>`;
    const blob = new Blob([xml], { type: 'application/xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'sitemap.xml';
    a.click();
    this.showToast('Đã tải file sitemap.xml chuẩn SEO!');
  },

  downloadRobotsTXT() {
    const txt = `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: https://neple.vn/sitemap.xml\n`;
    const blob = new Blob([txt], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'robots.txt';
    a.click();
    this.showToast('Đã tải file robots.txt!');
  },

  renderAdminSettingsTab() {
    const s = this.state.settings;
    return `
      <form onsubmit="NepleApp.saveSettingsFromAdmin(event)" class="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs sm:text-sm">
        <div class="p-6 rounded-2xl paper-card space-y-4">
          <h3 class="font-display text-xl font-bold text-[#0d2931]">1. Cấu Hình Tài Khoản VietQR &amp; Ví MoMo</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold mb-1">Mã Ngân hàng Napas (VD: MB, VCB, TCB, ACB)</label>
              <input type="text" id="adm-set-bankid" value="${s.bankId}" class="w-full px-3 py-2 rounded-xl border border-[#ae9984] bg-white" />
            </div>
            <div>
              <label class="block font-bold mb-1">Tên hiển thị Ngân hàng</label>
              <input type="text" id="adm-set-bankname" value="${s.bankName}" class="w-full px-3 py-2 rounded-xl border border-[#ae9984] bg-white" />
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold mb-1">Số tài khoản nhận tiền</label>
              <input type="text" id="adm-set-accno" value="${s.accountNumber}" class="w-full px-3 py-2 rounded-xl border border-[#ae9984] bg-white font-bold" />
            </div>
            <div>
              <label class="block font-bold mb-1">Tên chủ tài khoản</label>
              <input type="text" id="adm-set-accname" value="${s.accountName}" class="w-full px-3 py-2 rounded-xl border border-[#ae9984] bg-white" />
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#ae9984]/30">
            <div>
              <label class="block font-bold mb-1">Số điện thoại Ví MoMo</label>
              <input type="text" id="adm-set-momo" value="${s.momoPhone}" class="w-full px-3 py-2 rounded-xl border border-[#ae9984] bg-white font-bold" />
            </div>
            <div>
              <label class="block font-bold mb-1">Chủ Ví MoMo</label>
              <input type="text" id="adm-set-momoname" value="${s.momoName}" class="w-full px-3 py-2 rounded-xl border border-[#ae9984] bg-white" />
            </div>
          </div>
        </div>

        <div class="p-6 rounded-2xl paper-card space-y-4">
          <h3 class="font-display text-xl font-bold text-[#0d2931]">2. Công Cụ Tối Ưu UX (Clarity / GA4) &amp; Social Hub</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold mb-1">Microsoft Clarity Project ID (Heatmap)</label>
              <input type="text" id="adm-set-clarity" placeholder="VD: lq8xyz1234" value="${s.analytics?.clarityId || ''}" class="w-full px-3 py-2 rounded-xl border border-[#ae9984] bg-white" />
            </div>
            <div>
              <label class="block font-bold mb-1">Google Analytics 4 (Measurement ID)</label>
              <input type="text" id="adm-set-ga4" placeholder="VD: G-XXXXXXXXXX" value="${s.analytics?.ga4Id || ''}" class="w-full px-3 py-2 rounded-xl border border-[#ae9984] bg-white" />
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold mb-1">Hotline CSKH</label>
              <input type="text" id="adm-set-hotline" value="${s.hotline}" class="w-full px-3 py-2 rounded-xl border border-[#ae9984] bg-white" />
            </div>
            <div>
              <label class="block font-bold mb-1">Link Zalo OA / Cá nhân</label>
              <input type="text" id="adm-set-zalo" value="${s.socials?.zalo || ''}" class="w-full px-3 py-2 rounded-xl border border-[#ae9984] bg-white" />
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold mb-1">Link Messenger</label>
              <input type="text" id="adm-set-msg" value="${s.socials?.messenger || ''}" class="w-full px-3 py-2 rounded-xl border border-[#ae9984] bg-white" />
            </div>
            <div>
              <label class="block font-bold mb-1">Link TikTok / Instagram</label>
              <input type="text" id="adm-set-tiktok" value="${s.socials?.tiktok || ''}" class="w-full px-3 py-2 rounded-xl border border-[#ae9984] bg-white" />
            </div>
          </div>

          <div class="pt-3 flex justify-end">
            <button type="submit" class="px-6 py-3 rounded-xl btn-terracotta font-bold text-sm">
              💾 Lưu Toàn Bộ Cài Đặt Hệ Thống
            </button>
          </div>
        </div>
      </form>
    `;
  },

  saveSettingsFromAdmin(e) {
    e.preventDefault();
    const s = this.state.settings;
    s.bankId = document.getElementById('adm-set-bankid').value.trim();
    s.bankName = document.getElementById('adm-set-bankname').value.trim();
    s.accountNumber = document.getElementById('adm-set-accno').value.trim();
    s.accountName = document.getElementById('adm-set-accname').value.trim();
    s.momoPhone = document.getElementById('adm-set-momo').value.trim();
    s.momoName = document.getElementById('adm-set-momoname').value.trim();
    s.hotline = document.getElementById('adm-set-hotline').value.trim();
    s.socials = {
      ...s.socials,
      zalo: document.getElementById('adm-set-zalo').value.trim(),
      messenger: document.getElementById('adm-set-msg').value.trim(),
      tiktok: document.getElementById('adm-set-tiktok').value.trim()
    };
    s.analytics = {
      clarityId: document.getElementById('adm-set-clarity').value.trim(),
      ga4Id: document.getElementById('adm-set-ga4').value.trim()
    };
    this.saveSettings();
    this.injectAnalytics();
    this.renderFloatingSocials();
    this.showToast('Đã lưu cài đặt Thanh toán VietQR, MoMo & Analytics!');
  },

  renderFloatingSocials() {
    const mount = document.getElementById('floating-cskh-mount');
    if (!mount) return;
    const s = this.state.settings;
    mount.innerHTML = `
      <a href="${s.socials?.zalo || '#'}" target="_blank" rel="noopener"
         title="Chat Zalo cùng Nếp Lễ"
         class="w-11 h-11 rounded-full bg-[#0d2931] text-[#f0b45b] border border-[#f0b45b] shadow-lg flex items-center justify-center font-extrabold text-xs hover:scale-110 transition">
        Zalo
      </a>
      <a href="${s.socials?.messenger || '#'}" target="_blank" rel="noopener"
         title="Nhắn Messenger"
         class="w-11 h-11 rounded-full bg-[#691727] text-[#faf7f2] border border-[#f0b45b]/60 shadow-lg flex items-center justify-center font-bold text-xs hover:scale-110 transition">
        Chat
      </a>
      <a href="tel:${(s.hotline || '0901234567').replace(/\s+/g, '')}"
         title="Gọi Hotline: ${s.hotline}"
         class="w-11 h-11 rounded-full bg-[#a94025] text-white shadow-lg flex items-center justify-center hover:scale-110 transition">
        📞
      </a>
    `;
  },

  showToast(message) {
    const toast = document.getElementById('neple-toast');
    const text = document.getElementById('neple-toast-text');
    if (!toast || !text) return;
    text.textContent = message;
    toast.classList.remove('hidden');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 3400);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  NepleApp.init();
});
