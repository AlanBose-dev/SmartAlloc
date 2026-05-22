const API_URL = "http://localhost:5000/api/reports";

let expenseChartInstance = null;
let trendChartInstance = null;

document.addEventListener("DOMContentLoaded", () => {
  loadReports();
});

// Load Reports
async function loadReports() {

  try {

    // Fetch Income
    const incomeRes = await fetch(
      `${API_URL}/income`
    );

    const incomeData =
      await incomeRes.json();

    // Fetch Expenses
    const expenseRes = await fetch(
      `${API_URL}/expenses`
    );

    const expenseData =
      await expenseRes.json();

    updateSummaryCards(
      incomeData,
      expenseData
    );

    renderExpenseDistribution(
      expenseData
    );

    renderIncomeVsExpense(
      incomeData,
      expenseData
    );

    renderBreakdownTable(
      expenseData
    );

  } catch (error) {

    console.log(error);

  }

}

// Summary Cards
function updateSummaryCards(
  income,
  expenses
) {

  const totalIncome =
    income.reduce(
      (sum, item) =>
        sum + Number(item.amount),
      0
    );

  const totalExpense =
    expenses.reduce(
      (sum, item) =>
        sum + Number(item.amount),
      0
    );

  const savings =
    totalIncome - totalExpense;

  document.getElementById(
    "reportsTotalIncome"
  ).textContent =
    `₹${totalIncome.toLocaleString()}`;

  document.getElementById(
    "reportsTotalExpenses"
  ).textContent =
    `₹${totalExpense.toLocaleString()}`;

  document.getElementById(
    "reportsNetSavings"
  ).textContent =
    `₹${savings.toLocaleString()}`;
}

// Expense Distribution Chart
function renderExpenseDistribution(
  expenses
) {

  const canvas =
    document.getElementById(
      "expenseChart"
    );

  if (!canvas) return;

  const ctx =
    canvas.getContext("2d");

  if (expenseChartInstance) {
    expenseChartInstance.destroy();
  }

  if (expenses.length === 0) {
    return;
  }

  const categoryMap = {};

  expenses.forEach(item => {

    categoryMap[item.category] =
      (categoryMap[item.category] || 0)
      + Number(item.amount);

  });

  expenseChartInstance =
    new Chart(ctx, {

      type: "doughnut",

      data: {

        labels:
          Object.keys(categoryMap),

        datasets: [
          {
            data:
              Object.values(categoryMap),

            backgroundColor: [
              "#3b82f6",
              "#8b5cf6",
              "#f59e0b",
              "#22c55e",
              "#ef4444",
              "#9ca3af"
            ]
          }
        ]
      },

      options: {
        responsive: true,
        maintainAspectRatio: false
      }

    });

}

// Income vs Expense Chart
function renderIncomeVsExpense(
  income,
  expenses
) {

  const canvas =
    document.getElementById(
      "trendChart"
    );

  if (!canvas) return;

  const ctx =
    canvas.getContext("2d");

  if (trendChartInstance) {
    trendChartInstance.destroy();
  }

  const totalIncome =
    income.reduce(
      (sum, item) =>
        sum + Number(item.amount),
      0
    );

  const totalExpense =
    expenses.reduce(
      (sum, item) =>
        sum + Number(item.amount),
      0
    );

  trendChartInstance =
    new Chart(ctx, {

      type: "bar",

      data: {

        labels: [
          "Income",
          "Expenses"
        ],

        datasets: [
          {
            data: [
              totalIncome,
              totalExpense
            ],

            backgroundColor: [
              "#3b82f6",
              "#ef4444"
            ],

            borderRadius: 8
          }
        ]
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        }
      }

    });

}

// Breakdown Table
function renderBreakdownTable(
  expenses
) {

  const table =
    document.getElementById(
      "reportsBreakdownTable"
    );

  table.innerHTML = "";

  if (expenses.length === 0) {

    table.innerHTML = `
      <tr>
        <td colspan="4"
          class="py-6 text-center text-gray-500">

          No Expense Data

        </td>
      </tr>
    `;

    return;
  }

  const categoryMap = {};

  expenses.forEach(item => {

    categoryMap[item.category] =
      (categoryMap[item.category] || 0)
      + Number(item.amount);

  });

  const totalExpense =
    Object.values(categoryMap)
      .reduce(
        (sum, value) =>
          sum + value,
        0
      );

  Object.entries(categoryMap)
    .forEach(([category, amount]) => {

      const percent =
        (
          amount /
          totalExpense
        ) * 100;

      table.innerHTML += `
        <tr class="hover:bg-white/40 transition-colors border-b border-gray-100">

          <td class="py-4 px-4 font-medium text-gray-900">
            ${category}
          </td>

          <td class="py-4 px-4 text-right font-medium text-gray-900">
            ₹${amount.toLocaleString()}
          </td>

          <td class="py-4 px-4 text-right text-gray-600">
            ${percent.toFixed(1)}%
          </td>

          <td class="py-4 px-4 text-right text-gray-400">
            —
          </td>

        </tr>
      `;
    });

}