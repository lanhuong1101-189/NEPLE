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
    checkoutForm: {
      name: '',
      phone: '',
      province: '',
      district: '',
      addressDetail: '',
      note: ''
    },
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
      const parsedSettings = savedSettings ? JSON.parse(savedSettings) : {};
      this.state.settings = {
        ...DEFAULT_SETTINGS,
        ...parsedSettings,
        shipping: {
          ...DEFAULT_SETTINGS.shipping,
          ...(parsedSettings.shipping || {})
        },
        googleSheets: {
          ...DEFAULT_SETTINGS.googleSheets,
          ...(parsedSettings.googleSheets || {})
        }
      };
      if (this.state.settings.shipping.freeShipThreshold === 250000 || this.state.settings.shipping.freeShipThreshold === 180000) {
        this.state.settings.shipping.freeShipThreshold = 200000;
        this.saveSettings();
      }

      const savedCart = localStorage.getItem(NEPLE_STORAGE_KEYS.CART);
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];
      this.state.cart = parsedCart.map(item => {
        const freshProd = this.state.products.find(p => p.id === item.id);
        return freshProd
          ? {
              ...item,
              name: freshProd.name,
              tierLabel: freshProd.tierLabel,
              price: freshProd.price,
              image: freshProd.image
            }
          : item;
      });
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
                  ? rituals.length === 3
                    ? `<div class="text-xs font-medium text-[#0d2931]/45 line-through">${this.formatVND(matched.originalPrice)}</div>`
                    : `<div class="text-[11px] font-bold text-[#691727]"><span class="text-[#0d2931]/45 line-through font-normal mr-1">${this.formatVND(matched.originalPrice)}</span>-${matched.discountPercent}%</div>`
                  : ''
              }
            </div>
          </div>

          ${
            rituals.length < 3
              ? `
            <button type="button" onclick="NepleApp.setRitualsPreset(['tien-tao', 'giao-thua', 'khai-xuan'])"
              class="w-full py-2.5 px-4 rounded-xl bg-[#691727] hover:bg-[#4d0f1b] text-[#f0b45b] text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm">
              <span>Chọn đủ 3 dịp lễ (Combo Trọn Tết • 289.000đ)</span>
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
      .map(blog => this.renderBlogCardHTML(blog, true))
      .join('');
  },

  scrollHomeBlog(direction = 1) {
    const container = document.getElementById('home-blog-preview-mount');
    if (!container) return;
    const cardStep = 360;
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (container.scrollLeft + 30 >= maxScroll) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: direction * cardStep, behavior: 'smooth' });
    }
  },

  renderBlogCardHTML(blog, isHome = false) {
    const cardWidthClass = isHome 
      ? 'w-[280px] sm:w-[330px] md:w-[360px] shrink-0' 
      : 'w-full';

    return `
      <article onclick="NepleApp.switchView('cam-nang'); NepleApp.openBlogArticle('${blog.id}')"
        class="paper-card rounded-2xl overflow-hidden flex flex-col justify-between p-5 sm:p-6 cursor-pointer group hover:-translate-y-1.5 transition-all duration-300 shadow-md hover:shadow-xl border border-[#ae9984]/30 select-none ${cardWidthClass}">
        <div>
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="px-3 py-1 rounded-full bg-[#72826f] text-white text-[11px] font-semibold">
              ${blog.category}
            </span>
            ${blog.prayerText ? `<span class="px-2.5 py-0.5 rounded-full bg-[#f0b45b]/30 text-[#0d2931] text-[11px] font-bold">Có Văn Khấn</span>` : ''}
          </div>

          <h3 class="font-bevietnam-bold text-lg sm:text-xl text-[#0d2931] group-hover:text-[#691727] transition-colors leading-snug">
            ${blog.title}
          </h3>
          <p class="text-xs sm:text-sm text-[#0d2931]/75 mt-3 line-clamp-3 sm:line-clamp-4 leading-relaxed">
            ${blog.excerpt}
          </p>
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

        <h1 class="font-bevietnam-bold text-2xl sm:text-4xl text-[#0d2931] mt-5 leading-tight">
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

  vnLocations: {
    'TP. Hồ Chí Minh': [
      'Quận 1', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8', 'Quận 10', 'Quận 11', 'Quận 12',
      'Quận Bình Thạnh', 'Quận Phú Nhuận', 'Quận Gò Vấp', 'Quận Tân Bình', 'Quận Tân Phú', 'Quận Bình Tân',
      'TP. Thủ Đức', 'Huyện Bình Chánh', 'Huyện Hóc Môn', 'Huyện Nhà Bè', 'Huyện Củ Chi', 'Huyện Cần Giờ'
    ],
    'Hà Nội': [
      'Quận Ba Đình', 'Quận Hoàn Kiếm', 'Quận Đống Đa', 'Quận Hai Bà Trưng', 'Quận Cầu Giấy', 'Quận Thanh Xuân',
      'Quận Tây Hồ', 'Quận Hoàng Mai', 'Quận Long Biên', 'Quận Nam Từ Liêm', 'Quận Bắc Từ Liêm', 'Quận Hà Đông',
      'Huyện Gia Lâm', 'Huyện Đông Anh', 'Huyện Thanh Trì', 'Huyện Hoài Đức', 'Thị xã Sơn Tây'
    ],
    'Đà Nẵng': [
      'Quận Hải Châu', 'Quận Thanh Khê', 'Quận Sơn Trà', 'Quận Ngũ Hành Sơn', 'Quận Liên Chiểu', 'Quận Cẩm Lệ', 'Huyện Hòa Vang'
    ],
    'Hải Phòng': [
      'Quận Hồng Bàng', 'Quận Ngô Quyền', 'Quận Lê Chân', 'Quận Hải An', 'Quận Kiến An', 'Quận Dương Kinh', 'Quận Đồ Sơn', 'TP. Thủy Nguyên'
    ],
    'Cần Thơ': [
      'Quận Ninh Kiều', 'Quận Bình Thủy', 'Quận Cái Răng', 'Quận Ô Môn', 'Quận Thốt Nốt', 'Huyện Phong Điền'
    ],
    'Bình Dương': [
      'TP. Thủ Dầu Một', 'TP. Thuận An', 'TP. Dĩ An', 'TP. Tân Uyên', 'TP. Bến Cát', 'Huyện Bàu Bàng'
    ],
    'Đồng Nai': [
      'TP. Biên Hòa', 'TP. Long Khánh', 'Huyện Long Thành', 'Huyện Nhơn Trạch', 'Huyện Trảng Bom'
    ],
    'Khánh Hòa': [
      'TP. Nha Trang', 'TP. Cam Ranh', 'Thị xã Ninh Hòa', 'Huyện Diên Khánh'
    ],
    'Thừa Thiên Huế': [
      'Quận Thuận Hóa', 'Quận Phú Xuân', 'Thị xã Hương Thủy', 'Thị xã Hương Trà', 'Huyện Phú Vang'
    ],
    'Quảng Ninh': [
      'TP. Hạ Long', 'TP. Cẩm Phả', 'TP. Uông Bí', 'TP. Móng Cái', 'Thị xã Quảng Yên'
    ],
    'Lâm Đồng': [
      'TP. Đà Lạt', 'TP. Bảo Lộc', 'Huyện Đức Trọng', 'Huyện Đơn Dương'
    ],
    'Bà Rịa - Vũng Tàu': [
      'TP. Vũng Tàu', 'TP. Bà Rịa', 'Thị xã Phú Mỹ', 'Huyện Long Điền'
    ],
    'Tỉnh / Thành khác': [
      'Trung tâm Thành phố / Thị xã', 'Quận / Huyện nội tỉnh'
    ]
  },

  isValidVNPhone(phone) {
    const clean = (phone || '').replace(/\s+/g, '');
    return /^(03|05|07|08|09)\d{8}$/.test(clean);
  },

  calculateShippingFee() {
    const f = this.state.checkoutForm || {};
    const subtotal = this.getCartTotal();
    const s = this.state.settings?.shipping || DEFAULT_SETTINGS.shipping;
    const hasComboTronTet = this.state.cart.some(item => item.id === 'combo-tron-tet');

    const isComboFreeship = (s.freeShipCombo !== false) && hasComboTronTet;
    const isThresholdFreeship = (Number(s.freeShipThreshold) > 0) && (subtotal >= Number(s.freeShipThreshold));

    let baseFee = Number(s.innerCityFee) || 25000;
    let locationType = 'none';

    if (!f.province) {
      locationType = 'none';
      baseFee = Number(s.innerCityFee) || 25000;
    } else if (f.province === 'TP. Hồ Chí Minh') {
      const suburbanDistricts = ['Huyện Bình Chánh', 'Huyện Hóc Môn', 'Huyện Nhà Bè', 'Huyện Củ Chi', 'Huyện Cần Giờ'];
      if (f.district && suburbanDistricts.includes(f.district)) {
        locationType = 'suburban';
        baseFee = Number(s.suburbanFee) || 30000;
      } else {
        locationType = 'inner';
        baseFee = Number(s.innerCityFee) || 25000;
      }
    } else if (f.province === 'Hà Nội') {
      const suburbanDistricts = ['Huyện Gia Lâm', 'Huyện Đông Anh', 'Huyện Thanh Trì', 'Huyện Hoài Đức', 'Thị xã Sơn Tây'];
      if (f.district && suburbanDistricts.includes(f.district)) {
        locationType = 'suburban';
        baseFee = Number(s.suburbanFee) || 30000;
      } else {
        locationType = 'inner';
        baseFee = Number(s.innerCityFee) || 25000;
      }
    } else {
      locationType = 'interprovincial';
      baseFee = Number(s.interprovincialFee) || 35000;
    }

    if (isComboFreeship || isThresholdFreeship) {
      const reason = isComboFreeship ? 'Ưu đãi Combo Trọn Tết' : `Đơn từ ${this.formatVND(s.freeShipThreshold)}`;
      return {
        fee: 0,
        originalFee: baseFee,
        isFree: true,
        reason,
        label: `Miễn phí (0đ) — ${reason}`,
        locationType,
        hasLocation: Boolean(f.province)
      };
    }

    if (!f.province) {
      return {
        fee: 0,
        originalFee: baseFee,
        isFree: false,
        reason: 'Chọn Tỉnh / Thành để tính',
        label: 'Chọn Tỉnh / Thành để tính',
        locationType,
        hasLocation: false
      };
    }

    const typeLabel = locationType === 'inner' ? 'Nội thành' : locationType === 'suburban' ? 'Ngoại thành' : 'Liên tỉnh / Toàn quốc';
    return {
      fee: baseFee,
      originalFee: baseFee,
      isFree: false,
      reason: typeLabel,
      label: `${this.formatVND(baseFee)} (${typeLabel})`,
      locationType,
      hasLocation: true
    };
  },

  updateCheckoutPricingLive() {
    const shippingInfo = this.calculateShippingFee();
    const subtotal = this.getCartTotal();
    const finalTotal = subtotal + shippingInfo.fee;

    const shipFeeEl = document.getElementById('chk-shipping-fee-display');
    const totalEl = document.getElementById('chk-total-display');
    const submitBtn = document.getElementById('chk-submit-btn');

    if (shipFeeEl) {
      if (shippingInfo.isFree) {
        shipFeeEl.innerHTML = `
          <div class="flex flex-col items-end">
            <div>
              <span class="text-xs text-[#0d2931]/40 line-through mr-1">${this.formatVND(shippingInfo.originalFee)}</span>
              <span class="font-bold text-[#72826f]">Miễn phí (0đ)</span>
            </div>
            <span class="text-[11px] text-[#72826f] font-medium">${shippingInfo.reason}</span>
          </div>
        `;
      } else if (!shippingInfo.hasLocation) {
        shipFeeEl.innerHTML = `<span class="text-xs text-[#0d2931]/60 italic">Chọn Tỉnh / Thành để tính</span>`;
      } else {
        shipFeeEl.innerHTML = `
          <div class="flex flex-col items-end">
            <span class="font-bold text-[#0d2931]">${this.formatVND(shippingInfo.fee)}</span>
            <span class="text-[11px] text-[#0d2931]/60">(${shippingInfo.reason})</span>
          </div>
        `;
      }
    }

    if (totalEl) {
      totalEl.textContent = this.formatVND(finalTotal);
    }

    if (submitBtn) {
      submitBtn.textContent = `XÁC NHẬN ĐẶT HÀNG • ${this.formatVND(finalTotal)}`;
    }
  },

  syncCheckoutFormFromDOM() {
    if (!this.state.checkoutForm) {
      this.state.checkoutForm = { name: '', phone: '', province: '', district: '', addressDetail: '', note: '' };
    }
    const nameEl = document.getElementById('chk-name');
    const phoneEl = document.getElementById('chk-phone');
    const provEl = document.getElementById('chk-province');
    const distEl = document.getElementById('chk-district');
    const addrEl = document.getElementById('chk-address');
    const noteEl = document.getElementById('chk-note');

    if (nameEl) this.state.checkoutForm.name = nameEl.value;
    if (phoneEl) {
      const cleaned = phoneEl.value.replace(/[^0-9]/g, '').slice(0, 10);
      if (phoneEl.value !== cleaned) phoneEl.value = cleaned;
      this.state.checkoutForm.phone = cleaned;
      this.state.checkoutPhonePreview = cleaned;
    }
    if (provEl) this.state.checkoutForm.province = provEl.value;
    if (distEl) this.state.checkoutForm.district = distEl.value;
    if (addrEl) this.state.checkoutForm.addressDetail = addrEl.value;
    if (noteEl) this.state.checkoutForm.note = noteEl.value;
  },

  updateCartQty(productId, delta) {
    this.syncCheckoutFormFromDOM();
    const idx = this.state.cart.findIndex(i => i.id === productId);
    if (idx === -1) return;
    this.state.cart[idx].qty += delta;
    if (this.state.cart[idx].qty <= 0) {
      this.state.cart.splice(idx, 1);
    }
    this.saveCart();
    this.renderCheckoutModalContent();
  },

  removeCartItem(productId) {
    this.syncCheckoutFormFromDOM();
    this.state.cart = this.state.cart.filter(i => i.id !== productId);
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
    this.syncCheckoutFormFromDOM();
    this.state.paymentMethod = method;
    this.renderPaymentMethodDetails();
  },

  onCheckoutProvinceChange(provinceVal) {
    this.syncCheckoutFormFromDOM();
    this.state.checkoutForm.province = provinceVal;
    this.state.checkoutForm.district = '';
    const distSelect = document.getElementById('chk-district');
    if (distSelect) {
      const districts = this.vnLocations[provinceVal] || [];
      distSelect.innerHTML = `<option value="">Chọn Quận / Huyện / Thị xã *</option>` +
        districts.map(d => `<option value="${d}">${d}</option>`).join('');
      distSelect.disabled = districts.length === 0;
    }
    this.validateCheckoutFormLive();
  },

  onCheckoutFieldInput() {
    this.syncCheckoutFormFromDOM();
    this.validateCheckoutFormLive();
  },

  onCheckoutPhoneInput(val) {
    this.syncCheckoutFormFromDOM();
    this.validateCheckoutFormLive();
    this.renderPaymentMethodDetails();
  },

  validateCheckoutFormLive() {
    const f = this.state.checkoutForm || {};
    const phoneEl = document.getElementById('chk-phone');
    const helperEl = document.getElementById('chk-phone-helper');
    const submitBtn = document.getElementById('chk-submit-btn');

    const phoneVal = (f.phone || '').trim();
    const phoneValid = this.isValidVNPhone(phoneVal);
    const showPhoneError = phoneVal.length > 0 && !phoneValid;

    if (phoneEl && helperEl) {
      if (showPhoneError) {
        phoneEl.classList.remove('border-[#ae9984]', 'focus:border-[#0d2931]');
        phoneEl.classList.add('border-red-600', 'focus:border-red-600', 'bg-red-50/30');
        helperEl.textContent = 'Số điện thoại chưa hợp lệ (gồm 10 số, đầu 03, 05, 07, 08, 09)';
        helperEl.className = 'text-[12px] text-red-600 font-medium mt-1';
      } else {
        phoneEl.classList.remove('border-red-600', 'focus:border-red-600', 'bg-red-50/30');
        phoneEl.classList.add('border-[#ae9984]', 'focus:border-[#0d2931]');
        helperEl.textContent = '(Dùng tra cứu đơn)';
        helperEl.className = 'text-[12px] text-[#666666] mt-1';
      }
    }

    const isFormComplete =
      (f.name || '').trim().length >= 2 &&
      phoneValid &&
      (f.province || '').trim().length > 0 &&
      (f.district || '').trim().length > 0 &&
      (f.addressDetail || '').trim().length >= 3 &&
      this.state.cart.length > 0;

    if (submitBtn) {
      submitBtn.disabled = !isFormComplete;
    }
    this.updateCheckoutPricingLive();
    return isFormComplete;
  },

  renderCheckoutModalContent() {
    const container = document.getElementById('checkout-modal-body');
    if (!container) return;

    if (this.state.cart.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12">
          <h4 style="font-family: 'Be Vietnam Pro', sans-serif !important; font-weight: 700 !important;" class="text-xl font-bold text-[#0d2931]">Giỏ lễ của bạn đang trống</h4>
          <p class="text-xs sm:text-sm text-[#0d2931]/70 mt-1">Hãy chọn gói lẻ hoặc Combo Nếp Lễ phù hợp với gia đình bạn nhé.</p>
          <button onclick="NepleApp.closeCheckoutModal()" class="mt-4 px-5 py-2.5 rounded-xl bg-[#BA3820] hover:bg-[#9e2e19] text-white text-xs font-bold transition">
            Quay lại chọn gói lễ
          </button>
        </div>
      `;
      return;
    }

    const total = this.getCartTotal();
    const f = this.state.checkoutForm || { name: '', phone: '', province: '', district: '', addressDetail: '', note: '' };
    const provinces = Object.keys(this.vnLocations);
    const districts = f.province ? (this.vnLocations[f.province] || []) : [];

    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="lg:col-span-7 space-y-5">
          <!-- 1. CART ITEM SUMMARY WITH THUMBNAIL & TRASH BUTTON -->
          <div>
            <h4 class="text-xs font-extrabold uppercase tracking-wider text-[#72826f] mb-2.5">
              1. Gói Lễ Đã Chọn
            </h4>
            <div class="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              ${this.state.cart
                .map(item => {
                  const matchedProd = this.state.products.find(p => p.id === item.id);
                  const thumbSrc = item.image || matchedProd?.image || 'logo.png';
                  return `
                <div class="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#faf7f2] border border-[#ae9984]/50">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-13 h-13 sm:w-14 sm:h-14 rounded-[8px] overflow-hidden bg-white border border-[#ae9984]/40 shrink-0 p-1 flex items-center justify-center">
                      <img src="${thumbSrc}" alt="${item.name}" class="w-full h-full object-contain" />
                    </div>
                    <div class="min-w-0">
                      <div class="text-sm sm:text-base font-bold text-[#0d2931] truncate">${item.name}</div>
                      <div class="text-xs sm:text-sm text-[#a94025] font-bold mt-0.5">${this.formatVND(item.price)}</div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <div class="flex items-center gap-1.5 bg-white px-1.5 py-1 rounded-lg border border-[#ae9984]/40">
                      <button type="button" onclick="NepleApp.updateCartQty('${item.id}', -1)" class="w-7 h-7 rounded-md bg-[#efe9e0] hover:bg-[#0d2931] hover:text-white font-bold text-xs transition">-</button>
                      <span class="text-xs font-bold w-6 text-center text-[#0d2931]">${item.qty}</span>
                      <button type="button" onclick="NepleApp.updateCartQty('${item.id}', 1)" class="w-7 h-7 rounded-md bg-[#efe9e0] hover:bg-[#0d2931] hover:text-white font-bold text-xs transition">+</button>
                    </div>
                    <button type="button" onclick="NepleApp.removeCartItem('${item.id}')" title="Xóa gói lễ này"
                      class="w-8 h-8 rounded-lg bg-white border border-[#ae9984]/40 text-[#0d2931]/60 hover:bg-red-50 hover:text-red-600 hover:border-red-300 flex items-center justify-center transition">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              `;
                })
                .join('')}
            </div>
          </div>

          <!-- 2. CUSTOMER SHIPPING FORM -->
          <form id="neple-checkout-form" onsubmit="NepleApp.submitOrder(event)" class="space-y-3.5" novalidate>
            <h4 class="text-xs font-extrabold uppercase tracking-wider text-[#72826f]">
              2. Thông Tin Nhận Hộp Lễ
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
              <div>
                <label class="block text-xs font-semibold text-[#0d2931] mb-1">Họ và tên người nhận <span class="text-red-600">*</span></label>
                <input type="text" id="chk-name" required placeholder="VD: Nguyễn Minh Anh"
                  value="${f.name.replace(/"/g, '&quot;')}"
                  oninput="NepleApp.onCheckoutFieldInput()"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#ae9984] text-sm focus:outline-none focus:border-[#0d2931] transition" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-[#0d2931] mb-1">Số điện thoại <span class="text-red-600">*</span></label>
                <input type="tel" id="chk-phone" required maxlength="10" placeholder="VD: 0901234567"
                  value="${f.phone}"
                  oninput="NepleApp.onCheckoutPhoneInput(this.value)"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#ae9984] text-sm focus:outline-none focus:border-[#0d2931] transition" />
                <p id="chk-phone-helper" class="text-[12px] text-[#666666] mt-1">(Dùng tra cứu đơn)</p>
              </div>
            </div>

            <!-- Structured 2-Row Address Input -->
            <div class="space-y-2.5">
              <label class="block text-xs font-semibold text-[#0d2931]">Địa chỉ nhận hàng chi tiết <span class="text-red-600">*</span></label>
              <!-- Row 1: Province / City & District -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select id="chk-province" required onchange="NepleApp.onCheckoutProvinceChange(this.value)"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#ae9984] text-sm text-[#0d2931] focus:outline-none focus:border-[#0d2931] transition">
                  <option value="">Chọn Tỉnh / Thành phố *</option>
                  ${provinces
                    .map(p => `<option value="${p}" ${f.province === p ? 'selected' : ''}>${p}</option>`)
                    .join('')}
                </select>
                <select id="chk-district" required ${districts.length === 0 ? 'disabled' : ''} onchange="NepleApp.onCheckoutFieldInput()"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#ae9984] text-sm text-[#0d2931] disabled:bg-[#f4efe6]/70 disabled:text-[#0d2931]/50 focus:outline-none focus:border-[#0d2931] transition">
                  <option value="">Chọn Quận / Huyện / Thị xã *</option>
                  ${districts
                    .map(d => `<option value="${d}" ${f.district === d ? 'selected' : ''}>${d}</option>`)
                    .join('')}
                </select>
              </div>
              <!-- Row 2: Street, Building, Ward -->
              <div>
                <input type="text" id="chk-address" required placeholder="Số nhà, tên đường, tòa nhà/căn hộ, phường/xã..."
                  value="${f.addressDetail.replace(/"/g, '&quot;')}"
                  oninput="NepleApp.onCheckoutFieldInput()"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#ae9984] text-sm focus:outline-none focus:border-[#0d2931] transition" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-[#0d2931] mb-1">Ghi chú giao hàng (Tùy chọn)</label>
              <input type="text" id="chk-note" placeholder="VD: Giao trước ngày 20 tháng Chạp, gọi trước khi giao..."
                value="${f.note.replace(/"/g, '&quot;')}"
                oninput="NepleApp.onCheckoutFieldInput()"
                class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#ae9984] text-sm focus:outline-none focus:border-[#0d2931] transition" />
            </div>
          </form>
        </div>

        <!-- 3. PAYMENT METHOD, SUMMARY & PRIMARY SUBMIT CTA -->
        <div class="lg:col-span-5 flex flex-col justify-between bg-[#f4efe6] p-4 sm:p-5 rounded-2xl border border-[#ae9984]">
          <div>
            <h4 class="text-xs font-extrabold uppercase tracking-wider text-[#0d2931] mb-3">
              3. Chọn Phương Thức Thanh Toán
            </h4>
            <div class="grid grid-cols-3 gap-2.5" id="payment-method-tabs"></div>
          </div>

          <div class="mt-6 pt-4 border-t border-[#ae9984]/60 space-y-2">
            <div class="flex items-center justify-between text-xs sm:text-sm text-[#0d2931]/80">
              <span>Phí vận chuyển:</span>
              <div id="chk-shipping-fee-display">
                <span class="text-xs text-[#0d2931]/60 italic">Chọn Tỉnh / Thành để tính</span>
              </div>
            </div>
            <div class="flex items-baseline justify-between pt-0.5">
              <span class="text-sm sm:text-base font-bold text-[#0d2931]">Tổng thanh toán:</span>
              <span id="chk-total-display" class="text-2xl font-extrabold text-[#BA3820]">${this.formatVND(total)}</span>
            </div>

            <button type="submit" id="chk-submit-btn" form="neple-checkout-form" disabled
              class="mt-3 w-full py-4 px-6 rounded-xl bg-[#BA3820] hover:bg-[#9e2e19] text-white font-bold text-sm sm:text-base uppercase tracking-wide shadow-lg transition disabled:bg-[#c5b9ac] disabled:text-white/80 disabled:cursor-not-allowed disabled:shadow-none">
              XÁC NHẬN ĐẶT HÀNG • ${this.formatVND(total)}
            </button>
          </div>
        </div>
      </div>
    `;
    this.renderPaymentMethodDetails();
    this.validateCheckoutFormLive();
  },

  renderPaymentMethodDetails() {
    const tabsEl = document.getElementById('payment-method-tabs');
    if (!tabsEl) return;

    const method = this.state.paymentMethod;
    const methods = [
      { id: 'VIETQR', label: 'VietQR' },
      { id: 'MOMO', label: 'Ví MoMo' },
      { id: 'COD', label: 'COD' }
    ];

    tabsEl.innerHTML = methods
      .map(m => {
        const isActive = method === m.id;
        return `
      <button type="button" onclick="NepleApp.setPaymentMethod('${m.id}')"
        class="relative py-3 px-2.5 rounded-xl text-xs sm:text-sm font-bold border-2 whitespace-nowrap transition flex items-center justify-center gap-1.5 ${
          isActive
            ? 'bg-[#fffdf9] text-[#691727] border-[#BA3820] shadow-sm'
            : 'bg-white text-[#0d2931]/80 border-[#ae9984]/50 hover:border-[#ae9984]'
        }">
        ${
          isActive
            ? `<span class="w-4 h-4 rounded-full bg-[#BA3820] text-white text-[10px] flex items-center justify-center font-extrabold shrink-0">✓</span>`
            : `<span class="w-4 h-4 rounded-full border border-[#ae9984] shrink-0"></span>`
        }
        <span>${m.label}</span>
      </button>
    `;
      })
      .join('');
  },

  buildOrderPaymentData(method, cleanPhone, total, orderId) {
    const s = this.state.settings || DEFAULT_SETTINGS;
    const transferContent = `NEPLE ${cleanPhone}`;
    if (method === 'VIETQR') {
      const qrImageUrl = s.customQrImage || `https://img.vietqr.io/image/${encodeURIComponent(s.bankId)}-${encodeURIComponent(
        s.accountNumber
      )}-compact2.png?amount=${total}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(
        s.accountName
      )}`;
      return {
        transferContent,
        qrImageUrl,
        bankName: s.bankName,
        accountNumber: s.accountNumber,
        accountName: s.accountName
      };
    }
    if (method === 'MOMO') {
      const momoQrSvg = s.customQrImage ||
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
      return {
        transferContent,
        qrImageUrl: momoQrSvg,
        momoPhone: s.momoPhone,
        momoName: s.momoName
      };
    }
    return {
      transferContent: '',
      qrImageUrl: ''
    };
  },

  submitOrder(e) {
    e.preventDefault();
    this.syncCheckoutFormFromDOM();
    const f = this.state.checkoutForm || {};
    const name = (f.name || '').trim();
    const phone = (f.phone || '').trim();
    const province = (f.province || '').trim();
    const district = (f.district || '').trim();
    const addressDetail = (f.addressDetail || '').trim();
    const note = (f.note || '').trim();

    if (!name || !this.isValidVNPhone(phone) || !province || !district || !addressDetail) {
      this.validateCheckoutFormLive();
      this.showToast('Vui lòng điền đầy đủ Họ tên, SĐT 10 số hợp lệ và Địa chỉ nhận hàng!');
      return;
    }

    const cleanPhone = phone.replace(/\s+/g, '');
    const fullAddress = `${addressDetail}, ${district}, ${province}`;
    const subtotal = this.getCartTotal();
    const shippingInfo = this.calculateShippingFee();
    const shippingFee = shippingInfo.fee;
    const finalTotal = subtotal + shippingFee;
    const shippingLabel = shippingInfo.isFree
      ? `Miễn phí (0đ) — ${shippingInfo.reason}`
      : `${this.formatVND(shippingFee)} (${shippingInfo.reason})`;
    const orderId = 'NP-' + Math.floor(100000 + Math.random() * 900000);

    const paymentLabels = {
      VIETQR: 'Chuyển khoản VietQR Ngân hàng',
      MOMO: 'Thanh toán Ví MoMo',
      COD: 'Thanh toán khi nhận hàng (COD)'
    };

    const paymentDetails = this.buildOrderPaymentData(this.state.paymentMethod, cleanPhone, finalTotal, orderId);

    const newOrder = {
      id: orderId,
      customerName: name,
      phone: cleanPhone,
      province,
      district,
      addressDetail,
      address: fullAddress,
      note: note || 'Giao tiêu chuẩn trước Tết',
      paymentMethod: this.state.paymentMethod,
      paymentLabel: paymentLabels[this.state.paymentMethod],
      paymentDetails,
      status: 'Đã tiếp nhận',
      createdAt: new Date().toLocaleString('vi-VN'),
      subtotal,
      shippingFee,
      shippingLabel,
      total: finalTotal,
      items: this.state.cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, image: i.image }))
    };

    // Save order immediately so Admin has full order + QR payment info
    this.state.orders.unshift(newOrder);
    this.saveOrders();

    // Đồng bộ đơn hàng mới tức thì lên Google Sheets nếu đã cấu hình
    if (this.state.settings?.googleSheets?.syncUrl) {
      this.syncOrderToGoogleSheets(newOrder);
    }
    this.state.cart = [];
    this.state.checkoutForm = { name: '', phone: '', province: '', district: '', addressDetail: '', note: '' };
    this.state.checkoutPhonePreview = '';
    this.saveCart();

    // If user chose VIETQR or MOMO, show the dedicated QR Payment Screen inside the modal
    if (newOrder.paymentMethod === 'VIETQR' || newOrder.paymentMethod === 'MOMO') {
      this.renderOrderPaymentQRScreen(newOrder);
      this.showToast(`Đã tạo đơn ${newOrder.id}! Vui lòng quét mã QR để hoàn tất thanh toán.`);
      return;
    }

    // For COD, finish directly and go to Order Tracking
    this.finishOrderAndTrack(newOrder.phone, newOrder.id);
  },

  renderOrderPaymentQRScreen(order) {
    const container = document.getElementById('checkout-modal-body');
    if (!container) return;

    const p = order.paymentDetails || this.buildOrderPaymentData(order.paymentMethod, order.phone, order.total, order.id);
    const isVietQR = order.paymentMethod === 'VIETQR';

    container.innerHTML = `
      <div class="max-w-3xl mx-auto py-2 space-y-6">
        <div class="p-4 rounded-2xl bg-[#72826f]/15 border border-[#72826f]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span class="text-xs font-extrabold uppercase tracking-wider text-[#72826f] block">Đơn hàng đã được ghi nhận vào hệ thống</span>
            <div style="font-family: 'Be Vietnam Pro', sans-serif; font-weight: 700;" class="text-lg sm:text-xl font-bold text-[#0d2931] mt-0.5">
              Mã đơn: ${order.id} — ${order.customerName} (${order.phone})
            </div>
            <div class="text-xs text-[#0d2931]/75 mt-0.5">Địa chỉ: ${order.address}</div>
          </div>
          <span class="px-3.5 py-1.5 rounded-full bg-[#0d2931] text-[#f0b45b] text-xs font-extrabold shrink-0 self-start sm:self-center">
            ${order.paymentLabel}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#f4efe6] p-5 sm:p-6 rounded-3xl border-2 border-[#ae9984]">
          <!-- QR Image Column -->
          <div class="md:col-span-5 text-center space-y-2">
            <div class="text-xs font-extrabold uppercase tracking-wider ${isVietQR ? 'text-[#0d2931]' : 'text-[#a50064]'}">
              ${isVietQR ? 'Quét Mã VietQR Napas 247' : 'Quét Mã QR Ví MoMo'}
            </div>
            <div class="w-56 h-56 mx-auto rounded-2xl overflow-hidden border-2 border-[#f0b45b] bg-white shadow-md flex items-center justify-center p-2">
              <img src="${p.qrImageUrl}" alt="QR Thanh Toán ${order.id}" class="w-full h-full object-contain"
                onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 200 200\\'><rect width=\\'200\\' height=\\'200\\' fill=\\'#faf7f2\\'/><rect x=\\'20\\' y=\\'20\\' width=\\'50\\' height=\\'50\\' fill=\\'#0d2931\\'/><rect x=\\'130\\' y=\\'20\\' width=\\'50\\' height=\\'50\\' fill=\\'#0d2931\\'/><rect x=\\'20\\' y=\\'130\\' width=\\'50\\' height=\\'50\\' fill=\\'#0d2931\\'/><rect x=\\'80\\' y=\\'80\\' width=\\'40\\' height=\\'40\\' fill=\\'#691727\\'/><text x=\\'100\\' y=\\'192\\' text-anchor=\\'middle\\' font-size=\\'11\\' font-family=\\'sans-serif\\' fill=\\'#0d2931\\'>VIETQR NAPAS</text></svg>');" />
            </div>
            <p class="text-[11px] text-[#0d2931]/65">Mở App Ngân hàng hoặc MoMo quét mã để tự động điền đúng số tiền &amp; nội dung</p>
          </div>

          <!-- Transfer Details Column -->
          <div class="md:col-span-7 space-y-3">
            <div class="p-4 rounded-2xl bg-white border border-[#ae9984]/50 space-y-2.5 text-xs sm:text-sm">
              ${
                isVietQR
                  ? `
                <div class="flex justify-between gap-2 py-1 border-b border-[#ae9984]/25">
                  <span class="text-[#0d2931]/65">Ngân hàng:</span>
                  <strong class="text-[#0d2931] text-right">${p.bankName}</strong>
                </div>
                <div class="flex justify-between items-center gap-2 py-1 border-b border-[#ae9984]/25">
                  <span class="text-[#0d2931]/65">Số tài khoản:</span>
                  <div class="flex items-center gap-2">
                    <strong class="text-[#0d2931] text-base">${p.accountNumber}</strong>
                    <button type="button" onclick="navigator.clipboard?.writeText('${p.accountNumber}'); NepleApp.showToast('Đã sao chép Số tài khoản!');"
                      class="px-2 py-0.5 rounded bg-[#efe9e0] hover:bg-[#0d2931] hover:text-white text-[11px] font-bold transition">Copy</button>
                  </div>
                </div>
                <div class="flex justify-between gap-2 py-1 border-b border-[#ae9984]/25">
                  <span class="text-[#0d2931]/65">Chủ tài khoản:</span>
                  <strong class="text-[#0d2931] text-right">${p.accountName}</strong>
                </div>
              `
                  : `
                <div class="flex justify-between items-center gap-2 py-1 border-b border-[#ae9984]/25">
                  <span class="text-[#0d2931]/65">SĐT Ví MoMo:</span>
                  <div class="flex items-center gap-2">
                    <strong class="text-[#a50064] text-base">${p.momoPhone}</strong>
                    <button type="button" onclick="navigator.clipboard?.writeText('${p.momoPhone}'); NepleApp.showToast('Đã sao chép SĐT MoMo!');"
                      class="px-2 py-0.5 rounded bg-[#efe9e0] hover:bg-[#0d2931] hover:text-white text-[11px] font-bold transition">Copy</button>
                  </div>
                </div>
                <div class="flex justify-between gap-2 py-1 border-b border-[#ae9984]/25">
                  <span class="text-[#0d2931]/65">Chủ ví MoMo:</span>
                  <strong class="text-[#0d2931] text-right">${p.momoName}</strong>
                </div>
              `
              }
              <div class="flex justify-between gap-2 py-1 border-b border-[#ae9984]/25">
                <span class="text-[#0d2931]/65">Tiền hàng:</span>
                <span class="text-[#0d2931] font-semibold">${this.formatVND(order.subtotal || order.total)}</span>
              </div>
              <div class="flex justify-between gap-2 py-1 border-b border-[#ae9984]/25">
                <span class="text-[#0d2931]/65">Phí vận chuyển:</span>
                <span class="${order.shippingFee === 0 ? 'text-[#72826f] font-bold' : 'text-[#0d2931] font-semibold'}">${order.shippingLabel || (order.shippingFee ? this.formatVND(order.shippingFee) : 'Miễn phí (0đ)')}</span>
              </div>
              <div class="flex justify-between gap-2 py-1 border-b border-[#ae9984]/25">
                <span class="text-[#0d2931]/65">Tổng thanh toán:</span>
                <strong class="text-[#BA3820] text-base sm:text-lg font-extrabold">${this.formatVND(order.total)}</strong>
              </div>
              <div class="flex justify-between items-center gap-2 pt-1">
                <span class="text-[#0d2931]/65">Nội dung CK:</span>
                <div class="flex items-center gap-2">
                  <strong class="text-[#691727] bg-[#f0b45b]/35 px-2.5 py-1 rounded-lg font-extrabold">${p.transferContent}</strong>
                  <button type="button" onclick="navigator.clipboard?.writeText('${p.transferContent}'); NepleApp.showToast('Đã sao chép Nội dung chuyển khoản!');"
                    class="px-2 py-0.5 rounded bg-[#efe9e0] hover:bg-[#0d2931] hover:text-white text-[11px] font-bold transition">Copy</button>
                </div>
              </div>
            </div>

            <button type="button" onclick="NepleApp.finishOrderAndTrack('${order.phone}', '${order.id}')"
              class="w-full py-4 px-6 rounded-xl bg-[#BA3820] hover:bg-[#9e2e19] text-white font-bold text-sm sm:text-base uppercase tracking-wide shadow-lg transition">
              HOÀN TẤT &amp; THEO DÕI ĐƠN HÀNG →
            </button>
          </div>
        </div>
      </div>
    `;
  },

  finishOrderAndTrack(phone, orderId) {
    this.closeCheckoutModal();
    this.switchView('tra-cuu');
    const phoneInput = document.getElementById('order-lookup-phone');
    if (phoneInput) phoneInput.value = phone;
    this.lookupOrderByPhone(phone);
    this.showToast(`Đặt đơn ${orderId} thành công! Cảm ơn gia đình bạn đã chọn NEPLE.`);
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
              <div><strong>Ghi chú:</strong> ${order.note || 'Không có'}</div>
              <div><strong>Phương thức:</strong> ${order.paymentLabel || order.paymentMethod}</div>
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
              <div class="pt-2 mt-2 border-t border-[#ae9984]/30 space-y-1 text-xs">
                <div class="flex justify-between text-[#0d2931]/70">
                  <span>Tiền hàng:</span>
                  <span>${this.formatVND(order.subtotal || order.total)}</span>
                </div>
                <div class="flex justify-between text-[#0d2931]/70">
                  <span>Phí vận chuyển:</span>
                  <span class="font-medium text-[#72826f]">${order.shippingLabel || (order.shippingFee ? this.formatVND(order.shippingFee) : 'Miễn phí (0đ)')}</span>
                </div>
                <div class="flex justify-between text-sm font-bold text-[#a94025] pt-1 border-t border-dashed border-[#ae9984]/40">
                  <span>Tổng thanh toán:</span>
                  <span>${this.formatVND(order.total)}</span>
                </div>
              </div>
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
      { id: 'orders', label: 'Theo dõi đơn hàng' },
      { id: 'products', label: 'Quản lí danh mục sản phẩm' },
      { id: 'blogs', label: 'Quản lí nội dung Blog' },
      { id: 'settings', label: 'Cài đặt thanh toán' },
      { id: 'optimize', label: 'Tối ưu website' }
    ];

    const navHTML = `
      <div class="flex items-center overflow-x-auto gap-2 mb-6 pb-2 border-b border-[#ae9984]/30 no-scrollbar">
        ${tabs
          .map(
            t => `
          <button onclick="NepleApp.setAdminTab('${t.id}')"
            class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
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
    `;

    if (tab === 'orders') {
      mount.innerHTML = navHTML + this.renderAdminOrdersTab();
    } else if (tab === 'products') {
      mount.innerHTML = navHTML + this.renderAdminProductsTab();
    } else if (tab === 'blogs') {
      mount.innerHTML = navHTML + this.renderAdminBlogsTab();
    } else if (tab === 'settings') {
      mount.innerHTML = navHTML + this.renderAdminSettingsTab();
    } else {
      mount.innerHTML = navHTML + this.renderAdminOptimizeTab();
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
              <button onclick="NepleApp.exportOrdersCSV()" class="px-3 py-2 rounded-xl bg-[#0d2931] text-[#f0b45b] text-xs font-bold hover:bg-[#163d48] transition">
                Xuất File Excel / CSV
              </button>
              <button onclick="NepleApp.copyOrdersForGoogleSheets()" class="px-3 py-2 rounded-xl bg-[#72826f] text-white text-xs font-bold hover:bg-[#5b6a59] transition">
                Copy Dán Google Sheets
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
                .map(o => {
                  const p = o.paymentDetails || this.buildOrderPaymentData(o.paymentMethod, o.phone, o.total, o.id);
                  const isQRMethod = o.paymentMethod === 'VIETQR' || o.paymentMethod === 'MOMO';
                  return `
                <tr class="hover:bg-[#f4efe6]/70 align-top">
                  <td class="p-3.5 font-bold text-[#0d2931]">
                    ${o.id}
                    <div class="text-[11px] font-normal text-[#0d2931]/60">${o.createdAt}</div>
                  </td>
                  <td class="p-3.5">
                    <div class="font-bold text-[#0d2931]">${o.customerName}</div>
                    <div class="text-xs text-[#691727] font-semibold">${o.phone}</div>
                    <div class="text-xs text-[#0d2931]/70 max-w-xs">${o.address}</div>
                  </td>
                  <td class="p-3.5">
                    ${(o.items || []).map(i => `<div>• ${i.name} (x${i.qty})</div>`).join('')}
                  </td>
                  <td class="p-3.5">
                    <div class="font-extrabold text-[#a94025]">${this.formatVND(o.total)}</div>
                    <div class="text-[11px] font-semibold text-[#0d2931]/80">${o.paymentLabel}</div>
                    <div class="text-[11px] text-[#72826f] mt-0.5">
                      Ship: <strong>${o.shippingLabel || (o.shippingFee ? this.formatVND(o.shippingFee) : 'Miễn phí')}</strong>
                    </div>
                    ${
                      isQRMethod && p.transferContent
                        ? `
                      <div class="mt-1 text-[11px] text-[#691727]">
                        ND CK: <strong class="bg-[#f0b45b]/30 px-1.5 py-0.5 rounded">${p.transferContent}</strong>
                      </div>
                      <details class="mt-1.5 text-[11px]">
                        <summary class="cursor-pointer font-bold text-[#0d2931] hover:text-[#a94025] select-none">
                          Xem mã QR &amp; TT thanh toán
                        </summary>
                        <div class="mt-2 p-2.5 rounded-xl bg-white border border-[#ae9984]/60 space-y-1.5 max-w-[220px]">
                          <img src="${p.qrImageUrl}" alt="QR ${o.id}" class="w-32 h-32 mx-auto object-contain rounded-lg border border-[#ae9984]/30 p-1 bg-[#faf7f2]" />
                          ${
                            o.paymentMethod === 'VIETQR'
                              ? `<div class="text-[10px] leading-snug text-[#0d2931]/80">
                                   <div><strong>NH:</strong> ${p.bankName || ''}</div>
                                   <div><strong>STK:</strong> ${p.accountNumber || ''}</div>
                                 </div>`
                              : `<div class="text-[10px] leading-snug text-[#0d2931]/80">
                                   <div><strong>Ví MoMo:</strong> ${p.momoPhone || ''}</div>
                                 </div>`
                          }
                        </div>
                      </details>
                    `
                        : ''
                    }
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
              `;
                })
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
    const headers = ['Mã Đơn', 'Ngày Đặt', 'Họ Tên', 'Số Điện Thoại', 'Địa Chỉ', 'Sản Phẩm', 'Tiền Hàng', 'Phí Vận Chuyển', 'Tổng Tiền', 'Thanh Toán', 'Trạng Thái', 'Ghi Chú'];
    const rows = this.state.orders.map(o => [
      o.id,
      o.createdAt,
      `"${(o.customerName || '').replace(/"/g, '""')}"`,
      `'${o.phone}`,
      `"${(o.address || '').replace(/"/g, '""')}"`,
      `"${(o.items || []).map(i => `${i.name} (x${i.qty})`).join('; ')}"`,
      o.subtotal || o.total,
      `"${o.shippingLabel || (o.shippingFee ? o.shippingFee : '0')}"`,
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
    const headers = ['Mã Đơn', 'Ngày Đặt', 'Họ Tên', 'Số Điện Thoại', 'Địa Chỉ', 'Sản Phẩm', 'Tiền Hàng', 'Phí Vận Chuyển', 'Tổng Tiền', 'Thanh Toán', 'Trạng Thái'];
    const rows = this.state.orders.map(o =>
      [
        o.id,
        o.createdAt,
        o.customerName,
        o.phone,
        o.address,
        (o.items || []).map(i => `${i.name} (x${i.qty})`).join('; '),
        o.subtotal || o.total,
        o.shippingLabel || (o.shippingFee ? o.shippingFee : '0'),
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
                <label class="px-3.5 py-2 rounded-xl bg-[#72826f] text-white text-xs font-bold cursor-pointer shrink-0 text-center hover:bg-[#5b6a59] transition">
                  Tải ảnh lên
                  <input type="file" accept="image/*" class="hidden" onchange="NepleApp.uploadProductImage(event)" />
                </label>
              </div>
            </div>

            <div class="pt-2 flex justify-end">
              <button type="submit" class="px-6 py-3 rounded-xl btn-terracotta font-bold text-sm shadow-md">
                Lưu Thay Đổi Sản Phẩm
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
                  Xóa bài viết
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
                  <button type="submit" class="px-6 py-3 rounded-xl btn-terracotta font-bold text-sm shadow-md">
                    Lưu Bài Viết &amp; Cấu Hình SEO
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
        </div>

        <!-- 3. Cấu Hình Phí Vận Chuyển (Cách 3: Linh Hoạt Theo Vị Trí & Freeship) -->
        <div class="p-6 rounded-2xl paper-card space-y-4 lg:col-span-2">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-[#ae9984]/30 pb-3">
            <div>
              <h3 class="font-display text-xl font-bold text-[#0d2931]">3. Cấu Hình Phí Vận Chuyển (Cách 3: Theo Vị Trí &amp; Freeship)</h3>
              <p class="text-xs text-[#0d2931]/70 mt-0.5">Tự động tính phí theo địa chỉ khách và miễn phí ship khi giỏ hàng có Combo Trọn Tết hoặc đạt ngưỡng giá trị đơn hàng.</p>
            </div>
            <span class="px-3 py-1 rounded-full bg-[#72826f]/15 text-[#72826f] text-xs font-bold">Cách 3 Đang Bật</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block font-bold mb-1">Phí Nội thành TP.HCM / Hà Nội (VNĐ)</label>
              <input type="number" id="adm-set-innerfee" value="${s.shipping?.innerCityFee ?? 25000}" step="1000" min="0" class="w-full px-3 py-2 rounded-xl border border-[#ae9984] bg-white font-bold text-[#0d2931]" />
              <p class="text-[11px] text-[#0d2931]/60 mt-1">Các quận trung tâm TP.HCM và Hà Nội</p>
            </div>
            <div>
              <label class="block font-bold mb-1">Phí Ngoại thành TP.HCM / Hà Nội (VNĐ)</label>
              <input type="number" id="adm-set-suburbanfee" value="${s.shipping?.suburbanFee ?? 30000}" step="1000" min="0" class="w-full px-3 py-2 rounded-xl border border-[#ae9984] bg-white font-bold text-[#0d2931]" />
              <p class="text-[11px] text-[#0d2931]/60 mt-1">Bình Chánh, Hóc Môn, Củ Chi, Gia Lâm, Đông Anh...</p>
            </div>
            <div>
              <label class="block font-bold mb-1">Phí Liên Tỉnh / Toàn Quốc (VNĐ)</label>
              <input type="number" id="adm-set-interfee" value="${s.shipping?.interprovincialFee ?? 35000}" step="1000" min="0" class="w-full px-3 py-2 rounded-xl border border-[#ae9984] bg-white font-bold text-[#0d2931]" />
              <p class="text-[11px] text-[#0d2931]/60 mt-1">Các tỉnh thành khác ngoài HN &amp; TP.HCM</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#ae9984]/30">
            <div>
              <label class="block font-bold mb-1">Ngưỡng Miễn Phí Vận Chuyển Theo Giá Trị Đơn (VNĐ)</label>
              <input type="number" id="adm-set-freeship-thresh" value="${s.shipping?.freeShipThreshold ?? 200000}" step="5000" min="0" class="w-full px-3 py-2 rounded-xl border border-[#ae9984] bg-white font-bold text-[#72826f]" />
              <p class="text-[11px] text-[#0d2931]/60 mt-1">Đơn hàng có tổng tiền sản phẩm &ge; số tiền này sẽ được tự động Freeship 0đ (Nhập 0 để tắt)</p>
            </div>
            <div class="flex items-center pt-2 sm:pt-6">
              <label class="inline-flex items-center gap-3 p-3 rounded-xl bg-[#faf7f2] border border-[#ae9984]/50 cursor-pointer hover:bg-[#efe9e0]/60 transition w-full">
                <input type="checkbox" id="adm-set-freeship-combo" ${(s.shipping?.freeShipCombo !== false) ? 'checked' : ''} class="w-5 h-5 rounded text-[#BA3820] focus:ring-[#BA3820]" />
                <span class="text-xs sm:text-sm font-bold text-[#0d2931]">
                  Tự động Miễn Phí Vận Chuyển khi giỏ có Combo Trọn Tết
                  <span class="block text-[11px] font-normal text-[#0d2931]/70">Khách đặt Combo Trọn Tết được freeship toàn quốc mà không phụ thuộc ngưỡng tiền</span>
                </span>
              </label>
            </div>
          </div>
        </div>

        <!-- 4. Cấu Hình Đồng Bộ 2 Chiều Google Sheets (Mọi Người Cùng Thấy) -->
        <div class="p-6 rounded-2xl paper-card space-y-4 lg:col-span-2">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-[#ae9984]/30 pb-3">
            <div>
              <h3 class="font-display text-xl font-bold text-[#0d2931]">4. Đồng Bộ 2 Chiều Google Sheets (Mọi Người Cùng Hoạt Động)</h3>
              <p class="text-xs text-[#0d2931]/70 mt-0.5">Khách đặt hàng sẽ tự động ghi vào Google Sheets. Mọi nhân viên mở điện thoại hoặc máy tính đều thấy dữ liệu thời gian thực.</p>
            </div>
            <span class="px-3 py-1 rounded-full ${s.googleSheets?.syncUrl ? 'bg-[#72826f]/20 text-[#72826f]' : 'bg-[#691727]/15 text-[#691727]'} text-xs font-bold">
              ${s.googleSheets?.syncUrl ? '● Đang Kết Nối Google Sheets' : 'Chưa Kết Nối'}
            </span>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block font-bold mb-1">Google Apps Script Web App URL (URL Ứng Dụng Web)</label>
              <div class="flex flex-col sm:flex-row gap-2">
                <input type="url" id="adm-set-sheets-url" placeholder="https://script.google.com/macros/s/AKfycb.../exec" value="${s.googleSheets?.syncUrl || ''}" class="flex-1 px-3 py-2 rounded-xl border border-[#ae9984] bg-white font-mono text-xs text-[#0d2931]" />
                <button type="button" onclick="NepleApp.testAndSyncGoogleSheets()" class="px-4 py-2 rounded-xl bg-[#0d2931] text-[#f0b45b] font-bold text-xs shrink-0 hover:bg-[#163d48] transition">
                  Kiểm Tra &amp; Đồng Bộ Ngay
                </button>
              </div>
              <p class="text-[11px] text-[#0d2931]/60 mt-1">Dán URL sau khi Triển khai Apps Script từ Google Trang Tính của bạn vào đây.</p>
            </div>

            <div class="p-4 rounded-xl bg-[#faf7f2] border border-[#ae9984]/40 text-xs text-[#0d2931]/80 space-y-1.5">
              <div class="font-bold text-[#0d2931] text-sm">Hướng dẫn 3 bước kết nối Google Sheets (Chỉ làm 1 lần mất 2 phút):</div>
              <div>1. Tạo 1 file Google Trang Tính mới, đặt tên: <em>NEPLE - Quản Lý Đơn Hàng 2026</em>.</div>
              <div>2. Vào menu <strong>Tiện ích mở rộng (Extensions) → Apps Script</strong>. Xóa hết code cũ, mở file <a href="google-apps-script.js" target="_blank" class="text-[#a94025] underline font-bold">google-apps-script.js</a> trong mã nguồn NEPLE và dán toàn bộ vào.</div>
              <div>3. Bấm <strong>Triển khai (Deploy) → Tùy chọn triển khai mới → Ứng dụng web</strong> (Chọn: <em>Ai cũng có quyền truy cập / Anyone</em>) rồi sao chép link dán vào ô trên.</div>
            </div>
          </div>

          <div class="pt-3 flex justify-end">
            <button type="submit" class="px-6 py-3 rounded-xl btn-terracotta font-bold text-sm shadow-md">
              Lưu Toàn Bộ Cài Đặt Hệ Thống
            </button>
          </div>
        </div>
      </form>
    `;
  },

  saveSettingsFromAdmin(e) {
    e.preventDefault();
    const s = this.state.settings;
    s.bankId = document.getElementById('adm-set-bankid')?.value?.trim() || s.bankId;
    s.bankName = document.getElementById('adm-set-bankname')?.value?.trim() || s.bankName;
    s.accountNumber = document.getElementById('adm-set-accno')?.value?.trim() || s.accountNumber;
    s.accountName = document.getElementById('adm-set-accname')?.value?.trim() || s.accountName;
    s.momoPhone = document.getElementById('adm-set-momo')?.value?.trim() || s.momoPhone;
    s.momoName = document.getElementById('adm-set-momoname')?.value?.trim() || s.momoName;
    if (document.getElementById('adm-set-qr-image')) {
      s.customQrImage = document.getElementById('adm-set-qr-image').value.trim();
    }
    if (document.getElementById('adm-set-hotline')) {
      s.hotline = document.getElementById('adm-set-hotline').value.trim();
    }
    if (document.getElementById('adm-set-zalo')) {
      s.socials = {
        ...s.socials,
        zalo: document.getElementById('adm-set-zalo')?.value?.trim() || s.socials?.zalo || '',
        messenger: document.getElementById('adm-set-msg')?.value?.trim() || s.socials?.messenger || '',
        tiktok: document.getElementById('adm-set-tiktok')?.value?.trim() || s.socials?.tiktok || ''
      };
    }
    if (document.getElementById('adm-set-clarity')) {
      s.analytics = {
        clarityId: document.getElementById('adm-set-clarity').value.trim(),
        ga4Id: document.getElementById('adm-set-ga4')?.value?.trim() || ''
      };
    }
    s.shipping = {
      innerCityFee: Number(document.getElementById('adm-set-innerfee')?.value) || 0,
      suburbanFee: Number(document.getElementById('adm-set-suburbanfee')?.value) || 0,
      interprovincialFee: Number(document.getElementById('adm-set-interfee')?.value) || 0,
      freeShipThreshold: Number(document.getElementById('adm-set-freeship-thresh')?.value) || 0,
      freeShipCombo: document.getElementById('adm-set-freeship-combo')?.checked ?? true
    };
    const sheetsUrlInput = document.getElementById('adm-set-sheets-url');
    if (sheetsUrlInput) {
      const sheetsUrl = sheetsUrlInput.value.trim();
      s.googleSheets = {
        syncUrl: sheetsUrl,
        enabled: Boolean(sheetsUrl)
      };
    }
    this.saveSettings();
    this.injectAnalytics();
    this.renderFloatingSocials();
    this.showToast('Đã lưu cài đặt Thanh toán, Phí Vận Chuyển & Google Sheets!');
  },

  renderAdminOptimizeTab() {
    const s = this.state.settings;
    return `
      <div class="space-y-6 text-xs sm:text-sm">
        <!-- 1. Trực tiếp Mở Xem Website Khách Hàng -->
        <div class="p-6 rounded-2xl paper-card border-l-4 border-[#f0b45b]">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 class="font-display text-lg sm:text-xl font-bold text-[#0d2931]">Trải Nghiệm Khách Hàng (Live Website)</h3>
              <p class="text-xs text-[#0d2931]/75 mt-1">Mở giao diện khách hàng thực tế để kiểm tra danh mục sản phẩm, tính toán phí vận chuyển, các gói lễ và luồng thanh toán VietQR / MoMo.</p>
            </div>
            <a href="index.html" target="_blank" class="px-5 py-2.5 rounded-xl bg-[#0d2931] hover:bg-[#163d48] text-[#f0b45b] font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-md">
              Mở Xem Trang Khách Hàng ↗
            </a>
          </div>
        </div>

        <!-- 2. Quản Lý Sao Lưu & Phục Hồi Dữ Liệu Toàn Diện (Backup & Restore) -->
        <div class="p-6 rounded-2xl paper-card space-y-4">
          <div class="border-b border-[#ae9984]/30 pb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 class="font-display text-lg sm:text-xl font-bold text-[#0d2931]">Quản Lý Sao Lưu &amp; Khôi Phục Dữ Liệu</h3>
              <p class="text-xs text-[#0d2931]/75 mt-0.5">Tải toàn bộ cơ sở dữ liệu hiện tại về máy tính hoặc nạp dữ liệu từ file sao lưu .json</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div class="p-4 rounded-xl bg-[#faf7f2] border border-[#ae9984]/40 flex flex-col justify-between space-y-3">
              <div>
                <div class="font-bold text-[#0d2931]">Xuất Bản Sao Lưu (.json)</div>
                <div class="text-xs text-[#0d2931]/70 mt-1">Đóng gói toàn bộ đơn hàng, sản phẩm, bài viết cẩm nang và cấu hình thành 1 file .json an toàn.</div>
              </div>
              <button onclick="NepleApp.exportFullBackupJSON()" class="w-full py-2.5 rounded-xl bg-[#72826f] hover:bg-[#5b6a59] text-white text-xs font-bold transition">
                Xuất Backup (.json)
              </button>
            </div>

            <div class="p-4 rounded-xl bg-[#faf7f2] border border-[#ae9984]/40 flex flex-col justify-between space-y-3">
              <div>
                <div class="font-bold text-[#0d2931]">Nhập Bản Sao Lưu (.json)</div>
                <div class="text-xs text-[#0d2931]/70 mt-1">Khôi phục nhanh hệ thống từ một file sao lưu .json đã lưu trước đó trên máy tính của bạn.</div>
              </div>
              <label class="w-full py-2.5 rounded-xl bg-[#0d2931] hover:bg-[#163d48] text-[#f0b45b] text-xs font-bold text-center cursor-pointer transition block">
                Nhập Backup
                <input type="file" accept=".json" class="hidden" onchange="NepleApp.importFullBackupJSON(event)" />
              </label>
            </div>

            <div class="p-4 rounded-xl bg-[#691727]/5 border border-[#691727]/30 flex flex-col justify-between space-y-3">
              <div>
                <div class="font-bold text-[#691727]">Khôi Phục Dữ Liệu Mẫu Gốc</div>
                <div class="text-xs text-[#0d2931]/70 mt-1">Đặt lại hệ thống về trạng thái mặc định ban đầu của NEPLE khi cần làm mới hoặc trình diễn lại.</div>
              </div>
              <button onclick="NepleApp.resetAllData()" class="w-full py-2.5 rounded-xl border-2 border-[#691727] text-[#691727] hover:bg-[#691727] hover:text-white text-xs font-bold transition">
                Khôi phục dữ liệu mẫu gốc
              </button>
            </div>
          </div>
        </div>

        <!-- 3. Công Cụ Đo Lường & Tối Ưu Trải Nghiệm Người Dùng (UX Analytics) -->
        <div class="p-6 rounded-2xl paper-card space-y-4">
          <div class="border-b border-[#ae9984]/30 pb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 class="font-display text-lg sm:text-xl font-bold text-[#0d2931]">Công Cụ Tối Ưu UX &amp; Giám Sát Hành Vi Khách Hàng</h3>
              <p class="text-xs text-[#0d2931]/75 mt-0.5">Theo dõi bản đồ nhiệt Heatmap, hành vi cuộn chuột và số liệu chuyển đổi theo thời gian thực.</p>
            </div>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-bold mb-1">Microsoft Clarity Project ID (Bản đồ nhiệt &amp; Ghi hình phiên)</label>
                <input type="text" id="app-opt-clarity" placeholder="VD: lq8xyz1234" value="${s.analytics?.clarityId || ''}" class="w-full px-3.5 py-2.5 rounded-xl border border-[#ae9984] bg-white text-xs sm:text-sm" />
                <p class="text-[11px] text-[#0d2931]/60 mt-1">Tự động kích hoạt heatmap phân tích điểm dừng mắt và click của khách.</p>
              </div>
              <div>
                <label class="block font-bold mb-1">Google Analytics 4 Measurement ID</label>
                <input type="text" id="app-opt-ga4" placeholder="VD: G-XXXXXXXXXX" value="${s.analytics?.ga4Id || ''}" class="w-full px-3.5 py-2.5 rounded-xl border border-[#ae9984] bg-white text-xs sm:text-sm" />
                <p class="text-[11px] text-[#0d2931]/60 mt-1">Đo lường lượng truy cập và phễu chuyển đổi từ giỏ hàng đến đặt hàng thành công.</p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-bold mb-1">Hotline CSKH / Tư Vấn Nhanh</label>
                <input type="text" id="app-opt-hotline" value="${s.hotline}" class="w-full px-3.5 py-2.5 rounded-xl border border-[#ae9984] bg-white text-xs sm:text-sm" />
              </div>
              <div>
                <label class="block font-bold mb-1">Link Zalo Official Account / Hỗ Trợ Trực Tuyến</label>
                <input type="text" id="app-opt-zalo" value="${s.socials?.zalo || ''}" class="w-full px-3.5 py-2.5 rounded-xl border border-[#ae9984] bg-white text-xs sm:text-sm" />
              </div>
            </div>

            <div class="flex justify-end pt-2">
              <button type="button" onclick="NepleApp.saveOptimizeSettings()" class="px-5 py-2.5 rounded-xl bg-[#0d2931] hover:bg-[#163d48] text-[#f0b45b] font-bold text-xs sm:text-sm transition shadow-sm">
                Lưu Cấu Hình Tối Ưu UX
              </button>
            </div>
          </div>
        </div>

        <!-- 4. Tối Ưu SEO & Nội Dung Cẩm Nang -->
        <div class="p-6 rounded-2xl paper-card space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 class="font-display text-lg sm:text-xl font-bold text-[#0d2931]">Tối Ưu Tìm Kiếm &amp; Bài Viết Cẩm Nang (SEO)</h3>
              <p class="text-xs text-[#0d2931]/75 mt-0.5">Quản lý tiêu đề thẻ Meta Title, Meta Description và từ khóa tìm kiếm Google cho toàn bộ bài viết.</p>
            </div>
            <button onclick="NepleApp.setAdminTab('blogs')" class="px-4 py-2 rounded-xl bg-[#72826f] hover:bg-[#5b6a59] text-white text-xs font-bold transition">
              Đến Quản Lý Blog SEO
            </button>
          </div>
        </div>
      </div>
    `;
  },

  saveOptimizeSettings() {
    const clarity = document.getElementById('app-opt-clarity')?.value?.trim() || '';
    const ga4 = document.getElementById('app-opt-ga4')?.value?.trim() || '';
    const hotline = document.getElementById('app-opt-hotline')?.value?.trim() || this.state.settings.hotline;
    const zalo = document.getElementById('app-opt-zalo')?.value?.trim() || '';

    this.state.settings.analytics = this.state.settings.analytics || {};
    this.state.settings.analytics.clarityId = clarity;
    this.state.settings.analytics.ga4Id = ga4;
    this.state.settings.hotline = hotline;
    this.state.settings.socials = this.state.settings.socials || {};
    this.state.settings.socials.zalo = zalo;

    this.saveSettings();
    this.showToast('Đã lưu cấu hình Tối ưu Website thành công!');
  },

  syncOrderToGoogleSheets(order) {
    const url = this.state.settings?.googleSheets?.syncUrl;
    if (!url) return;
    try {
      fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_order', order })
      }).catch(err => console.warn('Google Sheets sync warning:', err));
    } catch (e) {
      console.warn('Sync failed:', e);
    }
  },

  syncOrderStatusToGoogleSheets(orderId, newStatus) {
    const url = this.state.settings?.googleSheets?.syncUrl;
    if (!url) return;
    try {
      fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', orderId, status: newStatus })
      }).catch(err => console.warn('Google Sheets status sync warning:', err));
    } catch (e) {}
  },

  async fetchOrdersFromGoogleSheets(quiet = false) {
    const url = this.state.settings?.googleSheets?.syncUrl;
    if (!url) {
      if (!quiet) this.showToast('Chưa cấu hình URL Google Sheets trong Cài đặt!');
      return;
    }
    if (!quiet) this.showToast('Đang kết nối Google Sheets...');
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.status === 'success' && Array.isArray(data.orders)) {
        const sheetOrders = data.orders.map(so => ({
          id: so.id,
          createdAt: so.createdAt,
          customerName: so.customerName,
          phone: so.phone,
          address: so.address,
          items: [{ name: so.itemsSummary || 'Gói Lễ Nếp Lễ', qty: 1, price: so.subtotal || so.total }],
          subtotal: so.subtotal || so.total,
          shippingLabel: so.shippingLabel,
          total: so.total,
          paymentLabel: so.paymentLabel,
          status: so.status,
          note: so.note
        }));
        const mergedMap = new Map();
        sheetOrders.forEach(o => mergedMap.set(o.id, o));
        this.state.orders.forEach(o => {
          if (!mergedMap.has(o.id)) mergedMap.set(o.id, o);
        });
        this.state.orders = Array.from(mergedMap.values());
        this.saveOrders();
        if (this.renderAdminPanel) this.renderAdminPanel();
        if (!quiet) this.showToast(`Đã đồng bộ ${data.orders.length} đơn hàng từ Google Sheets!`);
      } else {
        if (!quiet) this.showToast('Phản hồi từ Google Sheets không đúng định dạng!');
      }
    } catch (err) {
      console.warn('Fetch Google Sheets failed:', err);
      if (!quiet) this.showToast('Không thể kết nối tới Google Sheets, vui lòng kiểm tra URL!');
    }
  },

  async testAndSyncGoogleSheets() {
    const urlInput = document.getElementById('adm-set-sheets-url');
    const url = urlInput ? urlInput.value.trim() : '';
    if (!url) {
      this.showToast('Vui lòng dán URL Google Apps Script Web App trước!');
      return;
    }
    this.state.settings.googleSheets = {
      syncUrl: url,
      enabled: true
    };
    this.saveSettings();
    await this.fetchOrdersFromGoogleSheets(false);
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
