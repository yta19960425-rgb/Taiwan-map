document.addEventListener('DOMContentLoaded', function() {
    // 1. 初始化參數
    const defaultColor = '#ff9999'; // 您的預設粉色
    const baseColor = '#6f9c76';    // 原始綠色
    const storageKey = 'diaryMapProgress';
    
    const mapElements = document.querySelectorAll('#features path, #features circle');
    const mainIslandIds = [
        "TWKEE", "TWTPE", "TWNWT", "TWTAO", "TWHSQ", "TWHSZ", "TWMIA", 
        "TWTXG", "TWCHA", "TWNAN", "TWYUN", "TWCYQ", "TWCYI", "TWTNN", 
        "TWKHH", "TWPIF", "TWTTT", "TWHUA", "TWILA"
    ];

    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');

    if (progressBar) {
        progressBar.style.strokeDasharray = `${circumference} ${circumference}`;
    }

    // 2. 更新進度條
    function updateProgress() {
        const savedData = JSON.parse(localStorage.getItem(storageKey)) || {};
        const filledMainIslandCount = Object.keys(savedData).filter(id => 
            mainIslandIds.includes(id) && savedData[id] !== baseColor
        ).length;

        const percentage = Math.round((filledMainIslandCount / mainIslandIds.length) * 100);
        
        if (progressText) progressText.innerText = `${percentage}%`;
        if (progressBar) {
            const offset = circumference - (percentage / 100) * circumference;
            progressBar.style.strokeDashoffset = offset;
        }
    }

    // 3. 載入存檔
    function loadProgress() {
        const savedData = JSON.parse(localStorage.getItem(storageKey)) || {};
        mapElements.forEach(el => {
            const id = el.getAttribute('id');
            if (savedData[id]) {
                el.style.fill = savedData[id];
            }
        });
        updateProgress();
    }

    // 4. 設定點擊事件 (鎖定顏色)
    mapElements.forEach(el => {
        el.addEventListener('click', function() {
            const id = this.getAttribute('id');
            const savedData = JSON.parse(localStorage.getItem(storageKey)) || {};

            // 切換邏輯：如果是預設色就變回綠色，否則變預設色
            const newColor = (this.style.fill === 'rgb(255, 153, 153)' || this.style.fill === defaultColor) 
                             ? baseColor 
                             : defaultColor;
            
            this.style.fill = newColor;
            savedData[id] = newColor;
            localStorage.setItem(storageKey, JSON.stringify(savedData));
            updateProgress();
        });
    });

    // 5. 公開重置函數
    window.clearProgress = function() {
        if (confirm('確定要清除所有足跡進度嗎？')) {
            localStorage.removeItem(storageKey);
            mapElements.forEach(el => {
                el.style.fill = baseColor;
            });
            updateProgress();
        }
    };

    loadProgress();
});