import {NavigationState, PartialState} from '@react-navigation/native';
import CONST from '@src/CONST';
import getTabName from './getTabName';
import {CentralPaneName} from './types';

function getMatchingCentralPaneNameForState(state: NavigationState | PartialState<NavigationState>): CentralPaneName {
    const currentTabName = getTabName(state);

    return CONST.TAB_TO_CENTRAL_PANE_MAPPING[currentTabName][0];
}

export default getMatchingCentralPaneNameForState;
