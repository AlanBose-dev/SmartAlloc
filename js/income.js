const API_URL = "https://smartalloc.onrender.com/api/income";

// Start
document.addEventListener(
  "DOMContentLoaded",
  () => {

    renderIncome();
localStorage.setItem(
  "dashboardUpdated",
  Date.now()
);
    const form =
      document.getElementById(
        "incomeForm"
      );

    form.addEventListener(
      "submit",
      async (e) => {

        e.preventDefault();

        await addIncome();

      }
    );
  }
);

// Add Income
async function addIncome() {
renderIncome();

localStorage.setItem(
  "dashboardUpdated",
  Date.now()
);
  const source =
    document.getElementById(
      "incomeSource"
    ).value.trim();

  const amount =
    document.getElementById(
      "incomeAmount"
    ).value;

  const income_date =
    document.getElementById(
      "incomeDate"
    ).value;

  const notes =
    document.getElementById(
      "incomeNote"
    ).value.trim();

  if (
    !source ||
    !amount ||
    !income_date
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

        source,
        amount,
        income_date,
        notes

      })

    });

    document
      .getElementById(
        "incomeForm"
      )
      .reset();

    renderIncome();

  } catch (error) {

    console.log(error);

  }
}

// Render Income
async function renderIncome() {

  try {

    const response =
      await fetch(API_URL);

    const incomes =
      await response.json();

    const incomeList =
      document.getElementById(
        "incomeList"
      );

    const totalIncome =
      document.getElementById(
        "totalIncome"
      );

    incomeList.innerHTML = "";

    let total = 0;

    if (incomes.length === 0) {

      incomeList.innerHTML = `
        <tr>
          <td colspan="4"
            class="py-6 text-center text-gray-500">

            No Income Added

          </td>
        </tr>
      `;

      totalIncome.textContent =
        "₹0";

      return;
    }

    incomes.forEach(item => {

      total += Number(
        item.amount
      );

      const initials =
        item.source
          .split(" ")
          .map(word =>
            word[0]
          )
          .join("")
          .toUpperCase()
          .slice(0, 2);

      incomeList.innerHTML += `
        <tr class="hover:bg-white/40 transition-colors border-b border-gray-100">

          <td class="py-4 px-4 text-gray-600">
            ${new Date(
              item.income_date
            ).toLocaleDateString()}
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
            + ₹${Number(
              item.amount
            ).toLocaleString()}
          </td>

          <td class="py-4 px-4 text-center">

            <button
              onclick="deleteIncome(${item.id})"
              class="text-red-500 hover:text-red-700">

              Delete

            </button>

          </td>

        </tr>
      `;
    });

    totalIncome.textContent =
      `₹${total.toLocaleString()}`;

  } catch (error) {

    console.log(error);

  }
}

// Delete Income
async function deleteIncome(id) {
renderIncome();

localStorage.setItem(
  "dashboardUpdated",
  Date.now()
);
  try {

    await fetch(
      `${API_URL}/${id}`,
      {
        method: "DELETE"
      }
    );

    renderIncome();

  } catch (error) {

    console.log(error);

  }
}