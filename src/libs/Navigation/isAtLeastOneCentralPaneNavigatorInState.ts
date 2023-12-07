import {NavigationState, PartialState} from '@react-navigation/native';
import NAVIGATORS from '@src/NAVIGATORS';

type State = NavigationState | PartialState<NavigationState>;

/**
 * @param state - react-navigation state
 */
const isAtLeastOneCentralPaneNavigatorInState = (state: State) => state.routes.some((r) => r.name === NAVIGATORS.CENTRAL_PANE_NAVIGATOR);

export default isAtLeastOneCentralPaneNavigatorInState;
