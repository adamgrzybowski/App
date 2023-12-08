import NAVIGATORS from '@src/NAVIGATORS';
import {CentralPaneName, State} from './types';

// Get the name of topmost report in the navigation stack.
function getTopmostCentralPaneName(state: State): CentralPaneName | undefined {
    if (!state) {
        return;
    }

    const topmostCentralPane = state.routes.filter((route) => route.name === NAVIGATORS.CENTRAL_PANE_NAVIGATOR).at(-1);

    if (!topmostCentralPane) {
        return;
    }

    if (!!topmostCentralPane.params && 'screen' in topmostCentralPane.params && !!topmostCentralPane.params.screen) {
        return topmostCentralPane.params.screen as CentralPaneName;
    }

    return topmostCentralPane.state?.routes.at(-1)?.name as CentralPaneName;
}

export default getTopmostCentralPaneName;
