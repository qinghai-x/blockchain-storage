/// <reference types="D:/测试/node_modules/.vue-global-types/vue_3.5_0.d.ts" />
const summaryCards = [
    { icon: '💾', title: '总存储量', value: '1280 TB', description: '较昨日 +3.6%', gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)' },
    { icon: '📂', title: '文件总数', value: '56,240', description: '较昨日 +820', gradient: 'linear-gradient(135deg,#ec4899,#f97316)' },
    { icon: '🌐', title: '在线节点', value: '48', description: '全球分布 12 个区域', gradient: 'linear-gradient(135deg,#10b981,#34d399)' },
    { icon: '⏱️', title: '平均延迟', value: '42 ms', description: '同比下降 12%', gradient: 'linear-gradient(135deg,#0ea5e9,#38bdf8)' }
];
const nodeList = [
    { name: '节点-北京-01', region: '华北一区', status: '在线', storage: '32 TB / 64 TB', bandwidth: '52%', uptime: '186 天' },
    { name: '节点-上海-02', region: '华东一区', status: '在线', storage: '48 TB / 80 TB', bandwidth: '61%', uptime: '132 天' },
    { name: '节点-广州-05', region: '华南一区', status: '在线', storage: '40 TB / 64 TB', bandwidth: '47%', uptime: '205 天' },
    { name: '节点-法兰克福-01', region: '欧洲节点', status: '在线', storage: '28 TB / 64 TB', bandwidth: '55%', uptime: '98 天' }
];
const alarms = [
    { type: 'primary', time: '2025-05-12 10:32', content: '上海区域节点带宽使用率达到 80%，已自动扩容带宽资源。' },
    { type: 'warning', time: '2025-05-11 21:45', content: '检测到节点-东京-03 网络波动，已自动切换至备用线路。' },
    { type: 'danger', time: '2025-05-10 08:12', content: '节点-成都-02 存储占用超过 90%，请尽快进行扩容。' }
];
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "management-view" },
});
const __VLS_0 = {}.ElPageHeader;
/** @type {[typeof __VLS_components.ElPageHeader, typeof __VLS_components.elPageHeader, ]} */ ;
// @ts-ignore
ElPageHeader;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    content: "数据管理中心",
    ...{ class: "page-header" },
}));
const __VLS_2 = __VLS_1({
    content: "数据管理中心",
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
for (const [card] of __VLS_getVForSourceType((__VLS_ctx.summaryCards))) {
    // @ts-ignore
    [summaryCards,];
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
const __VLS_26 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
ElTable;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
    data: (__VLS_ctx.nodeList),
    border: true,
}));
const __VLS_28 = __VLS_27({
    data: (__VLS_ctx.nodeList),
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
const { default: __VLS_30 } = __VLS_29.slots;
// @ts-ignore
[nodeList,];
const __VLS_31 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
    prop: "name",
    label: "节点名称",
    minWidth: "140",
}));
const __VLS_33 = __VLS_32({
    prop: "name",
    label: "节点名称",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
const __VLS_36 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    prop: "region",
    label: "所属区域",
    minWidth: "120",
}));
const __VLS_38 = __VLS_37({
    prop: "region",
    label: "所属区域",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const __VLS_41 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
    prop: "status",
    label: "状态",
    width: "120",
}));
const __VLS_43 = __VLS_42({
    prop: "status",
    label: "状态",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
const { default: __VLS_45 } = __VLS_44.slots;
{
    const { default: __VLS_46 } = __VLS_44.slots;
    const [{ row }] = __VLS_getSlotParameters(__VLS_46);
    const __VLS_47 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    ElTag;
    // @ts-ignore
    const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
        type: (row.status === '在线' ? 'success' : 'danger'),
    }));
    const __VLS_49 = __VLS_48({
        type: (row.status === '在线' ? 'success' : 'danger'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_48));
    const { default: __VLS_51 } = __VLS_50.slots;
    (row.status);
    var __VLS_50;
}
var __VLS_44;
const __VLS_52 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    prop: "storage",
    label: "存储占用",
    minWidth: "140",
}));
const __VLS_54 = __VLS_53({
    prop: "storage",
    label: "存储占用",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_57 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
    prop: "bandwidth",
    label: "带宽负载",
    minWidth: "140",
}));
const __VLS_59 = __VLS_58({
    prop: "bandwidth",
    label: "带宽负载",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
const __VLS_62 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({
    prop: "uptime",
    label: "在线时长",
    minWidth: "140",
}));
const __VLS_64 = __VLS_63({
    prop: "uptime",
    label: "在线时长",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
var __VLS_29;
var __VLS_23;
const __VLS_67 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
ElCard;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
    ...{ class: "section-card" },
    shadow: "hover",
}));
const __VLS_69 = __VLS_68({
    ...{ class: "section-card" },
    shadow: "hover",
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
const { default: __VLS_71 } = __VLS_70.slots;
{
    const { header: __VLS_72 } = __VLS_70.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "card-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
}
const __VLS_73 = {}.ElTimeline;
/** @type {[typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, ]} */ ;
// @ts-ignore
ElTimeline;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({}));
const __VLS_75 = __VLS_74({}, ...__VLS_functionalComponentArgsRest(__VLS_74));
const { default: __VLS_77 } = __VLS_76.slots;
for (const [alarm, index] of __VLS_getVForSourceType((__VLS_ctx.alarms))) {
    // @ts-ignore
    [alarms,];
    const __VLS_78 = {}.ElTimelineItem;
    /** @type {[typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, ]} */ ;
    // @ts-ignore
    ElTimelineItem;
    // @ts-ignore
    const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
        key: (index),
        type: (alarm.type),
        timestamp: (alarm.time),
    }));
    const __VLS_80 = __VLS_79({
        key: (index),
        type: (alarm.type),
        timestamp: (alarm.time),
    }, ...__VLS_functionalComponentArgsRest(__VLS_79));
    const { default: __VLS_82 } = __VLS_81.slots;
    (alarm.content);
    var __VLS_81;
}
var __VLS_76;
var __VLS_70;
/** @type {__VLS_StyleScopedClasses['management-view']} */ ;
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
/** @type {__VLS_StyleScopedClasses['section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
