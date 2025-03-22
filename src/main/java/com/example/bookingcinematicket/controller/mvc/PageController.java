package com.example.bookingcinematicket.controller.mvc;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    // Dashboards
    @GetMapping("/")
    public String getDashboardsPage() {
        return "index"; // Analytics page
    }

    // Layouts
    @GetMapping("/layouts")
    public String getLayoutsPage() {
        return "layouts-without-menu";
    }

    @GetMapping("/layouts-without-navbar")
    public String getLayoutsWithoutNavbarPage() {
        return "layouts-without-navbar";
    }

    @GetMapping("/layouts-container")
    public String getLayoutsContainerPage() {
        return "layouts-container";
    }

    @GetMapping("/layouts-fluid")
    public String getLayoutsFluidPage() {
        return "layouts-fluid";
    }

    @GetMapping("/layouts-blank")
    public String getLayoutsBlankPage() {
        return "layouts-blank";
    }

    // Account Settings
    @GetMapping("/account-settings-account")
    public String getAccountSettingsPage() {
        return "pages-account-settings-account";
    }

    @GetMapping("/account-settings-notifications")
    public String getAccountSettingsNotificationsPage() {
        return "pages-account-settings-notifications";
    }

    @GetMapping("/account-settings-connections")
    public String getAccountSettingsConnectionsPage() {
        return "pages-account-settings-connections";
    }

    // Misc
    @GetMapping("/forbidden")
    public String getErrorPage() {
        return "pages-misc-error";
    }

    @GetMapping("/not-found")
    public String getErrorNotFoundPage() {
        return "not-found-error";
    }

    @GetMapping("/pages-misc-under-maintenance")
    public String getUnderMaintenancePage() {
        return "pages-misc-under-maintenance";
    }

    // Components
    @GetMapping("/cards-basic")
    public String getCardsPage() {
        return "cards-basic";
    }

    // User Interface
    @GetMapping("/ui-accordion")
    public String getAccordionPage() {
        return "ui-accordion";
    }

    @GetMapping("/ui-alerts")
    public String getAlertsPage() {
        return "ui-alerts";
    }

    @GetMapping("/ui-badges")
    public String getBadgesPage() {
        return "ui-badges";
    }

    @GetMapping("/ui-buttons")
    public String getButtonsPage() {
        return "ui-buttons";
    }

    @GetMapping("/ui-carousel")
    public String getCarouselPage() {
        return "ui-carousel";
    }

    @GetMapping("/ui-collapse")
    public String getCollapsePage() {
        return "ui-collapse";
    }

    @GetMapping("/ui-dropdowns")
    public String getDropdownsPage() {
        return "ui-dropdowns";
    }

    @GetMapping("/ui-footer")
    public String getFooterPage() {
        return "ui-footer";
    }

    @GetMapping("/ui-list-groups")
    public String getListGroupsPage() {
        return "ui-list-groups";
    }

    @GetMapping("/ui-modals")
    public String getModalsPage() {
        return "ui-modals";
    }

    @GetMapping("/ui-navbar")
    public String getNavbarPage() {
        return "ui-navbar";
    }

    @GetMapping("/ui-offcanvas")
    public String getOffcanvasPage() {
        return "ui-offcanvas";
    }

    @GetMapping("/ui-pagination-breadcrumbs")
    public String getPaginationBreadcrumbsPage() {
        return "ui-pagination-breadcrumbs";
    }

    @GetMapping("/ui-progress")
    public String getProgressPage() {
        return "ui-progress";
    }

    @GetMapping("/ui-spinners")
    public String getSpinnersPage() {
        return "ui-spinners";
    }

    @GetMapping("/ui-tabs-pills")
    public String getTabsPillsPage() {
        return "ui-tabs-pills";
    }

    @GetMapping("/ui-toasts")
    public String getToastsPage() {
        return "ui-toasts";
    }

    @GetMapping("/ui-tooltips-popovers")
    public String getTooltipsPopoversPage() {
        return "ui-tooltips-popovers";
    }

    @GetMapping("/ui-typography")
    public String getTypographyPage() {
        return "ui-typography";
    }

    // Extended UI
    @GetMapping("/extended-ui-perfect-scrollbar")
    public String getPerfectScrollbarPage() {
        return "extended-ui-perfect-scrollbar";
    }

    @GetMapping("/extended-ui-text-divider")
    public String getTextDividerPage() {
        return "extended-ui-text-divider";
    }

    // Icons
    @GetMapping("/icons-ri")
    public String getIconsPage() {
        return "icons-ri";
    }

    // Forms & Tables
    @GetMapping("/forms-basic-inputs")
    public String getFormsBasicInputsPage() {
        return "forms-basic-inputs";
    }

    @GetMapping("/forms-input-groups")
    public String getFormsInputGroupsPage() {
        return "forms-input-groups";
    }

    @GetMapping("/form-layouts-vertical")
    public String getFormLayoutsVerticalPage() {
        return "form-layouts-vertical";
    }

    @GetMapping("/form-layouts-horizontal")
    public String getFormLayoutsHorizontalPage() {
        return "form-layouts-horizontal";
    }

    @GetMapping("/tables-basic")
    public String getTablesBasicPage() {
        return "tables-basic";
    }

    // Misc (Support & Documentation)
    @GetMapping("/support")
    public String getSupportPage() {
        return "https://github.com/themeselection/materio-bootstrap-html-admin-template-free/issues";
    }

    @GetMapping("/documentation")
    public String getDocumentationPage() {
        return "https://demos.themeselection.com/materio-bootstrap-html-admin-template/documentation/";
    }
}
