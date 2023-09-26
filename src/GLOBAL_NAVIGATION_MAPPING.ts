import CONST from './CONST';
import SCREENS from './SCREENS';

export default {
    [CONST.GLOBAL_NAVIGATION_OPTION.HOME]: [SCREENS.HOME_OD],
    [CONST.GLOBAL_NAVIGATION_OPTION.CHATS]: [SCREENS.REPORT],
    [CONST.GLOBAL_NAVIGATION_OPTION.SPEND]: [SCREENS.EXPENSES_OD, SCREENS.REPORTS_OD, SCREENS.INSIGHTS_OD],
    [CONST.GLOBAL_NAVIGATION_OPTION.WORKSPACES]: [SCREENS.INDIVIDUALS_OD, SCREENS.GROUPS_OD, SCREENS.CARDS_AND_DOMAINS_OD],
} as const;
