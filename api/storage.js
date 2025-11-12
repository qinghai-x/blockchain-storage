import CryptoJS from 'crypto-js';
const STORAGE_KEY = 'blockchain-storage-files';
const getCurrentUserId = () => {
    try {
        const raw = localStorage.getItem('userInfo');
        if (!raw)
            return null;
        const parsed = JSON.parse(raw);
        return parsed?.id || null;
    }
    catch (error) {
        console.warn('解析用户信息失败', error);
        return null;
    }
};
const readStorage = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    }
    catch (error) {
        console.warn('解析文件数据失败', error);
        return {};
    }
};
const writeStorage = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
const generateId = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID();
    }
    return 'file-' + Math.random().toString(36).slice(2, 10);
};
const generateBlockchainTx = (hash) => {
    return `0x${CryptoJS.SHA256(hash + Date.now()).toString().slice(0, 32)}`;
};
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result;
            if (typeof result === 'string') {
                resolve(result);
            }
            else {
                reject(new Error('无法读取文件内容'));
            }
        };
        reader.onerror = () => reject(new Error('文件读取失败'));
        reader.readAsDataURL(file);
    });
};
export const getFileList = async () => {
    const userId = getCurrentUserId();
    if (!userId) {
        return {
            success: false,
            message: '用户未登录'
        };
    }
    const storage = readStorage();
    const files = storage[userId] || [];
    return {
        success: true,
        data: files.map(({ content, ...rest }) => rest)
    };
};
export const uploadFile = async (payload) => {
    const userId = getCurrentUserId();
    if (!userId) {
        return {
            success: false,
            message: '用户未登录，请先登录'
        };
    }
    const base64 = await fileToBase64(payload.file);
    const fileHash = CryptoJS.SHA256(base64).toString();
    const newFile = {
        id: generateId(),
        fileName: payload.file.name,
        originalName: payload.file.name,
        fileSize: payload.file.size,
        fileHash,
        blockchainTx: generateBlockchainTx(fileHash),
        uploadTime: new Date().toISOString(),
        status: 1,
        mimeType: payload.file.type || 'application/octet-stream',
        description: payload.description,
        content: base64
    };
    const storage = readStorage();
    const userFiles = storage[userId] || [];
    const duplicate = userFiles.some(file => file.fileHash === newFile.fileHash);
    if (duplicate) {
        return {
            success: false,
            message: '该文件已上传，无需重复上传'
        };
    }
    userFiles.push(newFile);
    storage[userId] = userFiles;
    writeStorage(storage);
    const { content, ...summary } = newFile;
    return {
        success: true,
        data: summary
    };
};
export const deleteFile = async (fileId) => {
    const userId = getCurrentUserId();
    if (!userId) {
        return {
            success: false,
            message: '用户未登录'
        };
    }
    const storage = readStorage();
    const userFiles = storage[userId] || [];
    const index = userFiles.findIndex(file => file.id === fileId);
    if (index === -1) {
        return {
            success: false,
            message: '文件不存在或已删除'
        };
    }
    userFiles.splice(index, 1);
    storage[userId] = userFiles;
    writeStorage(storage);
    return {
        success: true
    };
};
export const downloadFile = async (fileId) => {
    const userId = getCurrentUserId();
    if (!userId) {
        return {
            success: false,
            message: '用户未登录'
        };
    }
    const storage = readStorage();
    const userFiles = storage[userId] || [];
    const file = userFiles.find(item => item.id === fileId);
    if (!file) {
        return {
            success: false,
            message: '文件不存在或已删除'
        };
    }
    return {
        success: true,
        data: {
            content: file.content,
            fileName: file.fileName,
            mimeType: file.mimeType
        }
    };
};
