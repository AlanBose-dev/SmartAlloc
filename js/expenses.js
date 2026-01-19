document.addEventListener("DOMContentLoaded", () => {
  renderExpenses();

  const form = document.getElementById("add-expense-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      addExpense();
    });
  }
});

function addExpense() {
  const titleEl = document.getElementById("expense-title");
  const amountEl = document.getElementById("expense-amount");
  const categoryEl = document.getElementById("expense-category");
  const dateEl = document.getElementById("expense-date");
  const noteEl = document.getElementById("expense-notes");

  if (!titleEl || !amountEl || !categoryEl || !dateEl) return;

  const title = titleEl.value.trim();
  const amount = Number(amountEl.value);
  const category = categoryEl.value;
  const date = dateEl.value;
  const note = noteEl ? noteEl.value.trim() : "";

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

function renderExpenses() {
  const data = getData();
  const list = document.getElementById("expensesList");
  const totalEl = document.getElementById("totalExpenses");

  if (!list || !totalEl) return;

  list.innerHTML = "";
  let total = 0;

  data.expenses.forEach((item) => {
    total += item.amount;

    const initials = item.title
      .split(" ")
      .map(w => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const row = document.createElement("tr");
    row.className = "hover:bg-white/40 transition-colors border-b border-gray-100";

    row.innerHTML = `
      <td class="py-4 px-4 text-gray-600">
        ${item.date}
      </td>

      <td class="py-4 px-4">
        <div class="flex items-center">
          <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-danger mr-3 text-xs font-bold">
            ${initials}
          </div>
          <span class="font-medium text-gray-900">
            ${item.title}
          </span>
        </div>
      </td>

      <td class="py-4 px-4 text-gray-600">
        ${item.category}
      </td>

      <td class="py-4 px-4 text-right text-danger font-bold">
        - ₹${item.amount.toLocaleString()}
      </td>

      <td class="py-4 px-4 text-center">
        <button
          class="p-1.5 hover:bg-white/80 rounded-md text-gray-500 hover:text-danger transition-colors"
          onclick="deleteExpense(${item.id})"
          title="Delete"
        >
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </td>
    `;

    list.appendChild(row);
  });

  totalEl.textContent = `₹${total.toLocaleString()}`;

  if (window.lucide) {
    lucide.createIcons();
  }
}

function deleteExpense(id) {
  const data = getData();
  data.expenses = data.expenses.filter(item => item.id !== id);
  saveData(data);
  renderExpenses();
}
