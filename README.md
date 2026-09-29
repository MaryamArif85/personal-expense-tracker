# 💰 ExpenseTracker - Personal Finance Manager

A modern, responsive Personal Expense Tracker built with Flask and Firebase Firestore. Track daily spending, manage transactions, and monitor your budget in real-time.

**Live Demo:** `https://personal-expense-tracker-theta-ruddy.vercel.app/
**Project ID:** personal-expense-tracker-539bf

### ✨ Features
- Add, View, and Delete Expenses
- Real-time data sync with Firebase Firestore
- Total Transactions & Total Spent Dashboard
- Category-wise Tracking (Food, Transport, Bills, Shopping, etc.)
- Responsive Design - Works on Mobile & Desktop
- Deployed on Vercel with Flask Backend

### 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6 Modules)
- **Backend:** Python Flask
- **Database:** Google Firebase Firestore
- **Hosting:** Vercel
- **SDK:** Firebase JS SDK v10.12.2

### 📁 Project Structure

Expense Tracker/
├── static/
│   ├── style.css
│   └── script.js (Firebase Config)
├── templates/
│   └── index.html
├── main.py (Flask App)
├── requirements.txt
├── vercel.json
└── README.md


### 🚀 How to Run Locally
1. Clone the repo:
   ```bash
   git clone https://github.com/MaryamArif85/personal-expense-tracker
   cd personal-expense-tracker

### Install dependencies
   pip install -r requirements.txt

### Run the app
   python main.py
Open 127.0.0.1:5000

🔥 Firebase Setup
Create project at 
console.firebase.google.com
Enable Firestore Database (Test Mode)
Copy config to static/script.js
Firestore Rules:
   allow read, write: if true;

🌐 Deployment (Vercel)

👨‍💻 Author
Developed as part of Cloud Applied Generative AI - Assignment
Location: Karachi, PK

