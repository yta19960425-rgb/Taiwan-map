let cleanupData = [];
let trendChart = null;

async function initPage() {
    try {
        const response = await fetch('../json/cleanup.json');
        const data = await response.json();
        cleanupData = data;

        renderStats();
        renderTrendChart();
        
        // 渲染日誌：最新在最前
        const displayData = [...cleanupData].sort((a, b) => new Date(b.date) - new Date(a.date));
        renderThumbnails(displayData);
        
    } catch (e) { console.error("資料載入失敗", e); }
}

function renderStats() {
    let totalWeight = 0;
    cleanupData.forEach(d => { totalWeight += (parseInt(d.weight) || 0); });
    document.getElementById('weight-count').innerText = totalWeight.toLocaleString();
    document.getElementById('day-count').innerText = cleanupData.length;
}

function renderTrendChart() {
    const ctx = document.getElementById('trendChart').getContext('2d');
    if (trendChart) { trendChart.destroy(); }

    const chartData = [...cleanupData].sort((a, b) => new Date(a.date) - new Date(b.date));

    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.map(d => d.date.slice(5)),
            datasets: [{
                data: chartData.map(d => d.weight),
                borderColor: '#2d5a27',
                backgroundColor: 'rgba(45, 90, 39, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#2d5a27'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                // --- 核心修正：去掉所有隔線 ---
                x: { 
                    grid: { display: false }, // 去掉 X 軸隔線
                    ticks: { color: '#888' } 
                },
                y: { 
                    grid: { display: false }, // 去掉 Y 軸隔線
                    beginAtZero: true,
                    ticks: { color: '#888' }
                }
            }
        }
    });
}

function renderThumbnails(data) {
    const log = document.getElementById('cleanup-log');
    log.innerHTML = '';

    data.forEach((d) => {
        const item = document.createElement('div');
        item.className = 'cleanup-item-small';
        item.innerHTML = `
            <img src="${d.img || d.image}" class="thumb-circle" onerror="this.src='https://via.placeholder.com/150'">
            <span class="thumb-date">${d.date.slice(5)}</span>
        `;
        item.addEventListener('click', () => openModal(d));
        log.appendChild(item);
    });
}

function openModal(d) {
    const modal = document.getElementById('modal');
    document.getElementById('modal-img').src = d.img || d.image;
    document.getElementById('modal-location').innerText = "📍 " + d.location;
    document.getElementById('modal-date').innerText = d.date;
    document.getElementById('modal-desc').innerText = d.desc || d.description || "守護環境的一天。";

    const tagContainer = document.getElementById('modal-tags');
    tagContainer.innerHTML = '';
    const items = Array.isArray(d.items) ? d.items : (d.items ? d.items.split(/[,，、]/) : []);
    items.forEach(text => {
        const span = document.createElement('span');
        span.className = 'detail-tag';
        span.innerText = text.trim();
        tagContainer.appendChild(span);
    });

    modal.style.display = "block";
}

document.querySelector('.close-btn').onclick = () => document.getElementById('modal').style.display = "none";
window.onclick = (e) => { if (e.target == document.getElementById('modal')) document.getElementById('modal').style.display = "none"; }

initPage();