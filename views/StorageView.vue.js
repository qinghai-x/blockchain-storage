import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Document, Upload } from '@element-plus/icons-vue';
import UploadForm from '@/components/UploadForm.vue';
import { getFileList, deleteFile, downloadFile } from '@/api/storage';
const fileList = ref([]);
const loading = ref(false);
const showUploadDialog = ref(false);
onMounted(() => {
    loadFileList();
});
const loadFileList = async () => {
    try {
        loading.value = true;
        const response = await getFileList();
        if (response.success) {
            fileList.value = response.data || [];
        }
        else {
            fileList.value = [];
        }
    }
    catch (error) {
        ElMessage.error('获取文件列表失败');
    }
    finally {
        loading.value = false;
    }
};
const handleUploadSuccess = () => {
    showUploadDialog.value = false;
    loadFileList();
    ElMessage.success('文件上传成功');
};
const handleDownload = async (file) => {
    try {
        const response = await downloadFile(file.id);
        if (response.success && response.data) {
            const { content, fileName, mimeType } = response.data;
            const base64Data = content.startsWith('data:') ? content.split(',')[1] : content;
            const byteString = atob(base64Data);
            const arrayBuffer = new Uint8Array(byteString.length);
            for (let i = 0; i < byteString.length; i++) {
                arrayBuffer[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([arrayBuffer], { type: mimeType || 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName || file.fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        }
    }
    catch (error) {
        ElMessage.error('文件下载失败');
    }
};
const handleDelete = async (file) => {
    try {
        await ElMessageBox.confirm(`确定要删除文件 "${file.fileName}" 吗？此操作将在区块链上记录删除记录。`, '警告', { type: 'warning' });
        const response = await deleteFile(file.id);
        if (response.success) {
            ElMessage.success('文件删除成功');
            loadFileList();
        }
        else if (response.message) {
            ElMessage.error(response.message);
        }
    }
    catch (error) {
        // 用户取消删除
    }
};
const shortenHash = (hash) => {
    return hash ? `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}` : '';
};
const formatFileSize = (bytes) => {
    if (bytes === 0)
        return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
const formatTime = (time) => {
    return new Date(time).toLocaleString();
};
const getStatusType = (status) => {
    const types = ['', 'success', 'warning', 'danger'];
    return types[status] || '';
};
const getStatusText = (status) => {
    const texts = ['', '已存储', '同步中', '异常'];
    return texts[status] || '未知';
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "storage-container" },
});
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
ElCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "storage-card" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "storage-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_4 } = __VLS_3.slots;
{
    const { header: __VLS_5 } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "card-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({});
    const __VLS_6 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_8 = __VLS_7({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    let __VLS_10;
    let __VLS_11;
    const __VLS_12 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.showUploadDialog = true;
                // @ts-ignore
                [showUploadDialog,];
            } });
    const { default: __VLS_13 } = __VLS_9.slots;
    const __VLS_14 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    ElIcon;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({}));
    const __VLS_16 = __VLS_15({}, ...__VLS_functionalComponentArgsRest(__VLS_15));
    const { default: __VLS_18 } = __VLS_17.slots;
    const __VLS_19 = {}.Upload;
    /** @type {[typeof __VLS_components.Upload, ]} */ ;
    // @ts-ignore
    Upload;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({}));
    const __VLS_21 = __VLS_20({}, ...__VLS_functionalComponentArgsRest(__VLS_20));
    var __VLS_17;
    var __VLS_9;
}
const __VLS_24 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
ElTable;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    data: (__VLS_ctx.fileList),
}));
const __VLS_26 = __VLS_25({
    data: (__VLS_ctx.fileList),
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_28 } = __VLS_27.slots;
// @ts-ignore
[fileList, vLoading, loading,];
const __VLS_29 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    prop: "fileName",
    label: "文件名",
    minWidth: "200",
}));
const __VLS_31 = __VLS_30({
    prop: "fileName",
    label: "文件名",
    minWidth: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
const { default: __VLS_33 } = __VLS_32.slots;
{
    const { default: __VLS_34 } = __VLS_32.slots;
    const [{ row }] = __VLS_getSlotParameters(__VLS_34);
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "file-info" },
    });
    const __VLS_35 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    ElIcon;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
        ...{ class: "file-icon" },
    }));
    const __VLS_37 = __VLS_36({
        ...{ class: "file-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_36));
    const { default: __VLS_39 } = __VLS_38.slots;
    const __VLS_40 = {}.Document;
    /** @type {[typeof __VLS_components.Document, ]} */ ;
    // @ts-ignore
    Document;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({}));
    const __VLS_42 = __VLS_41({}, ...__VLS_functionalComponentArgsRest(__VLS_41));
    var __VLS_38;
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "file-details" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "file-name" },
    });
    (row.fileName);
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "file-meta" },
    });
    (__VLS_ctx.formatFileSize(row.fileSize));
    (__VLS_ctx.formatTime(row.uploadTime));
    // @ts-ignore
    [formatFileSize, formatTime,];
}
var __VLS_32;
const __VLS_45 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
    prop: "fileHash",
    label: "文件哈希",
    minWidth: "280",
}));
const __VLS_47 = __VLS_46({
    prop: "fileHash",
    label: "文件哈希",
    minWidth: "280",
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
const { default: __VLS_49 } = __VLS_48.slots;
{
    const { default: __VLS_50 } = __VLS_48.slots;
    const [{ row }] = __VLS_getSlotParameters(__VLS_50);
    const __VLS_51 = {}.ElTooltip;
    /** @type {[typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, ]} */ ;
    // @ts-ignore
    ElTooltip;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
        content: (row.fileHash),
    }));
    const __VLS_53 = __VLS_52({
        content: (row.fileHash),
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    const { default: __VLS_55 } = __VLS_54.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "hash-text" },
    });
    (__VLS_ctx.shortenHash(row.fileHash));
    // @ts-ignore
    [shortenHash,];
    var __VLS_54;
}
var __VLS_48;
const __VLS_56 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    prop: "blockchainTx",
    label: "区块链交易",
    minWidth: "280",
}));
const __VLS_58 = __VLS_57({
    prop: "blockchainTx",
    label: "区块链交易",
    minWidth: "280",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const { default: __VLS_60 } = __VLS_59.slots;
{
    const { default: __VLS_61 } = __VLS_59.slots;
    const [{ row }] = __VLS_getSlotParameters(__VLS_61);
    const __VLS_62 = {}.ElTooltip;
    /** @type {[typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, ]} */ ;
    // @ts-ignore
    ElTooltip;
    // @ts-ignore
    const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({
        content: (row.blockchainTx),
    }));
    const __VLS_64 = __VLS_63({
        content: (row.blockchainTx),
    }, ...__VLS_functionalComponentArgsRest(__VLS_63));
    const { default: __VLS_66 } = __VLS_65.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "hash-text" },
    });
    (__VLS_ctx.shortenHash(row.blockchainTx));
    // @ts-ignore
    [shortenHash,];
    var __VLS_65;
}
var __VLS_59;
const __VLS_67 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
    prop: "status",
    label: "状态",
    width: "100",
}));
const __VLS_69 = __VLS_68({
    prop: "status",
    label: "状态",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
const { default: __VLS_71 } = __VLS_70.slots;
{
    const { default: __VLS_72 } = __VLS_70.slots;
    const [{ row }] = __VLS_getSlotParameters(__VLS_72);
    const __VLS_73 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    ElTag;
    // @ts-ignore
    const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
        type: (__VLS_ctx.getStatusType(row.status)),
    }));
    const __VLS_75 = __VLS_74({
        type: (__VLS_ctx.getStatusType(row.status)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_74));
    const { default: __VLS_77 } = __VLS_76.slots;
    // @ts-ignore
    [getStatusType,];
    (__VLS_ctx.getStatusText(row.status));
    // @ts-ignore
    [getStatusText,];
    var __VLS_76;
}
var __VLS_70;
const __VLS_78 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
    label: "操作",
    width: "180",
}));
const __VLS_80 = __VLS_79({
    label: "操作",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
const { default: __VLS_82 } = __VLS_81.slots;
{
    const { default: __VLS_83 } = __VLS_81.slots;
    const [{ row }] = __VLS_getSlotParameters(__VLS_83);
    const __VLS_84 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_86 = __VLS_85({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    let __VLS_88;
    let __VLS_89;
    const __VLS_90 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.handleDownload(row);
                // @ts-ignore
                [handleDownload,];
            } });
    const { default: __VLS_91 } = __VLS_87.slots;
    var __VLS_87;
    const __VLS_92 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
    }));
    const __VLS_94 = __VLS_93({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    let __VLS_96;
    let __VLS_97;
    const __VLS_98 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.handleDelete(row);
                // @ts-ignore
                [handleDelete,];
            } });
    const { default: __VLS_99 } = __VLS_95.slots;
    var __VLS_95;
}
var __VLS_81;
var __VLS_27;
var __VLS_3;
const __VLS_100 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
ElDialog;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    modelValue: (__VLS_ctx.showUploadDialog),
    title: "上传文件",
    width: "600px",
}));
const __VLS_102 = __VLS_101({
    modelValue: (__VLS_ctx.showUploadDialog),
    title: "上传文件",
    width: "600px",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
const { default: __VLS_104 } = __VLS_103.slots;
// @ts-ignore
[showUploadDialog,];
/** @type {[typeof UploadForm, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(UploadForm, new UploadForm({
    ...{ 'onSuccess': {} },
    ...{ 'onCancel': {} },
}));
const __VLS_106 = __VLS_105({
    ...{ 'onSuccess': {} },
    ...{ 'onCancel': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
let __VLS_108;
let __VLS_109;
const __VLS_110 = ({ success: {} },
    { onSuccess: (__VLS_ctx.handleUploadSuccess) });
const __VLS_111 = ({ cancel: {} },
    { onCancel: (...[$event]) => {
            __VLS_ctx.showUploadDialog = false;
            // @ts-ignore
            [showUploadDialog, handleUploadSuccess,];
        } });
var __VLS_107;
var __VLS_103;
/** @type {__VLS_StyleScopedClasses['storage-container']} */ ;
/** @type {__VLS_StyleScopedClasses['storage-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['file-info']} */ ;
/** @type {__VLS_StyleScopedClasses['file-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['file-details']} */ ;
/** @type {__VLS_StyleScopedClasses['file-name']} */ ;
/** @type {__VLS_StyleScopedClasses['file-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['hash-text']} */ ;
/** @type {__VLS_StyleScopedClasses['hash-text']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
