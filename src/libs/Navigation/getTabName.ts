import {BottomTabName, State} from './types';

function getTabName(state: State): BottomTabName {
    // TODO-IDEAL better type safety
    const tabName = state.routes[0]?.state?.routes?.at(-1)?.name as BottomTabName;

    return tabName;
}

export default getTabName;
