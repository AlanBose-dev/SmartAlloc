// ================================
// Budget Page Logic (FINAL FIXED)
// Uses EXISTING IDs + EXISTING STORAGE
// ================================

document.addEventListener("DOMContentLoaded", () => {
  renderBudgetPage();
  bindActions();
});

// ---------- Storage helpers ----------
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

// ---------- Utilities ----------
function sum(arr) {
  return arr.reduce((t, i) => t + Number(i.amount || 0), 0);
}

// ---------- Main render ----------
function renderBudgetPage() {
  const data = getData();

  const totalIncome = sum(data.income);
  const totalExpenses = sum(data.expenses);

  // REAL savings (money left)
  const savings = totalIncome - totalExpenses;

  // Budget (planning only)
  const budgetLimit = Number(data.budget.total || 0);
  const budgetRemaining = budgetLimit - totalExpenses;

  // ---------- Budget Overview ----------
  const spentEl = document.getElementById("budgetTotalSpent");
  const limitEl = document.getElementById("budgetLimit");
  const remainingEl = document.getElementById("budgetRemaining");
  const percentEl = document.getElementById("budgetUsedPercent");
  const barEl = document.getElementById("budgetProgressBar");
  const alertBox = document.getElementById("budgetAlert");

  if (spentEl) spentEl.textContent = `₹${totalExpenses.toLocaleString()}`;
  if (limitEl) limitEl.textContent = `₹${budgetLimit.toLocaleString()}`;

  let rawPercent = 0;
  if (budgetLimit > 0) {
    rawPercent = (totalExpenses / budgetLimit) * 100;
  }

  const percentUsed = Math.min(rawPercent, 100);

  if (percentEl) {
    percentEl.textContent = `${rawPercent.toFixed(0)}% Used`;
  }

  if (barEl) {
    barEl.style.width = `${percentUsed}%`;
  }

  if (remainingEl) {
    if (budgetLimit === 0) {
      remainingEl.textContent = "No budget set";
      remainingEl.classList.remove("text-danger");
    } else if (budgetRemaining < 0) {
      remainingEl.textContent = `Over by ₹${Math.abs(budgetRemaining).toLocaleString()}`;
      remainingEl.classList.add("text-danger");
    } else {
      remainingEl.textContent = `₹${budgetRemaining.toLocaleString()}`;
      remainingEl.classList.remove("text-danger");
    }
  }

  // ---------- Budget alert ----------
  if (alertBox) {
    if (budgetLimit === 0 || rawPercent < 70) {
      alertBox.classList.add("hidden");
    } else if (rawPercent < 100) {
      alertBox.classList.remove("hidden");
      alertBox.querySelector("h4").textContent = "Approaching Limit";
      alertBox.querySelector("p").textContent =
        `You've used ${rawPercent.toFixed(0)}% of your planned budget.`;
    } else {
      alertBox.classList.remove("hidden");
      alertBox.querySelector("h4").textContent = "Over Budget (Planning)";
      alertBox.querySelector("p").textContent =
        `You've exceeded your planned budget by ₹${Math.abs(budgetRemaining).toLocaleString()}. This does not affect your actual savings.`;
    }
  }

  // ---------- Savings Overview ----------
  const savedEl = document.getElementById("savingsSoFar");
  const goalEl = document.getElementById("savingsGoal");
  const remainSaveEl = document.getElementById("savingsRemaining");
  const savePercentEl = document.getElementById("savingsPercent");
  const saveBarEl = document.getElementById("savingsProgressBar");

  const savingsGoal = Number(data.savings.goal || 0);
  const savingsRemaining = savingsGoal - savings;

  if (savedEl) savedEl.textContent = `₹${Math.max(savings, 0).toLocaleString()}`;
  if (goalEl) goalEl.textContent = `₹${savingsGoal.toLocaleString()}`;

  let savePercent = 0;
  if (savingsGoal > 0) {
    savePercent = Math.min((savings / savingsGoal) * 100, 100);
  }

  if (savePercentEl) {
    savePercentEl.textContent = `${savePercent.toFixed(0)}% Achieved`;
  }

  if (saveBarEl) {
    saveBarEl.style.width = `${savePercent}%`;
  }

  if (remainSaveEl) {
    if (savingsGoal === 0) {
      remainSaveEl.textContent = "No goal set";
    } else {
      remainSaveEl.textContent = `₹${Math.max(savingsRemaining, 0).toLocaleString()}`;
    }
  }
}

// ---------- Actions ----------
function bindActions() {
  const saveBudgetBtn = document.getElementById("saveBudgetBtn");
  const saveSavingsBtn = document.getElementById("saveSavingsBtn");

  saveBudgetBtn?.addEventListener("click", () => {
    const amount = Number(document.getElementById("budget-amount").value);
    if (!amount || amount <= 0) return alert("Enter a valid budget amount");

    const data = getData();
    data.budget.total = amount;
    saveData(data);

    renderBudgetPage();
  });

  saveSavingsBtn?.addEventListener("click", () => {
    const amount = Number(document.getElementById("savings-target").value);
    if (!amount || amount <= 0) return alert("Enter a valid savings goal");

    const data = getData();
    data.savings.goal = amount;
    saveData(data);

    renderBudgetPage();
  });
}
