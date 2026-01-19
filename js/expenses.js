document.addEventListener("DOMContentLoaded", () => {
  renderExpenses();
  bindExpenseForm();
});

// ---------- Storage ----------
function getData() {
  return JSON.parse(localStorage.getItem("budgetPlannerData")) || {
    income: [],
    expenses: [],
    budget: {},
    savings: {}
  };
}

function saveData(data) {
  localStorage.setItem("budgetPlannerData", JSON.stringify(data));
}

// ---------- Bind form ----------
function bindExpenseForm() {
  const form = document.getElementById("add-expense-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    addExpense();
  });
}

// ---------- Add expense ----------
function addExpense() {
  const title = document.getElementById("expense-title").value.trim();
  const amount = Number(document.getElementById("expense-amount").value);
  const category = document.getElementById("expense-category").value;
  const date = document.getElementById("expense-date").value;
  const note = document.getElementById("expense-notes").value;

  if (!title || !amount || !category || !date) {
    alert("Please fill all required fields");
    return;
  }

  const data = getData();

  data.expenses.push({
    id: Date.now(),
    title,
    amount,
    category,
    date,
    note
  });

  saveData(data);
  document.getElementById("add-expense-form").reset();
  renderExpenses();
}

// ---------- Render table ----------
function renderExpenses() {
  const data = getData();
  const tbody = document.getElementById("expensesList");
  const totalEl = document.getElementById("totalExpenses");

  if (!tbody) return;

  tbody.innerHTML = "";
  let total = 0;

  data.expenses.forEach(exp => {
    total += exp.amount;

    const tr = document.createElement("tr");
    tr.className = "hover:bg-white/40 transition-colors border-b border-gray-100 group";

    tr.innerHTML = `
      <td class="py-4 px-4 text-gray-600">${formatDate(exp.date)}</td>
      <td class="py-4 px-4 font-medium text-gray-900">${exp.title}</td>
      <td class="py-4 px-4">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryBadge(exp.category)}">
          ${formatCategory(exp.category)}
        </span>
      </td>
      <td class="py-4 px-4 text-right text-gray-900 font-semibold">₹${exp.amount.toLocaleString()}</td>
      <td class="py-4 px-4 text-center">
        <div class="flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onclick="deleteExpense(${exp.id})"
            class="p-1.5 hover:bg-white rounded-md text-gray-400 hover:text-danger transition-colors">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </td>
    `;

    tbody.appendChild(tr);
  });

  if (totalEl) {
    totalEl.textContent = `₹${total.toLocaleString()}`;
  }

  // Re-render icons
  if (window.lucide) {
    lucide.createIcons();
  }
}

// ---------- Delete ----------
function deleteExpense(id) {
  const data = getData();
  data.expenses = data.expenses.filter(e => e.id !== id);
  saveData(data);
  renderExpenses();
}

// ---------- Helpers ----------
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function formatCategory(cat) {
  const map = {
    food: "Food & Dining",
    travel: "Travel",
    rent: "Rent",
    bills: "Bills",
    education: "Education",
    entertainment: "Entertainment",
    others: "Others"
  };
  return map[cat] || cat;
}

function categoryBadge(cat) {
  const map = {
    food: "bg-blue-100 text-blue-800",
    travel: "bg-amber-100 text-amber-800",
    rent: "bg-purple-100 text-purple-800",
    bills: "bg-red-100 text-red-800",
    education: "bg-green-100 text-green-800",
    entertainment: "bg-pink-100 text-pink-800",
    others: "bg-gray-100 text-gray-800"
  };
  return map[cat] || "bg-gray-100 text-gray-800";
}
