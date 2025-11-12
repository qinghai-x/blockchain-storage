import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { register } from '@/api/auth';
const emit = defineEmits();
const form = reactive({
    username: '',
    password: '',
    confirmPassword: '',
    publicKey: ''
});
const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, message: '用户名至少3个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码至少6位', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        {
            validator: (_, value, callback) => {
                if (value !== form.password) {
                    callback(new Error('两次输入的密码不一致'));
                }
                else {
                    callback();
                }
            },
            trigger: 'blur'
        }
    ],
    publicKey: [
        { required: true, message: '请输入公钥', trigger: 'blur' },
        { min: 10, message: '公钥长度至少10位', trigger: 'blur' }
    ]
});
const formRef = ref();
const loading = ref(false);
const resetForm = () => {
    form.username = '';
    form.password = '';
    form.confirmPassword = '';
    form.publicKey = '';
};
const handleCancel = () => {
    resetForm();
    emit('cancel');
};
const handleRegister = async () => {
    if (!formRef.value)
        return;
    try {
        await formRef.value.validate();
        loading.value = true;
        const response = await register({
            username: form.username,
            password: form.password,
            publicKey: form.publicKey
        });
        if (response.success) {
            ElMessage.success('注册成功，请登录');
            resetForm();
            emit('success');
            window.dispatchEvent(new Event('auth-change'));
        }
        else {
            ElMessage.error(response.message || '注册失败，请稍后重试');
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : '注册失败，请稍后重试';
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
    labelWidth: "80px",
}));
const __VLS_2 = __VLS_1({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelWidth: "80px",
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
    label: "用户名",
    prop: "username",
}));
const __VLS_9 = __VLS_8({
    label: "用户名",
    prop: "username",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const { default: __VLS_11 } = __VLS_10.slots;
const __VLS_12 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    modelValue: (__VLS_ctx.form.username),
    placeholder: "请输入用户名",
}));
const __VLS_14 = __VLS_13({
    modelValue: (__VLS_ctx.form.username),
    placeholder: "请输入用户名",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
// @ts-ignore
[form,];
var __VLS_10;
const __VLS_17 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    label: "密码",
    prop: "password",
}));
const __VLS_19 = __VLS_18({
    label: "密码",
    prop: "password",
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
const { default: __VLS_21 } = __VLS_20.slots;
const __VLS_22 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({
    modelValue: (__VLS_ctx.form.password),
    type: "password",
    placeholder: "请输入密码",
    showPassword: true,
}));
const __VLS_24 = __VLS_23({
    modelValue: (__VLS_ctx.form.password),
    type: "password",
    placeholder: "请输入密码",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
// @ts-ignore
[form,];
var __VLS_20;
const __VLS_27 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    label: "确认密码",
    prop: "confirmPassword",
}));
const __VLS_29 = __VLS_28({
    label: "确认密码",
    prop: "confirmPassword",
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
const { default: __VLS_31 } = __VLS_30.slots;
const __VLS_32 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    modelValue: (__VLS_ctx.form.confirmPassword),
    type: "password",
    placeholder: "请再次输入密码",
    showPassword: true,
}));
const __VLS_34 = __VLS_33({
    modelValue: (__VLS_ctx.form.confirmPassword),
    type: "password",
    placeholder: "请再次输入密码",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
// @ts-ignore
[form,];
var __VLS_30;
const __VLS_37 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
    label: "公钥",
    prop: "publicKey",
}));
const __VLS_39 = __VLS_38({
    label: "公钥",
    prop: "publicKey",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
const { default: __VLS_41 } = __VLS_40.slots;
const __VLS_42 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({
    modelValue: (__VLS_ctx.form.publicKey),
    placeholder: "请输入区块链公钥",
}));
const __VLS_44 = __VLS_43({
    modelValue: (__VLS_ctx.form.publicKey),
    placeholder: "请输入区块链公钥",
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
// @ts-ignore
[form,];
var __VLS_40;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "form-actions" },
});
const __VLS_47 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
    ...{ 'onClick': {} },
}));
const __VLS_49 = __VLS_48({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
let __VLS_51;
let __VLS_52;
const __VLS_53 = ({ click: {} },
    { onClick: (__VLS_ctx.handleCancel) });
const { default: __VLS_54 } = __VLS_50.slots;
// @ts-ignore
[handleCancel,];
var __VLS_50;
const __VLS_55 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.loading),
}));
const __VLS_57 = __VLS_56({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
let __VLS_59;
let __VLS_60;
const __VLS_61 = ({ click: {} },
    { onClick: (__VLS_ctx.handleRegister) });
const { default: __VLS_62 } = __VLS_58.slots;
// @ts-ignore
[loading, handleRegister,];
var __VLS_58;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
// @ts-ignore
var __VLS_5 = __VLS_4;
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
});
export default {};
