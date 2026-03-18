import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// ใส่ตั้งค่า Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBJJWKjpd8CajlLHyfPyS1840RI07J4Fdg",
    authDomain: "library-bab3f.firebaseapp.com",
    projectId: "library-bab3f",
    storageBucket: "library-bab3f.firebasestorage.app",
    messagingSenderId: "140830822754",
    appId: "1:140830822754:web:0612c01a61c2dc6e115c3b",
    measurementId: "G-QMMXHDVP67"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ตรวจสอบการล็อกอิน
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('userEmail').innerText = `ผู้ใช้งาน: ${user.email}`;
        loadBooks(); // โหลดหนังสือทั้งหมดมาแสดง
    } else {
        // ถ้ายังไม่ล็อกอิน ให้เด้งกลับไปหน้า login
        window.location.href = "index.html";
    }
});

// ออกจากระบบ
document.getElementById('logoutBtn').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = "index.html";
    });
});

// เพิ่มหนังสือ
document.getElementById('addBookBtn').addEventListener('click', async () => {
    const title = document.getElementById('bookTitle').value;
    const category = document.getElementById('bookCategory').value;
    const msg = document.getElementById('addMessage');

    if(title === "" || category === "") {
        msg.innerText = "กรุณากรอกข้อมูลให้ครบถ้วน";
        msg.style.color = "red";
        return;
    }

    try {
        await addDoc(collection(db, "books"), {
            title: title,
            category: category,
            timestamp: new Date()
        });
        msg.innerText = "เพิ่มหนังสือสำเร็จ!";
        msg.style.color = "green";
        document.getElementById('bookTitle').value = "";
        document.getElementById('bookCategory').value = "";
        loadBooks(); // รีเฟรชรายการ
    } catch (e) {
        console.error("Error adding document: ", e);
    }
});

// ฟังก์ชันแสดงผลหนังสือ (แยกออกเพื่อง่ายต่อการเรียกใช้)
function renderBooks(books) {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = ""; 
    
    if(books.length === 0) {
        bookList.innerHTML = "<p>ไม่พบหนังสือที่ค้นหา</p>";
        return;
    }

    books.forEach(book => {
        const div = document.createElement('div');
        div.className = 'book-item';
        div.innerHTML = `
            <div class="book-title">📖 ${book.title}</div>
            <div class="book-category">หมวดหมู่: ${book.category}</div>
        `;
        bookList.appendChild(div);
    });
}

// โหลดและค้นหาหนังสือ
async function loadBooks(searchQuery = "") {
    const querySnapshot = await getDocs(collection(db, "books"));
    let books = [];
    
    querySnapshot.forEach((doc) => {
        books.push(doc.data());
    });

    // กรองข้อมูลตามคำค้นหา (ถ้าระบุ)
    if (searchQuery) {
        books = books.filter(book => 
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            book.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    renderBooks(books);
}

// กดปุ่มค้นหา
document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value;
    loadBooks(query);
});

// กดปุ่มแสดงทั้งหมด
document.getElementById('showAllBtn').addEventListener('click', () => {
    document.getElementById('searchInput').value = "";
    loadBooks();
});
