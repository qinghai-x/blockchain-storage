/// <reference types="D:/测试/node_modules/.vue-global-types/vue_3.5_0.d.ts" />
const securityCards = [
    { icon: '🔒', title: '加密级别', value: 'AES-256 + ZKP', description: '双层加密保护数据安全', gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)' },
    { icon: '🛡️', title: '安全事件', value: '0', description: '近 90 天未发生安全事件', gradient: 'linear-gradient(135deg,#0ea5e9,#38bdf8)' },
    { icon: '🔍', title: '异常检测', value: '132', description: '已自动拦截可疑请求', gradient: 'linear-gradient(135deg,#f59e0b,#f97316)' },
    { icon: '📜', title: '合规认证', value: '5 项', description: '通过等保/ISO/隐私保护认证', gradient: 'linear-gradient(135deg,#10b981,#34d399)' }
];
const securityPolicies = [
    {
        title: '数据安全策略',
        items: ['全链路 TLS1.3 加密传输', '多副本容灾备份机制', '零知识证明隐私保护', '基于区块链的操作审计']
    },
    {
        title: '访问控制策略',
        items: ['基于角色的权限模型（RBAC）', '多因素认证 (MFA)', '行为特征异常检测', '操作审批与追踪']
    }
];
const auditLogs = [
    { time: '2025-05-12 09:20', type: 'primary', content: '区块链审计：用户 Alice 成功上传文件，并生成链上记录 TX#0x8321ABF。' },
    { time: '2025-05-11 18:03', type: 'success', content: '安全策略：节点-上海-02 完成每日一次的安全基线检查。' },
    { time: '2025-05-10 23:41', type: 'warning', content: '告警：外部 IP 61.XX.XX.12 多次尝试登录被自动阻断。' }
];
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['policy-card']} */ ;
/** @type {__VLS_StyleScopedClasses['policy-card']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "security-view" },
});
const __VLS_0 = {}.ElPageHeader;
/** @type {[typeof __VLS_components.ElPageHeader, typeof __VLS_components.elPageHeader, ]} */ ;
// @ts-ignore
ElPageHeader;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    content: "安全中心",
    ...{ class: "page-header" },
}));
const __VLS_2 = __VLS_1({
    content: "安全中心",
    ...{ class: "page-header" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const __VLS_5 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
ElRow;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    gutter: (20),
    ...{ class: "stats-row" },
}));
const __VLS_7 = __VLS_6({
    gutter: (20),
    ...{ class: "stats-row" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
const { default: __VLS_9 } = __VLS_8.slots;
for (const [card] of __VLS_getVForSourceType((__VLS_ctx.securityCards))) {
    // @ts-ignore
    [securityCards,];
    const __VLS_10 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    ElCol;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
        xs: (24),
        sm: (12),
        lg: (6),
        key: (card.title),
    }));
    const __VLS_12 = __VLS_11({
        xs: (24),
        sm: (12),
        lg: (6),
        key: (card.title),
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    const { default: __VLS_14 } = __VLS_13.slots;
    const __VLS_15 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    ElCard;
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
        shadow: "hover",
        ...{ class: "summary-card" },
    }));
    const __VLS_17 = __VLS_16({
        shadow: "hover",
        ...{ class: "summary-card" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    const { default: __VLS_19 } = __VLS_18.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "card-icon" },
        ...{ style: ({ background: card.gradient }) },
    });
    (card.icon);
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "card-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "card-title" },
    });
    (card.title);
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "card-value" },
    });
    (card.value);
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "card-desc" },
    });
    (card.description);
    var __VLS_18;
    var __VLS_13;
}
var __VLS_8;
const __VLS_20 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
ElCard;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    ...{ class: "section-card" },
    shadow: "hover",
}));
const __VLS_22 = __VLS_21({
    ...{ class: "section-card" },
    shadow: "hover",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const { default: __VLS_24 } = __VLS_23.slots;
{
    const { header: __VLS_25 } = __VLS_23.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "card-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
}
const __VLS_26 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
ElRow;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
    gutter: (20),
}));
const __VLS_28 = __VLS_27({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
const { default: __VLS_30 } = __VLS_29.slots;
for (const [policy] of __VLS_getVForSourceType((__VLS_ctx.securityPolicies))) {
    // @ts-ignore
    [securityPolicies,];
    const __VLS_31 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    ElCol;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
        xs: (24),
        lg: (12),
        key: (policy.title),
    }));
    const __VLS_33 = __VLS_32({
        xs: (24),
        lg: (12),
        key: (policy.title),
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    const { default: __VLS_35 } = __VLS_34.slots;
    const __VLS_36 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    ElCard;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        ...{ class: "policy-card" },
    }));
    const __VLS_38 = __VLS_37({
        ...{ class: "policy-card" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    const { default: __VLS_40 } = __VLS_39.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({});
    (policy.title);
    __VLS_asFunctionalElement(__VLS_intrinsics.ul, __VLS_intrinsics.ul)({});
    for (const [item] of __VLS_getVForSourceType((policy.items))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.li, __VLS_intrinsics.li)({
            key: (item),
        });
        (item);
    }
    var __VLS_39;
    var __VLS_34;
}
var __VLS_29;
var __VLS_23;
const __VLS_41 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
ElCard;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
    ...{ class: "section-card" },
    shadow: "hover",
}));
const __VLS_43 = __VLS_42({
    ...{ class: "section-card" },
    shadow: "hover",
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
const { default: __VLS_45 } = __VLS_44.slots;
{
    const { header: __VLS_46 } = __VLS_44.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "card-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
}
const __VLS_47 = {}.ElTimeline;
/** @type {[typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, ]} */ ;
// @ts-ignore
ElTimeline;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({}));
const __VLS_49 = __VLS_48({}, ...__VLS_functionalComponentArgsRest(__VLS_48));
const { default: __VLS_51 } = __VLS_50.slots;
for (const [log, index] of __VLS_getVForSourceType((__VLS_ctx.auditLogs))) {
    // @ts-ignore
    [auditLogs,];
    const __VLS_52 = {}.ElTimelineItem;
    /** @type {[typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, ]} */ ;
    // @ts-ignore
    ElTimelineItem;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        key: (index),
        timestamp: (log.time),
        type: (log.type),
    }));
    const __VLS_54 = __VLS_53({
        key: (index),
        timestamp: (log.time),
        type: (log.type),
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    const { default: __VLS_56 } = __VLS_55.slots;
    (log.content);
    var __VLS_55;
}
var __VLS_50;
var __VLS_44;
/** @type {__VLS_StyleScopedClasses['security-view']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['stats-row']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['card-content']} */ ;
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['card-value']} */ ;
/** @type {__VLS_StyleScopedClasses['card-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['policy-card']} */ ;
/** @type {__VLS_StyleScopedClasses['section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
