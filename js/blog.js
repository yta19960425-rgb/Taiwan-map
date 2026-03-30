let allArticles = [];
let currentPage = 1;
const rowsPerPage = 6;
let currentFilter = 'all';
let searchQuery = '';

// 初始化：從 JSON 檔案抓取資料
async function init() {
    try {
        const response = await fetch('data.json');
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

    // 分頁邏輯
    const start = (currentPage - 1) * rowsPerPage;
    const paginatedItems = filtered.slice(start, start + rowsPerPage);
    const totalPages = Math.ceil(filtered.length / rowsPerPage);

    // 渲染 HTML
    grid.innerHTML = paginatedItems.length ? paginatedItems.map(post => `
        <div class="article-card">
            <div class="card-img">
                <span class="category-tag">${post.categoryName}</span>
                <img src="${post.img}" alt="${post.title}">
            </div>
            <div class="card-content">
                <div class="article-date">${post.date}</div>
                <h3 class="article-title">${post.title}</h3>
                <p class="article-desc">${post.desc}</p>
                <a href="${post.link}" style="color:#2d5a27; font-weight:bold; text-decoration:none; margin-top:15px; font-size:14px;">閱讀更多 →</a>
            </div>
        </div>
    `).join('') : '<div class="no-results">找不到符合的文章...</div>';

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
        btn.onclick = () => { currentPage = i; render(); window.scrollTo({top: 0, behavior: 'smooth'}); };
        container.appendChild(btn);
    }
}

init();