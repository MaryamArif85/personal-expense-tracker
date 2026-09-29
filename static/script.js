import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, orderBy, query } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your Firebase Config - from your screenshot
const firebaseConfig = {
  apiKey: "AIzaSyB-3FKyQVh7_4eR8wBuh7TT66Pw5J0TjvQ",
  authDomain: "personal-expense-tracker-539bf.firebaseapp.com",
  projectId: "personal-expense-tracker-539bf",
  storageBucket: "personal-expense-tracker-539bf.firebasestorage.app",
  messagingSenderId: "571703090151",
  appId: "1:571703090151:web:1beb66ed050cbfbd6a3b42"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const expensesRef = collection(db, "expenses");

const form = document.getElementById("expenseForm");
const table = document.getElementById("expenseTable");

if(document.getElementById("date")){
  document.getElementById("date").valueAsDate = new Date();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = form.querySelector("button");
  btn.innerText = "Adding...";
  btn.disabled = true;
  try {
    await addDoc(expensesRef, {
      title: document.getElementById("title").value.trim(),
      amount: Number(document.getElementById("amount").value),
      category: document.getElementById("category").value,
      date: document.getElementById("date").value,
      createdAt: new Date()
    });
    form.reset();
    document.getElementById("date").valueAsDate = new Date();
    loadData();
  } catch (err) { alert(err.message); }
  finally {
    btn.innerHTML = "<span>+</span> Add Expense";
    btn.disabled = false;
  }
});

async function loadData() {
  try {
    const q = query(expensesRef, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    let total = 0;
    table.innerHTML = "";
    if (snap.empty) {
      table.innerHTML = `<tr><td colspan="5" class="empty">No expenses yet. Add one!</td></tr>`;
    } else {
      snap.forEach((d) => {
        const data = d.data();
        total += data.amount;
        table.innerHTML += `
          <tr>
            <td><strong>${data.title}</strong></td>
            <td>Rs. ${data.amount}</td>
            <td><span class="category-pill">${data.category}</span></td>
            <td>${data.date}</td>
            <td><button class="delete-btn" data-id="${d.id}">Delete</button></td>
          </tr>`;
      });
    }
    document.getElementById("totalCount").innerText = snap.size;
    document.getElementById("totalAmount").innerText = `Rs. ${total}`;
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (confirm("Delete?")) {
          await deleteDoc(doc(db, "expenses", btn.dataset.id));
          loadData();
        }
      });
    });
  } catch (err) {
    table.innerHTML = `<tr><td colspan="5" class="empty">Error: ${err.message}<br>Set Firestore Rules to test mode</td></tr>`;
  }
}
loadData();