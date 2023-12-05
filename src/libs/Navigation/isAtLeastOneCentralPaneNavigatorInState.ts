import _ from 'lodash';
import NAVIGATORS from '@src/NAVIGATORS';

/**
 * @param state - react-navigation state
 */
const isAtLeastOneCentralPaneNavigatorInState = (state) => _.find(state.routes, (r) => r.name === NAVIGATORS.CENTRAL_PANE_NAVIGATOR);

export default isAtLeastOneCentralPaneNavigatorInState;
