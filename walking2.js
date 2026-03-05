// --- 設定區域 ---
const csvUrl = 'YOUR_GOOGLE_SHEETS_CSV_URL_HERE'; // <--- 請在此貼上網址
const startDate = new Date("2026-04-11");
const endDate = new Date("2026-05-25");

let diaryData = {};

// 1. 初始化日期清單
const dateList = document.getElementById('date-list');

for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const li = document.createElement('li');
    li.classList.add('date-item');
    
    // 顯示格式：04 / 11
    const displayDate = dateStr.split('-').slice(1).join(' / ');
    li.textContent = displayDate;
    li.dataset.date = dateStr;

    li.onclick = function() {
        document.querySelectorAll('.date-item').forEach(el => el.classList.remove('active'));
        this.classList.add('active');
        displayContent(this.dataset.date);
    };
    dateList.appendChild(li);
}

// 2. 載入雲端資料邏輯
function loadCloudData() {
    // 如果您還沒準備好 Google Sheets，這段會先抓不到資料
    if (csvUrl.startsWith('YOUR')) {
        console.log("請設定 Google Sheets CSV 網址以同步資料。");
        // 預設點擊第一天以顯示空狀態
        document.querySelector('.date-item').click();
        return;
    }

    Papa.parse(csvUrl, {
        download: true,
        header: true,
        complete: (results) => {
            results.data.forEach(row => {
                if(row.date) {
                    diaryData[row.date.trim()] = {
                        img: row.img ? row.img.trim() : "",
                        text: row.text ? row.text.trim() : ""
                    };
                }
            });
            // 資料載入後，預設顯示第一天
            document.querySelector('.date-item').click();
        },
        error: (err) => {
            console.error("無法讀取 CSV 資料:", err);
            document.querySelector('.date-item').click();
        }
    });
}

// 3. 顯示內容到頁面
function displayContent(date) {
    const content = diaryData[date];
    const viewDate = document.getElementById('view-date');
    const viewPhoto = document.getElementById('view-photo');
    const viewText = document.getElementById('view-text');

    viewDate.innerText = date.replace(/-/g, ' / ');

    if (content && (content.text || content.img)) {
        viewPhoto.src = content.img || "https://via.placeholder.com/800x500?text=No+Photo";
        viewText.textContent = content.text || "這天留下了足跡，但沒留下文字。";
        viewPhoto.style.display = content.img ? "block" : "none";
    } else {
        // 無資料時的顯示
        viewPhoto.src = "https://via.placeholder.com/800x500?text=Wait+for+Update";
        viewPhoto.style.display = "block";
        viewText.textContent = "徒步正在進行中，日記稍後送達！";
    }
}

// 啟動程式
loadCloudData();