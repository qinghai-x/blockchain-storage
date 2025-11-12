import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue';
import { uploadFile } from '@/api/storage';
const emit = defineEmits();
const form = reactive({
    description: '',
    file: null
});
const rules = reactive({
    file: [{ required: true, message: '请先选择要上传的文件', trigger: 'change' }]
});
const formRef = ref();
const loading = ref(false);
const fileList = ref([]);
const resetForm = () => {
    form.description = '';
    form.file = null;
    fileList.value = [];
    formRef.value?.clearValidate();
};
const handleFileChange = (file, files) => {
    if (files.length > 1) {
        files.splice(0, files.length - 1);
    }
    if (file.raw) {
        form.file = file.raw;
        fileList.value = [file];
    }
};
const handleFileRemove = () => {
    form.file = null;
    fileList.value = [];
};
const handleCancel = () => {
    resetForm();
    emit('cancel');
};
const handleSubmit = async () => {
    if (!formRef.value)
        return;
    try {
        await formRef.value.validate();
        if (!form.file) {
            ElMessage.warning('请选择文件后再上传');
            return;
        }
        loading.value = true;
        const response = await uploadFile({
            file: form.file,
            description: form.description
        });
        if (response.success) {
            ElMessage.success('文件上传成功');
            resetForm();
            emit('success');
        }
        else {
            ElMessage.error(response.message || '文件上传失败');
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : '文件上传失败';
        ElMessage.error(message);
    }
    finally {
        loading.value = false;
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
ElForm;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelWidth: "90px",
}));
const __VLS_2 = __VLS_1({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelWidth: "90px",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_4 = {};
const { default: __VLS_6 } = __VLS_3.slots;
// @ts-ignore
[form, rules, formRef,];
const __VLS_7 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
    label: "文件",
    prop: "file",
}));
const __VLS_9 = __VLS_8({
    label: "文件",
    prop: "file",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const { default: __VLS_11 } = __VLS_10.slots;
const __VLS_12 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
// @ts-ignore
ElUpload;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ class: "upload-wrapper" },
    drag: true,
    autoUpload: (false),
    fileList: (__VLS_ctx.fileList),
    onChange: (__VLS_ctx.handleFileChange),
    onRemove: (__VLS_ctx.handleFileRemove),
    limit: (1),
}));
const __VLS_14 = __VLS_13({
    ...{ class: "upload-wrapper" },
    drag: true,
    autoUpload: (false),
    fileList: (__VLS_ctx.fileList),
    onChange: (__VLS_ctx.handleFileChange),
    onRemove: (__VLS_ctx.handleFileRemove),
    limit: (1),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
const { default: __VLS_16 } = __VLS_15.slots;
// @ts-ignore
[fileList, handleFileChange, handleFileRemove,];
const __VLS_17 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
ElIcon;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    ...{ class: "upload-icon" },
}));
const __VLS_19 = __VLS_18({
    ...{ class: "upload-icon" },
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
const { default: __VLS_21 } = __VLS_20.slots;
const __VLS_22 = {}.UploadFilled;
/** @type {[typeof __VLS_components.UploadFilled, ]} */ ;
// @ts-ignore
UploadFilled;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({}));
const __VLS_24 = __VLS_23({}, ...__VLS_functionalComponentArgsRest(__VLS_23));
var __VLS_20;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "el-upload__text" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.em, __VLS_intrinsics.em)({});
{
    const { tip: __VLS_27 } = __VLS_15.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "el-upload__tip" },
    });
}
var __VLS_15;
var __VLS_10;
const __VLS_28 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "描述",
}));
const __VLS_30 = __VLS_29({
    label: "描述",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const { default: __VLS_32 } = __VLS_31.slots;
const __VLS_33 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
    modelValue: (__VLS_ctx.form.description),
    type: "textarea",
    rows: (3),
    placeholder: "请输入文件描述（可选）",
}));
const __VLS_35 = __VLS_34({
    modelValue: (__VLS_ctx.form.description),
    type: "textarea",
    rows: (3),
    placeholder: "请输入文件描述（可选）",
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
// @ts-ignore
[form,];
var __VLS_31;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "form-actions" },
});
const __VLS_38 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({
    ...{ 'onClick': {} },
}));
const __VLS_40 = __VLS_39({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
let __VLS_42;
let __VLS_43;
const __VLS_44 = ({ click: {} },
    { onClick: (__VLS_ctx.handleCancel) });
const { default: __VLS_45 } = __VLS_41.slots;
// @ts-ignore
[handleCancel,];
var __VLS_41;
const __VLS_46 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.loading),
}));
const __VLS_48 = __VLS_47({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
let __VLS_50;
let __VLS_51;
const __VLS_52 = ({ click: {} },
    { onClick: (__VLS_ctx.handleSubmit) });
const { default: __VLS_53 } = __VLS_49.slots;
// @ts-ignore
[loading, handleSubmit,];
var __VLS_49;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['upload-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['el-upload__text']} */ ;
/** @type {__VLS_StyleScopedClasses['el-upload__tip']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
// @ts-ignore
var __VLS_5 = __VLS_4;
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
});
export default {};
