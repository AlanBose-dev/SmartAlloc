const API_URL = "https://smartalloc.onrender.com/api/dashboard";

const currentDate = new Date();

const month = currentDate.toLocaleString("default", {
  month: "long",
});

const year = currentDate.getFullYear();

// Load Dashboard
async function loadDashboard() {

  try {

    // Dashboard API
    const dashboardRes = await fetch("https://smartalloc.onrender.com/api/dashboard")

    const dashboardData =
      await dashboardRes.json();

    // Budget API
    const budgetRes = await fetch(`https://smartalloc.onrender.com/api/budget/${month}/${year}`)

    const budgetData =
      await budgetRes.json();

    // Values
    const totalIncome =
      parseFloat(dashboardData.totalIncome) || 0;

    const totalExpense =
      parseFloat(dashboardData.totalExpense) || 0;

    const balance =
      totalIncome - totalExpense;

    const monthlyBudget =
      parseFloat(budgetData.monthly_budget) || 0;

    const savingsGoal =
      parseFloat(budgetData.savings_goal) || 0;

    // Dashboard Cards
    document.getElementById(
      "dashboardIncome"
    ).textContent =
      `₹${totalIncome.toLocaleString()}`;

    document.getElementById(
      "dashboardExpenses"
    ).textContent =
      `₹${totalExpense.toLocaleString()}`;

    document.getElementById(
      "dashboardBalance"
    ).textContent =
      `₹${balance.toLocaleString()}`;

    // --------------------
    // Savings Progress
    // --------------------

    let savingsPercent = 0;

    if (savingsGoal > 0) {

      savingsPercent =
        (balance / savingsGoal) * 100;
    }

    if (savingsPercent > 100) {
      savingsPercent = 100;
    }

    // Savings Card
    const savingsCard =
      document.querySelectorAll(
        ".glass-card"
      )[3];

    savingsCard.innerHTML = `
      <div class="relative z-10">

        <div class="flex justify-between items-center mb-1">
          <p class="text-sm font-medium text-gray-500">
            Savings Goal
          </p>

          <span class="text-xs font-bold text-success bg-green-100 px-2 py-0.5 rounded-full">
            ${savingsPercent.toFixed(0)}%
          </span>
        </div>

        <h3 class="text-2xl font-bold text-gray-900 mb-4">
          ₹${balance.toLocaleString()}
          <span class="text-sm font-normal text-gray-400">
            / ₹${savingsGoal.toLocaleString()}
          </span>
        </h3>

        <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div
            class="bg-success h-2.5 rounded-full"
            style="width:${savingsPercent}%">
          </div>
        </div>

        <p class="text-xs text-gray-500 mt-2">
          ${savingsPercent >= 100
            ? "Goal Achieved"
            : "Savings In Progress"}
        </p>

      </div>

      <div class="absolute bottom-0 left-0 w-full h-1 bg-success"></div>
    `;

    // --------------------
    // Budget Status
    // --------------------

    let budgetPercent = 0;

    if (monthlyBudget > 0) {

      budgetPercent =
        (totalExpense / monthlyBudget) * 100;
    }

    const statusTitle =
      budgetPercent >= 100
        ? "Over Budget"
        : budgetPercent >= 75
        ? "Near Limit"
        : "Safe";

    const statusText =
      budgetPercent >= 100
        ? `You exceeded your budget by ₹${(
            totalExpense - monthlyBudget
          ).toLocaleString()}`
        : `You have spent ${budgetPercent.toFixed(
            0
          )}% of your monthly budget.`;

    // Budget Status Card
    const budgetStatus =
      document.querySelector(
        ".border-l-warning"
      );

    budgetStatus.innerHTML = `
      <div class="flex flex-col md:flex-row justify-between items-center">

        <div class="flex items-center mb-4 md:mb-0">

          <div class="bg-amber-100 p-3 rounded-full mr-4 text-warning">
            <i data-lucide="alert-circle"
               class="w-6 h-6">
            </i>
          </div>

          <div>
            <h4 class="text-lg font-bold text-gray-900">
              Budget Status: ${statusTitle}
            </h4>

            <p class="text-sm text-gray-600">
              ${statusText}
            </p>
          </div>

        </div>

        <div class="flex items-center space-x-4 w-full md:w-auto">

          <div class="flex-1 md:flex-none text-right">
            <p class="text-xs text-gray-500 uppercase tracking-wide">
              Spent
            </p>

            <p class="font-bold text-gray-900">
              ₹${totalExpense.toLocaleString()}
            </p>
          </div>

          <div class="h-8 w-px bg-gray-300"></div>

          <div class="flex-1 md:flex-none text-left">
            <p class="text-xs text-gray-500 uppercase tracking-wide">
              Limit
            </p>

            <p class="font-bold text-gray-900">
              ₹${monthlyBudget.toLocaleString()}
            </p>
          </div>

        </div>

      </div>
    `;

    // --------------------
    // Recent Transactions
    // --------------------

    loadRecentTransactions();

    // Refresh Icons
    lucide.createIcons();

  } catch (error) {

    console.log(error);

  }

}

// Recent Transactions
async function loadRecentTransactions() {

  try {

    const incomeRes = await fetch("https://smartalloc.onrender.com/api/income")

    const expenseRes = await fetch("https://smartalloc.onrender.com/api/expenses")

    const incomes =
      await incomeRes.json();

    const expenses =
      await expenseRes.json();

    // Format Data
    const incomeData = incomes.map(item => ({
      type: "Income",
      category: item.source,
      amount: item.amount,
      date: item.date,
    }));

    const expenseData = expenses.map(item => ({
      type: "Expense",
      category: item.category,
      amount: item.amount,
      date: item.date,
    }));

    // Merge + Sort
    const transactions =
      [...incomeData, ...expenseData]
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      )
      .slice(0, 5);

    const table =
      document.getElementById(
        "recentTransactions"
      );

    table.innerHTML = "";

    transactions.forEach(item => {

      table.innerHTML += `
        <tr class="hover:bg-white/40 transition-colors border-b border-gray-100">

          <td class="py-4 px-4 text-gray-600">
            ${item.date}
          </td>

          <td class="py-4 px-4">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              ${item.category}
            </span>
          </td>

          <td class="py-4 px-4 text-gray-900 font-medium">
            ${item.category}
          </td>

          <td class="py-4 px-4 text-right font-semibold
            ${item.type === "Income"
              ? "text-success"
              : "text-danger"}">

            ${item.type === "Income"
              ? "+"
              : "-"} ₹${Number(
                item.amount
              ).toLocaleString()}

          </td>

          <td class="py-4 px-4 text-center">
            ${item.type}
          </td>

        </tr>
      `;
    });

  } catch (error) {

    console.log(error);

  }
}

// Start
loadDashboard();