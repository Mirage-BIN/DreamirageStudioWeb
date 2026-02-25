// 导航指示器逻辑
function initNavIndicator() {
    const navCenter = document.querySelector('.nav-center');
    const navBtns = document.querySelectorAll('.nav-btn');
    const indicator = document.querySelector('.nav-indicator');
    
    if (!navCenter || !indicator) return;
    
    // 设置初始位置
    function setIndicator() {
        const activeBtn = document.querySelector('.nav-btn.active');
        if (!activeBtn) {
            indicator.style.opacity = '0';
            return;
        }
        
        const btnRect = activeBtn.getBoundingClientRect();
        const centerRect = navCenter.getBoundingClientRect();
        
        indicator.style.left = `${btnRect.left - centerRect.left}px`;
        indicator.style.width = `${btnRect.width}px`;
        indicator.style.opacity = '0.1';
    }
    
    // 点击按钮时移动指示器
    navBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // 移除所有active类
            navBtns.forEach(b => b.classList.remove('active'));
            // 添加active类到当前按钮
            this.classList.add('active');
            setIndicator();
        });
    });
    
    // 页面加载时设置指示器
    window.addEventListener('load', setIndicator);
    window.addEventListener('resize', setIndicator);
    
    // 根据当前页面高亮对应按钮
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navBtns.forEach(btn => {
        const page = btn.getAttribute('data-page');
        if ((currentPage === 'index.html' && page === 'home') ||
            (currentPage === 'projects.html' && page === 'projects') ||
            (currentPage === 'about.html' && page === 'about') ||
            (currentPage === 'services.html' && page === 'services')) {
            btn.classList.add('active');
        }
    });
    
    setIndicator();
}

// 初始化所有功能
document.addEventListener('DOMContentLoaded', function() {
    initNavIndicator();
    
    // 平滑滚动（用于页面内锚点）
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 控制台欢迎信息
    console.log('%c🎨 DreamirageStudio', 'color: #6d28d9; font-size: 18px; font-weight: bold;');
    console.log('%c创意与技术的交汇点', 'color: #94a3b8;');
});