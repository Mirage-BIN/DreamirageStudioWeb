// 项目管理器
class ProjectManager {
    constructor() {
        this.projects = [];
        this.currentFilter = 'all';
        this.init();
    }
    
    async init() {
        // 加载项目数据
        await this.loadProjects();
        
        // 绑定事件
        this.bindEvents();
        
        // 渲染项目
        this.renderProjects();
    }
    
    async loadProjects() {
        try {
            // 尝试从 /projects 文件夹加载项目数据
            // 先尝试动态加载 projects-data.js
            if (typeof PROJECTS_DATA !== 'undefined') {
                this.projects = PROJECTS_DATA;
            } else {
                // 动态加载项目数据文件
                const script = document.createElement('script');
                script.src = 'projects/projects-data.js';
                script.async = true;
                document.head.appendChild(script);

                // 等待脚本加载完成
                await new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = reject;
                });

                // 获取加载的数据
                this.projects = typeof PROJECTS_DATA !== 'undefined' ? PROJECTS_DATA : [];
            }

            console.log(`已加载 ${this.projects.length} 个项目`);
        } catch (error) {
            console.error('加载项目失败:', error);
            this.projects = [];
        }
    }
    
    bindEvents() {
        // 筛选标签点击事件
        document.querySelectorAll('.filter-tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                const filter = e.target.dataset.tag;
                this.setFilter(filter);
            });
        });
        
        // 模态框关闭事件
        const modalOverlay = document.getElementById('modalOverlay');
        const modalClose = document.getElementById('modalClose');
        const modal = document.getElementById('projectModal');
        
        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => {
                this.closeModal();
            });
        }
        
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }
        
        // ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }
    
    setFilter(filter) {
        // 更新活动标签
        document.querySelectorAll('.filter-tag').forEach(tag => {
            tag.classList.remove('active');
            if (tag.dataset.tag === filter) {
                tag.classList.add('active');
            }
        });
        
        this.currentFilter = filter;
        this.renderProjects();
    }
    
    renderProjects() {
        const grid = document.getElementById('projectsGrid');
        if (!grid) return;

        // 筛选项目
        const filteredProjects = this.currentFilter === 'all'
            ? this.projects
            : this.projects.filter(project => project.tags.includes(this.currentFilter));

        if (filteredProjects.length === 0) {
            grid.innerHTML = `
                <div class="no-projects">
                    <i class="fas fa-inbox"></i>
                    <p>暂无相关项目</p>
                    <p class="text-secondary">尝试选择其他标签</p>
                </div>
            `;
            return;
        }

        // 生成项目卡片HTML
        grid.innerHTML = filteredProjects.map(project => `
            <div class="project-card" data-id="${project.id}">
                <div class="project-image" style="background-image: url('${project.image}'); background-size: cover; background-position: center;">
                    ${!project.image ? '<i class="fas fa-image"></i>' : ''}
                    <div class="project-status-badge ${project.status}">
                        ${this.getStatusText(project.status)}
                    </div>
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="project-tag">${this.getTagName(tag)}</span>`).join('')}
                    </div>
                    <p class="project-description">${project.description}</p>
                    <div class="project-info">
                        <div class="project-info-item">
                            <i class="fas fa-code-branch"></i>
                            <span>版本: ${project.version || 'N/A'}</span>
                        </div>
                        <div class="project-info-item">
                            <i class="fas fa-calendar-plus"></i>
                            <span>开始: ${project.startDate || 'N/A'}</span>
                        </div>
                        <div class="project-info-item">
                            <i class="fas fa-calendar-check"></i>
                            <span>更新: ${project.lastUpdate || 'N/A'}</span>
                        </div>
                    </div>
                    <div class="project-meta">
                        <span><i class="far fa-eye"></i> 查看详情</span>
                    </div>
                </div>
            </div>
        `).join('');

        // 绑定卡片点击事件
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const id = parseInt(card.dataset.id);
                const project = this.projects.find(p => p.id === id);
                if (project) {
                    this.openModal(project);
                }
            });
        });
    }

    getStatusText(status) {
        const statusMap = {
            'updating': '正在更新',
            'paused': '暂停更新',
            'stopped': '停止更新'
        };
        return statusMap[status] || status;
    }
    
    getTagName(tag) {
        const tagNames = {
            'web': '网页开发',
            'design': 'Logo/IP设计',
            'game': '游戏Mod',
            'app': '应用开发',
            'other': '其他'
        };
        return tagNames[tag] || tag;
    }
    
    openModal(project) {
        const modal = document.getElementById('projectModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalImage = document.getElementById('modalImage');
        const modalDescription = document.getElementById('modalDescription');
        const modalTags = document.getElementById('modalTags');
        const modalLinks = document.getElementById('modalLinks');
        const modalStatus = document.getElementById('modalStatus');
        const modalVersion = document.getElementById('modalVersion');
        const modalStartDate = document.getElementById('modalStartDate');
        const modalLastUpdate = document.getElementById('modalLastUpdate');

        if (!modal) return;

        // 更新模态框内容
        modalTitle.textContent = project.title;
        modalDescription.textContent = project.description;

        // 设置图片
        if (project.image) {
            modalImage.style.backgroundImage = `url('${project.image}')`;
            modalImage.innerHTML = '';
        } else {
            modalImage.style.backgroundImage = '';
            modalImage.innerHTML = '<i class="fas fa-image"></i>';
        }

        // 更新标签
        modalTags.innerHTML = project.tags.map(tag =>
            `<span class="modal-tag">${this.getTagName(tag)}</span>`
        ).join('');

        // 更新状态和日期信息
        if (modalStatus) {
            modalStatus.innerHTML = `<span class="modal-status-badge ${project.status}">${this.getStatusText(project.status)}</span>`;
        }
        if (modalVersion) {
            modalVersion.innerHTML = `<i class="fas fa-code-branch"></i> ${project.version || 'N/A'}`;
        }
        if (modalStartDate) {
            modalStartDate.innerHTML = `<i class="fas fa-calendar-plus"></i> ${project.startDate || 'N/A'}`;
        }
        if (modalLastUpdate) {
            modalLastUpdate.innerHTML = `<i class="fas fa-calendar-check"></i> ${project.lastUpdate || 'N/A'}`;
        }

        // 更新链接
        modalLinks.innerHTML = project.links.map(link => `
            <a href="${link.url}" target="_blank" class="modal-link">
                <i class="${link.icon}"></i>
                ${link.label}
            </a>
        `).join('');

        // 显示模态框
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        const modal = document.getElementById('projectModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// 初始化项目管理器
document.addEventListener('DOMContentLoaded', () => {
    window.projectManager = new ProjectManager();
});