// 請將下方引號內換成您「發佈到網路」後取得的 CSV 網址
const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS3WJavixxzV2eQU6IfzMIOGniW5lUU8pbCkRiHnDobo671g3McNUkuurNCoP3yBQGTaju_iYy7uR-K/pub?output=csv'; 

const startDate = new Date("2026-04-11");
const endDate = new Date("2026-05-25");
const dateList = document.getElementById('date-list');
let diaryData = {};

// 生成左側日期清單
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

// 讀取 Google Sheets 資料
function loadData() {
    if (!csvUrl || csvUrl.includes('在此貼上')) {
        document.querySelector('.date-item').click();
        return;
    }

    Papa.parse(csvUrl, {
        download: true,
        header: true,
        complete: (results) => {
            results.data.forEach(row => {
                if (row.date) diaryData[row.date.trim()] = row;
            });
            document.querySelector('.date-item').click();
        }
    });
}

function displayContent(date) {
    const data = diaryData[date];
    document.getElementById('view-date').innerText = date.replace(/-/g, ' / ');
    const imgEl = document.getElementById('view-photo');
    const textEl = document.getElementById('view-text');

    if (data) {
        imgEl.src = data.img || "https://via.placeholder.com/800x500?text=No+Photo";
        textEl.textContent = data.text || "這天沒有文字紀錄。";
    } else {
        imgEl.src = "https://via.placeholder.com/800x500?text=Wait+for+Update";
        textEl.textContent = "尚未更新日記內容。";
    }
}

loadData();