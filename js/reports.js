// reports.js — FULL & FINAL

let expenseChartInstance = null;
let trendChartInstance = null;

document.addEventListener("DOMContentLoaded", () => {
  renderReports();
});

function getData() {
  const raw = localStorage.getItem("budgetPlannerData");
  if (!raw) {
    return { income: [], expenses: [] };
  }
  return JSON.parse(raw);
}

function renderReports() {
  const data = getData();

  updateSummaryCards(data.income, data.expenses);
  renderExpenseDistribution(data.expenses);
  renderIncomeVsExpense(data.income, data.expenses);
  renderBreakdownTable(data.expenses);
}


function updateSummaryCards(income, expenses) {
  const totalIncome = income.reduce((sum, i) => sum + Number(i.amount), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const savings = totalIncome - totalExpenses;

  const incomeEl = document.getElementById("reportsTotalIncome");
  const expenseEl = document.getElementById("reportsTotalExpenses");
  const savingsEl = document.getElementById("reportsNetSavings");

  if (incomeEl) incomeEl.textContent = `₹${totalIncome.toLocaleString()}`;
  if (expenseEl) expenseEl.textContent = `₹${totalExpenses.toLocaleString()}`;
  if (savingsEl) savingsEl.textContent = `₹${savings.toLocaleString()}`;
}

/* ==============================
   EXPENSE DISTRIBUTION (DONUT)
================================ */
function renderExpenseDistribution(expenses) {
  const canvas = document.getElementById("expenseChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // Destroy old chart if exists
  if (expenseChartInstance) {
    expenseChartInstance.destroy();
  }

  if (expenses.length === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  // Group expenses by category
  const categoryMap = {};
  expenses.forEach((e) => {
    categoryMap[e.category] =
      (categoryMap[e.category] || 0) + Number(e.amount);
  });

  const labels = Object.keys(categoryMap);
  const values = Object.values(categoryMap);

  const colors = [
    "#3b82f6",
    "#8b5cf6",
    "#f59e0b",
    "#22c55e",
    "#ef4444",
    "#9ca3af"
  ];

  expenseChartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "65%",
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}

/* ==============================
   INCOME VS EXPENSE (BAR)
================================ */
function renderIncomeVsExpense(income, expenses) {
  const canvas = document.getElementById("trendChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // Destroy old chart if exists
  if (trendChartInstance) {
    trendChartInstance.destroy();
  }

  const totalIncome = income.reduce((sum, i) => sum + Number(i.amount), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  trendChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Income", "Expenses"],
      datasets: [
        {
          label: "Amount",
          data: [totalIncome, totalExpenses],
          backgroundColor: ["#3b82f6", "#ef4444"],
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}
function renderBreakdownTable(expenses) {
  const tableBody = document.getElementById("reportsBreakdownTable");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  if (expenses.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="py-6 text-center text-gray-500">
          No expense data available
        </td>
      </tr>
    `;
    return;
  }

  // Group expenses by category
  const categoryMap = {};
  expenses.forEach((e) => {
    categoryMap[e.category] =
      (categoryMap[e.category] || 0) + Number(e.amount);
  });

  const totalExpense = Object.values(categoryMap)
    .reduce((sum, val) => sum + val, 0);

  Object.entries(categoryMap).forEach(([category, amount]) => {
    const percent = ((amount / totalExpense) * 100).toFixed(1);

    const row = document.createElement("tr");
    row.className = "hover:bg-white/40 transition-colors border-b border-gray-100";

    row.innerHTML = `
      <td class="py-4 px-4 font-medium text-gray-900 capitalize">
        ${category}
      </td>
      <td class="py-4 px-4 text-right font-medium text-gray-900">
        ₹${amount.toLocaleString()}
      </td>
      <td class="py-4 px-4 text-right text-gray-600">
        ${percent}%
      </td>
      <td class="py-4 px-4 text-right text-gray-400">
        —
      </td>
    `;

    tableBody.appendChild(row);
  });
}
