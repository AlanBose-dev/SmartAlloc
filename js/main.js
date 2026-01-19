const CATEGORY_LABELS = {
  food: "Food & Dining",
  travel: "Travel & Transport",
  rent: "Rent & Housing",
  bills: "Bills & Utilities",
  education: "Education",
  entertainment: "Entertainment",
  others: "Others"
};

document.addEventListener("DOMContentLoaded", () => {
  const data = getData();

  updateSummaryCards(data);
  renderRecentTransactions(data);
  renderIncomeExpenseChart(data);
  renderExpenseCategoryChart(data);
});

/* ===== SUMMARY CARDS ===== */
function updateSummaryCards(data) {
  const incomeEl = document.getElementById("dashboardIncome");
  const expenseEl = document.getElementById("dashboardExpenses");
  const balanceEl = document.getElementById("dashboardBalance");

  if (!incomeEl || !expenseEl || !balanceEl) return;

  const totalIncome = data.income.reduce((s, i) => s + i.amount, 0);
  const totalExpenses = data.expenses.reduce((s, e) => s + e.amount, 0);
  const balance = totalIncome - totalExpenses;

  incomeEl.textContent = `₹${totalIncome.toLocaleString()}`;
  expenseEl.textContent = `₹${totalExpenses.toLocaleString()}`;
  balanceEl.textContent = `₹${balance.toLocaleString()}`;
}

/* ===== INCOME vs EXPENSE CHART ===== */
function renderIncomeExpenseChart(data) {
  const ctx = document.getElementById("incomeExpenseChart");
  if (!ctx) return;

  const totalIncome = data.income.reduce((s, i) => s + i.amount, 0);
  const totalExpenses = data.expenses.reduce((s, e) => s + e.amount, 0);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Income", "Expenses"],
      datasets: [{
        label: "Amount (₹)",
        data: [totalIncome, totalExpenses],
        backgroundColor: ["#22c55e", "#ef4444"],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}

/* ===== EXPENSE CATEGORY CHART ===== */
function renderExpenseCategoryChart(data) {
  const canvas = document.getElementById("expenseCategoryChart");
  if (!canvas) return;

  // 🔒 HARD GUARD: destroy any existing chart on this canvas
  const existingChart = Chart.getChart(canvas);
  if (existingChart) {
    existingChart.destroy();
  }

  if (!data.expenses || data.expenses.length === 0) return;

  const categoryTotals = {};
  data.expenses.forEach(e => {
    categoryTotals[e.category] =
      (categoryTotals[e.category] || 0) + e.amount;
  });

  const labels = Object.keys(categoryTotals).map(
    key => CATEGORY_LABELS[key] || key
  );
  const values = Object.values(categoryTotals);

  new Chart(canvas, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: [
          "#3b82f6",
          "#22c55e",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#14b8a6"
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });
}



/* ===== RECENT TRANSACTIONS ===== */
function renderRecentTransactions(data) {
  const container = document.getElementById("recentTransactions");
  if (!container) return;

  const incomeTx = data.income.map(i => ({
    type: "Income",
    title: i.source,
    amount: i.amount,
    date: i.date
  }));

  const expenseTx = data.expenses.map(e => ({
    type: "Expense",
    title: e.title,
    amount: e.amount,
    date: e.date
  }));

  const transactions = [...incomeTx, ...expenseTx]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  container.innerHTML = "";

  transactions.forEach(tx => {
    const row = document.createElement("tr");
    row.className = "hover:bg-white/40 transition-colors";

    row.innerHTML = `
      <td class="py-3 px-4 text-gray-600">${tx.date}</td>
      <td class="py-3 px-4 font-medium">${tx.title}</td>
      <td class="py-3 px-4 text-right font-bold ${
        tx.type === "Income" ? "text-success" : "text-danger"
      }">
        ${tx.type === "Income" ? "+" : "-"} ₹${tx.amount.toLocaleString()}
      </td>
      <td class="py-3 px-4 text-center text-sm ${
        tx.type === "Income" ? "text-success" : "text-danger"
      }">
        ${tx.type}
      </td>
    `;

    container.appendChild(row);
  });
}
function renderExpenseTrendChart(data) {
  const canvas = document.getElementById("expenseTrendChart");
  if (!canvas) return;

  const existingChart = Chart.getChart(canvas);
  if (existingChart) {
    existingChart.destroy();
  }

  if (!data.expenses || data.expenses.length === 0) return;

  const dailyTotals = {};
  data.expenses.forEach(e => {
    dailyTotals[e.date] = (dailyTotals[e.date] || 0) + e.amount;
  });

  new Chart(canvas, {
    type: "line",
    data: {
      labels: Object.keys(dailyTotals),
      datasets: [{
        data: Object.values(dailyTotals),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.15)",
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

function renderExpenseCategoryChart(data) {
  const canvas = document.getElementById("expenseCategoryChart");
  if (!canvas) return;

  const expenses = data.expenses;
  if (expenses.length === 0) return;

  const categoryTotals = {};
  expenses.forEach(e => {
    categoryTotals[e.category] =
      (categoryTotals[e.category] || 0) + e.amount;
  });

  new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: Object.keys(categoryTotals),
      datasets: [{
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#3b82f6",
          "#22c55e",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#14b8a6"
        ]
      }]
    },
    options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          padding: 16
        }
      }
    }
  }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const data = getData();

  updateSummaryCards(data);
  renderRecentTransactions(data);

  // ADD THESE TWO LINES
  renderExpenseTrendChart(data);
  renderExpenseCategoryChart(data);
});
