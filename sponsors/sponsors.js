// 赞助管理器
class SponsorManager {
    constructor() {
        this.sponsors = [];
        this.init();
    }

    async init() {
        // 加载赞助数据
        await this.loadSponsors();

        // 渲染鸣谢墙气泡
        this.renderThanksBubbles();
    }

    async loadSponsors() {
        try {
            // 尝试加载赞助数据
            if (typeof SPONSORS_DATA !== 'undefined') {
                this.sponsors = SPONSORS_DATA;
            } else {
                // 动态加载赞助数据文件
                const script = document.createElement('script');
                script.src = 'sponsors/sponsors-data.js';
                script.async = true;
                document.head.appendChild(script);

                // 等待脚本加载完成
                await new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = reject;
                });

                // 获取加载的数据
                this.sponsors = typeof SPONSORS_DATA !== 'undefined' ? SPONSORS_DATA : [];
            }

            console.log(`已加载 ${this.sponsors.length} 位赞助者`);
        } catch (error) {
            console.error('加载赞助数据失败:', error);
            this.sponsors = [];
        }
    }

    renderThanksBubbles() {
        const container = document.getElementById('thanksBubbles');
        if (!container) return;

        // 清空容器
        container.innerHTML = '';

        if (this.sponsors.length === 0) {
            container.innerHTML = '<div style="text-align:center;color:var(--color-text-secondary);padding:var(--spacing-xl);">暂无赞助者</div>';
            return;
        }

        // 为每个赞助者创建气泡
        this.sponsors.forEach((sponsor, index) => {
            this.createBubble(sponsor, index);
        });
    }

    createBubble(sponsor, index) {
        const container = document.getElementById('thanksBubbles');
        if (!container) return;

        const bubble = document.createElement('div');
        bubble.className = 'thanks-bubble';

        // 根据赞助金额确定气泡颜色
        const color = this.calculateBubbleColor(sponsor.amount);
        const duration = this.calculateAnimationDuration();
        const startY = this.calculateStartY(index);

        // 设置样式
        bubble.style.background = `linear-gradient(135deg, ${color} 0%, ${this.adjustColor(color, -20)} 100%)`;
        bubble.style.animationDuration = `${duration}s`;
        bubble.style.animationDelay = `${index * 1.5}s`;
        bubble.style.top = `${startY}px`;
        bubble.style.left = `${this.calculateStartX(index)}px`;

        // 设置内容
        bubble.innerHTML = `
            <span class="thanks-bubble-name">${sponsor.name}</span>
            <span class="thanks-bubble-amount">¥${sponsor.amount}</span>
        `;

        container.appendChild(bubble);

        // 动画结束后重新创建气泡
        bubble.addEventListener('animationend', () => {
            bubble.remove();
            this.createBubble(sponsor, index);
        });
    }

    calculateStartX(index) {
        // 计算气泡的起始X位置，让它们分散在容器中
        const positions = [-250, -150, -50, 50, 150, 250, 350, 450];
        const position = index % positions.length;
        return positions[position];
    }

    calculateStartY(index) {
        // 计算气泡的起始Y位置，避免堆积
        const containerHeight = 400;
        const bubbleHeight = 50;
        const maxBubbles = Math.floor(containerHeight / (bubbleHeight + 20));
        const position = index % maxBubbles;

        return position * (bubbleHeight + 20) + 20;
    }

    calculateBubbleColor(amount) {
        // 根据金额返回不同的颜色
        if (amount >= 300) return '#ec4899'; // 粉色
        if (amount >= 150) return '#8b5cf6'; // 紫色
        if (amount >= 80) return '#3b82f6'; // 蓝色
        return '#10b981'; // 绿色
    }

    calculateAnimationDuration() {
        // 随机动画时长（20-40秒）
        return 20 + Math.random() * 20;
    }

    adjustColor(hex, percent) {
        // 调整颜色亮度
        const num = parseInt(hex.slice(1), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;

        return `#${(0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)}`;
    }
}

// 初始化赞助管理器
document.addEventListener('DOMContentLoaded', () => {
    window.sponsorManager = new SponsorManager();
});