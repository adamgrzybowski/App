import {StackRouter} from '@react-navigation/native';
import lodashFindLast from 'lodash/findLast';
import _ from 'underscore';
import getMatchingCentralPaneNameForState from '@libs/Navigation/getMatchingCentralPaneNameForState';
import getTabName from '@libs/Navigation/getTabName';
import NAVIGATORS from '@src/NAVIGATORS';
import SCREENS from '@src/SCREENS';

/**
 * @param {Object} state - react-navigation state
 * @returns {Boolean}
 */
const isAtLeastOneCentralPaneNavigatorInState = (state) => _.find(state.routes, (r) => r.name === NAVIGATORS.CENTRAL_PANE_NAVIGATOR);

/**
 * @param {Object} state - react-navigation state
 * @returns {String}
 */
const getTopMostReportIDFromRHP = (state) => {
    if (!state) {
        return '';
    }
    const topmostRightPane = lodashFindLast(state.routes, (route) => route.name === NAVIGATORS.RIGHT_MODAL_NAVIGATOR);

    if (topmostRightPane) {
        return getTopMostReportIDFromRHP(topmostRightPane.state);
    }

    const topmostRoute = lodashFindLast(state.routes);

    if (topmostRoute.state) {
        return getTopMostReportIDFromRHP(topmostRoute.state);
    }

    if (topmostRoute.params && topmostRoute.params.reportID) {
        return topmostRoute.params.reportID;
    }

    return '';
};

/**
 * Adds report route without any specific reportID to the state.
 * The report screen will self set proper reportID param based on the helper function findLastAccessedReport (look at ReportScreenWrapper for more info)
 *
 * @param {Object} state - react-navigation state
 */
const addCentralPaneNavigatorRoute = (state) => {
    const currentTabName = getTabName(state);
    let centralPaneNavigatorRoute;

    if (currentTabName === SCREENS.HOME) {
        const reportID = getTopMostReportIDFromRHP(state);
        centralPaneNavigatorRoute = {
            name: NAVIGATORS.CENTRAL_PANE_NAVIGATOR,
            state: {
                routes: [
                    {
                        name: SCREENS.REPORT,
                        params: {
                            reportID,
                        },
                    },
                ],
            },
        };
        state.routes.splice(1, 0, centralPaneNavigatorRoute);
        // eslint-disable-next-line no-param-reassign
        state.index = state.routes.length - 1;
    } else {
        centralPaneNavigatorRoute = {
            name: NAVIGATORS.CENTRAL_PANE_NAVIGATOR,
            state: {
                routes: [
                    {
                        name: getMatchingCentralPaneNameForState(state),
                    },
                ],
            },
        };
    }

    state.routes.splice(1, 0, centralPaneNavigatorRoute);
    // eslint-disable-next-line no-param-reassign
    state.index = state.routes.length - 1;
};

function wrapMethods(router) {
    const newRouter = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(router)) {
        if (typeof router[key] !== 'function') {
            newRouter[key] = router[key];
        } else {
            newRouter[key] = (...args) => {
                console.log(key, args);
                return router[key](...args);
            };
        }
    }
    return newRouter;
}

function CustomRouter(options) {
    const stackRouter = StackRouter(options);

    const customRouter = {
        ...stackRouter,
        getRehydratedState(partialState, {routeNames, routeParamList}) {
            // Make sure that there is at least one CentralPaneNavigator (ReportScreen by default) in the state if this is a wide layout
            if (!isAtLeastOneCentralPaneNavigatorInState(partialState) && !options.getIsSmallScreenWidth()) {
                // If we added a route we need to make sure that the state.stale is true to generate new key for this route
                // eslint-disable-next-line no-param-reassign
                partialState.stale = true;
                addCentralPaneNavigatorRoute(partialState);
            }
            const state = stackRouter.getRehydratedState(partialState, {routeNames, routeParamList});
            return state;
        },
    };
    const wrapped = wrapMethods(customRouter);
    return wrapped;
}

export default CustomRouter;
