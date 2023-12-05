import {NavigationState, PartialState} from '@react-navigation/native';
import {BottomTabName} from './types';

function getTabName(state: NavigationState | PartialState<NavigationState>): BottomTabName {
    // TODO-IDEAL better type safety
    const tabName = state.routes[0]?.state?.routes?.at(-1)?.name as BottomTabName;

    return tabName;
}

export default getTabName;
