import NAVIGATORS from '@src/NAVIGATORS';
import {State} from './types';

/**
 * @param state - react-navigation state
 */
const isAtLeastOneCentralPaneNavigatorInState = (state: State) => state.routes.some((r) => r.name === NAVIGATORS.CENTRAL_PANE_NAVIGATOR);

export default isAtLeastOneCentralPaneNavigatorInState;
