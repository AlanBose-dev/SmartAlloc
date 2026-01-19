document.addEventListener("DOMContentLoaded", () => {
  renderIncome();

  const form = document.getElementById("incomeForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      addIncome();
    });
  }
});

function addIncome() {
  const sourceEl = document.getElementById("incomeSource");
  const amountEl = document.getElementById("incomeAmount");
  const dateEl = document.getElementById("incomeDate");
  const noteEl = document.getElementById("incomeNote");

  if (!sourceEl || !amountEl || !dateEl) return;

  const source = sourceEl.value.trim();
  const amount = Number(amountEl.value);
  const date = dateEl.value;
  const note = noteEl ? noteEl.value.trim() : "";

  if (!source || !amount || !date) {
    alert("Please fill all required fields");
    return;
  }

  const data = getData();

  data.income.push({
    id: Date.now(),
    source,
    amount,
    date,
    note
  });

  saveData(data);

  document.getElementById("incomeForm").reset();
  renderIncome();
}

function renderIncome() {
  const data = getData();
  const list = document.getElementById("incomeList");
  const totalEl = document.getElementById("totalIncome");

  if (!list || !totalEl) return;

  list.innerHTML = "";
  let total = 0;

  data.income.forEach((item) => {
    total += item.amount;

    const initials = item.source
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
          <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 text-xs font-bold">
            ${initials}
          </div>
          <span class="font-medium text-gray-900">
            ${item.source}
          </span>
        </div>
      </td>

      <td class="py-4 px-4 text-right text-success font-bold">
        + ₹${item.amount.toLocaleString()}
      </td>

      <td class="py-4 px-4 text-center">
        <div class="flex items-center justify-center">
          <button
            class="p-1.5 hover:bg-white/80 rounded-md text-gray-500 hover:text-danger transition-colors"
            onclick="deleteIncome(${item.id})"
            title="Delete"
          >
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </td>
    `;

    list.appendChild(row);
  });

  totalEl.textContent = `₹${total.toLocaleString()}`;

  // Re-render lucide icons for dynamically added rows
  if (window.lucide) {
    lucide.createIcons();
  }
}

function deleteIncome(id) {
  const data = getData();
  data.income = data.income.filter(item => item.id !== id);
  saveData(data);
  renderIncome();
}
