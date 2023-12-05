import lodashFindLast from 'lodash/findLast';
import lodashGet from 'lodash/get';

// Get the name of topmost report in the navigation stack.
function getTopmostCentralPaneName(state) {
    if (!state) {
        return;
    }
    const topmostCentralPane = lodashFindLast(state.routes, (route) => route.name === 'CentralPaneNavigator');

    if (!topmostCentralPane) {
        return;
    }

    const directScreenParam = lodashGet(topmostCentralPane, 'params.screen');

    if (!topmostCentralPane.state && !directScreenParam) {
        return;
    }

    if (directScreenParam) {
        return directScreenParam;
    }

    return topmostCentralPane.state.routes.at(-1).name;
}

export default getTopmostCentralPaneName;
