import CONST from './CONST';
import SCREENS from './SCREENS';

export default {
    [CONST.SUB_NAVIGATION_MENU.HOME]: [SCREENS.HOME_OLDDOT],
    [CONST.SUB_NAVIGATION_MENU.CHATS]: [SCREENS.REPORT],
    [CONST.SUB_NAVIGATION_MENU.MONEY]: [SCREENS.EXPENSES_OLDDOT, SCREENS.REPORTS_OLDDOT, SCREENS.INSIGHTS_OLDDOT],
    [CONST.SUB_NAVIGATION_MENU.WORKSPACES]: [SCREENS.INDIVIDUAL_WORKSPACE_OLDDOT, SCREENS.GROUPS_WORKSPACES_OLDDOT, SCREENS.DOMAINS_OLDDOT],
    // Breadcrumbs menus
    [CONST.SUB_NAVIGATION_MENU.WORKSPACE_NESTED]: [
        SCREENS.WORKSPACE_OVERVIEW_OLDDOT,
        SCREENS.WORKSPACE_EXPENSES_OLDDOT,
        SCREENS.WORKSPACE_REPORTS_OLDDOT,
        SCREENS.WORKSPACE_CONNECTIONS_OLDDOT,
        SCREENS.WORKSPACE_CATEGORIES_OLDDOT,
        SCREENS.WORKSPACE_TAGS_OLDDOT,
        SCREENS.WORKSPACE_TAX_OLDDOT,
        SCREENS.WORKSPACE_MEMBERS_OLDDOT,
        SCREENS.WORKSPACE_REIMBURSEMENT_OLDDOT,
        SCREENS.WORKSPACE_TRAVEL_OLDDOT,
        SCREENS.WORKSPACE_PER_DIEM_OLDDOT,
        SCREENS.WORKSPACE_EXPORT_FORMATS_OLDDOT,
        SCREENS.WORKSPACE_INVOICES_OLDDOT,
        SCREENS.WORKSPACE_PLAN_OLDDOT,
    ],
    [CONST.SUB_NAVIGATION_MENU.DOMAIN_NESTED]: [
        SCREENS.DOMAIN_COMPANY_CARDS_OLDDOT,
        SCREENS.DOMAIN_ADMINS_OLDDOT,
        SCREENS.DOMAIN_MEMBERS_OLDDOT,
        SCREENS.DOMAIN_GROUPS_OLDDOT,
        SCREENS.DOMAIN_REPORTING_TOOLS_OLDDOT,
        SCREENS.DOMAIN_SAML_OLDDOT,
    ],
} as const;
