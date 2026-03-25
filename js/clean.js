let cleanupData = [];

async function initPage() {
    try {
        const response = await fetch('../json/cleanup.json?t=' + new Date().getTime());
        if (!response.ok) throw new Error("找不到 cleanup.json 檔案");
        
        cleanupData = await response.json();
        
        renderStats();
        renderCharts();
        renderCards();
    } catch (error) {
        console.error("無法讀取 JSON 資料:", error);
        const log = document.getElementById('cleanup-log');
        if (log) log.innerHTML = `<p style="text-align:center; color:red;">載入失敗：${error.message}</p>`;
    }
}

function renderStats() {
    let totalItems = 0;
    let totalWeight = 0;
    cleanupData.forEach(entry => {
        // 安全抓取數字，若無數字則計為 1
        const numbers = (entry.items || "").match(/\d+/g);
        if (numbers) {
            numbers.forEach(n => totalItems += parseInt(n));
        } else if (entry.items) {
            totalItems += 1; 
        }
        totalWeight += (parseInt(entry.weight) || 0);
    });
    
    document.getElementById('total-count').innerText = totalItems.toLocaleString();
    document.getElementById('weight-count').innerText = totalWeight.toLocaleString();
    document.getElementById('day-count').innerText = cleanupData.length;
}

function renderCharts() {
    if (!cleanupData || cleanupData.length === 0) return;

    // --- 1. 圓餅圖 ---
    const typeTotals = { "菸蒂": 0, "塑膠": 0, "紙類": 0, "金屬": 0, "其他": 0 };
    cleanupData.forEach(d => {
        if (!d.items) return;
        const parts = d.items.split(/[,，、]/);
        parts.forEach(part => {
            let matched = false;
            for (let type in typeTotals) {
                if (part.includes(type)) {
                    const numMatch = part.match(/\d+/);
                    typeTotals[type] += numMatch ? parseInt(numMatch[0]) : 1;
                    matched = true;
                    break;
                }
            }
            if (!matched && part.trim() !== "") {
                const otherNum = part.match(/\d+/);
                typeTotals["其他"] += otherNum ? parseInt(otherNum[0]) : 1;
            }
        });
    });

    const typeCanvas = document.getElementById('typeChart');
    if (typeCanvas) {
        const typeCtx = typeCanvas.getContext('2d');
        if (window.myPieChart) window.myPieChart.destroy();
        window.myPieChart = new Chart(typeCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(typeTotals),
                datasets: [{
                    data: Object.values(typeTotals),
                    backgroundColor: ['#ffcc80', '#81c784', '#9575cd', '#4fc3f7', '#d1d1d1'],
                    borderWidth: 2
                }]
            },
            options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
        });
    }

    // --- 2. 折線圖 ---
    const weightMap = {};
    cleanupData.forEach(d => {
        const dateKey = d.date.split('-').slice(1).join('/');
        weightMap[dateKey] = (weightMap[dateKey] || 0) + (parseInt(d.weight) || 0);
    });

    const sortedDates = Object.keys(weightMap).sort();
    const sortedWeights = sortedDates.map(date => weightMap[date]);

    // 注意：這裡 ID 要跟 HTML 的 <canvas id="..."> 一致
    const trendCanvas = document.getElementById('trendChart') || document.getElementById('viewChart');
    if (trendCanvas) {
        const trendCtx = trendCanvas.getContext('2d');
        if (window.myLineChart) window.myLineChart.destroy();
        window.myLineChart = new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: sortedDates,
                datasets: [{
                    label: '每日總重量 (g)',
                    data: sortedWeights,
                    borderColor: '#6f9c76',
                    backgroundColor: 'rgba(111, 156, 118, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            }
        });
    }
}

function renderCards() {
    const logContainer = document.getElementById('cleanup-log');
    if (!logContainer) return;
    logContainer.innerHTML = '';
    
    [...cleanupData].reverse().forEach(entry => {
        const card = document.createElement('div');
        card.className = 'cleanup-card';
        const tagsHtml = (entry.items || "").split(/[,，、]/)
            .filter(t => t.trim() !== "")
            .map(t => `<span class="tag">${t.trim()}</span>`).join('');
            
        card.innerHTML = `
            <img src="${entry.img}" class="card-img" alt="照片" onerror="this.src='https://via.placeholder.com/400x300?text=No+Photo'">
            <div class="card-content">
                <div class="card-date">${entry.date}</div>
                <div class="card-location">📍 ${entry.location}</div>
                <div class="card-items">${tagsHtml}</div> <div class="card-weight">⚖️ ${entry.weight}g</div>
            </div>`;
        logContainer.appendChild(card);
    });
}

window.onload = initPage;