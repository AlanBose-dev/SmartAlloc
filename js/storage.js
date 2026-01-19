const STORAGE_KEY = "budgetPlannerData";

function getData() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    income: [],
    expenses: [],
    budget: {},
    savings: {}
  };
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
