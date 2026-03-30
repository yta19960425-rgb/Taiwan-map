// 取得彈窗元素
const modal = document.getElementById('challenge-modal');
const modalTitle = document.getElementById('modal-title');
const modalText = document.getElementById('modal-text');
const closeBtn = document.querySelector('.close-btn');

// 為每個挑戰卡片綁定點擊事件
document.querySelectorAll('.challenge-card').forEach(card => {
    card.addEventListener('click', () => {
        // 從 data 屬性讀取內容
        const title = card.getAttribute('data-title');
        const content = card.getAttribute('data-content');
        
        // 設定彈窗內容並顯示
        modalTitle.innerText = title;
        modalText.innerText = content;
        modal.style.display = 'block';
    });
});

// 點擊關閉按鈕
closeBtn.onclick = () => {
    modal.style.display = 'none';
};

// 點擊彈窗外部區域也可關閉
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};