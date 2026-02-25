// 成员管理器
class MemberManager {
    constructor() {
        this.members = [];
        this.lastLoadTime = 0;
        this.checkInterval = null;
        this.init();
    }

    init() {
        // 加载成员数据
        this.loadMembers();

        // 绑定事件
        this.bindEvents();

        // 渲染成员
        this.renderMembers();

        // 启动文件变化检测
        this.startWatching();

        // 注册数据更新回调
        window.MEMBERS_DATA_LOADED_CALLBACK = () => {
            this.reloadData();
        };
    }

    startWatching() {
        // 每1秒检测一次 members-data.js 文件是否有变化
        this.checkInterval = setInterval(() => {
            this.checkForChanges();
        }, 1000);
    }

    checkForChanges() {
        // 通过动态加载脚本的方式来检测变化
        const script = document.createElement('script');
        script.src = `members/members-data.js?t=${Date.now()}`;
        script.async = true;
        script.onload = () => {
            // 检查版本号是否变化
            if (window.MEMBERS_DATA_VERSION && window.MEMBERS_DATA_VERSION > this.lastLoadTime) {
                this.lastLoadTime = window.MEMBERS_DATA_VERSION;
                this.reloadData();
            }
        };
        script.onerror = () => {
            console.error('[MemberManager] 检测文件变化失败');
        };
        document.head.appendChild(script);

        // 清理旧的 script 标签
        setTimeout(() => {
            script.remove();
        }, 500);
    }

    reloadData() {
        console.log('[MemberManager] 检测到数据变化，正在重新加载...');
        this.loadMembers();
        this.renderMembers();
    }
    
    loadMembers() {
        try {
            // 直接使用已加载的 window.MEMBERS_DATA
            this.members = typeof window.MEMBERS_DATA !== 'undefined' ? window.MEMBERS_DATA : [];
            this.lastLoadTime = window.MEMBERS_DATA_VERSION || Date.now();
            console.log(`[MemberManager] 已加载 ${this.members.length} 位成员 (版本: ${this.lastLoadTime})`);
            console.log('[MemberManager] 成员列表:', this.members.map(m => ({ id: m.id, name: m.name })));
        } catch (error) {
            console.error('加载成员失败:', error);
            this.members = [];
        }
    }
    
    bindEvents() {
        // 模态框关闭事件
        const modalOverlay = document.getElementById('modalOverlay');
        const modalClose = document.getElementById('modalClose');
        const modal = document.getElementById('memberModal');
        
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
    
    renderMembers() {
        const grid = document.getElementById('membersGrid');
        if (!grid) return;

        console.log(`[MemberManager] 开始渲染 ${this.members.length} 位成员`);

        if (this.members.length === 0) {
            grid.innerHTML = `
                <div class="no-members">
                    <i class="fas fa-users"></i>
                    <p>暂无成员信息</p>
                    <p class="text-secondary">请稍后再试</p>
                </div>
            `;
            return;
        }

        // 生成成员卡片HTML
        const cardsHtml = this.members.map(member => {
            // 判断是否使用图片头像
            const useImageAvatar = member.avatarImage !== undefined;
            const avatarHtml = useImageAvatar
                ? `<img src="${member.avatarImage}" alt="${member.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`
                : `<span class="member-avatar-emoji">${member.avatarEmoji || '👤'}</span>`;
            const avatarStyle = useImageAvatar
                ? `background: none;`
                : `background: ${member.avatarColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};`;

            return `
            <div class="member-card" data-id="${member.id}">
                <div class="member-header">
                    <div class="member-avatar-custom" style="${avatarStyle}">
                        ${avatarHtml}
                    </div>
                    <div class="member-name-group">
                        <h3 class="member-name">${member.name}</h3>
                        <div class="member-role">
                            <i class="fas fa-briefcase"></i>
                            ${member.role}
                        </div>
                    </div>
                </div>
                <div class="member-tags">
                    ${member.tags.map(tag => `<span class="member-tag">${tag}</span>`).join('')}
                </div>
                <div class="member-divider"></div>
                <p class="member-bio">${member.bio.split('\n')[0]}</p>
                <div class="member-meta">
                    <span><i class="far fa-eye"></i> 查看详情</span>
                </div>
            </div>
            `;
        }).join('');

        grid.innerHTML = cardsHtml;
        console.log(`[MemberManager] 已渲染 ${this.members.length} 个成员卡片`);

        // 绑定卡片点击事件
        const cards = document.querySelectorAll('.member-card');
        console.log(`[MemberManager] 找到 ${cards.length} 个成员卡片元素`);
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                const id = parseInt(card.dataset.id);
                const member = this.members.find(m => m.id === id);
                if (member) {
                    this.openModal(member);
                }
            });
        });
    }
    
    openModal(member) {
        const modal = document.getElementById('memberModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalAvatar = document.getElementById('modalAvatar');
        const modalRole = document.getElementById('modalRole');
        const modalBio = document.getElementById('modalBio');
        const modalTags = document.getElementById('modalTags');
        const modalLinks = document.getElementById('modalLinks');

        if (!modal) return;

        // 更新模态框内容
        modalTitle.textContent = member.name;
        modalRole.textContent = member.role;
        modalBio.textContent = member.bio;

        // 设置头像（使用圆形自定义头像）
        if (member.avatarImage) {
            // 使用图片头像
            modalAvatar.style.background = 'none';
            modalAvatar.innerHTML = `<img src="${member.avatarImage}" alt="${member.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
        } else {
            // 使用 emoji 头像
            modalAvatar.style.background = member.avatarColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            modalAvatar.innerHTML = `<span class="member-avatar-emoji">${member.avatarEmoji || '👤'}</span>`;
        }

        // 更新标签
        modalTags.innerHTML = member.tags.map(tag =>
            `<span class="modal-tag">${tag}</span>`
        ).join('');

        // 更新链接
        modalLinks.innerHTML = member.links.map(link => `
            <a href="${link.url}" ${link.url.startsWith('mailto:') ? '' : 'target="_blank"'} class="modal-link">
                <i class="${link.icon}"></i>
                ${link.label}
            </a>
        `).join('');

        // 显示模态框
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        const modal = document.getElementById('memberModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    destroy() {
        // 清理定时器
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
        console.log('[MemberManager] 已停止文件监听');
    }
}

// 初始化成员管理器
document.addEventListener('DOMContentLoaded', () => {
    window.memberManager = new MemberManager();
});