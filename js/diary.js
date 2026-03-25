const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS3WJavixxzV2eQU6IfzMIOGniW5lUU8pbCkRiHnDobo671g3McNUkuurNCoP3yBQGTaju_iYy7uR-K/pub?output=csv'; 

// 設定你的本地照片路徑
const defaultBgImg = "../pic/island.png"; 

const startDate = new Date("2026-04-11");
const endDate = new Date("2026-05-25");
const dateList = document.getElementById('date-list');
let diaryData = {};

// 生成日期清單
for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const li = document.createElement('li');
    li.className = 'date-item';
    li.textContent = dateStr.split('-').slice(1).join(' / ');
    li.dataset.date = dateStr;
    li.onclick = function() {
        document.querySelectorAll('.date-item').forEach(el => el.classList.remove('active'));
        this.classList.add('active');
        displayContent(this.dataset.date);
    };
    dateList.appendChild(li);
}

function loadData() {
    // 檢查 Papa 是否存在
    if (typeof Papa === 'undefined') {
        console.error("找不到 PapaParse，請檢查 HTML 是否已引入腳本。");
        return;
    }

    Papa.parse(csvUrl, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            results.data.forEach(row => {
                if (row.date) diaryData[row.date.trim()] = row;
            });
            // 預設點擊第一個日期
            const firstItem = document.querySelector('.date-item');
            if (firstItem) firstItem.click();
        }
    });
}

function displayContent(date) {
    const data = diaryData[date];
    document.getElementById('view-date').innerText = date.replace(/-/g, ' / ');
    const imgWrapper = document.querySelector('.diary-image-wrapper');
    const imgEl = document.getElementById('view-photo');
    const textEl = document.getElementById('view-text');

    if (data && data.img && data.img.trim().startsWith('http')) {
        imgEl.style.display = "block";
        imgEl.src = data.img;
        imgWrapper.style.backgroundImage = "none";
        textEl.textContent = data.text || "這天沒有文字紀錄。";
    } else {
        // 沒內容時顯示本地背景圖
        imgEl.style.display = "none";
        imgWrapper.style.backgroundImage = `url('${defaultBgImg}')`;
        textEl.textContent = data ? data.text : "尚未更新日記內容。";
    }
}

loadData();