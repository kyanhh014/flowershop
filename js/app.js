"use strict";

const DEMO_PASSWORD = "hoaxinh123";
const SESSION_KEY = "hoaxinh-demo-phone";
const REMEMBERED_PHONE_KEY = "hoaxinh-demo-remembered-phone";
const REGISTERED_CUSTOMERS_KEY = "hoaxinh-demo-customers";
const ACCOUNT_OVERRIDES_KEY = "hoaxinh-demo-account-overrides";
const CUSTOMER_ADDRESSES_KEY_PREFIX = "hoaxinh-demo-addresses:";
const CUSTOMER_ORDERS_KEY = "hoaxinh-demo-orders";
const CUSTOMER_REVIEWS_KEY = "hoaxinh-demo-reviews";
const CUSTOMER_CONTACTS_KEY = "hoaxinh-demo-contacts";
const CART_KEY_PREFIX = "hoaxinh-demo-cart:";
const roleHome = (role) => role.dashboard || role.features[0].file;
const currency = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

const roles = {
  owner: {
    label: "Chủ cửa hàng",
    welcome: "Chào mừng bạn đến với không gian chủ cửa hàng Hoa Xinh.",
    dashboard: "pages/dashboard.html",
    features: [
      { id: "product-catalog", file: "pages/owner/owner-product-catalog.html", title: "Quản lý danh mục sản phẩm", description: "Tạo và cập nhật danh mục hoa, mẫu bó hoa và thông tin sản phẩm.", tasks: ["Danh sách danh mục", "Thông tin sản phẩm", "Trạng thái hiển thị"] },
      { id: "daily-flowers", file: "pages/owner/owner-daily-flowers.html", title: "Thêm hoa bán trong ngày", description: "Chọn hoa từ kho, cập nhật giá bán trong ngày và ghi chú khuyến mãi.", tasks: ["Tìm hoa trong kho", "Giá bán và số lượng", "Danh sách hoa đang bán"] },
      { id: "users", file: "pages/owner/owner-users.html", title: "Quản lý người dùng", description: "Tra cứu tài khoản khách hàng và nhân viên theo vai trò.", tasks: ["Thông tin tài khoản", "Vai trò người dùng", "Trạng thái tài khoản"] },
      { id: "stats", file: "pages/owner/owner-stats.html", title: "Báo cáo thống kê cửa hàng", description: "Theo dõi tổng quan doanh thu, đơn hàng và sản phẩm bán chạy.", tasks: ["Doanh thu", "Tình hình đơn hàng", "Sản phẩm nổi bật"] },
      { id: "promotions", file: "pages/owner/owner-promotions.html", title: "Quản lý chương trình khuyến mãi", description: "Tạo và theo dõi các chương trình ưu đãi của cửa hàng.", tasks: ["Tên và mã ưu đãi", "Thời gian áp dụng", "Trạng thái chương trình"] }
    ]
  },
  customer: {
    label: "Khách hàng",
    welcome: "Rất vui được gặp bạn tại Hoa Xinh.",
    features: [
      { id: "products", file: "pages/customer/customer-products.html", title: "Sản phẩm", description: "Tìm và xem các loại hoa đang được cửa hàng giới thiệu.", tasks: ["Tìm kiếm hoa", "Xem thông tin và giá", "Chọn sản phẩm"] },
      { id: "cart", file: "pages/customer/customer-cart.html", title: "Quản lý giỏ hàng", description: "Xem lại các sản phẩm đã chọn trước khi đặt hàng.", tasks: ["Danh sách sản phẩm", "Số lượng và tạm tính", "Cập nhật giỏ hàng"] },
      { id: "orders", file: "pages/customer/customer-orders.html", title: "Theo dõi đơn hàng", description: "Tra cứu trạng thái và thông tin các đơn hàng của bạn.", tasks: ["Mã đơn hàng", "Tình trạng xử lý", "Thông tin giao hàng"] },
      { id: "place-order", file: "pages/customer/customer-place-order.html", title: "Đặt hàng sản phẩm", description: "Nhập thông tin người nhận, địa chỉ và thời gian giao hoa.", tasks: ["Thông tin người nhận", "Thông tin giao hàng", "Phương thức thanh toán"] },
      { id: "reviews", file: "pages/customer/customer-reviews.html", title: "Đánh giá sản phẩm", description: "Gửi nhận xét về những sản phẩm bạn đã mua.", tasks: ["Chọn sản phẩm", "Nội dung đánh giá", "Lịch sử nhận xét"] },
      { id: "contact", file: "pages/customer/customer-contact.html", title: "Liên hệ cửa hàng", description: "Gửi câu hỏi hoặc yêu cầu hỗ trợ tới Hoa Xinh.", tasks: ["Chủ đề liên hệ", "Nội dung yêu cầu", "Thông tin phản hồi"] },
      { id: "register", file: "pages/customer/customer-register.html", title: "Đăng ký tài khoản", description: "Tạo tài khoản khách hàng để sử dụng các chức năng mua hoa.", tasks: ["Họ tên", "Số điện thoại", "Thông tin tài khoản"] }
    ]
  },
  sales: {
    label: "Nhân viên bán",
    welcome: "Chào mừng bạn trở lại với Hoa Xinh.",
    dashboard: "pages/dashboard.html",
    features: [
      { id: "new-orders", file: "pages/sales/sales-new-orders.html", title: "Xem đơn hàng mới", description: "Danh sách các đơn mới chờ nhân viên bán tiếp nhận.", tasks: ["Mã đơn hàng", "Thông tin khách đặt", "Sản phẩm và số lượng"] },
      { id: "confirm-orders", file: "pages/sales/sales-confirm-orders.html", title: "Xác nhận đơn hàng", description: "Kiểm tra thông tin và xác nhận đơn với khách hàng.", tasks: ["Thông tin người nhận", "Kiểm tra sản phẩm", "Kết quả xác nhận"] },
      { id: "order-status", file: "pages/sales/sales-order-status.html", title: "Cập nhật trạng thái đơn", description: "Cập nhật tiến độ xử lý để khách hàng theo dõi.", tasks: ["Trạng thái hiện tại", "Cập nhật tiến độ", "Ghi chú xử lý"] },
      { id: "invoices", file: "pages/sales/sales-invoices.html", title: "Lập hóa đơn", description: "Tạo và kiểm tra hóa đơn bán hàng cho khách.", tasks: ["Thông tin hóa đơn", "Chi tiết đơn hàng", "Trạng thái thanh toán"] },
      { id: "delivery", file: "pages/sales/sales-delivery.html", title: "Quản lý giao hàng", description: "Theo dõi đơn vị vận chuyển và lịch giao hoa.", tasks: ["Đơn chờ giao", "Đơn vị vận chuyển", "Trạng thái giao hàng"] }
    ]
  },
  support: {
    label: "Nhân viên CSKH",
    welcome: "Chào mừng bạn đến với bộ phận chăm sóc khách hàng.",
    dashboard: "pages/dashboard.html",
    features: [
      { id: "reply-contact", file: "pages/support/support-reply-contact.html", title: "Phản hồi liên hệ", description: "Xem và trả lời các câu hỏi, yêu cầu từ khách hàng.", tasks: ["Danh sách liên hệ", "Nội dung câu hỏi", "Nội dung phản hồi"] },
      { id: "reply-reviews", file: "pages/support/support-reply-reviews.html", title: "Phản hồi đánh giá", description: "Theo dõi đánh giá của khách và gửi lời cảm ơn.", tasks: ["Danh sách đánh giá", "Mức độ hài lòng", "Phản hồi nhận xét"] },
      { id: "find-orders", file: "pages/support/support-find-orders.html", title: "Tra cứu đơn hàng", description: "Tìm nhanh đơn theo mã hoặc số điện thoại người mua.", tasks: ["Mã hoặc số điện thoại", "Thông tin đơn hàng", "Lịch sử xử lý"] },
      { id: "find-users", file: "pages/support/support-find-users.html", title: "Tra cứu người dùng", description: "Xem thông tin cơ bản của tài khoản khách hàng.", tasks: ["Số điện thoại", "Thông tin tài khoản", "Lịch sử mua hoa"] }
    ]
  },
  warehouse: {
    label: "Nhân viên kho",
    welcome: "Chào mừng bạn đến với khu vực quản lý kho.",
    dashboard: "pages/dashboard.html",
    features: [
      { id: "stock-in", file: "pages/warehouse/warehouse-stock-in.html", title: "Ghi nhận nhập kho", description: "Tạo phiếu nhập hoa tươi và vật tư vào hệ thống.", tasks: ["Thông tin nguồn nhập", "Loại hoa và số lượng", "Xác nhận nhập kho"] },
      { id: "stock-loss", file: "pages/warehouse/warehouse-stock-loss.html", title: "Ghi nhận hao hụt", description: "Ghi nhận hoa dập, héo hoặc tồn kho không đạt chuẩn.", tasks: ["Loại hoa hao hụt", "Số lượng và lý do", "Xác nhận ghi giảm"] },
      { id: "stock-report", file: "pages/warehouse/warehouse-stock-report.html", title: "Báo cáo tồn kho", description: "Theo dõi số lượng tồn của từng loại hoa theo thời gian thực.", tasks: ["Số lượng tồn hiện tại", "Cảnh báo hoa sắp hết", "Lịch sử biến động"] },
      { id: "stock-in-report", file: "pages/warehouse/warehouse-stock-in-report.html", title: "Báo cáo nhập kho", description: "Tổng hợp các đợt nhập hoa theo ngày hoặc theo đợt.", tasks: ["Tổng số lượng nhập", "Tổng chi phí nhập", "Danh sách phiếu nhập"] },
      { id: "loss-report", file: "pages/warehouse/warehouse-loss-report.html", title: "Báo cáo hao hụt", description: "Thống kê tỉ lệ hoa hỏng và lý do hao hụt trong kỳ.", tasks: ["Tỉ lệ hao hụt", "Lý do phổ biến", "Chi tiết các đợt hao hụt"] }
    ]
  }
};

let accounts = [];
let flowers = [];

function customerCartKey(phone) {
  return `${CART_KEY_PREFIX}${phone}`;
}

function getCustomerCart(phone) {
  if (!phone) return [];
  const raw = localStorage.getItem(customerCartKey(phone));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveCustomerCart(phone, cart) {
  if (!phone) return;
  localStorage.setItem(customerCartKey(phone), JSON.stringify(cart));
}

function updateCartCount(phone) {
  const badge = document.querySelector("#cart-count");
  if (!badge) return;
  const cart = getCustomerCart(phone);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = String(count);
  badge.hidden = count === 0;
}

function storedArray(key, description) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch (e) {
    return [];
  }
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined && text !== null) element.textContent = text;
  return element;
}

function showPageError(error) {
  console.error(error);
  const message = document.querySelector("#page-error") || document.querySelector("#login-error");
  if (message) {
    message.textContent = "Đã xảy ra lỗi khi tải dữ liệu. Hãy đảm bảo bạn chạy ứng dụng qua máy chủ tĩnh (HTTP server).";
    message.hidden = false;
  }
}

function createNavigationLink(label, href, icon, { current = false, cartCount = false } = {}) {
  const link = document.createElement("a");
  link.className = `nav-link${cartCount ? " nav-icon" : ""}`;
  link.href = href;
  if (current) link.setAttribute("aria-current", "page");
  if (cartCount) {
    link.setAttribute("aria-label", label);
    link.setAttribute("title", label);
  }
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  const paths = {
    home: '<path d="m3 11 9-8 9 8v10h-6v-7H9v7H3z"/>',
    register: '<path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm9 10a9 9 0 0 0-18 0z"/><path d="M19 8v6m-3-3h6"/>',
    flowers: '<path d="M12 2c1.7 0 2.4 2.2 2.1 4.5 1.7-1.6 3.8-2.5 5-1.3s.3 3.3-1.3 5C20.1 9.9 22.3 10.6 22.3 12s-2.2 2.1-4.5 1.8c1.6 1.7 2.5 3.8 1.3 5s-3.3.3-5-1.3C14.4 19.8 13.7 22 12 22s-2.4-2.2-2.1-4.5c-1.7 1.6-3.8 2.5-5 1.3s-.3-3.3 1.3-5C3.9 14.1 1.7 13.4 1.7 12s2.2-2.1 4.5-1.8c-1.6-1.7-2.5-3.8-1.3-5s3.3-.3 5 1.3C9.6 4.2 10.3 2 12 2Z"/>',
    phone: '<path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.2 11 11 0 0 0 3.5.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1A11 11 0 0 0 9 7.5a1 1 0 0 1-.2 1z"/>',
    account: '<path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm9 10a9 9 0 0 0-18 0z"/>',
    search: '<circle cx="10.8" cy="10.8" r="7.3"/><path d="m16.2 16.2 5 5"/>',
    cart: '<path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'
  };
  svg.innerHTML = paths[icon] || paths.home;
  link.append(svg);
  if (!cartCount) {
    link.append(Object.assign(document.createElement("span"), { textContent: label }));
  }
  if (cartCount) {
    const badge = Object.assign(document.createElement("span"), {
      id: "cart-count",
      className: "cart-count",
      textContent: "0",
      hidden: true
    });
    link.append(badge);
  }
  return link;
}

function createNavigationSearch() {
  const form = document.createElement("form");
  form.className = "nav-search";
  form.setAttribute("role", "search");
  const input = document.createElement("input");
  input.type = "search";
  input.name = "q";
  input.placeholder = "Tìm sản phẩm...";
  input.setAttribute("aria-label", "Tìm kiếm sản phẩm");
  const button = document.createElement("button");
  button.className = "nav-link nav-icon nav-search-button";
  button.type = "submit";
  button.setAttribute("aria-label", "Tìm kiếm");
  button.title = "Tìm kiếm";
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = '<circle cx="10.8" cy="10.8" r="7.3"/><path d="m16.2 16.2 5 5"/>';
  button.append(svg);
  form.append(input, button);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = input.value.trim();
    const target = new URL("pages/customer/customer-products.html", document.baseURI);
    if (query) target.searchParams.set("q", query);
    location.assign(target);
  });
  return form;
}

function createAccountMenu(account) {
  const container = document.createElement("div");
  container.className = "account-menu";
  const trigger = document.createElement("button");
  trigger.className = "nav-link account-menu-trigger";
  trigger.type = "button";
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("aria-hidden", "true");
  icon.innerHTML = '<path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm9 10a9 9 0 0 0-18 0z"/>';
  trigger.append(icon, Object.assign(document.createElement("span"), { textContent: "Tài khoản" }));
  trigger.setAttribute("aria-expanded", "false");
  const menu = Object.assign(document.createElement("div"), {
    className: "account-menu-panel",
    hidden: true
  });
  if (account) {
    menu.append(Object.assign(document.createElement("a"), {
      className: "account-menu-item",
      href: "pages/account/profile.html",
      textContent: "Cập nhật tài khoản"
    }));
    const signOut = Object.assign(document.createElement("button"), {
      className: "account-menu-item",
      type: "button",
      textContent: "Đăng xuất"
    });
    signOut.addEventListener("click", () => {
      sessionStorage.removeItem(SESSION_KEY);
      location.assign(new URL("index.html", document.baseURI));
    });
    menu.append(signOut);
  } else {
    menu.append(
      Object.assign(document.createElement("a"), {
        className: "account-menu-item",
        href: "index.html",
        textContent: "Đăng nhập"
      }),
      Object.assign(document.createElement("a"), {
        className: "account-menu-item",
        href: "pages/customer/customer-register.html",
        textContent: "Đăng ký"
      })
    );
  }
  trigger.addEventListener("click", () => {
    const expanded = trigger.getAttribute("aria-expanded") === "true";
    trigger.setAttribute("aria-expanded", String(!expanded));
    menu.hidden = expanded;
  });
  document.addEventListener("click", (event) => {
    if (!container.contains(event.target)) {
      trigger.setAttribute("aria-expanded", "false");
      menu.hidden = true;
    }
  });
  container.append(trigger, menu);
  return container;
}

function initializeNavigation() {
  let navInner = document.querySelector(".nav-inner");
  const header = document.querySelector(".site-header");
  if (!navInner) {
    if (!header) return;
    const nav = document.createElement("nav");
    nav.className = "main-nav";
    nav.setAttribute("aria-label", "Điều hướng chính");
    navInner = document.createElement("div");
    navInner.className = "nav-inner";
    nav.append(navInner);
    header.append(nav);
  }
  const nav = navInner.closest(".main-nav");
  if (header && nav && nav.parentElement === header) header.after(nav);
  const updateNavHeight = () => {
    document.documentElement.style.setProperty("--main-nav-height", `${nav.getBoundingClientRect().height}px`);
  };
  const currentPhone = sessionStorage.getItem(SESSION_KEY);
  const account = accounts.find((item) => item.phone === currentPhone);
  navInner.replaceChildren();

  const links = [
    createNavigationLink("Trang chủ", "home.html", "home", {
      current: document.body.dataset.page === "home"
    })
  ];

  if (!account || account.role === "customer") {
    links.push(
      createNavigationLink("Sản phẩm", "pages/customer/customer-products.html", "flowers", {
        current: document.body.dataset.page === "products"
      }),
      createNavigationLink("Liên hệ", "pages/customer/customer-contact.html", "phone", {
        current: document.body.dataset.feature === "contact"
      })
    );
  }

  if (account) {
    if (account.role === "customer") {
      links.push(
        createNavigationLink("Đơn hàng", "pages/customer/customer-orders.html", "cart", {
          current: document.body.dataset.feature === "orders"
        })
      );
    } else {
      links.push(
        createNavigationLink("Quản trị", roleHome(roles[account.role]), "account", {
          current: document.body.dataset.page === "workspace"
        })
      );
    }
  }
  links.push(createAccountMenu(account));

  const tools = document.createElement("div");
  tools.className = "nav-tools";
  tools.append(createNavigationSearch());

  if (!account || account.role === "customer") {
    tools.append(
      createNavigationLink("Giỏ hàng", account ? "pages/customer/customer-cart.html" : "index.html", "cart", {
        cartCount: true,
        current: document.body.dataset.feature === "cart"
      })
    );
  }

  navInner.append(...links, tools);
  updateNavHeight();
  window.addEventListener("resize", updateNavHeight, { passive: true });
  if (account && account.role === "customer") {
    updateCartCount(account.phone);
  }
}

async function loadAccounts() {
  const response = await fetch(new URL("data/accounts.json", document.baseURI));
  if (!response.ok) {
    throw new Error(`Could not load data/accounts.json (${response.status})`);
  }
  const baseAccounts = await response.json();
  const registered = storedArray(REGISTERED_CUSTOMERS_KEY, "Saved demo customer accounts");
  let registeredAccountsChanged = false;
  registered.forEach((account) => {
    if (!account.accountId) {
      account.accountId = `cust-${account.phone}`;
      registeredAccountsChanged = true;
    }
  });
  if (registeredAccountsChanged) {
    localStorage.setItem(REGISTERED_CUSTOMERS_KEY, JSON.stringify(registered));
  }
  const overrides = JSON.parse(localStorage.getItem(ACCOUNT_OVERRIDES_KEY) || "{}");
  if (Object.prototype.hasOwnProperty.call(overrides, "undefined")) {
    delete overrides.undefined;
    localStorage.setItem(ACCOUNT_OVERRIDES_KEY, JSON.stringify(overrides));
  }
  accounts = [...baseAccounts, ...registered].map((account) => {
    const accountWithId = { ...account, accountId: account.accountId || `demo-${account.phone}` };
    const override = overrides[accountWithId.accountId];
    return override ? { ...accountWithId, ...override } : accountWithId;
  });
  return accounts;
}

async function loadFlowers() {
  const response = await fetch(new URL("data/flowers.json", document.baseURI));
  if (!response.ok) {
    throw new Error(`Could not load data/flowers.json (${response.status})`);
  }
  const data = await response.json();
  flowers = data;
  return flowers;
}

function initializeLogin() {
  const phoneInput = document.querySelector("#phone");
  const passwordInput = document.querySelector("#password");
  const rememberPhone = document.querySelector("#remember-phone");
  const loginForm = document.querySelector("#login-form");
  const loginButton = document.querySelector("#login-button");
  const errorMessage = document.querySelector("#login-error");
  const helpMessage = document.querySelector("#login-help");
  const rememberedPhone = localStorage.getItem(REMEMBERED_PHONE_KEY);

  if (rememberedPhone && accounts.some((account) => account.phone === rememberedPhone)) {
    phoneInput.value = rememberedPhone;
    rememberPhone.checked = true;
  }

  loginButton.disabled = false;
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const phone = phoneInput.value.replace(/[\s()-]/g, "");
    const account = accounts.find((entry) => entry.phone === phone);

    if (!account || passwordInput.value !== DEMO_PASSWORD) {
      errorMessage.textContent = "Số điện thoại hoặc mật khẩu chưa đúng. Vui lòng thử lại.";
      errorMessage.hidden = false;
      return;
    }

    if (rememberPhone.checked) {
      localStorage.setItem(REMEMBERED_PHONE_KEY, account.phone);
    } else {
      localStorage.removeItem(REMEMBERED_PHONE_KEY);
    }
    sessionStorage.setItem(SESSION_KEY, account.phone);
    const destination = account.role === "customer" ? "home.html" : roleHome(roles[account.role]);
    location.assign(new URL(destination, document.baseURI));
  });

  document.querySelector("#toggle-password").addEventListener("click", (event) => {
    const button = event.currentTarget;
    const showingPassword = passwordInput.type === "password";
    passwordInput.type = showingPassword ? "text" : "password";
    button.setAttribute("aria-label", showingPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu");
    button.setAttribute("aria-pressed", String(showingPassword));
  });

  document.querySelector("#forgot-password").addEventListener("click", () => {
    helpMessage.textContent = "Chức năng khôi phục mật khẩu chưa có trong bản demo. Mật khẩu dùng thử là hoaxinh123.";
    helpMessage.hidden = false;
  });
  document.querySelector("#register-link").addEventListener("click", () => {
    location.assign(new URL("pages/customer/customer-register.html", document.baseURI));
  });
}

function initializeRegistration() {
  document.querySelector("#registration-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name")).trim();
    const phone = String(formData.get("phone")).replace(/[\s()-]/g, "");
    const message = document.querySelector("#registration-message");

    if (name.length < 2 || !/^\d{10,11}$/.test(phone)) {
      message.textContent = "Vui lòng nhập họ tên và số điện thoại hợp lệ.";
      message.hidden = false;
      return;
    }
    if (accounts.some((account) => account.phone === phone)) {
      message.textContent = "Số điện thoại này đã được đăng ký.";
      message.hidden = false;
      return;
    }

    const customer = { accountId: `cust-${Date.now()}`, name, phone, role: "customer" };
    const registered = storedArray(REGISTERED_CUSTOMERS_KEY, "Saved demo customer accounts");
    registered.push(customer);
    localStorage.setItem(REGISTERED_CUSTOMERS_KEY, JSON.stringify(registered));
    sessionStorage.setItem(SESSION_KEY, phone);
    location.assign(new URL("home.html", document.baseURI));
  });
}

function initializeProfile() {
  const phone = sessionStorage.getItem(SESSION_KEY);
  const account = accounts.find((item) => item.phone === phone);
  const form = document.querySelector("#profile-form");
  if (!account || !form) {
    location.replace(new URL("index.html", document.baseURI));
    return;
  }

  form.elements.namedItem("name").value = account.name || "";
  form.elements.namedItem("phone").value = account.phone;

  // Initialize Customer Stats & Sổ địa chỉ nếu là khách hàng
  if (account.role === "customer") {
    const statsContainer = document.querySelector("#customer-stats");
    const addressCard = document.querySelector("#address-book-card");
    const addressList = document.querySelector("#address-list");
    const addAddressForm = document.querySelector("#add-address-form");
    const addressMessage = document.querySelector("#address-message");

    function renderCustomerStats() {
      if (!statsContainer) return;
      const orders = storedArray(CUSTOMER_ORDERS_KEY, "Saved demo orders").filter((o) => o.customerPhone === account.phone);
      const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      const addresses = storedArray(`${CUSTOMER_ADDRESSES_KEY_PREFIX}${account.phone}`, "Saved customer addresses");

      statsContainer.replaceChildren();
      const stats = [
        { label: "Tổng đơn hàng", value: orders.length },
        { label: "Tổng chi tiêu", value: currency.format(totalSpent) },
        { label: "Địa chỉ đã lưu", value: addresses.length }
      ];
      stats.forEach((st) => {
        const card = makeElement("div", "customer-stat-card");
        card.append(makeElement("div", "stat-number", String(st.value)), makeElement("div", "stat-label", st.label));
        statsContainer.append(card);
      });
      statsContainer.hidden = false;
    }

    function renderAddressBook() {
      if (!addressCard || !addressList) return;
      addressCard.hidden = false;
      addressList.replaceChildren();
      const addresses = storedArray(`${CUSTOMER_ADDRESSES_KEY_PREFIX}${account.phone}`, "Saved customer addresses");
      if (addresses.length === 0) {
        addressList.append(makeElement("p", "empty-state", "Chưa có địa chỉ nhận hàng nào được lưu."));
        renderCustomerStats();
        return;
      }
      addresses.forEach((addr, index) => {
        const item = makeElement("div", `address-card${index === 0 ? " is-default" : ""}`);
        const info = makeElement("div", "address-card-info");
        info.append(makeElement("div", "address-card-text", addr));
        if (index === 0) {
          info.append(makeElement("span", "default-badge", "Địa chỉ mặc định"));
        }
        const actions = makeElement("div", "address-card-actions");
        if (index !== 0) {
          const setDefaultBtn = makeElement("button", "btn-icon-text", "Đặt mặc định");
          setDefaultBtn.type = "button";
          setDefaultBtn.title = "Đặt làm địa chỉ ưu tiên khi mua hàng";
          setDefaultBtn.addEventListener("click", () => {
            const [selected] = addresses.splice(index, 1);
            addresses.unshift(selected);
            localStorage.setItem(`${CUSTOMER_ADDRESSES_KEY_PREFIX}${account.phone}`, JSON.stringify(addresses));
            renderAddressBook();
          });
          actions.append(setDefaultBtn);
        }
        const deleteBtn = makeElement("button", "btn-icon-text btn-delete", "Xóa");
        deleteBtn.type = "button";
        deleteBtn.addEventListener("click", () => {
          addresses.splice(index, 1);
          localStorage.setItem(`${CUSTOMER_ADDRESSES_KEY_PREFIX}${account.phone}`, JSON.stringify(addresses));
          renderAddressBook();
        });
        actions.append(deleteBtn);
        item.append(info, actions);
        addressList.append(item);
      });
      renderCustomerStats();
    }

    if (addAddressForm) {
      addAddressForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = addAddressForm.elements.namedItem("newAddress");
        const newAddr = String(input.value).trim();
        if (newAddr.length < 5) {
          if (addressMessage) {
            addressMessage.textContent = "Vui lòng nhập địa chỉ cụ thể hơn (tối thiểu 5 ký tự).";
            addressMessage.hidden = false;
          }
          return;
        }
        const addresses = storedArray(`${CUSTOMER_ADDRESSES_KEY_PREFIX}${account.phone}`, "Saved customer addresses");
        if (addresses.includes(newAddr)) {
          if (addressMessage) {
            addressMessage.textContent = "Địa chỉ này đã có trong danh sách.";
            addressMessage.hidden = false;
          }
          return;
        }
        addresses.push(newAddr);
        localStorage.setItem(`${CUSTOMER_ADDRESSES_KEY_PREFIX}${account.phone}`, JSON.stringify(addresses));
        input.value = "";
        if (addressMessage) {
          addressMessage.textContent = "Đã thêm địa chỉ mới thành công.";
          addressMessage.hidden = false;
        }
        renderAddressBook();
      });
    }

    renderAddressBook();
    renderCustomerStats();
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = String(formData.get("name")).trim();
    const updatedPhone = String(formData.get("phone")).replace(/[\s()-]/g, "");
    const message = document.querySelector("#profile-message");
    if (name.length < 2 || !/^\d{10,11}$/.test(updatedPhone)) {
      message.textContent = "Vui lòng nhập họ tên và số điện thoại hợp lệ.";
      message.hidden = false;
      return;
    }
    if (accounts.some((item) => item.phone === updatedPhone && item.accountId !== account.accountId)) {
      message.textContent = "Số điện thoại này đã được tài khoản khác sử dụng.";
      message.hidden = false;
      return;
    }

    const overrides = JSON.parse(localStorage.getItem(ACCOUNT_OVERRIDES_KEY) || "{}");
    overrides[account.accountId] = { name, phone: updatedPhone };
    localStorage.setItem(ACCOUNT_OVERRIDES_KEY, JSON.stringify(overrides));

    if (account.role === "customer") {
      const registered = storedArray(REGISTERED_CUSTOMERS_KEY, "Saved demo customer accounts");
      const registeredAccount = registered.find((item) => item.accountId === account.accountId || (!item.accountId && item.phone === phone));
      if (registeredAccount) {
        registeredAccount.accountId = account.accountId;
        registeredAccount.name = name;
        registeredAccount.phone = updatedPhone;
        localStorage.setItem(REGISTERED_CUSTOMERS_KEY, JSON.stringify(registered));
      }
    }

    const updateStoredRecords = (key, description, predicate, update) => {
      const records = storedArray(key, description);
      records.forEach((record) => {
        if (predicate(record)) update(record);
      });
      localStorage.setItem(key, JSON.stringify(records));
    };
    updateStoredRecords(
      CUSTOMER_ORDERS_KEY,
      "Saved demo orders",
      (record) => record.customerPhone === phone,
      (record) => {
        record.customerPhone = updatedPhone;
        record.customerName = name;
      }
    );
    updateStoredRecords(
      CUSTOMER_REVIEWS_KEY,
      "Saved demo reviews",
      (record) => record.customerPhone === phone,
      (record) => {
        record.customerPhone = updatedPhone;
        record.customerName = name;
      }
    );
    updateStoredRecords(
      CUSTOMER_CONTACTS_KEY,
      "Saved customer contacts",
      (record) => record.phone === phone,
      (record) => {
        record.phone = updatedPhone;
        record.customerName = name;
      }
    );
    if (account.role === "customer" && updatedPhone !== phone) {
      saveCustomerCart(updatedPhone, getCustomerCart(phone));
      localStorage.removeItem(customerCartKey(phone));
      const oldAddressKey = `${CUSTOMER_ADDRESSES_KEY_PREFIX}${phone}`;
      const newAddressKey = `${CUSTOMER_ADDRESSES_KEY_PREFIX}${updatedPhone}`;
      if (localStorage.getItem(oldAddressKey)) {
        localStorage.setItem(newAddressKey, localStorage.getItem(oldAddressKey));
        localStorage.removeItem(oldAddressKey);
      }
    }
    if (localStorage.getItem(REMEMBERED_PHONE_KEY) === phone) {
      localStorage.setItem(REMEMBERED_PHONE_KEY, updatedPhone);
    }
    sessionStorage.setItem(SESSION_KEY, updatedPhone);
    account.phone = updatedPhone;
    account.name = name;
    message.textContent = "Thông tin tài khoản đã được cập nhật.";
    message.hidden = false;
  });
}

function initializeContactForm(account) {
  const form = document.querySelector("#contact-form");
  const message = document.querySelector("#contact-message");
  const status = document.querySelector("#contact-status");
  const nameEl = document.querySelector("#contact-customer-name");
  const phoneEl = document.querySelector("#contact-customer-phone");
  if (nameEl) nameEl.textContent = account.name || "Khách hàng";
  if (phoneEl) phoneEl.textContent = account.phone;

  form.addEventListener("input", () => {
    if (status) status.hidden = true;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const subject = String(formData.get("subject"));
    const content = String(formData.get("content")).trim();
    if (!content) return;

    const contacts = storedArray(CUSTOMER_CONTACTS_KEY, "Saved customer contacts");
    contacts.unshift({
      id: `LH${Date.now()}`,
      customerName: account.name || "Khách hàng",
      phone: account.phone,
      subject,
      content,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem(CUSTOMER_CONTACTS_KEY, JSON.stringify(contacts));
    form.reset();
    if (message) {
      message.textContent = "Cảm ơn bạn đã gửi liên hệ. Bộ phận CSKH sẽ phản hồi sớm nhất.";
      message.hidden = false;
    }
  });
}

function renderFlowerProducts(account) {
  const grid = document.querySelector("#products-grid");
  const toolbar = document.querySelector(".product-toolbar");
  const categoryList = document.querySelector("#product-categories");
  const categoryButton = document.querySelector("#product-category-toggle");
  const search = document.querySelector("#product-search");
  const count = document.querySelector("#product-count");
  const isCustomer = account?.role === "customer";
  const updateStickyToolbar = () => {
    const nav = document.querySelector(".main-nav");
    const navBottom = nav ? nav.getBoundingClientRect().bottom : 0;
    toolbar.style.top = `${navBottom}px`;
    toolbar.classList.toggle("is-stuck", toolbar.getBoundingClientRect().top <= navBottom + 1);
  };
  window.addEventListener("scroll", updateStickyToolbar, { passive: true });
  window.addEventListener("resize", updateStickyToolbar, { passive: true });
  updateStickyToolbar();
  const params = new URLSearchParams(location.search);
  search.value = params.get("q") || "";
  let selectedGroup = ["hoa", "phu-kien"].includes(params.get("group")) ? params.get("group") : "";
  let selectedCategory = params.get("category") || "";

  document.querySelector("#shopping-note").textContent = isCustomer
    ? "Hoa và phụ kiện được bán theo đơn vị ghi trên từng sản phẩm. Số lượng giỏ hàng được lưu cho tài khoản của bạn."
    : "Bạn có thể xem danh mục sản phẩm miễn phí. Đăng nhập bằng tài khoản khách hàng để thêm vào giỏ.";
  document.querySelector("#shopping-login-link").hidden = isCustomer;

  function drawCategories() {
    categoryList.replaceChildren();
    const groups = [
      { id: "hoa", label: "Hoa" },
      { id: "phu-kien", label: "Phụ kiện" }
    ];
    const categories = [...new Set(flowers
      .filter((product) => !selectedGroup || product.group === selectedGroup)
      .map((product) => product.category))];
    if (!categories.includes(selectedCategory)) selectedCategory = "";
    const currentGroup = groups.find((group) => group.id === selectedGroup);
    categoryButton.setAttribute("aria-label", selectedCategory
      ? `Danh mục sản phẩm: ${selectedCategory}`
      : currentGroup ? `Danh mục sản phẩm: ${currentGroup.label}` : "Chọn danh mục sản phẩm");
    const addCategoryOption = (label, { group = "", category = "" } = {}) => {
      const option = makeElement("button", `product-category-option${category ? " product-category-option--child" : ""}`, label);
      option.type = "button";
      option.setAttribute("aria-pressed", String(selectedGroup === group && selectedCategory === category));
      option.addEventListener("click", () => {
        selectedGroup = group;
        selectedCategory = category;
        drawCategories();
        drawProducts();
        categoryList.hidden = true;
        categoryButton.setAttribute("aria-expanded", "false");
      });
      categoryList.append(option);
    };
    addCategoryOption("Tất cả sản phẩm");
    groups.forEach((group) => {
      const groupCategories = [...new Set(flowers
        .filter((product) => product.group === group.id)
        .map((product) => product.category))];
      addCategoryOption(group.label, { group: group.id });
      groupCategories.forEach((category) => {
        addCategoryOption(category, { group: group.id, category });
      });
    });
  }

  categoryButton.addEventListener("click", () => {
    const expanded = categoryButton.getAttribute("aria-expanded") === "true";
    categoryButton.setAttribute("aria-expanded", String(!expanded));
    categoryList.hidden = expanded;
  });
  document.addEventListener("click", (event) => {
    if (!categoryList.contains(event.target) && !categoryButton.contains(event.target)) {
      categoryList.hidden = true;
      categoryButton.setAttribute("aria-expanded", "false");
    }
  });

  function drawProducts() {
    grid.replaceChildren();
    const query = search.value.trim().toLocaleLowerCase("vi");
    const visibleProducts = flowers.filter((product) => {
      const matchesGroup = !selectedGroup || product.group === selectedGroup;
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesQuery = !query || `${product.name} ${product.category} ${product.variety} ${product.description}`.toLocaleLowerCase("vi").includes(query);
      return matchesGroup && matchesCategory && matchesQuery;
    });

    count.textContent = `${visibleProducts.length} sản phẩm`;

    visibleProducts.forEach((product) => {
      const card = makeElement("article", "flower-card");
      const detailUrl = `pages/customer/customer-product-detail.html?id=${encodeURIComponent(product.id)}`;
      card.tabIndex = 0;
      card.setAttribute("role", "link");
      card.setAttribute("aria-label", `Xem chi tiết ${product.name}`);
      card.addEventListener("click", (event) => {
        if (event.target.closest("a, button, input, select, textarea")) return;
        location.assign(new URL(detailUrl, document.baseURI));
      });
      card.addEventListener("keydown", (event) => {
        if (event.target !== card || !["Enter", " "].includes(event.key)) return;
        event.preventDefault();
        location.assign(new URL(detailUrl, document.baseURI));
      });
      const art = makeElement("div", `flower-art flower-art--${product.style}`, product.symbol);
      art.setAttribute("aria-hidden", "true");
      art.setAttribute("role", "img");
      art.setAttribute("aria-label", product.name);
      const details = makeElement("div", "flower-details");
      details.append(
        makeElement("p", "flower-category-label", product.category),
        makeElement("h2", "", product.name),
        makeElement("p", "flower-variety", `${product.group === "hoa" ? "Giống" : "Loại"}: ${product.variety}`),
        makeElement("p", "flower-description", product.description)
      );
      const stock = makeElement("p", "flower-stock", `Còn ${product.stock} ${product.unit}`);
      const price = makeElement("p", "flower-price", `${currency.format(product.price)} / ${product.unit}`);
      details.append(stock, price);
      const detailLink = makeElement("a", "product-detail-link", "Xem chi tiết");
      detailLink.href = detailUrl;
      details.append(detailLink);
      card.append(art, details);
      grid.append(card);
    });

    if (visibleProducts.length === 0) {
      grid.append(makeElement("p", "empty-state", "Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại."));
    }
  }

  drawCategories();
  search.addEventListener("input", drawProducts);
  drawProducts();
}

function addFlowerToCart(account, flower, quantity, message) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > flower.stock) {
    message.textContent = `Số lượng ${flower.name} phải từ 1 đến ${flower.stock} ${flower.unit}.`;
    message.hidden = false;
    return false;
  }
  const cart = getCustomerCart(account.phone);
  const item = cart.find((entry) => entry.id === flower.id);
  if (item && item.quantity + quantity > flower.stock) {
    message.textContent = `Giỏ hàng đã có ${item.quantity} ${flower.unit}; số lượng tồn của ${flower.name} là ${flower.stock}.`;
    message.hidden = false;
    return false;
  }
  if (item) {
    item.quantity += quantity;
  } else {
    cart.push({ id: flower.id, name: flower.name, price: flower.price, unit: flower.unit, quantity });
  }
  saveCustomerCart(account.phone, cart);
  updateCartCount(account.phone);
  message.textContent = `✓ Đã thêm ${quantity} ${flower.unit} ${flower.name} vào giỏ hàng.`;
  message.hidden = false;
  return true;
}

function renderProductDetail(account) {
  const product = flowers.find((flower) => flower.id === new URLSearchParams(location.search).get("id"));
  const content = document.querySelector("#product-detail");
  if (!product) {
    content.append(
      makeElement("div", "empty-state", "Không tìm thấy sản phẩm."),
      Object.assign(makeElement("a", "button button-primary", "Quay lại sản phẩm"), { href: "pages/customer/customer-products.html" })
    );
    return;
  }

  const breadcrumb = document.querySelector("#product-breadcrumb");
  breadcrumb.append(makeElement("span", "", product.name));
  document.title = `${product.name} | Hoa Xinh`;
  const art = makeElement("div", `product-detail-art flower-art--${product.style}`, product.symbol);
  art.setAttribute("role", "img");
  art.setAttribute("aria-label", product.name);

  // Ratings calculation
  const allReviews = storedArray(CUSTOMER_REVIEWS_KEY, "Saved demo reviews").filter((r) => r.productId === product.id);
  const avgRating = allReviews.length
    ? (allReviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) / allReviews.length).toFixed(1)
    : null;
  const ratingBadge = makeElement("div", "product-rating-badge");
  if (avgRating) {
    const starCount = Math.round(Number(avgRating));
    ratingBadge.append(
      makeElement("span", "product-rating-stars", "★".repeat(starCount) + "☆".repeat(5 - starCount)),
      makeElement("strong", "", `${avgRating} / 5`),
      makeElement("span", "product-rating-count", `(${allReviews.length} đánh giá)`)
    );
  } else {
    ratingBadge.append(
      makeElement("span", "product-rating-stars", "★★★★★"),
      makeElement("span", "product-rating-count", "(Chưa có đánh giá)")
    );
  }

  const info = makeElement("section", "product-detail-info");
  info.append(
    makeElement("p", "flower-category-label", product.category),
    makeElement("h1", "", product.name),
    ratingBadge,
    makeElement("p", "product-detail-variety", `${product.group === "hoa" ? "Giống hoa" : "Loại phụ kiện"}: ${product.variety}`),
    makeElement("p", "product-detail-price", `${currency.format(product.price)} / ${product.unit}`),
    makeElement("p", "flower-stock", `Còn ${product.stock} ${product.unit}`),
    makeElement("p", "product-detail-description", product.description)
  );
  const formMessage = makeElement("p", "contact-status");
  formMessage.setAttribute("role", "status");
  formMessage.hidden = true;
  const actions = makeElement("div", "product-detail-actions");
  if (account?.role === "customer" && product.stock > 0) {
    const quantityRow = makeElement("div", "product-quantity-row");
    const quantityLabel = makeElement("label", "", "Số lượng:");
    const quantity = document.createElement("input");
    quantity.type = "number";
    quantity.min = "1";
    quantity.max = String(product.stock);
    quantity.value = "1";
    quantity.name = "quantity";
    quantity.id = "product-quantity";
    quantity.setAttribute("aria-label", `Số lượng ${product.name}`);
    quantityLabel.htmlFor = quantity.id;
    const decrement = makeElement("button", "quantity-stepper", "-");
    decrement.type = "button";
    decrement.setAttribute("aria-label", "Giảm số lượng");
    const increment = makeElement("button", "quantity-stepper", "+");
    increment.type = "button";
    increment.setAttribute("aria-label", "Tăng số lượng");
    const updateStepperState = () => {
      const amount = Number(quantity.value);
      decrement.disabled = !Number.isInteger(amount) || amount <= 1;
      increment.disabled = !Number.isInteger(amount) || amount >= product.stock;
    };
    decrement.addEventListener("click", () => {
      quantity.value = String(Math.max(1, Number(quantity.value) - 1));
      updateStepperState();
    });
    increment.addEventListener("click", () => {
      quantity.value = String(Math.min(product.stock, Number(quantity.value) + 1));
      updateStepperState();
    });
    quantity.addEventListener("input", updateStepperState);
    quantityRow.append(quantityLabel, decrement, quantity, increment);
    const purchaseButtons = makeElement("div", "product-purchase-buttons");
    const addButton = makeElement("button", "button product-add-button", "Thêm vào giỏ hàng");
    addButton.type = "button";
    addButton.addEventListener("click", () => {
      addFlowerToCart(account, product, Number(quantity.value), formMessage);
    });
    const buyButton = makeElement("button", "button product-buy-button", "Mua ngay");
    buyButton.type = "button";
    buyButton.addEventListener("click", () => {
      const amount = Number(quantity.value);
      if (!Number.isInteger(amount) || amount < 1 || amount > product.stock) {
        formMessage.textContent = `Số lượng ${product.name} phải từ 1 đến ${product.stock} ${product.unit}.`;
        formMessage.hidden = false;
        return;
      }
      const checkout = new URL("pages/customer/customer-place-order.html", document.baseURI);
      checkout.searchParams.set("buyNow", product.id);
      checkout.searchParams.set("quantity", String(amount));
      location.assign(checkout);
    });
    purchaseButtons.append(buyButton, addButton);
    actions.append(quantityRow, purchaseButtons);
  } else if (account?.role === "customer") {
    actions.append(makeElement("p", "flower-stock-empty", "Tạm hết hàng"));
  } else {
    const loginLink = makeElement("a", "button button-primary", "Đăng nhập để mua");
    loginLink.href = "index.html";
    actions.append(loginLink);
  }
  info.append(formMessage, actions);
  const meta = makeElement("p", "product-detail-category", `Danh mục: ${product.category}`);
  const layout = makeElement("section", "product-detail-layout");
  layout.setAttribute("aria-label", `Chi tiết ${product.name}`);
  layout.append(art, info);
  content.append(layout, meta);

  // Cross-sell & Related Products Section (1-click navigation)
  const relatedSection = makeElement("section", "product-related-section");
  relatedSection.append(makeElement("h2", "", product.group === "hoa" ? "Gợi ý phụ kiện cắm hoa & Sản phẩm liên quan" : "Hoa tươi phối kèm phụ kiện"));
  const relatedGrid = makeElement("div", "related-grid");
  let relatedItems = [];
  if (product.group === "hoa") {
    const accessories = flowers.filter((f) => f.group === "phu-kien").slice(0, 2);
    const otherFlowers = flowers.filter((f) => f.group === "hoa" && f.id !== product.id).slice(0, 2);
    relatedItems = [...accessories, ...otherFlowers];
  } else {
    relatedItems = flowers.filter((f) => f.group === "hoa").slice(0, 4);
  }
  relatedItems.forEach((rel) => {
    const card = makeElement("a", "related-card");
    card.href = `pages/customer/customer-product-detail.html?id=${encodeURIComponent(rel.id)}`;
    const cardArt = makeElement("span", `related-card-art flower-art--${rel.style}`, rel.symbol);
    card.append(
      cardArt,
      makeElement("span", "related-card-title", rel.name),
      makeElement("span", "related-card-price", `${currency.format(rel.price)} / ${rel.unit}`)
    );
    relatedGrid.append(card);
  });
  relatedSection.append(relatedGrid);
  content.append(relatedSection);

  // Customer Reviews on Product Detail
  const reviewsSection = makeElement("section", "product-reviews-section");
  reviewsSection.append(makeElement("h2", "", `Đánh giá từ khách hàng (${allReviews.length})`));
  if (allReviews.length === 0) {
    reviewsSection.append(makeElement("p", "empty-state", "Chưa có nhận xét nào cho sản phẩm này. Hãy mua hoa để gửi đánh giá đầu tiên!"));
  } else {
    const list = makeElement("div", "product-reviews-list");
    allReviews.forEach((review) => {
      const item = makeElement("article", "product-review-item");
      const header = makeElement("div", "product-review-header");
      header.append(
        makeElement("span", "product-review-user", review.customerName || "Khách hàng"),
        makeElement("span", "product-review-date", review.createdAt ? new Date(review.createdAt).toLocaleDateString("vi-VN") : "")
      );
      const starRating = Number(review.rating || 5);
      const stars = makeElement("p", "review-stars", "★".repeat(starRating) + "☆".repeat(5 - starRating));
      const comment = makeElement("p", "product-review-comment", review.content || "");
      item.append(header, stars, comment);
      list.append(item);
    });
    reviewsSection.append(list);
  }
  content.append(reviewsSection);
}

function renderCart(account, moduleView) {
  const cart = getCustomerCart(account.phone);
  moduleView.replaceChildren();
  if (cart.length === 0) {
    const empty = makeElement("div", "empty-state");
    empty.append(
      makeElement("h2", "", "Giỏ hàng đang trống"),
      makeElement("p", "", "Chọn hoa hoặc phụ kiện để bắt đầu."),
      Object.assign(makeElement("a", "button button-primary", "Xem sản phẩm"), { href: "pages/customer/customer-products.html" })
    );
    moduleView.append(empty);
    return;
  }

  const cartSection = makeElement("section", "cart-content");
  const feedback = makeElement("p", "form-message");
  feedback.hidden = true;
  const listHeader = makeElement("div", "cart-list-header");
  const updateAllButton = makeElement("button", "button cart-update-button", "Cập nhật");
  updateAllButton.type = "button";
  updateAllButton.addEventListener("click", () => {
    const updates = [];
    for (const row of cartRows) {
      const nextQuantity = Number(row.quantity.value);
      const flower = flowers.find((entry) => entry.id === row.item.id);
      if (!Number.isInteger(nextQuantity) || nextQuantity < 1) {
        feedback.textContent = `Số lượng ${row.item.name} phải là số nguyên lớn hơn 0.`;
        feedback.hidden = false;
        row.quantity.focus();
        return;
      }
      if (!flower || nextQuantity > flower.stock) {
        feedback.textContent = `Số lượng ${row.item.name} vượt quá hàng hiện có.`;
        feedback.hidden = false;
        row.quantity.focus();
        return;
      }
      updates.push([row.item, nextQuantity]);
    }
    updates.forEach(([item, quantity]) => { item.quantity = quantity; });
    saveCustomerCart(account.phone, cart);
    renderCart(account, moduleView);
  });
  listHeader.append(makeElement("h2", "", "Sản phẩm trong giỏ hàng"), updateAllButton);
  const list = makeElement("div", "cart-list");
  const cartRows = [];
  cart.forEach((item) => {
    const row = makeElement("article", "cart-row");
    const details = makeElement("div", "cart-row-details");
    details.append(makeElement("h3", "", item.name), makeElement("p", "", `${currency.format(item.price)} / ${item.unit}`));
    const quantityControl = makeElement("div", "cart-quantity-control");
    const decrement = makeElement("button", "quantity-stepper", "-");
    decrement.type = "button";
    decrement.setAttribute("aria-label", `Giảm số lượng ${item.name}`);
    const quantity = document.createElement("input");
    quantity.type = "number";
    quantity.min = "1";
    const flower = flowers.find((entry) => entry.id === item.id);
    quantity.max = String(flower?.stock || item.quantity);
    quantity.value = String(item.quantity);
    quantity.setAttribute("aria-label", `Số lượng ${item.name}`);
    const increment = makeElement("button", "quantity-stepper", "+");
    increment.type = "button";
    increment.setAttribute("aria-label", `Tăng số lượng ${item.name}`);
    const updateStepperState = () => {
      const amount = Number(quantity.value);
      decrement.disabled = !Number.isInteger(amount) || amount <= 1;
      increment.disabled = !Number.isInteger(amount) || amount >= (flower?.stock || item.quantity);
    };
    decrement.addEventListener("click", () => {
      quantity.value = String(Math.max(1, Number(quantity.value) - 1));
      updateStepperState();
    });
    increment.addEventListener("click", () => {
      quantity.value = String(Math.min(flower?.stock || item.quantity, Number(quantity.value) + 1));
      updateStepperState();
    });
    quantity.addEventListener("input", updateStepperState);
    updateStepperState();
    quantityControl.append(decrement, quantity, increment);
    const removeButton = makeElement("button", "cart-remove-button");
    removeButton.type = "button";
    removeButton.setAttribute("aria-label", `Xóa ${item.name} khỏi giỏ hàng`);
    removeButton.title = `Xóa ${item.name}`;
    removeButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5"/></svg>';
    removeButton.addEventListener("click", () => {
      saveCustomerCart(account.phone, cart.filter((entry) => entry.id !== item.id));
      renderCart(account, moduleView);
    });
    row.append(details, quantityControl, makeElement("strong", "cart-line-total", currency.format(item.price * item.quantity)), removeButton);
    cartRows.push({ item, quantity });
    list.append(row);
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const summary = makeElement("div", "cart-summary");
  const freeshipNote = makeElement("p", "cart-freeship-note");
  if (total >= 300000) {
    freeshipNote.textContent = "🎉 Đơn hàng của bạn đã đủ điều kiện Miễn phí giao hàng tiêu chuẩn!";
    freeshipNote.style.color = "#2e7d32";
    freeshipNote.style.fontWeight = "600";
  } else {
    freeshipNote.textContent = `Mua thêm ${currency.format(300000 - total)} để nhận Miễn phí giao hàng tiêu chuẩn (đơn từ 300.000đ).`;
    freeshipNote.style.color = "var(--rose-800)";
  }
  summary.append(freeshipNote, makeElement("p", "", `Tạm tính: ${currency.format(total)}`));
  const checkout = makeElement("a", "button button-primary", "Đặt hàng");
  checkout.href = "pages/customer/customer-place-order.html";
  summary.append(checkout);
  cartSection.append(feedback, listHeader, list, summary);
  moduleView.append(cartSection);
}

function renderCheckout(account, moduleView) {
  const searchParams = new URLSearchParams(location.search);
  const buyNowId = searchParams.get("buyNow");
  const isDirectPurchase = buyNowId !== null;
  let checkoutItems = getCustomerCart(account.phone);
  if (isDirectPurchase) {
    const flower = flowers.find((item) => item.id === buyNowId);
    const quantity = Number(searchParams.get("quantity"));
    if (!flower || !Number.isInteger(quantity) || quantity < 1 || quantity > flower.stock) {
      moduleView.replaceChildren();
      moduleView.append(
        makeElement("div", "empty-state", "Thông tin sản phẩm hoặc số lượng không hợp lệ."),
        Object.assign(makeElement("a", "button button-primary", "Quay lại sản phẩm"), { href: "pages/customer/customer-products.html" })
      );
      return;
    }
    checkoutItems = [{ id: flower.id, name: flower.name, price: flower.price, unit: flower.unit, quantity }];
  }
  moduleView.replaceChildren();
  if (checkoutItems.length === 0) {
    const empty = makeElement("div", "empty-state");
    empty.append(
      makeElement("h2", "", "Chưa có sản phẩm trong giỏ"),
      makeElement("p", "", "Thêm hoa hoặc phụ kiện vào giỏ trước khi gửi đơn đặt hàng."),
      Object.assign(makeElement("a", "button button-primary", "Chọn sản phẩm"), { href: "pages/customer/customer-products.html" })
    );
    moduleView.append(empty);
    return;
  }

  const subtotal = checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let fulfillment = "delivery";
  let deliveryType = "standard"; // standard | express | pickup

  const form = document.createElement("form");
  form.id = "checkout-form";
  form.innerHTML = `
    <fieldset class="checkout-fulfillment">
      <legend>Vui lòng chọn cách nhận hàng</legend>
      <button class="checkout-fulfillment-option is-selected" type="button" data-fulfillment="delivery" aria-pressed="true">Giao hàng tận nơi</button>
      <button class="checkout-fulfillment-option" type="button" data-fulfillment="pickup" aria-pressed="false">Nhận tại cửa hàng</button>
    </fieldset>
    <div class="checkout-columns">
      <div class="checkout-customer-column">
        <section class="checkout-section">
          <h2>Thông tin người nhận</h2>
          <label>Họ tên người nhận<input name="name" autocomplete="name" required></label>
          <label>Số điện thoại<input name="phone" type="tel" inputmode="tel" autocomplete="tel" required></label>
          <div class="checkout-address-fields" id="checkout-address-fields">
            <label for="checkout-saved-address">Địa chỉ đã lưu (Chọn 1-click)</label>
            <select id="checkout-saved-address" name="savedAddress">
              <option value="">Địa chỉ đã lưu</option>
            </select>
            <label class="checkout-new-address-label" for="checkout-address">Địa chỉ nhận hàng</label>
            <textarea id="checkout-address" name="address" autocomplete="street-address" rows="3" placeholder="Nhập địa chỉ để tìm gợi ý..." aria-autocomplete="list" aria-controls="checkout-address-suggestions" aria-expanded="false"></textarea>
            <div class="checkout-address-actions">
              <button id="checkout-use-location" class="button" type="button">Dùng vị trí hiện tại</button>
              <span class="checkout-address-privacy">Gợi ý địa chỉ qua OpenStreetMap/Photon; vị trí chỉ dùng khi bạn bấm nút.</span>
            </div>
            <div id="checkout-address-suggestions" class="checkout-address-suggestions" role="listbox" aria-label="Gợi ý địa chỉ" hidden></div>
            <p id="checkout-address-status" class="checkout-address-status" role="status" aria-live="polite"></p>
            <label class="checkout-save-address"><input type="checkbox" name="saveAddress">Lưu địa chỉ này cho lần mua sau</label>
          </div>
        </section>
        <section class="checkout-section checkout-delivery">
          <h2>Thông tin giao hàng</h2>
          <div id="checkout-delivery-options" class="checkout-delivery-options">
            <label class="delivery-option-card is-active" data-type="standard">
              <div class="delivery-option-info">
                <span class="delivery-option-title">Giao tiêu chuẩn (Trong ngày)</span>
                <span class="delivery-option-desc">Giao theo khung giờ đã chọn</span>
              </div>
              <span class="delivery-option-fee" id="fee-standard-label">${subtotal >= 300000 ? "Miễn phí (≥300k)" : "25.000 ₫"}</span>
            </label>
            <label class="delivery-option-card" data-type="express">
              <div class="delivery-option-info">
                <span class="delivery-option-title">Giao hỏa tốc (2 giờ)</span>
                <span class="delivery-option-desc">Ưu tiên chuyển phát nhanh</span>
              </div>
              <span class="delivery-option-fee">40.000 ₫</span>
            </label>
          </div>
          <label id="checkout-delivery-time-field">Khung giờ nhận hàng
            <select name="deliveryTime" required>
              <option value="">Chọn khung giờ</option>
              <option value="08:00 - 12:00">08:00 - 12:00</option>
              <option value="12:00 - 17:00">12:00 - 17:00</option>
              <option value="17:00 - 21:00">17:00 - 21:00</option>
            </select>
          </label>
          <label>Ghi chú cho cửa hàng<textarea name="note" rows="2" placeholder="Lời dặn hoặc lưu ý giao hoa"></textarea></label>
        </section>
      </div>
      <div class="checkout-order-column">
        <section class="checkout-section">
          <h2>Sản phẩm đặt hàng</h2>
          <div id="checkout-items" class="checkout-items"></div>
        </section>
        <section class="checkout-section checkout-payment">
          <h2>Phương thức thanh toán</h2>
          <label class="checkout-payment-option"><input type="radio" name="payment" value="Thanh toán khi nhận hoa (COD)" checked>Thanh toán khi nhận hàng (COD)</label>
          <label class="checkout-payment-option"><input type="radio" name="payment" value="Thanh toán trực tuyến">Thanh toán trực tuyến qua cổng OnePay</label>
          <p class="checkout-demo-note">Thanh toán trực tuyến là lựa chọn minh họa trong demo.</p>
          <div id="checkout-summary" class="checkout-summary"></div>
          <p id="checkout-error" class="form-message" role="alert" hidden></p>
          <button class="button button-primary checkout-submit" type="submit">Đặt hàng</button>
        </section>
      </div>
    </div>
  `;

  form.elements.namedItem("name").value = account.name || "";
  form.elements.namedItem("phone").value = account.phone;

  // Saved Addresses Setup (1-click auto-select)
  const savedAddresses = storedArray(`${CUSTOMER_ADDRESSES_KEY_PREFIX}${account.phone}`, "Saved customer addresses");
  const addressSelect = form.querySelector("#checkout-saved-address");
  const addressInput = form.querySelector("#checkout-address");
  addressSelect.options[0].textContent = savedAddresses.length ? "Chọn địa chỉ đã lưu" : "Chưa có địa chỉ đã lưu";
  savedAddresses.forEach((address, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = index === 0 ? `${address} (Mặc định)` : address;
    addressSelect.append(option);
  });
  if (savedAddresses.length > 0) {
    addressSelect.value = "0";
    addressInput.value = savedAddresses[0];
    addressInput.readOnly = true;
  }
  addressSelect.addEventListener("change", () => {
    const selectedAddress = addressSelect.value === "" ? "" : savedAddresses[Number(addressSelect.value)];
    if (selectedAddress) {
      addressInput.value = selectedAddress;
      addressInput.readOnly = true;
      form.elements.namedItem("saveAddress").checked = false;
    } else {
      addressInput.value = "";
      addressInput.readOnly = false;
      addressInput.focus();
    }
  });
  addressInput.addEventListener("input", () => {
    if (addressSelect.value !== "") addressSelect.value = "";
  });

  const addressSuggestions = form.querySelector("#checkout-address-suggestions");
  const addressStatus = form.querySelector("#checkout-address-status");
  const useLocationButton = form.querySelector("#checkout-use-location");
  let addressSearchTimer;
  let addressSearchController;
  let locationBias = null;
  let activeSuggestionIndex = -1;

  function formatPhotonAddress(properties) {
    const street = [properties.housenumber, properties.street || properties.name].filter(Boolean).join(" ");
    const locality = [properties.district, properties.city, properties.state, properties.country]
      .filter((part, index, parts) => part && parts.indexOf(part) === index);
    return [...(street ? [street] : []), ...locality].join(", ");
  }

  function closeAddressSuggestions() {
    addressSuggestions.replaceChildren();
    addressSuggestions.hidden = true;
    addressInput.setAttribute("aria-expanded", "false");
    activeSuggestionIndex = -1;
  }

  function selectAddress(address) {
    addressInput.value = address;
    addressInput.readOnly = false;
    addressSelect.value = "";
    addressStatus.textContent = "Đã chọn địa chỉ gợi ý.";
    closeAddressSuggestions();
  }

  addressInput.addEventListener("input", () => {
    window.clearTimeout(addressSearchTimer);
    addressSearchController?.abort();
    const query = addressInput.value.trim();
    addressStatus.textContent = "";
    closeAddressSuggestions();
    if (query.length < 3) return;

    addressStatus.textContent = "Đang tìm gợi ý địa chỉ...";
    addressSearchTimer = window.setTimeout(async () => {
      const controller = new AbortController();
      addressSearchController = controller;
      try {
        const url = new URL("https://photon.komoot.io/api/");
        url.searchParams.set("q", query);
        url.searchParams.set("limit", "6");
        url.searchParams.set("lang", "vi");
        if (locationBias) {
          url.searchParams.set("lat", String(locationBias.latitude));
          url.searchParams.set("lon", String(locationBias.longitude));
        }
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`Địa chỉ gợi ý không khả dụng (${response.status}).`);
        const data = await response.json();
        if (controller.signal.aborted) return;
        const suggestions = (data.features || [])
          .map((feature) => formatPhotonAddress(feature.properties || {}))
          .filter((address, index, addresses) => address && addresses.indexOf(address) === index);
        if (!suggestions.length) {
          addressStatus.textContent = "Chưa tìm thấy gợi ý. Bạn có thể tiếp tục nhập địa chỉ đầy đủ.";
          return;
        }

        addressSuggestions.replaceChildren();
        suggestions.forEach((address, index) => {
          const option = makeElement("button", "checkout-address-suggestion", address);
          option.type = "button";
          option.id = `checkout-address-suggestion-${index}`;
          option.setAttribute("role", "option");
          option.addEventListener("click", () => selectAddress(address));
          addressSuggestions.append(option);
        });
        addressSuggestions.hidden = false;
        addressInput.setAttribute("aria-expanded", "true");
        addressStatus.textContent = `${suggestions.length} gợi ý địa chỉ.`;
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error(error);
        addressStatus.textContent = "Không tải được gợi ý địa chỉ. Bạn vẫn có thể nhập địa chỉ thủ công.";
      }
    }, 350);
  });

  addressInput.addEventListener("keydown", (event) => {
    const options = [...addressSuggestions.querySelectorAll('[role="option"]')];
    if (addressSuggestions.hidden || !options.length) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      activeSuggestionIndex = (activeSuggestionIndex + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
      options.forEach((option, index) => option.setAttribute("aria-selected", String(index === activeSuggestionIndex)));
      addressInput.setAttribute("aria-activedescendant", options[activeSuggestionIndex].id);
    } else if (event.key === "Enter" && activeSuggestionIndex >= 0) {
      event.preventDefault();
      selectAddress(options[activeSuggestionIndex].textContent);
    } else if (event.key === "Escape") {
      closeAddressSuggestions();
    }
  });

  useLocationButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
      addressStatus.textContent = "Trình duyệt này không hỗ trợ lấy vị trí hiện tại.";
      return;
    }
    window.clearTimeout(addressSearchTimer);
    addressSearchController?.abort();
    closeAddressSuggestions();
    useLocationButton.disabled = true;
    addressStatus.textContent = "Đang lấy vị trí hiện tại...";
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      locationBias = { latitude: coords.latitude, longitude: coords.longitude };
      try {
        const url = new URL("https://photon.komoot.io/reverse");
        url.searchParams.set("lat", String(coords.latitude));
        url.searchParams.set("lon", String(coords.longitude));
        url.searchParams.set("lang", "vi");
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Không thể xác định địa chỉ (${response.status}).`);
        const data = await response.json();
        const address = formatPhotonAddress(data.features?.[0]?.properties || {});
        if (!address) throw new Error("Không tìm thấy địa chỉ cho vị trí hiện tại.");
        selectAddress(address);
      } catch (error) {
        console.error(error);
        addressStatus.textContent = "Không thể đổi vị trí thành địa chỉ. Bạn có thể nhập địa chỉ thủ công.";
      } finally {
        useLocationButton.disabled = false;
      }
    }, (error) => {
      const messages = {
        1: "Bạn chưa cấp quyền truy cập vị trí.",
        2: "Không xác định được vị trí hiện tại.",
        3: "Lấy vị trí quá thời gian chờ. Vui lòng thử lại."
      };
      addressStatus.textContent = messages[error.code] || "Không thể lấy vị trí hiện tại.";
      useLocationButton.disabled = false;
    }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 });
  });

  // Fulfillment selector
  const addressFields = form.querySelector("#checkout-address-fields");
  const deliveryTypeOptions = form.querySelector("#checkout-delivery-options");
  form.querySelectorAll("[data-fulfillment]").forEach((button) => {
    button.addEventListener("click", () => {
      fulfillment = button.dataset.fulfillment;
      form.querySelectorAll("[data-fulfillment]").forEach((option) => {
        const selected = option === button;
        option.classList.toggle("is-selected", selected);
        option.setAttribute("aria-pressed", String(selected));
      });
      addressFields.hidden = fulfillment !== "delivery";
      deliveryTypeOptions.hidden = fulfillment !== "delivery";
      addressInput.required = fulfillment === "delivery";
      form.querySelector("#checkout-delivery-time-field").hidden = fulfillment !== "delivery";
      form.elements.namedItem("deliveryTime").required = fulfillment === "delivery";
      updateSummary();
    });
  });

  // Delivery type selector (standard vs express)
  form.querySelectorAll(".delivery-option-card").forEach((card) => {
    card.addEventListener("click", () => {
      deliveryType = card.dataset.type;
      form.querySelectorAll(".delivery-option-card").forEach((c) => c.classList.toggle("is-active", c === card));
      updateSummary();
    });
  });

  // Items list
  const itemList = form.querySelector("#checkout-items");
  checkoutItems.forEach((item) => {
    const flower = flowers.find((entry) => entry.id === item.id);
    const row = makeElement("article", "checkout-item");
    const art = makeElement("span", `checkout-item-art flower-art--${flower?.style || "rose"}`, flower?.symbol || "✿");
    art.setAttribute("aria-hidden", "true");
    const details = makeElement("span", "checkout-item-details");
    details.append(
      makeElement("strong", "", item.name),
      makeElement("span", "", `${item.quantity} ${item.unit}`)
    );
    row.append(art, details, makeElement("strong", "checkout-item-total", currency.format(item.price * item.quantity)));
    itemList.append(row);
  });

  // Calculate & update summary
  const summary = form.querySelector("#checkout-summary");
  function updateSummary() {
    summary.replaceChildren();
    let shippingFee = 0;
    if (fulfillment === "delivery") {
      if (deliveryType === "express") {
        shippingFee = 40000;
      } else {
        shippingFee = subtotal >= 300000 ? 0 : 25000;
      }
    }

    const finalTotal = subtotal + shippingFee;

    const lines = [
      ["Tổng tiền hàng", currency.format(subtotal)],
      ["Phí giao hàng", fulfillment === "pickup" ? "0 ₫ (Nhận tại shop)" : (shippingFee === 0 ? "Miễn phí" : currency.format(shippingFee))]
    ];

    lines.forEach(([label, value]) => {
      const line = makeElement("div", "checkout-total-line");
      line.append(makeElement("span", "", label), makeElement("span", "", value));
      summary.append(line);
    });
    const totalLine = makeElement("div", "checkout-total-line checkout-total-final");
    totalLine.append(makeElement("strong", "", "Tổng thanh toán"), makeElement("strong", "", currency.format(finalTotal)));
    summary.append(totalLine);
  }

  updateSummary();

  // Form submit
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name")).trim();
    const phone = String(data.get("phone")).replace(/[\s()-]/g, "");
    const address = String(data.get("address")).trim();
    const error = form.querySelector("#checkout-error");
    if (name.length < 2 || !/^\d{10,11}$/.test(phone) || (fulfillment === "delivery" && !address)) {
      error.textContent = "Vui lòng nhập họ tên, số điện thoại và địa chỉ giao hàng hợp lệ.";
      error.hidden = false;
      return;
    }
    const unavailable = checkoutItems.find((item) => {
      const flower = flowers.find((entry) => entry.id === item.id);
      return !flower || item.quantity > flower.stock;
    });
    if (unavailable) {
      error.textContent = `Số lượng ${unavailable.name} hiện vượt quá hàng có sẵn. Vui lòng cập nhật giỏ hàng.`;
      error.hidden = false;
      return;
    }
    if (fulfillment === "delivery" && data.get("saveAddress") === "on" && !savedAddresses.includes(address)) {
      savedAddresses.push(address);
      localStorage.setItem(`${CUSTOMER_ADDRESSES_KEY_PREFIX}${account.phone}`, JSON.stringify(savedAddresses));
    }

    let shippingFee = 0;
    if (fulfillment === "delivery") {
      shippingFee = deliveryType === "express" ? 40000 : (subtotal >= 300000 ? 0 : 25000);
    }
    const finalTotal = subtotal + shippingFee;

    const orders = storedArray(CUSTOMER_ORDERS_KEY, "Saved demo orders");
    const order = {
      id: `HX${Date.now()}`,
      customerPhone: account.phone,
      customerName: name,
      phone,
      fulfillment,
      deliveryType: fulfillment === "delivery" ? deliveryType : "pickup",
      address: fulfillment === "delivery" ? address : "",
      deliveryTime: fulfillment === "delivery" ? String(data.get("deliveryTime")) : "",
      payment: String(data.get("payment")),
      note: String(data.get("note")).trim(),
      items: checkoutItems.map((item) => ({ ...item })),
      subtotal,
      shippingFee,
      total: finalTotal,
      status: "Chờ xác nhận",
      createdAt: new Date().toISOString()
    };
    orders.unshift(order);
    localStorage.setItem(CUSTOMER_ORDERS_KEY, JSON.stringify(orders));
    if (!isDirectPurchase) saveCustomerCart(account.phone, []);
    location.assign("pages/customer/customer-orders.html");
  });

  moduleView.append(form);
}

function renderOrders(account, moduleView) {
  moduleView.replaceChildren();
  const allOrders = storedArray(CUSTOMER_ORDERS_KEY, "Saved demo orders")
    .filter((order) => order.customerPhone === account.phone);

  if (allOrders.length === 0) {
    const empty = makeElement("div", "empty-state");
    empty.append(
      makeElement("h2", "", "Bạn chưa có đơn hàng"),
      makeElement("p", "", "Đơn hàng sau khi đặt sẽ xuất hiện tại đây để bạn theo dõi."),
      Object.assign(makeElement("a", "button button-primary", "Chọn sản phẩm"), { href: "pages/customer/customer-products.html" })
    );
    moduleView.append(empty);
    return;
  }

  // Status Filter Tabs
  let currentFilter = "all";
  const tabsContainer = makeElement("div", "orders-filter-tabs");
  const tabDefs = [
    { id: "all", label: `Tất cả (${allOrders.length})` },
    { id: "pending", label: `Chờ xác nhận (${allOrders.filter((o) => o.status === "Chờ xác nhận").length})` },
    { id: "shipping", label: `Đang xử lý / Giao (${allOrders.filter((o) => ["Đã xác nhận", "Đang xử lý", "Đang giao"].includes(o.status)).length})` },
    { id: "completed", label: `Hoàn thành (${allOrders.filter((o) => ["Hoàn thành", "Đã giao"].includes(o.status)).length})` },
    { id: "canceled", label: `Đã hủy (${allOrders.filter((o) => o.status === "Đã hủy").length})` }
  ];

  const orderListContainer = makeElement("div", "orders-list");

  function drawOrders() {
    orderListContainer.replaceChildren();
    const filteredOrders = allOrders.filter((order) => {
      if (currentFilter === "all") return true;
      if (currentFilter === "pending") return order.status === "Chờ xác nhận";
      if (currentFilter === "shipping") return ["Đã xác nhận", "Đang xử lý", "Đang giao"].includes(order.status);
      if (currentFilter === "completed") return ["Hoàn thành", "Đã giao"].includes(order.status);
      if (currentFilter === "canceled") return order.status === "Đã hủy";
      return true;
    });

    if (filteredOrders.length === 0) {
      orderListContainer.append(makeElement("p", "empty-state", "Không có đơn hàng nào trong mục này."));
      return;
    }

    filteredOrders.forEach((order) => {
      const card = makeElement("article", "order-card");
      const isPickup = order.fulfillment === "pickup";
      const displayedStatus = isPickup && order.status === "Đang giao"
        ? "Đang chuẩn bị"
        : isPickup && ["Hoàn thành", "Đã giao"].includes(order.status)
          ? "Đã nhận tại cửa hàng"
          : order.status;

      // Status badge class
      let statusClass = "order-status--pending";
      if (["Đã xác nhận", "Đang xử lý"].includes(order.status)) statusClass = "order-status--confirmed";
      else if (order.status === "Đang giao") statusClass = "order-status--shipping";
      else if (["Hoàn thành", "Đã giao"].includes(order.status)) statusClass = "order-status--completed";
      else if (order.status === "Đang hủy" || order.status === "Đã hủy") statusClass = "order-status--canceled";

      const heading = makeElement("header", "order-card-heading");
      const titleGroup = makeElement("div", "order-card-title-group");
      titleGroup.append(
        makeElement("h2", "", `Đơn hàng #${order.id}`),
        makeElement("span", `order-status ${statusClass}`, displayedStatus)
      );
      heading.append(titleGroup);
      if (["Hoàn thành", "Đã giao", "Đã hủy"].includes(order.status)) {
        const deleteBtn = makeElement("button", "order-delete-button");
        deleteBtn.type = "button";
        deleteBtn.setAttribute("aria-label", `Xóa đơn hàng #${order.id}`);
        deleteBtn.title = "Xóa đơn hàng";
        deleteBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M5 7l1 14h12l1-14M9 7V4h6v3"/></svg>';
        deleteBtn.addEventListener("click", () => {
          if (!window.confirm(`Bạn có chắc muốn xóa đơn hàng #${order.id} khỏi lịch sử?`)) return;
          const remainingOrders = storedArray(CUSTOMER_ORDERS_KEY, "Saved demo orders")
            .filter((savedOrder) => savedOrder.id !== order.id);
          localStorage.setItem(CUSTOMER_ORDERS_KEY, JSON.stringify(remainingOrders));
          renderOrders(account, moduleView);
        });
        heading.append(deleteBtn);
      }

      // Meta row
      const meta = makeElement("div", "order-card-meta");
      meta.append(
        makeElement("span", "", `Ngày đặt: ${new Date(order.createdAt).toLocaleString("vi-VN")}`),
        makeElement("span", "", order.fulfillment === "pickup" ? "Hình thức: Nhận tại cửa hàng" : (order.deliveryType === "express" ? "Hình thức: Giao hỏa tốc 2 giờ" : "Hình thức: Giao tiêu chuẩn")),
        makeElement("span", "", `Thanh toán: ${order.payment || "COD"}`)
      );

      card.append(heading, meta);

      if (order.status !== "Đã hủy") {
        const timeline = makeElement("div", "order-timeline");
        const steps = [
          { label: "Đặt hàng", done: true, active: order.status === "Chờ xác nhận" },
          { label: "Chờ xác nhận đơn", done: ["Đã xác nhận", "Đang xử lý", "Đang giao", "Hoàn thành", "Đã giao"].includes(order.status), active: ["Chờ xác nhận", "Đã xác nhận", "Đang xử lý"].includes(order.status) },
          { label: isPickup ? "Đang chuẩn bị" : "Đang giao", done: ["Hoàn thành", "Đã giao"].includes(order.status), active: order.status === "Đang giao" },
          { label: isPickup ? "Đã nhận tại cửa hàng" : "Giao thành công", done: ["Hoàn thành", "Đã giao"].includes(order.status), active: ["Hoàn thành", "Đã giao"].includes(order.status) }
        ];
        steps.forEach((st, idx) => {
          const nextStep = steps[idx + 1];
          const hasProgress = nextStep && (nextStep.done || nextStep.active);
          const stepEl = makeElement("div", `timeline-step${st.done ? " is-done" : ""}${st.active ? " is-active" : ""}${hasProgress ? " has-progress" : ""}`);
          stepEl.append(makeElement("div", "timeline-dot", String(idx + 1)), makeElement("span", "timeline-label", st.label));
          timeline.append(stepEl);
        });
        card.append(timeline);
      } else if (order.status === "Đã hủy") {
        const cancelBox = makeElement("div", "order-cancel-notice");
        cancelBox.style.cssText = "padding:10px 14px; background:#ffebee; border-left:4px solid #d32f2f; border-radius:4px; font-size:.88rem; color:#b71c1c; margin:4px 0 10px;";
        cancelBox.textContent = `Đơn hàng đã được hủy${order.cancelReason ? `. Lý do: ${order.cancelReason}` : ""}${order.canceledAt ? ` (Lúc: ${new Date(order.canceledAt).toLocaleTimeString("vi-VN")} ${new Date(order.canceledAt).toLocaleDateString("vi-VN")})` : ""}`;
        card.append(cancelBox);
      }

      // Address & delivery note
      if (order.fulfillment === "delivery" && order.address) {
        card.append(makeElement("p", "", `Địa chỉ giao: ${order.address}${order.deliveryTime ? ` (${order.deliveryTime})` : ""}`));
      } else if (order.deliveryTime) {
        card.append(makeElement("p", "", `Khung giờ nhận: ${order.deliveryTime}`));
      }

      // Item breakdown
      order.items.forEach((item) => {
        card.append(makeElement("p", "order-item", `${item.name} × ${item.quantity} ${item.unit} · ${currency.format(item.price * item.quantity)}`));
      });

      if (order.shippingFee) {
        card.append(makeElement("p", "order-item", `Phí giao hàng: ${currency.format(order.shippingFee)}`));
      }

      card.append(makeElement("strong", "order-total", `Tổng thanh toán: ${currency.format(order.total)}`));

      // Actions row (1-click buttons)
      const actionsRow = makeElement("div", "order-card-actions");

      // 1-Click Cancel button with Modal
      if (order.status === "Chờ xác nhận") {
        const cancelBtn = makeElement("button", "button button-outline-danger", "Hủy đơn hàng");
        cancelBtn.type = "button";
        cancelBtn.addEventListener("click", () => {
          openCancelModal(order);
        });
        actionsRow.append(cancelBtn);
      }

      if (actionsRow.childElementCount) card.append(actionsRow);
      orderListContainer.append(card);
    });
  }

  // Cancel Modal Logic
  function openCancelModal(order) {
    const backdrop = makeElement("div", "modal-backdrop");
    const modal = makeElement("div", "modal-content");
    modal.innerHTML = `
      <h3>Hủy đơn hàng #${order.id}</h3>
      <p class="section-hint">Bạn có chắc chắn muốn hủy đơn hàng này không? Vui lòng chọn lý do:</p>
      <label for="cancel-reason-select">Lý do hủy đơn:</label>
      <select id="cancel-reason-select" class="product-select" style="width:100%">
        <option value="Tôi muốn đổi sản phẩm hoặc số lượng">Tôi muốn đổi sản phẩm hoặc số lượng</option>
        <option value="Tôi muốn đổi địa chỉ hoặc giờ giao hàng">Tôi muốn đổi địa chỉ hoặc giờ giao hàng</option>
        <option value="Tìm thấy giá tốt hơn ở nơi khác">Tìm thấy giá tốt hơn ở nơi khác</option>
        <option value="Đổi ý, không muốn mua nữa">Đổi ý, không muốn mua nữa</option>
        <option value="Lý do khác">Lý do khác</option>
      </select>
      <div class="modal-buttons">
        <button type="button" class="button" id="modal-cancel-close">Đóng</button>
        <button type="button" class="button button-outline-danger" id="modal-cancel-confirm">Xác nhận hủy đơn</button>
      </div>
    `;
    backdrop.append(modal);
    document.body.append(backdrop);

    modal.querySelector("#modal-cancel-close").addEventListener("click", () => backdrop.remove());
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) backdrop.remove();
    });
    modal.querySelector("#modal-cancel-confirm").addEventListener("click", () => {
      const reason = modal.querySelector("#cancel-reason-select").value;
      order.status = "Đã hủy";
      order.cancelReason = reason;
      order.canceledAt = new Date().toISOString();
      const allUpdated = storedArray(CUSTOMER_ORDERS_KEY, "Saved demo orders");
      const targetOrder = allUpdated.find((o) => o.id === order.id);
      if (targetOrder) {
        targetOrder.status = "Đã hủy";
        targetOrder.cancelReason = reason;
        targetOrder.canceledAt = order.canceledAt;
        localStorage.setItem(CUSTOMER_ORDERS_KEY, JSON.stringify(allUpdated));
      }
      backdrop.remove();
      renderOrders(account, moduleView);
    });
  }

  tabDefs.forEach((tab) => {
    const tabBtn = makeElement("button", `orders-tab${tab.id === currentFilter ? " is-active" : ""}`, tab.label);
    tabBtn.type = "button";
    tabBtn.addEventListener("click", () => {
      currentFilter = tab.id;
      tabsContainer.querySelectorAll(".orders-tab").forEach((btn) => btn.classList.toggle("is-active", btn === tabBtn));
      drawOrders();
    });
    tabsContainer.append(tabBtn);
  });

  moduleView.append(tabsContainer, orderListContainer);
  drawOrders();
}

function renderReviews(account, moduleView) {
  moduleView.replaceChildren();
  const orders = storedArray(CUSTOMER_ORDERS_KEY, "Saved demo orders")
    .filter((order) => order.customerPhone === account.phone);
  const purchasedFlowers = [...new Map(orders.flatMap((order) => order.items).map((item) => [item.id, item])).values()];
  if (purchasedFlowers.length === 0) {
    const empty = makeElement("div", "empty-state");
    empty.append(
      makeElement("h2", "", "Chưa có hoa để đánh giá"),
      makeElement("p", "", "Sau khi đặt hoa, bạn có thể gửi đánh giá sản phẩm tại đây."),
      Object.assign(makeElement("a", "button button-primary", "Xem sản phẩm"), { href: "pages/customer/customer-products.html" })
    );
    moduleView.append(empty);
    return;
  }

  const form = document.createElement("form");
  form.id = "review-form";
  form.innerHTML = `
    <label for="review-product">Hoa đã đặt</label><select id="review-product" name="productId" required></select>
    <label for="review-rating">Đánh giá</label><select id="review-rating" name="rating" required><option value="5">5 sao - Rất hài lòng</option><option value="4">4 sao - Hài lòng</option><option value="3">3 sao - Bình thường</option><option value="2">2 sao - Chưa hài lòng</option><option value="1">1 sao - Không hài lòng</option></select>
    <label for="review-content">Nội dung nhận xét</label><textarea id="review-content" name="content" rows="4" required placeholder="Chia sẻ cảm nhận của bạn..."></textarea>
    <p id="review-message" class="contact-status" role="status" hidden></p>
    <button class="button button-primary" type="submit">Gửi đánh giá</button>`;
  const select = form.querySelector("#review-product");
  purchasedFlowers.forEach((item) => {
    const option = makeElement("option", "", item.name);
    option.value = item.id;
    select.append(option);
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const content = String(data.get("content")).trim();
    const flower = purchasedFlowers.find((item) => item.id === data.get("productId"));
    if (!flower || !content) return;
    const reviews = storedArray(CUSTOMER_REVIEWS_KEY, "Saved demo reviews");
    reviews.unshift({
      customerPhone: account.phone,
      customerName: account.name || "Khách hàng",
      productId: flower.id,
      productName: flower.name,
      rating: Number(data.get("rating")),
      content,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem(CUSTOMER_REVIEWS_KEY, JSON.stringify(reviews));
    form.reset();
    const message = form.querySelector("#review-message");
    message.textContent = "Cảm ơn bạn đã gửi đánh giá.";
    message.hidden = false;
  });
  moduleView.append(form);

  const reviews = storedArray(CUSTOMER_REVIEWS_KEY, "Saved demo reviews")
    .filter((review) => review.customerPhone === account.phone);
  if (reviews.length) {
    const history = makeElement("div", "review-history");
    history.append(makeElement("h3", "", "Đánh giá của bạn"));
    reviews.forEach((review) => {
      const card = makeElement("article", "order-card");
      card.append(
        makeElement("h4", "", review.productName),
        makeElement("p", "review-stars", `${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}`),
        makeElement("p", "", review.content)
      );
      history.append(card);
    });
    moduleView.append(history);
  }
}

function renderModule(moduleView, feature) {
  moduleView.replaceChildren();
  const description = document.createElement("p");
  description.className = "module-description";
  description.textContent = feature.description;
  const taskList = document.createElement("div");
  taskList.className = "module-task-list";

  feature.tasks.forEach((task, index) => {
    const item = document.createElement("article");
    item.className = "module-task";
    const number = document.createElement("span");
    number.className = "module-task-number";
    number.textContent = String(index + 1).padStart(2, "0");
    const label = document.createElement("h4");
    label.textContent = task;
    const placeholder = document.createElement("p");
    placeholder.textContent = "Giao diện minh họa cho chức năng này đang được kết nối trong demo.";
    item.append(number, label, placeholder);
    taskList.append(item);
  });

  moduleView.append(description, taskList);
}

function renderRoleDashboard(account) {
  const role = roles[account.role];
  if (!role || account.role === "customer") {
    location.replace(new URL("index.html", document.baseURI));
    return;
  }

  const title = document.querySelector("#dashboard-title");
  title.textContent = "Trang chủ";
  document.title = "Trang chủ | Hoa Xinh";

  const profile = document.querySelector("#dashboard-profile");
  profile.replaceChildren();
  profile.append(makeElement("h2", "", account.role === "owner" ? "Thông tin chủ cửa hàng" : "Thông tin nhân viên"));
  const fields = account.role === "owner"
    ? [["Họ tên", account.name], ["Chức vụ", role.label], ["Số điện thoại", account.phone], ["Địa chỉ", account.address]]
    : [["Họ tên", account.name], ["Mã NV", account.employeeId], ["Giới tính", account.gender], ["Chức vụ", account.position || role.label], ["Số điện thoại", account.phone], ["Địa chỉ", account.address]];
  const details = document.createElement("dl");
  details.className = "dashboard-profile-details";
  fields.forEach(([label, value]) => {
    details.append(
      makeElement("dt", "", label),
      makeElement("dd", "", value || "Chưa cập nhật")
    );
  });
  profile.append(details);

  const actions = document.querySelector("#dashboard-actions");
  actions.replaceChildren();
  const featureIcons = {
    "product-catalog": "✿",
    "daily-flowers": "↑",
    users: "♙",
    stats: "▤",
    promotions: "%",
    "new-orders": "▣",
    "confirm-orders": "✓",
    "order-status": "↻",
    invoices: "▤",
    delivery: "➜",
    "reply-contact": "☎",
    "reply-reviews": "★",
    "find-orders": "⌕",
    "find-users": "♙",
    "stock-in": "↓",
    "stock-loss": "−",
    "stock-report": "▦",
    "stock-in-report": "▤",
    "loss-report": "!"
  };
  role.features.forEach((feature, index) => {
    const link = document.createElement("a");
    link.className = "dashboard-action-card";
    link.href = feature.file;
    const icon = makeElement("span", "dashboard-action-icon", featureIcons[feature.id] || String(index + 1).padStart(2, "0"));
    icon.setAttribute("aria-hidden", "true");
    link.append(icon, makeElement("span", "dashboard-action-title", feature.title));
    actions.append(link);
  });
}

function renderWorkspace(roleKey, featureId) {
  const role = roles[roleKey];
  const feature = role?.features.find((item) => item.id === featureId);
  const account = accounts.find((item) => item.phone === sessionStorage.getItem(SESSION_KEY));
  if (!role || !feature || account?.role !== roleKey) {
    location.replace(new URL("index.html", document.baseURI));
    return;
  }

  document.title = `${feature.title} | Hoa Xinh`;
  const isContactPage = featureId === "contact";
  if (isContactPage) {
    initializeContactForm(account);
  } else {
    document.querySelector("#workspace-title").textContent = feature.title;
  }
  document.querySelector(".dashboard-disclaimer")?.remove();
  if (roleKey === "customer" && featureId === "cart") {
    renderCart(account, document.querySelector("#module-view"));
    updateCartCount(account.phone);
  } else if (roleKey === "customer" && featureId === "orders") {
    renderOrders(account, document.querySelector("#module-view"));
  } else if (roleKey === "customer" && featureId === "reviews") {
    renderReviews(account, document.querySelector("#module-view"));
  } else if (!isContactPage) {
    renderModule(document.querySelector("#module-view"), feature);
  }
}

function initializeBackButton() {
  const main = document.querySelector("main");
  if (!main || main.querySelector(".page-back-button")) return;

  const button = makeElement("button", "button page-back-button");
  button.type = "button";
  button.setAttribute("aria-label", "Quay lại");
  button.title = "Quay lại";
  button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m7 7-7-7 7-7"/></svg>';
  const updateBackButtonPosition = () => {
    const nav = document.querySelector(".main-nav");
    const navBottom = nav ? Math.max(0, nav.getBoundingClientRect().bottom) : 0;
    document.documentElement.style.setProperty("--main-nav-bottom", `${navBottom}px`);
  };
  updateBackButtonPosition();
  window.addEventListener("scroll", updateBackButtonPosition, { passive: true });
  window.addEventListener("resize", updateBackButtonPosition, { passive: true });
  button.addEventListener("click", () => {
    const referrer = document.referrer ? new URL(document.referrer) : null;
    if (referrer?.origin === location.origin && referrer.href !== location.href) {
      history.back();
      return;
    }

    const phone = sessionStorage.getItem(SESSION_KEY);
    const account = accounts.find((item) => item.phone === phone);
    const currentPath = location.pathname.toLocaleLowerCase();
    let fallback = "index.html";
    if (account) {
      fallback = account.role === "customer" ? "pages/customer/customer-products.html" : "pages/dashboard.html";
    } else if (currentPath.endsWith("/index.html")) {
      fallback = "home.html";
    }
    if (new URL(fallback, document.baseURI).pathname !== location.pathname) {
      location.assign(new URL(fallback, document.baseURI));
    }
  });
  main.prepend(button);

  const topButton = makeElement("button", "button page-top-button");
  topButton.type = "button";
  topButton.setAttribute("aria-label", "Lên đầu trang");
  topButton.title = "Lên đầu trang";
  topButton.hidden = window.scrollY < 240;
  topButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 14 6-6 6 6"/></svg>';
  topButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", () => {
    topButton.hidden = window.scrollY < 240;
  }, { passive: true });
  document.body.append(topButton);
}

loadAccounts().then(() => {
  initializeNavigation();
  initializeBackButton();
  const page = document.body.dataset.page;
  if (page === "login") {
    initializeLogin();
  } else if (page === "register") {
    initializeRegistration();
  } else if (page === "profile") {
    initializeProfile();
  } else if (page === "dashboard") {
    const account = accounts.find((item) => item.phone === sessionStorage.getItem(SESSION_KEY));
    if (!account || account.role === "customer") {
      location.replace(new URL("index.html", document.baseURI));
      return;
    }
    renderRoleDashboard(account);
  } else if (page === "products") {
    return loadFlowers().then(() => {
      const account = accounts.find((item) => item.phone === sessionStorage.getItem(SESSION_KEY));
      renderFlowerProducts(account);
    });
  } else if (page === "product-detail") {
    return loadFlowers().then(() => {
      const account = accounts.find((item) => item.phone === sessionStorage.getItem(SESSION_KEY));
      renderProductDetail(account);
    });
  } else if (page === "checkout") {
    const account = accounts.find((item) => item.phone === sessionStorage.getItem(SESSION_KEY));
    if (account?.role !== "customer") {
      location.replace(new URL("index.html", document.baseURI));
      return;
    }
    return loadFlowers().then(() => renderCheckout(account, document.querySelector("#checkout-view")));
  } else if (page === "workspace") {
    const roleKey = document.body.dataset.role;
    const featureId = document.body.dataset.feature;
    if (roleKey === "customer" && ["cart", "reviews", "orders"].includes(featureId)) {
      return loadFlowers().then(() => renderWorkspace(roleKey, featureId));
    }
    renderWorkspace(roleKey, featureId);
  }
}).catch((error) => {
  showPageError(error);
});
