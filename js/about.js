// 可以加入一些簡單的進場動畫或點擊顯示詳細內容
document.querySelectorAll('.challenge-item').forEach(item => {
    item.addEventListener('click', () => {
        const challengeName = item.querySelector('p').innerText;
        console.log(`即將展開任務：${challengeName}`);
        // 這裡可以連動到你之前的日記頁面或是地圖標記
    });
});