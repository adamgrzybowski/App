import {NavigationState, PartialState} from '@react-navigation/native';
import CONST from '@src/CONST';
import SCREENS from '@src/SCREENS';
import getTopmostCentralPaneName from './getTopmostCentralPaneName';
import {BottomTabName, CentralPaneName} from './types';

function getMatchingTabNameForState(state: NavigationState | PartialState<NavigationState>): BottomTabName {
    const currentTopCentralPaneName = getTopmostCentralPaneName(state);

    if (currentTopCentralPaneName === undefined) {
        return SCREENS.HOME;
    }

    for (const tabName in CONST.TAB_TO_CENTRAL_PANE_MAPPING) {
        if ((CONST.TAB_TO_CENTRAL_PANE_MAPPING[tabName as BottomTabName] as readonly CentralPaneName[]).includes(currentTopCentralPaneName)) {
            return tabName as BottomTabName;
        }
    }

    return SCREENS.HOME;
}

export default getMatchingTabNameForState;
