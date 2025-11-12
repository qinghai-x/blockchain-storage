// 导航栏滚动效果
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(15, 23, 42, 0.98)';
        navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// 移动端菜单切换
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// 平滑滚动到锚点
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            // 关闭移动端菜单
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });
});

// 数字动画效果
function animateNumber(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// 观察器：当统计数字进入视口时开始动画
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target;
            const target = parseInt(statNumber.getAttribute('data-target'));
            if (!statNumber.classList.contains('animated')) {
                animateNumber(statNumber, target);
                statNumber.classList.add('animated');
            }
        }
    });
}, observerOptions);

// 观察所有统计数字
document.querySelectorAll('.stat-number').forEach(stat => {
    statsObserver.observe(stat);
});

// 表单提交处理
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 获取表单数据
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;

        // 这里可以添加实际的表单提交逻辑
        // 例如：发送到服务器、显示成功消息等
        
        // 模拟提交成功
        alert('感谢您的留言！我们会尽快与您联系。');
        contactForm.reset();
    });
}

// 卡片悬停效果增强
document.querySelectorAll('.feature-card, .layer-card, .tech-item').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// 添加滚动动画
const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// 为需要动画的元素添加观察
document.querySelectorAll('.feature-card, .comparison-item, .tech-item, .stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(el);
});


// 粒子效果增强
function createParticle() {
    const particles = document.querySelector('.particles');
    if (!particles) return;

    // 可以在这里添加更复杂的粒子动画
    setInterval(() => {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.background = 'rgba(99, 102, 241, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = 'float 3s ease-in-out infinite';
        particles.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 3000);
    }, 500);
}

// 性能优化：节流函数
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 优化滚动事件
const optimizedScroll = throttle(() => {
    // 滚动相关的操作
}, 100);

window.addEventListener('scroll', optimizedScroll);

// ==================== 存储管理功能 ====================

// IndexedDB 数据库管理
class StorageDB {
    constructor() {
        this.dbName = 'BlockchainStorageDB';
        this.version = 1;
        this.storeName = 'files';
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const objectStore = db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
                    objectStore.createIndex('name', 'name', { unique: false });
                    objectStore.createIndex('date', 'uploadDate', { unique: false });
                    objectStore.createIndex('size', 'size', { unique: false });
                }
            };
        });
    }

    async addFile(fileData) {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        return store.add(fileData);
    }

    async getAllFiles() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteFile(id) {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        return store.delete(id);
    }

    async getFile(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}

// 存储管理器
class StorageManager {
    constructor() {
        this.db = new StorageDB();
        this.files = [];
        this.init();
    }

    async init() {
        try {
            await this.db.init();
            await this.loadFiles();
            this.setupEventListeners();
        } catch (error) {
            console.error('数据库初始化失败:', error);
            alert('存储系统初始化失败，请刷新页面重试');
        }
    }

    setupEventListeners() {
        const fileInput = document.getElementById('fileInput');
        const uploadArea = document.getElementById('uploadArea');
        const searchInput = document.getElementById('searchInput');
        const sortSelect = document.getElementById('sortSelect');
        const refreshBtn = document.getElementById('refreshBtn');

        // 文件选择
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileSelect(e.target.files));
        }

        // 拖拽上传
        if (uploadArea) {
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('dragover');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                this.handleFileSelect(e.dataTransfer.files);
            });
        }

        // 搜索
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.filterFiles(e.target.value));
        }

        // 排序
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => this.sortFiles(e.target.value));
        }

        // 刷新
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadFiles());
        }
    }

    async handleFileSelect(files) {
        const maxSize = 100 * 1024 * 1024; // 100MB
        const validFiles = Array.from(files).filter(file => {
            if (file.size > maxSize) {
                alert(`文件 "${file.name}" 超过100MB限制，已跳过`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        const uploadProgress = document.getElementById('uploadProgress');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');

        uploadProgress.style.display = 'block';

        for (let i = 0; i < validFiles.length; i++) {
            const file = validFiles[i];
            const progress = ((i + 1) / validFiles.length) * 100;

            try {
                await this.uploadFile(file);
                progressFill.style.width = progress + '%';
                progressText.textContent = `上传中... ${i + 1}/${validFiles.length}`;
            } catch (error) {
                console.error('上传失败:', error);
                alert(`文件 "${file.name}" 上传失败: ${error.message}`);
            }
        }

        setTimeout(() => {
            uploadProgress.style.display = 'none';
            progressFill.style.width = '0%';
            progressText.textContent = '上传中...';
        }, 1000);

        await this.loadFiles();
    }

    async uploadFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const fileData = {
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        data: e.target.result,
                        uploadDate: new Date().toISOString(),
                        hash: await this.generateHash(file.name + file.size + Date.now())
                    };

                    await this.db.addFile(fileData);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('文件读取失败'));
            reader.readAsDataURL(file);
        });
    }

    async generateHash(str) {
        // 简单的哈希生成（实际应用中应使用更安全的算法）
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }

    async loadFiles() {
        try {
            this.files = await this.db.getAllFiles();
            this.renderFiles();
            this.updateStats();
        } catch (error) {
            console.error('加载文件失败:', error);
        }
    }

    renderFiles(filesToRender = this.files) {
        const fileList = document.getElementById('fileList');
        if (!fileList) return;

        if (filesToRender.length === 0) {
            fileList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📁</div>
                    <p>暂无文件，请上传文件开始使用</p>
                </div>
            `;
            return;
        }

        fileList.innerHTML = filesToRender.map(file => this.createFileItem(file)).join('');
        
        // 添加事件监听器
        fileList.querySelectorAll('.btn-download').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('.file-item').dataset.id);
                this.downloadFile(id);
            });
        });

        fileList.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('.file-item').dataset.id);
                this.deleteFile(id);
            });
        });
    }

    createFileItem(file) {
        const icon = this.getFileIcon(file.type || file.name);
        const size = this.formatFileSize(file.size);
        const date = new Date(file.uploadDate).toLocaleString('zh-CN');

        return `
            <div class="file-item" data-id="${file.id}">
                <div class="file-info">
                    <div class="file-icon">${icon}</div>
                    <div class="file-details">
                        <div class="file-name">${this.escapeHtml(file.name)}</div>
                        <div class="file-meta">
                            <span>大小: ${size}</span>
                            <span>上传时间: ${date}</span>
                            <span>哈希: ${file.hash.substring(0, 8)}...</span>
                        </div>
                    </div>
                </div>
                <div class="file-actions-buttons">
                    <button class="btn-icon btn-download" title="下载">⬇️</button>
                    <button class="btn-icon btn-delete danger" title="删除">🗑️</button>
                </div>
            </div>
        `;
    }

    getFileIcon(typeOrName) {
        const name = typeOrName.toLowerCase();
        if (name.includes('image')) return '🖼️';
        if (name.includes('video')) return '🎥';
        if (name.includes('audio')) return '🎵';
        if (name.includes('pdf')) return '📄';
        if (name.includes('word') || name.includes('doc')) return '📝';
        if (name.includes('excel') || name.includes('xls')) return '📊';
        if (name.includes('zip') || name.includes('rar')) return '📦';
        if (name.includes('code') || name.includes('text')) return '💻';
        return '📄';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async downloadFile(id) {
        try {
            const file = await this.db.getFile(id);
            if (!file) {
                alert('文件不存在');
                return;
            }

            // 创建下载链接
            const link = document.createElement('a');
            link.href = file.data;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('下载失败:', error);
            alert('文件下载失败');
        }
    }

    async deleteFile(id) {
        if (!confirm('确定要删除这个文件吗？')) return;

        try {
            await this.db.deleteFile(id);
            await this.loadFiles();
        } catch (error) {
            console.error('删除失败:', error);
            alert('文件删除失败');
        }
    }

    filterFiles(searchTerm) {
        const term = searchTerm.toLowerCase();
        const filtered = this.files.filter(file => 
            file.name.toLowerCase().includes(term) ||
            file.type.toLowerCase().includes(term)
        );
        this.renderFiles(filtered);
    }

    sortFiles(sortBy) {
        const sorted = [...this.files];
        
        switch (sortBy) {
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'size':
                sorted.sort((a, b) => b.size - a.size);
                break;
            case 'date':
                sorted.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
                break;
        }
        
        this.renderFiles(sorted);
    }

    updateStats() {
        const totalFiles = this.files.length;
        const totalSize = this.files.reduce((sum, file) => sum + file.size, 0);
        const encryptedFiles = this.files.length; // 所有文件都视为加密存储

        const totalFilesEl = document.getElementById('totalFiles');
        const totalSizeEl = document.getElementById('totalSize');
        const encryptedFilesEl = document.getElementById('encryptedFiles');

        if (totalFilesEl) {
            totalFilesEl.textContent = totalFiles;
        }
        if (totalSizeEl) {
            totalSizeEl.textContent = this.formatFileSize(totalSize);
        }
        if (encryptedFilesEl) {
            encryptedFilesEl.textContent = encryptedFiles;
        }
    }
}

// 初始化存储管理器
let storageManager;
document.addEventListener('DOMContentLoaded', () => {
    // 添加加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    // 初始化存储管理器
    storageManager = new StorageManager();
});

