const arr = [
    {
        isHeader: false,
        text: "Thống kê",
        icon: "ri-home-smile-line",
        href: "/",
        badge: { text: "5", color: "danger" },
    },
    {
        isHeader: false,
        text: "Quản lý chi nhánh",
        icon: "ri-map-pin-2-line",
        href: "/branch-management",
        badge: { text: "5", color: "danger" },
    },
    {
        isHeader: false,
        text: "Quản lý người dùng",
        icon: "ri-user-line",
        href: "/account-management",
        badge: { text: "5", color: "danger" },
    },
    {
        isHeader: false,
        text: "Quản lý phòng chiếu",
        icon: "ri-vidicon-line",
        href: "/room-management",
        badge: { text: "5", color: "danger" },
    },
    {
        isHeader: false,
        text: "Quản lý loại ghế",
        icon: "ri-sofa-line",
        href: "/seat-type-management",
        badge: { text: "5", color: "danger" },
    },
    {
        isHeader: false,
        text: "Quản lý đồ ăn",
        icon: "ri-cake-3-line",
        href: "/food-management",
        badge: { text: "5", color: "danger" },
    },
    {
        isHeader: false,
        text: "Quản lý khuyến mãi",
        icon: "ri-discount-percent-line",
        href: "/promotion-management",
        badge: { text: "5", color: "danger" },
    },
    {
        isHeader: false,
        text: "Quản lý vai trò bộ phim",
        icon: "ri-medal-line",
        href: "/role-management",
        badge: { text: "5", color: "danger" },
    },
    {
        isHeader: false,
        text: "Quản lý diễn viên",
        icon: "ri-user-line",
        href: "/person-management",
        badge: { text: "5", color: "danger" },
    },
    {
        isHeader: false,
        text: "Quản lý phim",
        icon: "ri-movie-2-line",
        href: "/movie-management",
        badge: { text: "5", color: "danger" },
    },
    {
        isHeader: false,
        text: "Layouts",
        icon: "layout-2",
        href: "javascript:void(0);",
        subItem: [
            { text: "Without menu", href: "layouts-without-menu" },
            { text: "Without navbar", href: "layouts-without-navbar" },
            { text: "Container", href: "layouts-container" },
            { text: "Fluid", href: "layouts-fluid" },
            { text: "Blank", href: "layouts-blank" }
        ]
    },
    {
        isHeader: true,
        text: "Apps & Pages"
    },
    {
        isHeader: false,
        text: "Account Settings",
        icon: "layout-left",
        href: "javascript:void(0);",
        subItem: [
            { text: "Account", href: "pages-account-settings-account" },
            { text: "Notifications", href: "pages-account-settings-notifications" },
            { text: "Connections", href: "pages-account-settings-connections" }
        ]
    },
    {
        isHeader: false,
        text: "Authentications",
        icon: "shield-keyhole",
        href: "javascript:void(0);",
        subItem: [
            { text: "Login", href: "/auth/login" },
            { text: "Register", href: "/auth/register"},
            { text: "Forgot Password", href: "auth-forgot-password-basic", target: "_blank" }
        ]
    },
    {
        isHeader: false,
        text: "Misc",
        icon: "box-3",
        href: "javascript:void(0);",
        subItem: [
            { text: "Error", href: "pages-misc-error", target: "_blank" },
            { text: "Under Maintenance", href: "pages-misc-under-maintenance", target: "_blank" }
        ]
    },
    {
        isHeader: true,
        text: "Components"
    },
    {
        isHeader: false,
        text: "Cards",
        icon: "bank-card-2",
        href: "cards-basic"
    },
    {
        isHeader: false,
        text: "User interface",
        icon: "toggle-line",
        href: "javascript:void(0);",
        subItem: [
            { text: "Accordion", href: "ui-accordion" },
            { text: "Alerts", href: "ui-alerts" },
            { text: "Badges", href: "ui-badges" },
            { text: "Buttons", href: "ui-buttons" },
            { text: "Carousel", href: "ui-carousel" },
            { text: "Collapse", href: "ui-collapse" },
            { text: "Dropdowns", href: "ui-dropdowns" },
            { text: "Footer", href: "ui-footer" },
            { text: "List Groups", href: "ui-list-groups" },
            { text: "Modals", href: "ui-modals" },
            { text: "Navbar", href: "ui-navbar" },
            { text: "Offcanvas", href: "ui-offcanvas" },
            { text: "Pagination & Breadcrumbs", href: "ui-pagination-breadcrumbs" },
            { text: "Progress", href: "ui-progress" },
            { text: "Spinners", href: "ui-spinners" },
            { text: "Tabs & Pills", href: "ui-tabs-pills" },
            { text: "Toasts", href: "ui-toasts" },
            { text: "Tooltips & Popovers", href: "ui-tooltips-popovers" },
            { text: "Typography", href: "ui-typography" }
        ]
    },
    {
        isHeader: false,
        text: "Extended UI",
        icon: "box-3",
        href: "javascript:void(0);",
        subItem: [
            { text: "Perfect Scrollbar", href: "extended-ui-perfect-scrollbar" },
            { text: "Text Divider", href: "extended-ui-text-divider" }
        ]
    },
    {
        isHeader: false,
        text: "Icons",
        icon: "remixicon-line",
        href: "icons-ri"
    },
    {
        isHeader: true,
        text: "Forms & Tables"
    },
    {
        isHeader: false,
        text: "Form Elements",
        icon: "radio-button",
        href: "javascript:void(0);",
        subItem: [
            { text: "Basic Inputs", href: "forms-basic-inputs" },
            { text: "Input groups", href: "forms-input-groups" }
        ]
    },
    {
        isHeader: false,
        text: "Form Layouts",
        icon: "box-3",
        href: "javascript:void(0);",
        subItem: [
            { text: "Vertical Form", href: "form-layouts-vertical" },
            { text: "Horizontal Form", href: "form-layouts-horizontal" }
        ]
    },
    {
        isHeader: false,
        text: "Tables",
        icon: "table-alt",
        href: "tables-basic",
        subItem: [
            { text: "Basic Tables", href: "tables-basic" },
        ]
    },
];
