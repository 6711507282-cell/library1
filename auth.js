// Import ฟังก์ชันของ Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// ใส่ตั้งค่า Firebase ของคุณ
const firebaseConfig = {
    apiKey: "AIzaSyBJJWKjpd8CajlLHyfPyS1840RI07J4Fdg",
    authDomain: "library-bab3f.firebaseapp.com",
    projectId: "library-bab3f",
    storageBucket: "library-bab3f.firebasestorage.app",
    messagingSenderId: "140830822754",
    appId: "1:140830822754:web:0612c01a61c2dc6e115c3b",
    measurementId: "G-QMMXHDVP67"
};

// เริ่มต้น Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ดึง Elements จากหน้าเว็บ
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const errorMsg = document.getElementById('errorMessage');

// ฟังก์ชันเข้าสู่ระบบ
loginBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // ล็อกอินสำเร็จ ย้ายไปหน้าห้องสมุด
            window.location.href = "library.html";
        })
        .catch((error) => {
            errorMsg.innerText = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
            console.error(error.message);
        });
});

// ฟังก์ชันสมัครสมาชิก
registerBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("สมัครสมาชิกสำเร็จ! เข้าสู่ระบบแล้ว");
            window.location.href = "library.html";
        })
        .catch((error) => {
            errorMsg.innerText = "เกิดข้อผิดพลาด: รหัสผ่านต้อง 6 ตัวอักษรขึ้นไป หรืออีเมลซ้ำ";
            console.error(error.message);
        });
});
