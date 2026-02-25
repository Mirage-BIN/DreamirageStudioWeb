// 项目数据
// 修改此文件来更新作品集中的项目信息
// 项目状态可选值: 'updating'（正在更新）, 'paused'（暂停更新）, 'stopped'（停止更新）

const PROJECTS_DATA = [
    {
        id: 1,
        title: '浮幻工作室官网',
        description: '浮幻工作室的官方网站，是一个现代化的静态网页。采用响应式设计，支持多主题切换（暗夜、明亮、马卡龙、莫兰迪），集成了作品展示、团队成员介绍、服务内容等模块。使用JavaScript动态渲染内容，便于快速更新和维护。',
        tags: ['web'],
        image: 'projects/picture/DreamirageStudio Web.png',
        status: 'updating',
        version: '1.0',
        startDate: '2026.02.02',
        lastUpdate: '2026.02.02',
        links: [
            { label: 'GitHub', url: 'https://github.com/Mirage-BIN', icon: 'fab fa-github' }
        ]
    },
    {
        id: 2,
        title: 'Intelligence Calculator',
        description: '一款"一本正经胡说八道"的娱乐计算器，用欧拉公式和微积分计算简单的加减法！包含加法和减法计算功能，使用欧拉公式、泰勒级数、微分方程等"高端"数学方法推导。支持实时打字机动画效果展示推导过程，提供多种主题（明亮、暗夜、莫兰迪、黑金）和会员等级系统，支持Windows原生通知。',
        tags: ['app', 'other'],
        image: 'projects/picture/Intelligence Calculator.png',
        status: 'updating',
        version: '1.0',
        startDate: '2026.02.02',
        lastUpdate: '2026.02.02',
        links: [
            { label: 'GitHub', url: 'https://github.com/Mirage-BIN/Intelligence-Calculator', icon: 'fab fa-github' }
        ]
    }
];