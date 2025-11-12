import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { User, Lock, Key } from '@element-plus/icons-vue';
import RegisterForm from '@/components/RegisterForm.vue';
import { login } from '@/api/auth';
const router = useRouter();
const loginFormRef = ref();
const loading = ref(false);
const showRegister = ref(false);
const loginForm = reactive({
    username: '',
    password: '',
    publicKey: ''
});
const rules = reactive({
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    publicKey: [{ required: true, message: '请输入公钥', trigger: 'blur' }]
});
const handleLogin = async () => {
    if (!loginFormRef.value)
        return;
    try {
        await loginFormRef.value.validate();
        loading.value = true;
        const response = await login(loginForm);
        if (response.success) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userInfo', JSON.stringify(response.data.user));
            window.dispatchEvent(new Event('auth-change'));
            ElMessage.success('登录成功');
            router.push('/storage');
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : '登录失败，请检查用户名和密码';
        ElMessage.error(message);
    }
    finally {
        loading.value = false;
    }
};
const handleRegisterSuccess = () => {
    showRegister.value = false;
    ElMessage.success('注册成功，请登录');
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['login-header']} */ ;
/** @type {__VLS_StyleScopedClasses['login-header']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "login-container" },
});
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
ElCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "login-card" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "login-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_4 } = __VLS_3.slots;
{
    const { header: __VLS_5 } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "login-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
}
const __VLS_6 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
ElForm;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
    model: (__VLS_ctx.loginForm),
    rules: (__VLS_ctx.rules),
    ref: "loginFormRef",
}));
const __VLS_8 = __VLS_7({
    model: (__VLS_ctx.loginForm),
    rules: (__VLS_ctx.rules),
    ref: "loginFormRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
/** @type {typeof __VLS_ctx.loginFormRef} */ ;
var __VLS_10 = {};
const { default: __VLS_12 } = __VLS_9.slots;
// @ts-ignore
[loginForm, rules, loginFormRef,];
const __VLS_13 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    prop: "username",
}));
const __VLS_15 = __VLS_14({
    prop: "username",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
const { default: __VLS_17 } = __VLS_16.slots;
const __VLS_18 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
    modelValue: (__VLS_ctx.loginForm.username),
    placeholder: "用户名",
    prefixIcon: (__VLS_ctx.User),
    size: "large",
}));
const __VLS_20 = __VLS_19({
    modelValue: (__VLS_ctx.loginForm.username),
    placeholder: "用户名",
    prefixIcon: (__VLS_ctx.User),
    size: "large",
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
// @ts-ignore
[loginForm, User,];
var __VLS_16;
const __VLS_23 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    prop: "password",
}));
const __VLS_25 = __VLS_24({
    prop: "password",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
const { default: __VLS_27 } = __VLS_26.slots;
const __VLS_28 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    modelValue: (__VLS_ctx.loginForm.password),
    type: "password",
    placeholder: "密码",
    prefixIcon: (__VLS_ctx.Lock),
    size: "large",
    showPassword: true,
}));
const __VLS_30 = __VLS_29({
    modelValue: (__VLS_ctx.loginForm.password),
    type: "password",
    placeholder: "密码",
    prefixIcon: (__VLS_ctx.Lock),
    size: "large",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
// @ts-ignore
[loginForm, Lock,];
var __VLS_26;
const __VLS_33 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
    prop: "publicKey",
}));
const __VLS_35 = __VLS_34({
    prop: "publicKey",
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
const { default: __VLS_37 } = __VLS_36.slots;
const __VLS_38 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({
    modelValue: (__VLS_ctx.loginForm.publicKey),
    placeholder: "公钥",
    prefixIcon: (__VLS_ctx.Key),
    size: "large",
}));
const __VLS_40 = __VLS_39({
    modelValue: (__VLS_ctx.loginForm.publicKey),
    placeholder: "公钥",
    prefixIcon: (__VLS_ctx.Key),
    size: "large",
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
// @ts-ignore
[loginForm, Key,];
var __VLS_36;
const __VLS_43 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
    ...{ 'onClick': {} },
    type: "primary",
    size: "large",
    loading: (__VLS_ctx.loading),
    ...{ style: {} },
}));
const __VLS_45 = __VLS_44({
    ...{ 'onClick': {} },
    type: "primary",
    size: "large",
    loading: (__VLS_ctx.loading),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
let __VLS_47;
let __VLS_48;
const __VLS_49 = ({ click: {} },
    { onClick: (__VLS_ctx.handleLogin) });
const { default: __VLS_50 } = __VLS_46.slots;
// @ts-ignore
[loading, handleLogin,];
var __VLS_46;
var __VLS_9;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "login-footer" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
const __VLS_51 = {}.ElLink;
/** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
// @ts-ignore
ElLink;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_53 = __VLS_52({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
let __VLS_55;
let __VLS_56;
const __VLS_57 = ({ click: {} },
    { onClick: (...[$event]) => {
            __VLS_ctx.showRegister = true;
            // @ts-ignore
            [showRegister,];
        } });
const { default: __VLS_58 } = __VLS_54.slots;
var __VLS_54;
var __VLS_3;
const __VLS_59 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
ElDialog;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
    modelValue: (__VLS_ctx.showRegister),
    title: "用户注册",
    width: "500px",
}));
const __VLS_61 = __VLS_60({
    modelValue: (__VLS_ctx.showRegister),
    title: "用户注册",
    width: "500px",
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
const { default: __VLS_63 } = __VLS_62.slots;
// @ts-ignore
[showRegister,];
/** @type {[typeof RegisterForm, ]} */ ;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent(RegisterForm, new RegisterForm({
    ...{ 'onSuccess': {} },
    ...{ 'onCancel': {} },
}));
const __VLS_65 = __VLS_64({
    ...{ 'onSuccess': {} },
    ...{ 'onCancel': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
let __VLS_67;
let __VLS_68;
const __VLS_69 = ({ success: {} },
    { onSuccess: (__VLS_ctx.handleRegisterSuccess) });
const __VLS_70 = ({ cancel: {} },
    { onCancel: (...[$event]) => {
            __VLS_ctx.showRegister = false;
            // @ts-ignore
            [showRegister, handleRegisterSuccess,];
        } });
var __VLS_66;
var __VLS_62;
/** @type {__VLS_StyleScopedClasses['login-container']} */ ;
/** @type {__VLS_StyleScopedClasses['login-card']} */ ;
/** @type {__VLS_StyleScopedClasses['login-header']} */ ;
/** @type {__VLS_StyleScopedClasses['login-footer']} */ ;
// @ts-ignore
var __VLS_11 = __VLS_10;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
