import {
    getStateFromPath,
    getActionFromState,
} from '@react-navigation/core';
import _ from 'lodash';
import NAVIGATORS from '../../NAVIGATORS';
import linkingConfig from './linkingConfig';
import getTopmostReportId from './getTopmostReportId';
import getOneRouteDiffAction from './getOneRouteDiffAction';

export default function linkTo(navigationRef, path) {
    const normalizedPath = !path.startsWith('/') ? `/${path}` : path;
    if (navigationRef === undefined) {
        throw new Error("Couldn't find a navigation object. Is your component inside a screen in a navigator?");
    }

    const state = linkingConfig.getStateFromPath
        ? linkingConfig.getStateFromPath(normalizedPath, linkingConfig.config)
        : getStateFromPath(normalizedPath, linkingConfig.config);

    if (!state) {
        throw new Error('Failed to parse the path to a navigation state.');
    }

    // If the action can be simple push one route, do it instead of dispatching action for the root.
    const oneRouteDiffAction = getOneRouteDiffAction(navigationRef.getRootState(), state);
    if (oneRouteDiffAction) {
        navigationRef.current.dispatch(oneRouteDiffAction);
        return;
    }

    const action = getActionFromState(state, linkingConfig.config);

    // If action type is different than NAVIGATE we can't change it to the PUSH safely
    if (action.type === 'NAVIGATE') {
        // If this action is navigating to the report screen and the top most navigator is different from the one we want to navigate - PUSH
        if (action.payload.name === NAVIGATORS.CENTRAL_PANE_NAVIGATOR && getTopmostReportId(navigationRef.current.getState()) !== getTopmostReportId(state)) {
            action.type = 'PUSH';

        // If this action is navigating to the RightModalNavigator and the last route on the root navigator is not RightModalNavigator then push
        } else if (action.payload.name === NAVIGATORS.RIGHT_MODAL_NAVIGATOR && _.last(navigationRef.current.getState().routes).name !== NAVIGATORS.RIGHT_MODAL_NAVIGATOR) {
            action.type = 'PUSH';
        }
    }

    if (action !== undefined) {
        navigationRef.current.dispatch(action);
    } else {
        navigationRef.current.reset(state);
    }
}
