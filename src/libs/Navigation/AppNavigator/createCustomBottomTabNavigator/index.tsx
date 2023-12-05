import {createNavigatorFactory, NavigationState, PartialState, StackRouter, useNavigationBuilder} from '@react-navigation/native';
import {StackView} from '@react-navigation/stack';
import PropTypes from 'prop-types';
import React from 'react';
import {View} from 'react-native';
import {NavigationStateRoute} from '@libs/Navigation/types';
import SCREENS from '@src/SCREENS';
import BottomTabBar from './BottomTabBar';

const propTypes = {
    /* Children for the useNavigationBuilder hook */
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,

    /* initialRouteName for this navigator */
    initialRouteName: PropTypes.oneOf([PropTypes.string, PropTypes.undefined]),

    /* Screen options defined for this navigator */
    // eslint-disable-next-line react/forbid-prop-types
    screenOptions: PropTypes.object,
};

const defaultProps = {
    initialRouteName: undefined,
    screenOptions: undefined,
};

function getStateToRender(state: NavigationState | PartialState<NavigationState>): NavigationState | PartialState<NavigationState> {
    const routesToRender = [state.routes.at(-1)] as NavigationStateRoute[];
    // We need to render at least one HOME screen to make sure everything load properly.
    if (routesToRender[0].name !== SCREENS.HOME) {
        routesToRender.unshift(state.routes.find((route) => route.name === SCREENS.HOME) as NavigationStateRoute);
    }

    return {...state, routes: routesToRender, index: routesToRender.length - 1};
}

function CustomBottomTabNavigator(props) {
    const {navigation, state, descriptors, NavigationContent} = useNavigationBuilder(StackRouter, {
        children: props.children,
        screenOptions: props.screenOptions,
        initialRouteName: props.initialRouteName,
    });

    const stateToRender = getStateToRender(state);

    return (
        <View style={{flex: 1}}>
            <NavigationContent>
                <StackView
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...props}
                    state={stateToRender}
                    descriptors={descriptors}
                    navigation={navigation}
                />
            </NavigationContent>
            <BottomTabBar
                state={state}
                navigation={navigation}
            />
        </View>
    );
}

CustomBottomTabNavigator.defaultProps = defaultProps;
CustomBottomTabNavigator.propTypes = propTypes;
CustomBottomTabNavigator.displayName = 'CustomBottomTabNavigator';

export default createNavigatorFactory(CustomBottomTabNavigator);
