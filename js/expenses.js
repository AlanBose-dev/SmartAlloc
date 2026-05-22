const API_URL =
  "https://smartalloc.onrender.com/api/expenses";

// Start
document.addEventListener(
  "DOMContentLoaded",
  () => {

    renderExpenses();

    bindExpenseForm();

  }
);

// Bind Form
function bindExpenseForm() {

  const form =
    document.getElementById(
      "add-expense-form"
    );

  if (!form) return;

  form.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();

      await addExpense();

    }
  );
}

// Add Expense
async function addExpense() {

  

  const amount =
    document.getElementById(
      "expense-amount"
    ).value;

  const category =
    document.getElementById(
      "expense-category"
    ).value;

  const expense_date =
    document.getElementById(
      "expense-date"
    ).value;

  const notes =
    document.getElementById(
      "expense-notes"
    ).value;

  if (

    !amount ||
    !category ||
    !expense_date
  ) {

    alert(
      "Please fill all fields"
    );

    return;
  }

  try {

    await fetch(API_URL, {

      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({

        category,
        amount,
        expense_date,
        notes

      })

    });

    document
      .getElementById(
        "add-expense-form"
      )
      .reset();

    renderExpenses();

    localStorage.setItem(
      "dashboardUpdated",
      Date.now()
    );

  } catch (error) {

    console.log(error);

  }
}

// Render Expenses
async function renderExpenses() {

  try {

    const response =
      await fetch(API_URL);

    const expenses =
      await response.json();

    const tbody =
      document.getElementById(
        "expensesList"
      );

    const totalEl =
      document.getElementById(
        "totalExpenses"
      );

    tbody.innerHTML = "";

    let total = 0;

    if (expenses.length === 0) {

      tbody.innerHTML = `
        <tr>
          <td colspan="5"
            class="py-6 text-center text-gray-500">

            No Expenses Added

          </td>
        </tr>
      `;

      totalEl.textContent =
        "₹0";

      return;
    }

    expenses.forEach(exp => {

      total += Math.round(Number(exp.amount));

      tbody.innerHTML += `
        <tr class="hover:bg-white/40 transition-colors border-b border-gray-100">

          <td class="py-4 px-4 text-gray-600">
            ${new Date(
              exp.expense_date
            ).toLocaleDateString()}
          </td>

          <td class="py-4 px-4 font-medium text-gray-900">
            ${exp.category}
          </td>

         
          <td class="py-4 px-4 text-right font-semibold text-gray-900">
            ₹${Number(
              exp.amount
            ).toFixed(2)}
          </td>

          <td class="py-4 px-4 text-center">

            <button
              onclick="deleteExpense(${exp.id})"
              class="text-red-500 hover:text-red-700">

              Delete

            </button>

          </td>

        </tr>
      `;
    });

    totalEl.textContent =
  `₹${total.toFixed(2)}`;
  } catch (error) {

    console.log(error);

  }
}

// Delete Expense
async function deleteExpense(id) {

  try {

    await fetch(
      `${API_URL}/${id}`,
      {
        method: "DELETE"
      }
    );

    renderExpenses();

    localStorage.setItem(
      "dashboardUpdated",
      Date.now()
    );

  } catch (error) {

    console.log(error);

  }
}