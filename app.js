"use strict";

const DEMO_PASSWORD = "hoaxinh123";
const SESSION_KEY = "hoaxinh-demo-phone";
const REMEMBERED_PHONE_KEY = "hoaxinh-demo-remembered-phone";
const REGISTERED_CUSTOMERS_KEY = "hoaxinh-demo-customers";
const roleHome = (role) => role.features[0].file;

const roles = {
  owner: {
    label: "Chủ cửa hàng",
    welcome: "Chào mừng bạn đến với không gian chủ cửa hàng Hoa Xinh.",
    features: [
      { id: "product-catalog", file: "owner-product-catalog.html", title: "Quản lý danh mục sản phẩm", description: "Tạo và cập nhật danh mục hoa, mẫu bó hoa và thông tin sản phẩm.", tasks: ["Danh sách danh mục", "Thông tin sản phẩm", "Trạng thái hiển thị"] },
      { id: "daily-flowers", file: "owner-daily-flowers.html", title: "Thêm hoa bán trong ngày", description: "Chọn hoa từ kho, cập nhật giá bán trong ngày và ghi chú khuyến mãi.", tasks: ["Tìm hoa trong kho", "Giá bán và số lượng", "Danh sách hoa đang bán"] },
      { id: "users", file: "owner-users.html", title: "Quản lý người dùng", description: "Tra cứu tài khoản khách hàng và nhân viên theo vai trò.", tasks: ["Thông tin tài khoản", "Vai trò người dùng", "Trạng thái tài khoản"] },
      { id: "stats", file: "owner-stats.html", title: "Báo cáo thống kê cửa hàng", description: "Theo dõi tổng quan doanh thu, đơn hàng và sản phẩm bán chạy.", tasks: ["Doanh thu", "Tình hình đơn hàng", "Sản phẩm nổi bật"] },
      { id: "promotions", file: "owner-promotions.html", title: "Quản lý chương trình khuyến mãi", description: "Tạo và theo dõi các chương trình ưu đãi của cửa hàng.", tasks: ["Tên và mã ưu đãi", "Thời gian áp dụng", "Trạng thái chương trình"] }
    ]
  },
  customer: {
    label: "Khách hàng",
    welcome: "Rất vui được gặp bạn tại Hoa Xinh.",
    features: [
      { id: "products", file: "customer-products.html", title: "Sản phẩm", description: "Tìm và xem các loại hoa đang được cửa hàng giới thiệu.", tasks: ["Tìm kiếm hoa", "Xem thông tin và giá", "Chọn sản phẩm"] },
      { id: "cart", file: "customer-cart.html", title: "Quản lý giỏ hàng", description: "Xem lại các sản phẩm đã chọn trước khi đặt hàng.", tasks: ["Danh sách sản phẩm", "Số lượng và tạm tính", "Cập nhật giỏ hàng"] },
      { id: "orders", file: "customer-orders.html", title: "Theo dõi đơn hàng", description: "Tra cứu trạng thái và thông tin các đơn hàng của bạn.", tasks: ["Mã đơn hàng", "Tình trạng xử lý", "Thông tin giao hàng"] },
      { id: "place-order", file: "customer-place-order.html", title: "Đặt hàng sản phẩm", description: "Nhập thông tin người nhận, địa chỉ và thời gian giao hoa.", tasks: ["Thông tin người nhận", "Thông tin giao hàng", "Phương thức thanh toán"] },
      { id: "reviews", file: "customer-reviews.html", title: "Đánh giá sản phẩm", description: "Gửi nhận xét về những sản phẩm bạn đã mua.", tasks: ["Chọn sản phẩm", "Nội dung đánh giá", "Lịch sử nhận xét"] },
      { id: "contact", file: "customer-contact.html", title: "Liên hệ cửa hàng", description: "Gửi câu hỏi hoặc yêu cầu hỗ trợ tới Hoa Xinh.", tasks: ["Chủ đề liên hệ", "Nội dung yêu cầu", "Thông tin phản hồi"] },
      { id: "register", file: "customer-register.html", title: "Đăng ký tài khoản", description: "Tạo tài khoản khách hàng để sử dụng các chức năng mua hoa.", tasks: ["Họ tên", "Số điện thoại", "Thông tin tài khoản"] }
    ]
  },
  sales: {
    label: "Nhân viên bán",
    welcome: "Chào mừng bạn trở lại với Hoa Xinh.",
    features: [
      { id: "new-orders", file: "sales-new-orders.html", title: "Xem đơn hàng mới", description: "Danh sách các đơn mới chờ nhân viên bán tiếp nhận.", tasks: ["Mã đơn hàng", "Thông tin khách đặt", "Sản phẩm và số lượng"] },
      { id: "confirm-orders", file: "sales-confirm-orders.html", title: "Xác nhận đơn hàng", description: "Kiểm tra thông tin và xác nhận đơn với khách hàng.", tasks: ["Thông tin người nhận", "Kiểm tra sản phẩm", "Kết quả xác nhận"] },
      { id: "order-status", file: "sales-order-status.html", title: "Cập nhật trạng thái đơn", description: "Cập nhật tiến độ xử lý để khách hàng theo dõi.", tasks: ["Trạng thái hiện tại", "Trạng thái mới", "Lịch sử cập nhật"] },
      { id: "invoices", file: "sales-invoices.html", title: "In hóa đơn", description: "Xem trước thông tin đơn hàng và chuẩn bị hóa đơn.", tasks: ["Thông tin hóa đơn", "Chi tiết sản phẩm", "Tổng thanh toán"] },
      { id: "delivery", file: "sales-delivery.html", title: "Gửi đơn cho đơn vị vận chuyển", description: "Chuẩn bị thông tin bàn giao đơn hàng cho đơn vị giao nhận.", tasks: ["Địa chỉ nhận hàng", "Thông tin liên hệ", "Mã vận đơn"] }
    ]
  },
  support: {
    label: "Nhân viên CSKH",
    welcome: "Cảm ơn bạn đã đồng hành cùng Hoa Xinh.",
    features: [
      { id: "reply-contact", file: "support-reply-contact.html", title: "Trả lời liên hệ", description: "Xem yêu cầu được gửi từ trang liên hệ và soạn nội dung trả lời.", tasks: ["Nội dung liên hệ", "Thông tin khách gửi", "Phản hồi hỗ trợ"] },
      { id: "find-users", file: "support-find-users.html", title: "Tra cứu người dùng", description: "Tìm tài khoản khách hàng để hỗ trợ các yêu cầu liên quan.", tasks: ["Số điện thoại", "Thông tin khách hàng", "Lịch sử hỗ trợ"] },
      { id: "find-orders", file: "support-find-orders.html", title: "Tra cứu đơn hàng", description: "Tra cứu thông tin đơn hàng để giải đáp thắc mắc.", tasks: ["Mã đơn hoặc số điện thoại", "Trạng thái đơn", "Thông tin giao hàng"] },
      { id: "reply-reviews", file: "support-reply-reviews.html", title: "Trả lời đánh giá", description: "Theo dõi đánh giá sản phẩm và soạn phản hồi từ cửa hàng.", tasks: ["Nội dung đánh giá", "Sản phẩm được đánh giá", "Phản hồi cửa hàng"] }
    ]
  },
  warehouse: {
    label: "Nhân viên kho",
    welcome: "Chào mừng bạn đến với Hoa Xinh.",
    features: [
      { id: "stock-in", file: "warehouse-stock-in.html", title: "Ghi nhận nhập kho", description: "Ghi nhận số lượng hoa và vật tư được nhập vào cửa hàng.", tasks: ["Sản phẩm nhập kho", "Số lượng nhập", "Ngày nhập và ghi chú"] },
      { id: "stock-loss", file: "warehouse-stock-loss.html", title: "Ghi nhận hao hụt", description: "Ghi lại số hoa hư hỏng hoặc hao hụt trong quá trình bảo quản.", tasks: ["Sản phẩm hao hụt", "Số lượng và lý do", "Ngày ghi nhận"] },
      { id: "stock-in-report", file: "warehouse-stock-in-report.html", title: "Báo cáo nhập kho", description: "Xem tổng hợp các lần nhập hoa và vật tư.", tasks: ["Khoảng thời gian", "Số lượng nhập", "Chi tiết lần nhập"] },
      { id: "stock-report", file: "warehouse-stock-report.html", title: "Báo cáo tồn kho", description: "Theo dõi số lượng còn lại trong kho theo từng sản phẩm.", tasks: ["Danh sách sản phẩm", "Số lượng tồn", "Mức tồn cần lưu ý"] },
      { id: "loss-report", file: "warehouse-loss-report.html", title: "Báo cáo hao hụt", description: "Xem thống kê hoa hao hụt theo thời gian và nguyên nhân.", tasks: ["Khoảng thời gian", "Số lượng hao hụt", "Nguyên nhân"] }
    ]
  }
};

const loginForm = document.querySelector("#login-form");
const phoneInput = document.querySelector("#phone");
const passwordInput = document.querySelector("#password");
const errorMessage = document.querySelector("#login-error");
const helpMessage = document.querySelector("#login-help");
const loginButton = document.querySelector("#login-button");
const rememberPhone = document.querySelector("#remember-phone");
let accounts = [];

function renderModule(moduleView, feature) {
  moduleView.replaceChildren();
  const heading = document.createElement("h2");
  heading.textContent = feature.title;
  const description = document.createElement("p");
  description.className = "module-description";
  description.textContent = feature.description;
  const subheading = document.createElement("h3");
  subheading.textContent = "Khu vực chức năng";
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
    placeholder.textContent = "Khu vực hiển thị và thao tác demo.";
    item.append(number, label, placeholder);
    taskList.append(item);
  });

  const note = document.createElement("p");
  note.className = "module-note";
  note.textContent = "Đây là khung giao diện ban đầu; dữ liệu và nghiệp vụ sẽ được kết nối ở bước tiếp theo.";
  moduleView.append(heading, description, subheading, taskList, note);
}

async function loadAccounts() {
  const response = await fetch("accounts.json");
  if (!response.ok) {
    throw new Error(`Could not load accounts.json (${response.status})`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("accounts.json must contain an array of accounts");
  }
  const registeredCustomers = JSON.parse(localStorage.getItem(REGISTERED_CUSTOMERS_KEY) || "[]");
  if (!Array.isArray(registeredCustomers)) {
    throw new Error("Saved demo customer accounts must be an array");
  }
  data.push(...registeredCustomers);

  const seenPhones = new Set();
  for (const account of data) {
    if (
      typeof account.phone !== "string"
      || !/^\d{10,11}$/.test(account.phone)
      || (account.role !== "customer" && !Object.hasOwn(roles, account.role))
      || seenPhones.has(account.phone)
    ) {
      throw new Error("accounts.json contains an invalid or duplicate account");
    }
    seenPhones.add(account.phone);
  }

  accounts = data;
  return accounts;
}

function initializeLogin() {
  const savedAccount = accounts.find((account) => account.phone === sessionStorage.getItem(SESSION_KEY));
  if (savedAccount) {
    location.replace(roleHome(roles[savedAccount.role]));
    return;
  }

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
    location.assign(roleHome(roles[account.role]));
  });

  document.querySelector("#toggle-password").addEventListener("click", (event) => {
    const button = event.currentTarget;
    const showingPassword = passwordInput.type === "password";
    passwordInput.type = showingPassword ? "text" : "password";
    button.setAttribute("aria-label", showingPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu");
    button.setAttribute("aria-pressed", String(showingPassword));
  });

  document.querySelector("#forgot-password").addEventListener("click", () => {
    helpMessage.textContent = "Chức năng khôi phục mật khẩu chưa có trong bản demo.";
    helpMessage.hidden = false;
  });
  document.querySelector("#register-link").addEventListener("click", () => {
    location.assign("customer-register.html");
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

    const customer = { name, phone, role: "customer" };
    const registered = JSON.parse(localStorage.getItem(REGISTERED_CUSTOMERS_KEY) || "[]");
    registered.push(customer);
    localStorage.setItem(REGISTERED_CUSTOMERS_KEY, JSON.stringify(registered));
    sessionStorage.setItem(SESSION_KEY, phone);
    location.assign(roleHome(roles.customer));
  });
}

function renderWorkspace(roleKey, featureId) {
  const role = roles[roleKey];
  const feature = role?.features.find((item) => item.id === featureId);
  const account = accounts.find((item) => item.phone === sessionStorage.getItem(SESSION_KEY));
  if (!role || !feature || account?.role !== roleKey) {
    location.replace("index.html");
    return;
  }

  document.title = `${feature.title} | Hoa Xinh`;
  document.querySelector("#workspace-title").textContent = feature.title;
  document.querySelector("#workspace-subtitle").textContent = feature.description;
  const roleMenu = document.querySelector("#role-menu");
  role.features.forEach((item) => {
    const link = document.createElement("a");
    link.className = `role-menu-link${item.id === featureId ? " is-active" : ""}`;
    link.href = item.file;
    link.textContent = item.title;
    roleMenu.append(link);
  });
  renderModule(document.querySelector("#module-view"), feature);
  document.querySelector("#sign-out").addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    location.assign("index.html");
  });
}

loadAccounts().then(() => {
  const page = document.body.dataset.page;
  if (page === "login") {
    initializeLogin();
  } else if (page === "register") {
    initializeRegistration();
  } else if (page === "workspace") {
    renderWorkspace(document.body.dataset.role, document.body.dataset.feature);
  }
}).catch((error) => {
  console.error("Unable to initialize the demo account list.", error);
  const message = document.querySelector("#login-error") || document.querySelector("#page-error");
  if (message) {
    message.textContent = "Không tải được dữ liệu phân quyền. Hãy chạy demo qua máy chủ tĩnh và kiểm tra accounts.json.";
    message.hidden = false;
  }
});
