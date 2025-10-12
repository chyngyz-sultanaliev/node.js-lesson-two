// ----------------- CONFIG -----------------
const API =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api/todo"
    : "https://node-js-lesson-two.onrender.com/api/todo";

let token = localStorage.getItem("token");

// ----------------- DOM ELEMENTS -----------------
const emailInput = document.getElementById("email");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const signupBtn = document.getElementById("signup-btn");
const signinBtn = document.getElementById("signin-btn");
const todoSection = document.getElementById("todo-section");
const todoList = document.getElementById("todo-list");
const todoTitle = document.getElementById("todo-title");
const todoPrice = document.getElementById("todo-price");
const addTodoBtn = document.getElementById("add-todo-btn");
const logoutBtn = document.getElementById("logout-btn");
const searchQueryInput = document.getElementById("search-query");
const searchBtn = document.getElementById("search-btn");
const downloadExcelBtn = document.getElementById("download-excel-btn");

// ----------------- UTILS -----------------
async function fetchWithToken(url, options = {}) {
  if (!options.headers) options.headers = {};
  options.headers["Content-Type"] = "application/json";
  if (token) options.headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, options);

  if (res.status === 401) {
    token = null;
    localStorage.removeItem("token");
    todoSection.style.display = "none";
    document.getElementById("auth-section").style.display = "block";
    throw new Error("Unauthorized. Пожалуйста, войдите снова.");
  }

  return res.json();
}

// ----------------- INITIALIZE -----------------
async function initialize() {
  if (token) {
    try {
      await fetchTodos();
      document.getElementById("auth-section").style.display = "none";
      todoSection.style.display = "block";
    } catch (err) {
      console.error(err.message);
    }
  }
}
initialize();

// ----------------- SIGNUP -----------------
signupBtn.addEventListener("click", async () => {
  try {
    const data = await fetch(`${API}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailInput.value,
        username: usernameInput.value,
        password: passwordInput.value,
      }),
    }).then((res) => res.json());

    alert(
      data.message || (data.success ? "Успешно зарегистрированы!" : "Ошибка")
    );

    // Авто-вход после успешной регистрации
    if (data.success) {
      token = data.token;
      localStorage.setItem("token", token);
      document.getElementById("auth-section").style.display = "none";
      todoSection.style.display = "block";
      await fetchTodos();
    }
  } catch (err) {
    console.error(err);
  }
});

// ----------------- SIGNIN -----------------
signinBtn.addEventListener("click", async () => {
  try {
    const data = await fetch(`${API}/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailInput.value,
        username: usernameInput.value,
        password: passwordInput.value,
      }),
    }).then((res) => res.json());

    if (data.success) {
      token = data.token;
      localStorage.setItem("token", token);
      document.getElementById("auth-section").style.display = "none";
      todoSection.style.display = "block";
      await fetchTodos(); // Авто-отображение списка
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
  }
});

// ----------------- FETCH TODOS -----------------
async function fetchTodos() {
  try {
    const res = await fetchWithToken(`${API}/list`);
    console.log("Todos from server:", res);
    todoList.innerHTML = "";

    if (Array.isArray(res.data)) {
      if (res.data.length === 0) {
        todoList.innerHTML = "<li>Нет продуктов</li>";
      } else {
        res.data.forEach((todo) => {
          const li = document.createElement("li");
          li.textContent = `${todo.name} — ${todo.price}`;
          todoList.appendChild(li);
        });
      }
    } else {
      todoList.innerHTML = "<li>Нет данных</li>";
    }
  } catch (err) {
    console.error("fetchTodos error:", err.message);
  }
}

// ----------------- SEARCH TODOS -----------------
searchBtn.addEventListener("click", async () => {
  const query = searchQueryInput.value.trim();
  if (!query) return;

  try {
    const data = await fetchWithToken(`${API}/list/search?name=${query}`);
    todoList.innerHTML = "";

    if (data.success && Array.isArray(data.data)) {
      if (data.data.length === 0)
        todoList.innerHTML = "<li>Продукты не найдены</li>";
      data.data.forEach((todo) => {
        const li = document.createElement("li");
        li.textContent = `${todo.name} — ${todo.price}`;
        todoList.appendChild(li);
      });
    } else {
      alert(data.message || "Ошибка поиска");
    }
  } catch (err) {
    console.error(err.message);
  }
});

// ----------------- ADD TODO -----------------
addTodoBtn.addEventListener("click", async () => {
  const name = todoTitle.value.trim();
  const price = parseFloat(todoPrice.value) || 0;

  if (!name) return alert("Введите название продукта");

  try {
    const data = await fetchWithToken(`${API}/list`, {
      method: "POST",
      body: JSON.stringify({ name, price }),
    });

    if (data.success) {
      todoTitle.value = "";
      todoPrice.value = "";
      await fetchTodos(); // Авто-обновление списка после добавления
    } else {
      alert(data.message || "Ошибка при добавлении");
    }
  } catch (err) {
    console.error(err.message);
  }
});

// ----------------- DOWNLOAD EXCEL -----------------
downloadExcelBtn.addEventListener("click", async () => {
  try {
    const res = await fetch(`${API}/list/excel`, {
      headers: { Authorization: "Bearer " + token },
    });
    if (res.status === 401) throw new Error("Unauthorized");

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "todos.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err.message);
  }
});

// ----------------- LOGOUT -----------------
logoutBtn.addEventListener("click", () => {
  token = null;
  localStorage.removeItem("token");
  todoSection.style.display = "none";
  document.getElementById("auth-section").style.display = "block";
});
// ----------------- RESET PASSWORD -----------------
const resetModal = document.getElementById("reset-password-modal");
const openResetBtn = document.getElementById("open-reset-modal-btn");
const closeResetBtn = document.getElementById("close-reset-modal");

const stepEmail = document.getElementById("step-email");
const stepCode = document.getElementById("step-code");
const stepNewPassword = document.getElementById("step-new-password");

const resetEmailInput = document.getElementById("reset-email");
const resetCodeInput = document.getElementById("reset-code");
const resetNewPasswordInput = document.getElementById("reset-new-password");

const sendResetCodeBtn = document.getElementById("send-reset-code-btn");
const verifyResetCodeBtn = document.getElementById("verify-reset-code-btn");
const setNewPasswordBtn = document.getElementById("set-new-password-btn");

// Открыть модалку
openResetBtn.addEventListener("click", () => {
  resetModal.style.display = "flex";
  stepEmail.style.display = "block";
  stepCode.style.display = "none";
  stepNewPassword.style.display = "none";
});

// Закрыть модалку
closeResetBtn.addEventListener("click", () => {
  resetModal.style.display = "none";
});

// 1️⃣ Отправка кода на email
sendResetCodeBtn.addEventListener("click", async () => {
  const email = resetEmailInput.value.trim();
  if (!email) return alert("Введите email");

  try {
    const res = await fetch(`${API}/request-reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).then(r => r.json());

    if (res.message) {
      alert(res.message);
      stepEmail.style.display = "none";
      stepCode.style.display = "block";
    }
  } catch (err) {
    console.error(err);
  }
});

// 2️⃣ Проверка кода
verifyResetCodeBtn.addEventListener("click", async () => {
  const email = resetEmailInput.value.trim();
  const token = resetCodeInput.value.trim();
  if (!token) return alert("Введите код");

  try {
    const res = await fetch(`${API}/verify-reset-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token }),
    }).then(r => r.json());

    if (res.message === "Код верный") {
      stepCode.style.display = "none";
      stepNewPassword.style.display = "block";
    } else {
      alert(res.message);
    }
  } catch (err) {
    console.error(err);
  }
});

// 3️⃣ Установка нового пароля
setNewPasswordBtn.addEventListener("click", async () => {
  const email = resetEmailInput.value.trim();
  const token = resetCodeInput.value.trim();
  const newPassword = resetNewPasswordInput.value.trim();

  if (!newPassword) return alert("Введите новый пароль");

  try {
    const res = await fetch(`${API}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, newPassword }),
    }).then(r => r.json());

    if (res.message === "Пароль успешно обновлён") {
      alert("Пароль изменён! Войдите снова.");
      resetModal.style.display = "none";
    } else {
      alert(res.message);
    }
  } catch (err) {
    console.error(err);
  }
});
