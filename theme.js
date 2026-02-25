// 主题管理器
class ThemeManager {
    constructor() {
        this.themes = {
            dark: {
                name: '暗夜',
                colors: {
                    primary: '#22d3ee',
                    secondary: '#10b981',
                    accent: '#f59e0b',
                    background: '#0a0f1a',
                    surface: '#111827',
                    text: '#e5e7eb',
                    textSecondary: '#9ca3af',
                    border: '#1f2937',
                    shadow: 'rgba(0, 0, 0, 0.6)',
                    overlay: 'rgba(10, 15, 26, 0.85)',
                    bg1: '#0e7490',
                    bg2: '#155e75',
                    bg3: '#164e63'
                }
            },
            light: {
                name: '明亮',
                colors: {
                    primary: '#3b82f6',
                    secondary: '#10b981',
                    accent: '#f59e0b',
                    background: '#f8fafc',
                    surface: '#ffffff',
                    text: '#1e293b',
                    textSecondary: '#64748b',
                    border: '#e2e8f0',
                    shadow: 'rgba(0, 0, 0, 0.1)',
                    overlay: 'rgba(248, 250, 252, 0.8)',
                    bg1: '#60a5fa',
                    bg2: '#38bdf8',
                    bg3: '#a5f3fc'
                }
            },
            macaron: {
                name: '马卡龙',
                colors: {
                    primary: '#f472b6',
                    secondary: '#a78bfa',
                    accent: '#fbbf24',
                    background: '#fef3c7',
                    surface: '#fdf4ff',
                    text: '#7c2d12',
                    textSecondary: '#92400e',
                    border: '#fbcfe8',
                    shadow: 'rgba(244, 114, 182, 0.3)',
                    overlay: 'rgba(254, 243, 199, 0.8)',
                    bg1: '#f472b6',
                    bg2: '#a78bfa',
                    bg3: '#fbbf24'
                }
            },
            morandi: {
                name: '莫兰迪',
                colors: {
                    primary: '#a8a29e',
                    secondary: '#94a3b8',
                    accent: '#d6d3d1',
                    background: '#f5f5f4',
                    surface: '#e7e5e4',
                    text: '#57534e',
                    textSecondary: '#78716c',
                    border: '#d6d3d1',
                    shadow: 'rgba(168, 162, 158, 0.3)',
                    overlay: 'rgba(245, 245, 244, 0.8)',
                    bg1: '#a8a29e',
                    bg2: '#94a3b8',
                    bg3: '#d6d3d1'
                }
            }
        };
        
        this.customTheme = null;
        this.init();
    }
    
    init() {
        // 加载保存的主题
        const savedTheme = localStorage.getItem('dreamirage-theme');
        if (savedTheme) {
            if (savedTheme.startsWith('custom:')) {
                try {
                    this.customTheme = JSON.parse(savedTheme.slice(7));
                    this.applyCustomTheme();
                } catch (e) {
                    this.setTheme('dark');
                }
            } else {
                this.setTheme(savedTheme, false);
            }
        } else {
            // 默认暗夜主题
            this.setTheme('dark', false);
        }
        
        this.bindEvents();
    }
    
    bindEvents() {
        // 主题切换按钮
        const themeToggle = document.getElementById('themeToggle');
        const themeDropdown = document.getElementById('themeDropdown');
        
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                themeDropdown.classList.toggle('show');
            });
        }
        
        // 主题选项
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const theme = e.target.dataset.theme;
                if (theme === 'custom') {
                    this.openCustomColorPicker();
                } else {
                    this.setTheme(theme);
                }
                themeDropdown.classList.remove('show');
            });
        });
        
        // 点击外部关闭下拉菜单
        document.addEventListener('click', () => {
            if (themeDropdown) {
                themeDropdown.classList.remove('show');
            }
        });
    }
    
    setTheme(themeName, save = true) {
        if (!this.themes[themeName]) return;
        
        const theme = this.themes[themeName];
        
        // 设置data-theme属性
        document.documentElement.setAttribute('data-theme', themeName);
        
        // 更新CSS变量
        this.updateCSSVariables(theme.colors);
        
        // 保存到localStorage
        if (save) {
            localStorage.setItem('dreamirage-theme', themeName);
        }
        
        // 触发主题更改事件
        this.dispatchThemeChange(themeName);
    }
    
    applyCustomTheme() {
        if (!this.customTheme) return;
        
        document.documentElement.setAttribute('data-theme', 'custom');
        this.updateCSSVariables(this.customTheme);
        localStorage.setItem('dreamirage-theme', `custom:${JSON.stringify(this.customTheme)}`);
        this.dispatchThemeChange('custom');
    }
    
    updateCSSVariables(colors) {
        const root = document.documentElement;
        
        Object.entries(colors).forEach(([key, value]) => {
            if (key.startsWith('bg')) {
                root.style.setProperty(`--bg-color-${key.slice(2)}`, value);
            } else {
                root.style.setProperty(`--color-${key}`, value);
            }
        });
    }
    
    openCustomColorPicker() {
        // 色轮选择器
        this.showColorWheelModal();
    }

    showColorWheelModal() {
        // 移除旧的模态框（如果存在）
        const oldModal = document.getElementById('colorWheelModal');
        if (oldModal) oldModal.remove();

        // 创建模态框
        const modal = document.createElement('div');
        modal.id = 'colorWheelModal';
        modal.innerHTML = `
            <div class="color-wheel-overlay">
                <div class="color-wheel-container">
                    <div class="color-wheel-header">
                        <h3>选择主题颜色</h3>
                        <button class="color-wheel-close">&times;</button>
                    </div>
                    <div class="color-wheel-body">
                        <div class="color-wheel-canvas-container">
                            <canvas id="colorWheelCanvas" width="280" height="280"></canvas>
                            <div class="color-wheel-indicator"></div>
                        </div>
                        <div class="color-wheel-info">
                            <div class="selected-color-preview">
                                <div class="selected-color-box"></div>
                                <div class="selected-color-values">
                                    <div class="color-value-hsl"><label>HSL:</label><span></span></div>
                                    <div class="color-value-hex"><label>HEX:</label><span></span></div>
                                </div>
                            </div>
                            <div class="color-wheel-buttons">
                                <button class="color-wheel-btn color-wheel-cancel">取消</button>
                                <button class="color-wheel-btn color-wheel-confirm">应用主题</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // 添加样式
        this.addColorWheelStyles();

        // 初始化色轮
        setTimeout(() => this.initColorWheel(), 10);
    }

    addColorWheelStyles() {
        if (document.getElementById('colorWheelStyles')) return;

        const style = document.createElement('style');
        style.id = 'colorWheelStyles';
        style.textContent = `
            .color-wheel-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(10px);
                z-index: 3000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: colorWheelFadeIn 0.3s ease;
            }

            @keyframes colorWheelFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            .color-wheel-container {
                background: var(--color-surface);
                border-radius: var(--radius-lg);
                padding: var(--spacing-xl);
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                max-width: 450px;
                width: 90%;
            }

            .color-wheel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--spacing-lg);
                padding-bottom: var(--spacing-md);
                border-bottom: 1px solid var(--color-border);
            }

            .color-wheel-header h3 {
                margin: 0;
                font-size: 1.25rem;
                color: var(--color-text);
            }

            .color-wheel-close {
                width: 32px;
                height: 32px;
                border: none;
                background: var(--color-background);
                color: var(--color-text);
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.25rem;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }

            .color-wheel-close:hover {
                background: var(--color-primary);
                color: white;
            }

            .color-wheel-body {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: var(--spacing-lg);
            }

            .color-wheel-canvas-container {
                position: relative;
                width: 280px;
                height: 280px;
                border-radius: 50%;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            }

            #colorWheelCanvas {
                width: 100%;
                height: 100%;
                cursor: crosshair;
            }

            .color-wheel-indicator {
                position: absolute;
                width: 20px;
                height: 20px;
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                pointer-events: none;
                transform: translate(-50%, -50%);
            }

            .color-wheel-info {
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: var(--spacing-md);
            }

            .selected-color-preview {
                display: flex;
                align-items: center;
                gap: var(--spacing-md);
                padding: var(--spacing-md);
                background: var(--color-background);
                border-radius: var(--radius-md);
            }

            .selected-color-box {
                width: 50px;
                height: 50px;
                border-radius: var(--radius-md);
                border: 2px solid var(--color-border);
            }

            .selected-color-values {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: var(--spacing-xs);
            }

            .selected-color-values label {
                color: var(--color-text-secondary);
                font-size: 0.75rem;
                margin-right: var(--spacing-sm);
            }

            .selected-color-values span {
                color: var(--color-text);
                font-family: monospace;
                font-size: 0.875rem;
            }

            .color-wheel-buttons {
                display: flex;
                gap: var(--spacing-md);
            }

            .color-wheel-btn {
                flex: 1;
                padding: var(--spacing-md);
                border: none;
                border-radius: var(--radius-md);
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .color-wheel-cancel {
                background: var(--color-background);
                color: var(--color-text);
            }

            .color-wheel-cancel:hover {
                background: var(--color-border);
            }

            .color-wheel-confirm {
                background: var(--color-primary);
                color: white;
            }

            .color-wheel-confirm:hover {
                background: var(--color-secondary);
                transform: translateY(-2px);
            }
        `;
        document.head.appendChild(style);
    }

    initColorWheel() {
        const canvas = document.getElementById('colorWheelCanvas');
        const ctx = canvas.getContext('2d');
        const indicator = document.querySelector('.color-wheel-indicator');
        const selectedColorBox = document.querySelector('.selected-color-box');
        const hslValue = document.querySelector('.color-value-hsl span');
        const hexValue = document.querySelector('.color-value-hex span');

        if (!canvas || !ctx) return;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = canvas.width / 2 - 10;

        let selectedHue = 270;
        let selectedSaturation = 80;
        let selectedLightness = 50;

        // 绘制色轮
        function drawColorWheel() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let angle = 0; angle < 360; angle++) {
                const startAngle = (angle - 90) * Math.PI / 180;
                const endAngle = (angle - 89) * Math.PI / 180;

                for (let r = 0; r < radius; r++) {
                    const saturation = r / radius;
                    const hue = angle;
                    const lightness = 50;

                    ctx.beginPath();
                    ctx.arc(centerX, centerY, r, startAngle, endAngle);
                    ctx.strokeStyle = `hsl(${hue}, ${saturation * 100}%, ${lightness}%)`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            // 更新指示器位置
            updateIndicatorPosition();
        }

        function updateIndicatorPosition() {
            const angle = (selectedHue - 90) * Math.PI / 180;
            const r = (selectedSaturation / 100) * radius;
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);

            indicator.style.left = x + 'px';
            indicator.style.top = y + 'px';
            indicator.style.backgroundColor = `hsl(${selectedHue}, ${selectedSaturation}%, ${selectedLightness}%)`;

            // 更新颜色显示
            const hex = hslToHex(selectedHue, selectedSaturation, selectedLightness);
            selectedColorBox.style.backgroundColor = hex;
            hslValue.textContent = `hsl(${selectedHue}, ${selectedSaturation}%, ${selectedLightness}%)`;
            hexValue.textContent = hex.toUpperCase();
        }

        function hslToHex(h, s, l) {
            s /= 100;
            l /= 100;
            const a = s * Math.min(l, 1 - l);
            const f = n => {
                const k = (n + h / 30) % 12;
                const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
                return Math.round(255 * color).toString(16).padStart(2, '0');
            };
            return `#${f(0)}${f(8)}${f(4)}`;
        }

        function hexToHsl(hex) {
            let r = parseInt(hex.slice(1, 3), 16) / 255;
            let g = parseInt(hex.slice(3, 5), 16) / 255;
            let b = parseInt(hex.slice(5, 7), 16) / 255;

            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;

            if (max === min) {
                h = s = 0;
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
                    case g: h = ((b - r) / d + 2) * 60; break;
                    case b: h = ((r - g) / d + 4) * 60; break;
                }
            }

            return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
        }

        function getColorFromPosition(x, y) {
            const dx = x - centerX;
            const dy = y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > radius) {
                const ratio = radius / distance;
                const clampedX = centerX + dx * ratio;
                const clampedY = centerY + dy * ratio;
                const clampedDx = clampedX - centerX;
                const clampedDy = clampedY - centerY;

                const angle = Math.atan2(clampedDy, clampedDx) * 180 / Math.PI + 90;
                const saturation = (Math.sqrt(clampedDx * clampedDx + clampedDy * clampedDy) / radius) * 100;

                return {
                    hue: Math.round((angle + 360) % 360),
                    saturation: Math.min(100, Math.max(0, saturation))
                };
            }

            const angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
            const saturation = (distance / radius) * 100;

            return {
                hue: Math.round((angle + 360) % 360),
                saturation: Math.min(100, Math.max(0, saturation))
            };
        }

        let isDragging = false;

        canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            handleColorSelect(e);
        });

        canvas.addEventListener('mousemove', (e) => {
            if (isDragging) {
                handleColorSelect(e);
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        function handleColorSelect(e) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;

            const color = getColorFromPosition(x, y);
            selectedHue = color.hue;
            selectedSaturation = color.saturation;

            updateIndicatorPosition();
        }

        // 按钮事件
        document.querySelector('.color-wheel-close').addEventListener('click', closeColorWheel);
        document.querySelector('.color-wheel-cancel').addEventListener('click', closeColorWheel);
        document.querySelector('.color-wheel-confirm').addEventListener('click', () => {
            applyCustomThemeFromWheel();
            closeColorWheel();
        });

        document.querySelector('.color-wheel-overlay').addEventListener('click', (e) => {
            if (e.target.classList.contains('color-wheel-overlay')) {
                closeColorWheel();
            }
        });

        function closeColorWheel() {
            const modal = document.getElementById('colorWheelModal');
            if (modal) {
                modal.style.opacity = '0';
                setTimeout(() => modal.remove(), 300);
            }
        }

        function applyCustomThemeFromWheel() {
            const primaryColor = hslToHex(selectedHue, selectedSaturation, selectedLightness);
            window.themeManager.customTheme = {
                primary: primaryColor,
                secondary: window.themeManager.adjustColor(primaryColor, 40),
                accent: window.themeManager.adjustColor(primaryColor, -30),
                background: window.themeManager.adjustColor(primaryColor, -80),
                surface: window.themeManager.adjustColor(primaryColor, -70),
                text: window.themeManager.getContrastColor(window.themeManager.adjustColor(primaryColor, -80)),
                textSecondary: window.themeManager.adjustColor(primaryColor, -50),
                border: window.themeManager.adjustColor(primaryColor, -60),
                shadow: `${primaryColor}30`,
                overlay: `${window.themeManager.adjustColor(primaryColor, -80)}cc`,
                bg1: primaryColor,
                bg2: window.themeManager.adjustColor(primaryColor, 20),
                bg3: window.themeManager.adjustColor(primaryColor, 40)
            };
            window.themeManager.applyCustomTheme();
        }

        // 初始绘制
        drawColorWheel();
    }

    getContrastColor(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? '#1e293b' : '#f1f5f9';
    }
    
    adjustColor(hex, percent) {
        // 简化的颜色调整函数
        const num = parseInt(hex.slice(1), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        
        return `#${(0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)}`;
    }
    
    dispatchThemeChange(themeName) {
        const event = new CustomEvent('themechange', {
            detail: { theme: themeName }
        });
        document.dispatchEvent(event);
        console.log(`主题已切换为: ${this.themes[themeName]?.name || '自定义'}`);
    }
}

// 初始化主题管理器
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});