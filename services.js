// 服务管理器
class ServiceManager {
    constructor() {
        this.services = [];
        this.selectedTiers = {};
        this.init();
    }
    
    async init() {
        // 加载服务数据
        await this.loadServices();
        
        // 绑定事件
        this.bindEvents();
        
        // 渲染服务
        this.renderServices();
    }
    
    async loadServices() {
        try {
            // 服务数据
            this.services = [
                {
                    id: 1,
                    name: '设计',
                    description: '提供专业的设计服务，包括品牌设计、UI设计、平面设计等',
                    icon: 'fas fa-paint-brush',
                    features: [
                        '品牌视觉设计',
                        'UI/UX界面设计',
                        '平面设计（海报、宣传册等）',
                        '品牌VI设计',
                        '图标设计',
                        '插画创作'
                    ]
                },
                {
                    id: 2,
                    name: 'PPT制作',
                    description: '专业的PPT设计与制作服务，让您的演示更加出色',
                    icon: 'fas fa-file-powerpoint',
                    features: [
                        '商务PPT设计',
                        '教学课件制作',
                        '产品演示PPT',
                        '数据可视化图表',
                        '动画效果设计',
                        '模板定制'
                    ]
                },
                {
                    id: 3,
                    name: '视频剪辑',
                    description: '专业的视频剪辑与后期制作服务',
                    icon: 'fas fa-video',
                    features: [
                        '视频剪辑与合成',
                        '特效制作',
                        '字幕添加',
                        '背景音乐处理',
                        '颜色校正与调色',
                        '格式转换与导出'
                    ]
                },
                {
                    id: 4,
                    name: '前端设计',
                    description: '现代化的网页前端设计与开发服务',
                    icon: 'fas fa-laptop-code',
                    features: [
                        '响应式网页设计',
                        'HTML/CSS/JavaScript开发',
                        'React/Vue等框架开发',
                        '交互动画效果',
                        '性能优化',
                        'SEO优化'
                    ]
                },
                {
                    id: 5,
                    name: '小程序开发',
                    description: '微信小程序及其他小程序开发服务',
                    icon: 'fas fa-mobile-alt',
                    features: [
                        '微信小程序开发',
                        '支付宝小程序开发',
                        '百度小程序开发',
                        '小程序UI设计',
                        '后端接口对接',
                        '小程序发布与维护'
                    ]
                },
                {
                    id: 6,
                    name: '技术咨询',
                    description: '专业的技术咨询与解决方案服务',
                    icon: 'fas fa-lightbulb',
                    features: [
                        '技术方案咨询',
                        '架构设计建议',
                        '代码审查与优化',
                        '技术选型指导',
                        '团队技术培训',
                        '项目技术支持'
                    ]
                }
            ];

            console.log(`已加载 ${this.services.length} 项服务`);
        } catch (error) {
            console.error('加载服务失败:', error);
            this.services = [];
        }
    }
    
    bindEvents() {
        // 暂无需要绑定的事件
    }
    
    renderServices() {
        const grid = document.getElementById('servicesGrid');
        if (!grid) return;

        if (this.services.length === 0) {
            grid.innerHTML = `
                <div class="no-services" style="grid-column: 1 / -1; text-align: center; padding: var(--spacing-xxl); color: var(--color-text-secondary);">
                    <i class="fas fa-concierge-bell"></i>
                    <p>暂无服务信息</p>
                    <p class="text-secondary">请稍后再试</p>
                </div>
            `;
            return;
        }

        // 生成服务卡片HTML
        grid.innerHTML = this.services.map(service => {
            return `
                <div class="service-card" data-id="${service.id}">
                    <div class="service-header">
                        <div class="service-icon">
                            <i class="${service.icon}"></i>
                        </div>
                        <h3 class="service-name">${service.name}</h3>
                        <p class="service-description">${service.description}</p>
                    </div>

                    <div class="service-content">
                        <ul class="service-features">
                            ${service.features.map(feature => `
                                <li class="service-feature">
                                    <i class="fas fa-check-circle"></i>
                                    <span>${feature}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// 初始化服务管理器
document.addEventListener('DOMContentLoaded', () => {
    window.serviceManager = new ServiceManager();
});