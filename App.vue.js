/// <reference types="D:/测试/node_modules/.vue-global-types/vue_3.5_0.d.ts" />
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ArrowDown } from '@element-plus/icons-vue';
const route = useRoute();
const router = useRouter();
const defaultAvatar = 'https://api.dicebear.com/7.x/identicon/svg?seed=guest';
const userInfo = ref({
    username: '访客',
    avatar: defaultAvatar,
    role: ''
});
const token = ref('');
const activeMenu = computed(() => route.path);
const isAuthenticated = computed(() => Boolean(token.value));
const refreshUserInfo = () => {
    const storedUserInfo = localStorage.getItem('userInfo');
    const storedToken = localStorage.getItem('token') || '';
    token.value = storedToken;
    if (storedUserInfo && storedToken) {
        try {
            const parsed = JSON.parse(storedUserInfo);
            userInfo.value = {
                username: parsed.username || '未命名用户',
                avatar: parsed.avatar || defaultAvatar,
                role: parsed.role || ''
            };
        }
        catch (error) {
            console.warn('解析用户信息失败', error);
            userInfo.value = {
                username: '访客',
                avatar: defaultAvatar,
                role: ''
            };
        }
    }
    else {
        userInfo.value = {
            username: '访客',
            avatar: defaultAvatar,
            role: ''
        };
    }
};
onMounted(() => {
    refreshUserInfo();
    window.addEventListener('storage', refreshUserInfo);
    window.addEventListener('auth-change', refreshUserInfo);
});
onBeforeUnmount(() => {
    window.removeEventListener('storage', refreshUserInfo);
    window.removeEventListener('auth-change', refreshUserInfo);
});
watch(() => route.fullPath, () => {
    refreshUserInfo();
});
const handleCommand = async (command) => {
    if (command === 'logout') {
        try {
            await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
                type: 'warning'
            });
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            refreshUserInfo();
            ElMessage.success('已退出登录');
            router.push('/login');
        }
        catch {
            // 用户取消退出
        }
    }
    else if (command === 'profile') {
        // 跳转到个人信息页面
        ElMessage.info('个人信息功能开发中...');
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['user-dropdown']} */ ;
const __VLS_0 = {}.ElContainer;
/** @type {[typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, ]} */ ;
// @ts-ignore
ElContainer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "layout-container" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "layout-container" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
const { default: __VLS_5 } = __VLS_3.slots;
const __VLS_6 = {}.ElHeader;
/** @type {[typeof __VLS_components.ElHeader, typeof __VLS_components.elHeader, typeof __VLS_components.ElHeader, typeof __VLS_components.elHeader, ]} */ ;
// @ts-ignore
ElHeader;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
    ...{ class: "layout-header" },
}));
const __VLS_8 = __VLS_7({
    ...{ class: "layout-header" },
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_10 } = __VLS_9.slots;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "header-content" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "logo" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "nav-menu" },
});
const __VLS_11 = {}.ElMenu;
/** @type {[typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, ]} */ ;
// @ts-ignore
ElMenu;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
    mode: "horizontal",
    defaultActive: (__VLS_ctx.activeMenu),
    router: true,
}));
const __VLS_13 = __VLS_12({
    mode: "horizontal",
    defaultActive: (__VLS_ctx.activeMenu),
    router: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
const { default: __VLS_15 } = __VLS_14.slots;
// @ts-ignore
[activeMenu,];
const __VLS_16 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
ElMenuItem;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    index: "/",
}));
const __VLS_18 = __VLS_17({
    index: "/",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
const { default: __VLS_20 } = __VLS_19.slots;
var __VLS_19;
const __VLS_21 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
ElMenuItem;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    index: "/storage",
}));
const __VLS_23 = __VLS_22({
    index: "/storage",
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
const { default: __VLS_25 } = __VLS_24.slots;
var __VLS_24;
const __VLS_26 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
ElMenuItem;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
    index: "/management",
}));
const __VLS_28 = __VLS_27({
    index: "/management",
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
const { default: __VLS_30 } = __VLS_29.slots;
var __VLS_29;
const __VLS_31 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
ElMenuItem;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
    index: "/security",
}));
const __VLS_33 = __VLS_32({
    index: "/security",
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
const { default: __VLS_35 } = __VLS_34.slots;
var __VLS_34;
var __VLS_14;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "user-info" },
});
if (__VLS_ctx.isAuthenticated) {
    // @ts-ignore
    [isAuthenticated,];
    const __VLS_36 = {}.ElDropdown;
    /** @type {[typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, ]} */ ;
    // @ts-ignore
    ElDropdown;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        ...{ 'onCommand': {} },
    }));
    const __VLS_38 = __VLS_37({
        ...{ 'onCommand': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    let __VLS_40;
    let __VLS_41;
    const __VLS_42 = ({ command: {} },
        { onCommand: (__VLS_ctx.handleCommand) });
    const { default: __VLS_43 } = __VLS_39.slots;
    // @ts-ignore
    [handleCommand,];
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "user-dropdown" },
    });
    const __VLS_44 = {}.ElAvatar;
    /** @type {[typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, ]} */ ;
    // @ts-ignore
    ElAvatar;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        size: (32),
        src: (__VLS_ctx.userInfo.avatar),
    }));
    const __VLS_46 = __VLS_45({
        size: (32),
        src: (__VLS_ctx.userInfo.avatar),
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    // @ts-ignore
    [userInfo,];
    (__VLS_ctx.userInfo.username || '未命名用户');
    // @ts-ignore
    [userInfo,];
    const __VLS_49 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    ElIcon;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({}));
    const __VLS_51 = __VLS_50({}, ...__VLS_functionalComponentArgsRest(__VLS_50));
    const { default: __VLS_53 } = __VLS_52.slots;
    const __VLS_54 = {}.ArrowDown;
    /** @type {[typeof __VLS_components.ArrowDown, ]} */ ;
    // @ts-ignore
    ArrowDown;
    // @ts-ignore
    const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({}));
    const __VLS_56 = __VLS_55({}, ...__VLS_functionalComponentArgsRest(__VLS_55));
    var __VLS_52;
    {
        const { dropdown: __VLS_59 } = __VLS_39.slots;
        const __VLS_60 = {}.ElDropdownMenu;
        /** @type {[typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, ]} */ ;
        // @ts-ignore
        ElDropdownMenu;
        // @ts-ignore
        const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({}));
        const __VLS_62 = __VLS_61({}, ...__VLS_functionalComponentArgsRest(__VLS_61));
        const { default: __VLS_64 } = __VLS_63.slots;
        const __VLS_65 = {}.ElDropdownItem;
        /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
        // @ts-ignore
        ElDropdownItem;
        // @ts-ignore
        const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
            command: "profile",
        }));
        const __VLS_67 = __VLS_66({
            command: "profile",
        }, ...__VLS_functionalComponentArgsRest(__VLS_66));
        const { default: __VLS_69 } = __VLS_68.slots;
        var __VLS_68;
        const __VLS_70 = {}.ElDropdownItem;
        /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
        // @ts-ignore
        ElDropdownItem;
        // @ts-ignore
        const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({
            command: "logout",
            divided: true,
        }));
        const __VLS_72 = __VLS_71({
            command: "logout",
            divided: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_71));
        const { default: __VLS_74 } = __VLS_73.slots;
        var __VLS_73;
        var __VLS_63;
    }
    var __VLS_39;
}
else {
    const __VLS_75 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_77 = __VLS_76({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_76));
    let __VLS_79;
    let __VLS_80;
    const __VLS_81 = ({ click: {} },
        { onClick: (...[$event]) => {
                if (!!(__VLS_ctx.isAuthenticated))
                    return;
                __VLS_ctx.router.push('/login');
                // @ts-ignore
                [router,];
            } });
    const { default: __VLS_82 } = __VLS_78.slots;
    var __VLS_78;
}
var __VLS_9;
const __VLS_83 = {}.ElMain;
/** @type {[typeof __VLS_components.ElMain, typeof __VLS_components.elMain, typeof __VLS_components.ElMain, typeof __VLS_components.elMain, ]} */ ;
// @ts-ignore
ElMain;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
    ...{ class: "layout-main" },
}));
const __VLS_85 = __VLS_84({
    ...{ class: "layout-main" },
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
const { default: __VLS_87 } = __VLS_86.slots;
const __VLS_88 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
RouterView;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({}));
const __VLS_90 = __VLS_89({}, ...__VLS_functionalComponentArgsRest(__VLS_89));
var __VLS_86;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['layout-container']} */ ;
/** @type {__VLS_StyleScopedClasses['layout-header']} */ ;
/** @type {__VLS_StyleScopedClasses['header-content']} */ ;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['user-info']} */ ;
/** @type {__VLS_StyleScopedClasses['user-dropdown']} */ ;
/** @type {__VLS_StyleScopedClasses['layout-main']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
