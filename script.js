/* =========================================
   1. 作品数据配置 (在此处添加/修改作品)
   =========================================
   type: 'image' (图片) | 'video-local' (本地MP4) | 'video-embed' (B站/YT) | 'link' (外链)
   src: 图片路径 | 视频路径 | 视频Iframe代码 | 跳转链接
   thumb: 封面缩略图路径 (必须配置)
   category: 对应HTML中 data-filter 的值
*/
const projects = [
    {
        id: 1,
        title: "AI概念短片",
        category: "video",
        type: "video-local",
        thumb: "assets/.jpg",
        src: "assets/mv.mp4"
    },
    {
        id: 2,
        title: "石头A30系列销量视频",
        category: "video",
        type: "video-local",
        thumb: "assets/stfm.png",
        src: "assets/shitou.mp4"
    },
    {
        id: 3,
        title: "MG竞赛短片",
        category: "video",
        type: "video-local",
        thumb: "assets/my.png",
        src: "assets/mgdh.mp4" // 你的本地视频路径
    },
    {
        id: 4,
        title: "金海豚",
        category: "video",
        type: "video-embed",
        thumb: "assets/nh.jpg",
        // B站嵌入代码示例 (使用 iframe src)
        src: "assets/kunp.mp4"
    },
    {
        id: 5,
        title: "产品设计",
        category: "web",
        type: "link",
        thumb: "assets/shub.png",
        src: "assets/sb.pdf" // 跳转目标链接
    },
    {
        id: 6,
        title: "平面",
        category: "3D",
        type: "link",
        thumb: "assets/shub.png",
        src: "assets/sb.pdf"
    }

];

// DOM 元素获取
const gallery = document.getElementById('gallery');
const filterBtns = document.querySelectorAll('.filter-btn');
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.querySelector('.lightbox-content');
const closeBtn = document.querySelector('.close-lightbox');
const loader = document.getElementById('loader');

/* =========================================
   2. 核心功能函数
   ========================================= */

// 初始化页面
/* =========================================
   2. 核心功能函数 (双列表渲染)
   ========================================= */

// 获取两个不同的容器
const galleryFeatured = document.getElementById('gallery');
const galleryMore = document.getElementById('gallery-more');

// 初始化页面
window.addEventListener('load', () => {
    // 1. 渲染【精选作品】 (只取数组的 前 6 个元素)
    // .slice(0, 6) 的意思就是“从第0个开始切，切到第6个之前”
    const featuredProjects = projects.slice(0, 6);
    renderProjects(featuredProjects, galleryFeatured);

    // 2. 渲染【全部作品】 (传入完整的 projects 数组)
    renderProjects(projects, galleryMore);
    
    // 隐藏加载动画
    loader.style.display = 'none';
});

// 重写渲染函数，增加 targetContainer 参数，让它知道渲染到哪里
function renderProjects(data, targetContainer) {
    targetContainer.innerHTML = ''; // 清空当前容器内容
    
    data.forEach(project => {
        // 创建卡片元素
        const card = document.createElement('div');
        card.classList.add('portfolio-card');
        card.setAttribute('data-id', project.id);

        let iconClass = 'fa-plus';
        if (project.type.includes('video')) iconClass = 'fa-play';
        if (project.type === 'link') iconClass = 'fa-link';

        card.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${project.thumb}" alt="${project.title}" loading="lazy">
                <div class="card-overlay">
                    <h3 class="card-title">${project.title}</h3>
                    <span class="card-category">${project.category}</span>
                    <i class="fas ${iconClass} icon-play"></i>
                </div>
            </div>
        `;

        // 绑定弹窗点击事件
        card.addEventListener('click', () => handleCardClick(project));
        targetContainer.appendChild(card);
    });
}

// 修改分类按钮的逻辑，让它只影响“全部作品”区域
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // 移除所有激活状态
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');
        
        // 筛选逻辑只渲染到 galleryMore 容器
        if (filterValue === 'all') {
            renderProjects(projects, galleryMore);
        } else {
            const filtered = projects.filter(p => p.category === filterValue);
            renderProjects(filtered, galleryMore);
        }
    });
});

// 渲染作品卡片
function renderProjects(data) {
    gallery.innerHTML = ''; // 清空当前内容
    
    data.forEach(project => {
        // 创建卡片元素
        const card = document.createElement('div');
        card.classList.add('portfolio-card');
        card.setAttribute('data-id', project.id);

        // 不同的类型显示不同的图标
        let iconClass = 'fa-plus';
        if (project.type.includes('video')) iconClass = 'fa-play';
        if (project.type === 'link') iconClass = 'fa-link';

        card.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${project.thumb}" alt="${project.title}" loading="lazy">
                <div class="card-overlay">
                    <h3 class="card-title">${project.title}</h3>
                    <span class="card-category">${project.category}</span>
                    <i class="fas ${iconClass} icon-play"></i>
                </div>
            </div>
        `;

        // 绑定点击事件
        card.addEventListener('click', () => handleCardClick(project));
        gallery.appendChild(card);
    });
}

// 处理筛选点击
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // 移除所有激活状态
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');
        
        if (filterValue === 'all') {
            renderProjects(projects);
        } else {
            const filtered = projects.filter(p => p.category === filterValue);
            renderProjects(filtered);
        }
    });
});

// 处理卡片点击 (弹窗或跳转)
function handleCardClick(project) {
    if (project.type === 'link') {
        window.open(project.src, '_blank'); // 新窗口打开链接
        return;
    }

    openLightbox(project);
}

// 打开弹窗
function openLightbox(project) {
    lightboxContent.innerHTML = ''; // 清空旧内容
    
    if (project.type === 'image') {
        const img = document.createElement('img');
        img.src = project.src;
        lightboxContent.appendChild(img);
    } 
    else if (project.type === 'video-local') {
        const video = document.createElement('video');
        video.src = project.src;
        video.controls = true;
        video.autoplay = true;
        lightboxContent.appendChild(video);
    }
    else if (project.type === 'video-embed') {
        const iframe = document.createElement('iframe');
        iframe.src = project.src;
        iframe.allow = "autoplay; encrypted-media";
        iframe.allowFullscreen = true;
        lightboxContent.appendChild(iframe);
    }

    lightbox.classList.add('active');
}

// 关闭弹窗
closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('active');
    lightboxContent.innerHTML = ''; // 停止视频播放
});

// 点击弹窗背景关闭
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
        lightboxContent.innerHTML = '';
    }
});

// 导航栏滚动变色
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.style.background = getComputedStyle(document.documentElement).getPropertyValue('--nav-bg');
        nav.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
    } else {
        nav.style.background = "transparent";
        nav.style.boxShadow = "none";
    }
});
/* =========================================
   5. 微信二维码弹窗逻辑
   ========================================= */
const wechatBtn = document.getElementById('wechat-btn');

if (wechatBtn) {
    wechatBtn.addEventListener('click', () => {
        // 1. 清空弹窗里之前的内容
        lightboxContent.innerHTML = ''; 
        
        // 2. 创建一张图片放你的二维码
        const img = document.createElement('img');
        
        // ⚠️注意：确保这里是你实际的二维码图片路径和名字
        img.src = 'assets/ewm.png'; 
        
        // 为了让二维码不要像作品图那么巨大，我们限制一下它的最大宽度
        img.style.maxWidth = '300px'; 
        img.style.borderRadius = '10px'; // 加个好看的圆角
        
        // 3. 把图片放进弹窗，并显示弹窗
        lightboxContent.appendChild(img);
        lightbox.classList.add('active');
    });
}