const expenseForm = document.querySelector("form");
const titleInput = document.getElementById("expense");
const amountInput = document.getElementById("amount");
const expenseList = document.querySelector(".expense-list ul");

const budgetInput = document.getElementById("budget-input");
const setBudgetBtn = document.getElementById("set-budget-btn");

const totalSpentSpan = document.querySelector(".summary li:nth-child(2) span");
const remainingSpan = document.querySelector(".summary li:nth-child(3) span");

let expenses = [];
let totalBudget = parseFloat(budgetInput.value) || 1000;
let totalSpent = 0;

function updateSummary() {
  totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  totalSpentSpan.textContent = `$ ${totalSpent.toFixed(2)}`;
  const remaining = totalBudget - totalSpent;
  remainingSpan.textContent = `$ ${remaining.toFixed(2)}`;
}

function renderExpenses() {
  expenseList.innerHTML = "";
  expenses.forEach((expense, index) => {
    const li = document.createElement("li");

    const titleSpan = document.createElement("span");
    titleSpan.className = "expense-title";
    titleSpan.textContent = expense.title;

    const amountSpan = document.createElement("span");
    amountSpan.className = "expense-amount";
    amountSpan.textContent = `-$${expense.amount}`;

    const actionsSpan = document.createElement("span");
    actionsSpan.className = "expense-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editExpense(index);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "X";
    deleteBtn.onclick = () => deleteExpense(index);

    actionsSpan.appendChild(editBtn);
    actionsSpan.appendChild(deleteBtn);

    li.appendChild(titleSpan);
    li.appendChild(amountSpan);
    li.appendChild(actionsSpan);

    expenseList.appendChild(li);
  });

  updateSummary();
}

function addExpense(title, amount) {
  expenses.push({ title, amount });
  renderExpenses();
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  renderExpenses();
}

function editExpense(index) {
  const expense = expenses[index];
  const newTitle = prompt("Edit title:", expense.title);
  const newAmount = parseFloat(prompt("Edit amount:", expense.amount));

  if (newTitle && !isNaN(newAmount)) {
    expenses[index] = { title: newTitle, amount: newAmount };
    renderExpenses();
  }
}

expenseForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const title = titleInput.value.trim();
  const amount = parseFloat(amountInput.value);

  if (title && !isNaN(amount)) {
    addExpense(title, amount);
    titleInput.value = "";
    amountInput.value = "";
  } else {
    alert("Please enter valid title and amount.");
  }
});

setBudgetBtn.addEventListener("click", () => {
  const newBudget = parseFloat(budgetInput.value);
  if (!isNaN(newBudget) && newBudget >= 0) {
    totalBudget = newBudget;
    updateSummary();
  } else {
    alert("Enter a valid budget.");
  }
});
