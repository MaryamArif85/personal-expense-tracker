import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, query, where, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB-3FKyQVh7_4eR0w0Uh7TT66Pw5J0TJvQ",
  authDomain: "personal-expense-tracker-539bf.firebaseapp.com",
  projectId: "personal-expense-tracker-539bf",
  storageBucket: "personal-expense-tracker-539bf.firebasestorage.app",
  messagingSenderId: "571703090151",
  appId: "1:571703090151:web:1beb66ed050cbfbd6a3b42"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

let editingId = null;
const submitBtn = document.querySelector(".add-btn");

document.getElementById("loginBtn")?.addEventListener("click", ()=> signInWithPopup(auth, provider));
document.getElementById("guestBtn")?.addEventListener("click", ()=> signInAnonymously(auth));
document.getElementById("logoutBtn")?.addEventListener("click", ()=> signOut(auth));

onAuthStateChanged(auth, (user)=>{
  if(user){
    document.getElementById("loginScreen").style.display="none";
    document.getElementById("appScreen").style.display="block";
    document.getElementById("mainHeader").style.display="flex";
    document.getElementById("userLabel").innerText = user.displayName || "Guest";
    loadExpenses(user.uid);
  }else{
    document.getElementById("loginScreen").style.display="flex";
    document.getElementById("appScreen").style.display="none";
    document.getElementById("mainHeader").style.display="none";
  }
});

document.getElementById("expenseForm")?.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const user = auth.currentUser;
  if(!user) return alert("Login first");
  const data = {
    uid: user.uid,
    title: document.getElementById("title").value,
    amount: parseFloat(document.getElementById("amount").value),
    category: document.getElementById("category").value,
    date: document.getElementById("date").value
  };
  try{
    if(editingId){
      await updateDoc(doc(db,"expenses",editingId), data);
      editingId=null;
      submitBtn.textContent="+ Add Expense";
      submitBtn.classList.remove("update-mode");
    }else{
      await addDoc(collection(db,"expenses"), data);
    }
    e.target.reset();
  }catch(err){ alert(err.message); }
});

function loadExpenses(uid){
  const q = query(collection(db,"expenses"), where("uid","==",uid));
  onSnapshot(q, (snap)=>{
    const tbody=document.getElementById("expenseTableBody");
    tbody.innerHTML="";
    let total=0;
    document.getElementById("emptyMsg").style.display = snap.empty ? "block":"none";
    snap.forEach(d=>{
      const data=d.data();
      total+=data.amount;
      tbody.innerHTML+=`<tr>
        <td data-label="TITLE">${data.title}</td>
        <td data-label="CATEGORY">${data.category}</td>
        <td data-label="DATE">${data.date}</td>
        <td data-label="AMOUNT">PKR ${data.amount}</td>
        <td><div class="action-btns"><button class="edit-btn" onclick="editExpense('${d.id}','${data.title}',${data.amount},'${data.category}','${data.date}')">Edit</button><button class="delete-btn" onclick="deleteExpense('${d.id}')">Delete</button></div></td>
      </tr>`;
    });
    document.getElementById("totalCount").innerText=snap.size;
    document.getElementById("totalAmount").innerText=`PKR ${total.toFixed(2)}`;
  });
}

window.deleteExpense=async(id)=>{ if(confirm("Delete?")) await deleteDoc(doc(db,"expenses",id)); };
window.editExpense=(id,title,amount,category,date)=>{
  editingId=id;
  document.getElementById("title").value=title;
  document.getElementById("amount").value=amount;
  document.getElementById("category").value=category;
  document.getElementById("date").value=date;
  submitBtn.textContent="✓ Update Expense";
  submitBtn.classList.add("update-mode");
  window.scrollTo({top:0,behavior:"smooth"});
};