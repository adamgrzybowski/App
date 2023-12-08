import {RouterConfigOptions, StackNavigationState, StackRouter} from '@react-navigation/native';
import {ParamListBase} from '@react-navigation/routers';
import {nanoid} from 'nanoid/non-secure';
import getMatchingCentralPaneNameForState from '@libs/Navigation/getMatchingCentralPaneNameForState';
import getTabName from '@libs/Navigation/getTabName';
import getTopmostCentralPaneName from '@libs/Navigation/getTopmostCentralPaneName';
import {State} from '@libs/Navigation/types';
import NAVIGATORS from '@src/NAVIGATORS';
import SCREENS from '@src/SCREENS';
import type {ResponsiveStackNavigatorRouterOptions} from './types';

/**
 * @param state - react-navigation state
 */
const getTopMostReportIDFromRHP = (state: State): string => {
    if (!state) {
        return '';
    }

    const topmostRightPane = state.routes.filter((route) => route.name === NAVIGATORS.RIGHT_MODAL_NAVIGATOR).at(-1);

    if (topmostRightPane?.state) {
        return getTopMostReportIDFromRHP(topmostRightPane.state);
    }

    const topmostRoute = state.routes.at(-1);

    if (topmostRoute?.state) {
        return getTopMostReportIDFromRHP(topmostRoute.state);
    }

    if (topmostRoute?.params && 'reportID' in topmostRoute.params && typeof topmostRoute.params.reportID === 'string' && topmostRoute.params.reportID) {
        return topmostRoute.params.reportID;
    }

    return '';
};

// const getPolicyIDfromBottomTabNavigator = (state: State): string => {
//     const bottomTabNavigator = state.routes.at(-1);

//     if (bottomTabNavigator.state) {
//         return getTopMostReportIDFromRHP(topmostRightPane.state);
//     }

//     const topmostRoute = state.routes.at(-1);

//     if (topmostRoute?.state) {
//         return getTopMostReportIDFromRHP(topmostRoute.state);
//     }

//     if (topmostRoute?.params && 'reportID' in topmostRoute.params && typeof topmostRoute.params.reportID === 'string' && topmostRoute.params.reportID) {
//         return topmostRoute.params.reportID;
//     }

//     return '';
// };
/**
 * Adds report route without any specific reportID to the state.
 * The report screen will self set proper reportID param based on the helper function findLastAccessedReport (look at ReportScreenWrapper for more info)
 *
 * @param state - react-navigation state
 */
const addCentralPaneNavigatorRoute = (state: State) => {
    const currentTabName = getTabName(state);
    let centralPaneNavigatorRoute;

    const bottomTabRoute = state.routes.filter((route) => route.name === NAVIGATORS.BOTTOM_TAB_NAVIGATOR);
    const centralPaneRoutes = state.routes.filter((route) => route.name === NAVIGATORS.CENTRAL_PANE_NAVIGATOR);
    // Both RHP and LHP
    const modalRoutes = state.routes.filter((route) => route.name === NAVIGATORS.RIGHT_MODAL_NAVIGATOR || route.name === NAVIGATORS.LEFT_MODAL_NAVIGATOR);

    if (currentTabName === SCREENS.HOME) {
        const reportID = getTopMostReportIDFromRHP(state);
        centralPaneNavigatorRoute = {
            key: `${NAVIGATORS.CENTRAL_PANE_NAVIGATOR}-${nanoid()}`,
            name: NAVIGATORS.CENTRAL_PANE_NAVIGATOR,
            state: {
                key: `stack-${nanoid()}`,
                routes: [
                    {
                        name: SCREENS.REPORT,
                        key: `${SCREENS.REPORT}-${nanoid()}`,
                        params: {
                            reportID,
                        },
                    },
                ],
            },
        };
    } else if (currentTabName === SCREENS.WORKSPACE.INITIAL) {
        const policyID = '39354CCB6F285DEC';
        // const policyID = getTopmostPolicyID(state);
        centralPaneNavigatorRoute = {
            name: NAVIGATORS.CENTRAL_PANE_NAVIGATOR,
            key: `${NAVIGATORS.CENTRAL_PANE_NAVIGATOR}-${nanoid()}`,
            state: {
                key: `stack-${nanoid()}`,
                routes: [
                    {
                        name: SCREENS.WORKSPACE.SETTINGS,
                        key: `${SCREENS.REPORT}-${nanoid()}`,
                        params: {
                            policyID,
                        },
                    },
                ],
            },
        };
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

    // @ts-expect-error Updating read only property
    // noinspection JSConstantReassignment
    state.routes = [...bottomTabRoute, ...centralPaneRoutes, centralPaneNavigatorRoute, ...modalRoutes]; // eslint-disable-line

    // @ts-expect-error Updating read only property
    // noinspection JSConstantReassignment
    state.index = state.routes.length - 1; // eslint-disable-line
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

function CustomRouter(options: ResponsiveStackNavigatorRouterOptions) {
    const stackRouter = StackRouter(options);

    const customRouter = {
        ...stackRouter,
        // getStateForAction(state: StackNavigationState<ParamListBase>, action: any, options: any) {
        //     if (action.type === 'PUSH_TAB') {
        //         const [bottomTabRoute, ...rest] = state.routes;
        //         const newBottomTabRoute = {
        //             ...bottomTabRoute,
        //             state: stackRouter.getStateForAction(bottomTabRoute.state, {type: 'PUSH', payload: {name: action.payload.params.screen}}, options),
        //         };

        //         const newState = {...state, routes: [newBottomTabRoute, ...rest]};
        //         const newerAction = {type: 'PUSH', payload: {name: NAVIGATORS.CENTRAL_PANE_NAVIGATOR, params: {screen: getMatchingCentralPaneNameForState(newState)}}};
        //         const newerState = stackRouter.getStateForAction(state, newerAction, options);
        //         return newerState;
        //         // return stackRouter.getStateForAction(newState, {type: 'PUSH', payload: {name: getMatchingCentralPaneNameForState(newState)}}, options);
        //         // return stackRouter.getStateForAction(state, action, options);
        //     }
        //     return stackRouter.getStateForAction(state, action, options);
        // },
        getRehydratedState(partialState: StackNavigationState<ParamListBase>, {routeNames, routeParamList, routeGetIdList}: RouterConfigOptions): StackNavigationState<ParamListBase> {
            // Make sure that there is at least one CentralPaneNavigator (ReportScreen by default) in the state if this is a wide layout
            // if (!isAtLeastOneCentralPaneNavigatorInState(partialState) && !options.getIsSmallScreenWidth()) {
            const c1 = getTopmostCentralPaneName(partialState);
            const c2 = getMatchingCentralPaneNameForState(partialState);
            if (c1 !== c2 && !options.getIsSmallScreenWidth()) {
                // If we added a route we need to make sure that the state.stale is true to generate new key for this route
                // @ts-expect-error Updating read only property
                // noinspection JSConstantReassignment
                // partialState.stale = true; // eslint-disable-line
                addCentralPaneNavigatorRoute(partialState);
            }
            const state = stackRouter.getRehydratedState(partialState, {routeNames, routeParamList, routeGetIdList});
            return state;
        },
    };
    const wrapped = wrapMethods(customRouter);
    return wrapped;
}

export default CustomRouter;
