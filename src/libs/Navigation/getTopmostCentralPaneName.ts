import {NavigationState, PartialState} from '@react-navigation/native';
import NAVIGATORS from '@src/NAVIGATORS';
import {CentralPaneName} from './types';

// Get the name of topmost report in the navigation stack.
function getTopmostCentralPaneName(state: NavigationState | PartialState<NavigationState>): CentralPaneName | undefined {
    if (!state) {
        return;
    }

    const topmostCentralPane = state.routes.filter((route) => typeof route !== 'number' && 'name' in route && route.name === NAVIGATORS.CENTRAL_PANE_NAVIGATOR).at(-1);

    if (!topmostCentralPane || typeof topmostCentralPane === 'number' || !('state' in topmostCentralPane)) {
        return;
    }

    if ('params' in topmostCentralPane && !!topmostCentralPane.params && 'screen' in topmostCentralPane.params && !!topmostCentralPane.params.screen) {
        return topmostCentralPane.params.screen as CentralPaneName;
    }

    return topmostCentralPane.state?.routes.at(-1)?.name as CentralPaneName;
}

export default getTopmostCentralPaneName;
