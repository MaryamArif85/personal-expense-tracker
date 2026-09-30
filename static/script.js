// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// TODO: PASTE YOUR OWN CONFIG FROM Firebase Console here
const firebaseConfig = {
  apiKey: "AIzaSyB-3FKyQVh7_4eR0w0Uh7TT66Pw5J0TJvQ",
  authDomain: "personal-expense-tracker-539bf.firebaseapp.com",
  projectId: "personal-expense-tracker-539bf",
  storageBucket: "personal-expense-tracker-539bf.firebasestorage.app",
  messagingSenderId: "571703090151",
  appId: "1:571703090151:web:1beb66ed050cbfbd6a3b42"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Elements
const loginScreen = document.getElementById("loginScreen");
const appScreen = document.getElementById("appScreen");
const mainHeader = document.getElementById("mainHeader");
const userLabel = document.getElementById("userLabel");
const form = document.getElementById("expenseForm");
const submitBtn = form.querySelector(".add-btn");

let currentUser = null;
let isGuest = false;
let editingId = null;

if(document.getElementById("date")) document.getElementById("date").valueAsDate = new Date();

// Auth
document.getElementById("loginBtn").onclick = () => signInWithPopup(auth, provider);
document.getElementById("guestBtn").onclick = () => {
  isGuest = true;
  currentUser = { uid: "guest_user", displayName: "Guest User" };
  showApp();
};
document.getElementById("logoutBtn").onclick = () => {
  if(isGuest){ isGuest=false; currentUser=null; showLogin(); }
  else signOut(auth);
};
onAuthStateChanged(auth, (user)=>{
  if(user){ currentUser=user; isGuest=false; showApp(); }
  else if(!isGuest) showLogin();
});
function showLogin(){ loginScreen.style.display="flex"; appScreen.style.display="none"; mainHeader.style.display="none"; }
function showApp(){
  loginScreen.style.display="none"; appScreen.style.display="block"; mainHeader.style.display="flex";
  userLabel.textContent = isGuest ? "Guest User" : (currentUser.displayName || "User");
  loadExpenses();
}

// Add / Update
form.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const data = {
    uid: currentUser.uid,
    title: document.getElementById("title").value,
    amount: Number(document.getElementById("amount").value),
    category: document.getElementById("category").value,
    date: document.getElementById("date").value,
    createdAt: new Date()
  };
  if(editingId){
    await updateDoc(doc(db,"expenses",editingId), data);
    editingId = null;
    submitBtn.textContent = "+ Add Expense";
    submitBtn.classList.remove("update-mode");
  } else {
    await addDoc(collection(db,"expenses"), data);
  }
  form.reset();
  document.getElementById("date").valueAsDate = new Date();
  loadExpenses();
});

async function loadExpenses(){
  const tbody = document.getElementById("expenseTableBody");
  const q = query(collection(db,"expenses"), where("uid","==",currentUser.uid), orderBy("createdAt","desc"));
  const snap = await getDocs(q);
  let total=0;
  tbody.innerHTML="";
  document.getElementById("emptyMsg").style.display = snap.empty ? "block" : "none";
  snap.forEach(d=>{
    const data=d.data();
    total+=data.amount;
    tbody.innerHTML+=`<tr>
      <td>${data.title}</td>
      <td><span style="background:#2a2a5a;padding:4px 10px;border-radius:12px;color:#a5b4fc;font-size:11px">${data.category}</span></td>
      <td>${data.date}</td>
      <td style="color:#34d399;font-weight:600">PKR ${data.amount}</td>
      <td><div class="action-btns">
        <button class="edit-btn" onclick="editExpense('${d.id}','${data.title}','${data.amount}','${data.category}','${data.date}')">Edit</button>
        <button class="delete-btn" onclick="deleteExpense('${d.id}')">Delete</button>
      </div></td>
    </tr>`;
  });
  document.getElementById("totalCount").textContent=snap.size;
  document.getElementById("totalAmount").textContent=`PKR ${total.toFixed(2)}`;
}

window.editExpense = (id, title, amount, category, date) => {
  editingId = id;
  document.getElementById("title").value = title;
  document.getElementById("amount").value = amount;
  document.getElementById("category").value = category;
  document.getElementById("date").value = date;
  submitBtn.textContent = "✓ Update Expense";
  submitBtn.classList.add("update-mode");
  window.scrollTo({top:0, behavior:'smooth'});
}

window.deleteExpense = async (id)=>{
  if(confirm("Delete this expense permanently?")){
    await deleteDoc(doc(db,"expenses",id));
    if(editingId === id){ editingId=null; submitBtn.textContent="+ Add Expense"; submitBtn.classList.remove("update-mode"); form.reset(); }
    loadExpenses();
  }
}