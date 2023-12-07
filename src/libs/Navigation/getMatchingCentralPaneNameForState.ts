import CONST from '@src/CONST';
import getTabName from './getTabName';
import {CentralPaneName, State} from './types';

function getMatchingCentralPaneNameForState(state: State): CentralPaneName {
    const currentTabName = getTabName(state);

    return CONST.TAB_TO_CENTRAL_PANE_MAPPING[currentTabName][0];
}

export default getMatchingCentralPaneNameForState;
