const API_URL = "http://localhost:5000/api/budget";

const currentDate = new Date();

const month = currentDate.toLocaleString("default", {
  month: "long",
});

const year = currentDate.getFullYear();

// Inputs
const budgetInput = document.getElementById("budget-amount");
const savingsInput = document.getElementById("savings-target");

// Buttons
const saveBudgetBtn = document.getElementById("saveBudgetBtn");
const saveSavingsBtn = document.getElementById("saveSavingsBtn");

// Budget UI
const budgetTotalSpent =
  document.getElementById("budgetTotalSpent");

const budgetLimit =
  document.getElementById("budgetLimit");

const budgetProgressBar =
  document.getElementById("budgetProgressBar");

const budgetUsedPercent =
  document.getElementById("budgetUsedPercent");

const budgetRemaining =
  document.getElementById("budgetRemaining");

const budgetAlert =
  document.getElementById("budgetAlert");

// Savings UI
const savingsSoFar =
  document.getElementById("savingsSoFar");

const savingsGoal =
  document.getElementById("savingsGoal");

const savingsProgressBar =
  document.getElementById("savingsProgressBar");

const savingsPercent =
  document.getElementById("savingsPercent");

const savingsRemaining =
  document.getElementById("savingsRemaining");

// Save Budget
async function saveBudget() {
  try {
    const response = await fetch(`${API_URL}/budget`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        monthly_budget: budgetInput.value || 0,
        savings_goal: savingsInput.value || 0,
        month,
        year,
      }),
    });

    await response.json();

    alert("Saved Successfully");

    loadBudget();

  } catch (error) {
    console.error(error);
  }
}

// Load Budget
async function loadBudget() {
  try {
    const response = await fetch(
      `${API_URL}/budget/${month}/${year}`
    );

    const data = await response.json();

    budgetInput.value =
      data.monthly_budget || 0;

    savingsInput.value =
      data.savings_goal || 0;

    updateOverview();

  } catch (error) {
    console.error(error);
  }
}

// Update Overview
async function updateOverview() {
  try {

    // Dashboard Data
    const dashboardRes = await fetch(
      `${API_URL}/dashboard`
    );

    const dashboardData =
      await dashboardRes.json();

    const totalIncome =
      parseFloat(dashboardData.totalIncome) || 0;

    const totalExpense =
      parseFloat(dashboardData.totalExpense) || 0;

    const balance =
      totalIncome - totalExpense;

    // Budget Values
    const monthlyBudget =
      parseFloat(budgetInput.value) || 0;

    const savingsTarget =
      parseFloat(savingsInput.value) || 0;

    // -------------------------
    // Budget Calculation
    // -------------------------

    let budgetPercent = 0;

    if (monthlyBudget > 0) {
      budgetPercent =
        (totalExpense / monthlyBudget) * 100;
    }

    const remainingBudget =
      monthlyBudget - totalExpense;

    // UI Update
    budgetTotalSpent.textContent =
      `₹${totalExpense.toLocaleString()}`;

    budgetLimit.textContent =
      `₹${monthlyBudget.toLocaleString()}`;

    budgetUsedPercent.textContent =
      `${budgetPercent.toFixed(0)}% Used`;

    // Progress Width
    const progressWidth =
      Math.min(budgetPercent, 100);

    budgetProgressBar.style.width =
      `${progressWidth}%`;

    // Remaining Text
    if (remainingBudget >= 0) {

      budgetRemaining.textContent =
        `₹${remainingBudget.toLocaleString()}`;

    } else {

      budgetRemaining.textContent =
        `Over by ₹${Math.abs(
          remainingBudget
        ).toLocaleString()}`;
    }

    // Alert Logic
    budgetAlert.classList.remove(
      "hidden",
      "bg-red-50",
      "border-red-200",
      "bg-amber-50",
      "border-amber-200"
    );

    if (budgetPercent >= 100) {

      budgetAlert.classList.add(
        "bg-red-50",
        "border-red-200"
      );

      budgetAlert.innerHTML = `
        <div class="flex items-start">
          <i data-lucide="alert-circle"
             class="w-5 h-5 text-red-500 mr-3 mt-0.5">
          </i>

          <div>
            <h4 class="text-sm font-bold text-red-800">
              Over Budget
            </h4>

            <p class="text-xs text-red-700 mt-1">
              You exceeded your budget by ₹${Math.abs(
                remainingBudget
              ).toLocaleString()}
            </p>
          </div>
        </div>
      `;

    } else if (budgetPercent >= 75) {

      budgetAlert.classList.add(
        "bg-amber-50",
        "border-amber-200"
      );

      budgetAlert.innerHTML = `
        <div class="flex items-start">
          <i data-lucide="alert-triangle"
             class="w-5 h-5 text-amber-500 mr-3 mt-0.5">
          </i>

          <div>
            <h4 class="text-sm font-bold text-amber-800">
              Approaching Limit
            </h4>

            <p class="text-xs text-amber-700 mt-1">
              You have used ${budgetPercent.toFixed(0)}% of your budget.
            </p>
          </div>
        </div>
      `;

    } else {

      budgetAlert.classList.add("hidden");
    }

    // -------------------------
    // Savings Calculation
    // -------------------------

    let savingsAchieved = 0;

    if (savingsTarget > 0) {

      savingsAchieved =
        (balance / savingsTarget) * 100;
    }

    if (savingsAchieved > 100) {
      savingsAchieved = 100;
    }

    const remainingSavings =
      savingsTarget - balance;

    // Savings UI
    savingsSoFar.textContent =
      `₹${balance.toLocaleString()}`;

    savingsGoal.textContent =
      `₹${savingsTarget.toLocaleString()}`;

    savingsPercent.textContent =
      `${savingsAchieved.toFixed(0)}% Achieved`;

    savingsProgressBar.style.width =
      `${savingsAchieved}%`;

    if (remainingSavings > 0) {

      savingsRemaining.textContent =
        `₹${remainingSavings.toLocaleString()}`;

    } else {

      savingsRemaining.textContent =
        `Goal Reached`;
    }

    // Refresh Icons
    lucide.createIcons();

  } catch (error) {
    console.error(error);
  }
}

// Button Events
saveBudgetBtn.addEventListener(
  "click",
  saveBudget
);

saveSavingsBtn.addEventListener(
  "click",
  saveBudget
);

// Initial Load
loadBudget();