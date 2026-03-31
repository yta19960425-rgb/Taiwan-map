let allArticles = [];
let currentPage = 1;
const rowsPerPage = 8; // 改為 8 以對應 4 欄佈局
let currentFilter = 'all';
let searchQuery = '';

// 初始化：改為從您的資料夾路徑獲取文章 JSON
async function init() {
    try {
        // 建議將資料存在 ../json/articles.json 以統一專案結構
        const response = await fetch('../json/articles.json');
        allArticles = await response.json();
        setupEventListeners();
        render();
    } catch (error) {
        console.error("無法載入文章資料:", error);
    }
}

function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        currentPage = 1;
        render();
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.getAttribute('data-filter');
            currentPage = 1;
            render();
        });
    });
}

function render() {
    const grid = document.getElementById('articleGrid');
    
    // 過濾邏輯
    let filtered = allArticles.filter(item => {
        const matchesFilter = currentFilter === 'all' || item.category === currentFilter;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery) || 
                              item.desc.toLowerCase().includes(searchQuery);
        return matchesFilter && matchesSearch;
    });

    const start = (currentPage - 1) * rowsPerPage;
    const paginatedItems = filtered.slice(start, start + rowsPerPage);
    const totalPages = Math.ceil(filtered.length / rowsPerPage);

    grid.innerHTML = paginatedItems.length ? paginatedItems.map(post => `
        <div class="article-card">
            <div class="card-img">
                <span class="category-tag">${post.categoryName}</span>
                <img src="${post.img}" onerror="this.src='https://via.placeholder.com/300x200'">
            </div>
            <div class="card-content">
                <div class="article-date">${post.date}</div>
                <h3 class="article-title">${post.title}</h3>
                <p class="article-desc">${post.desc}</p>
                <a href="${post.link}" class="read-more">閱讀更多 →</a>
            </div>
        </div>
    `).join('') : '<div style="grid-column: 1/-1; text-align: center; padding: 50px; color: #888;">找不到相關文章...</div>';

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const container = document.getElementById('pagination');
    container.innerHTML = '';
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        btn.onclick = () => { 
            currentPage = i; 
            render(); 
            window.scrollTo({top: 0, behavior: 'smooth'}); 
        };
        container.appendChild(btn);
    }
}

init();