import PropTypes from 'prop-types';
import React from 'react';
import {Text, View} from 'react-native';
import {PressableWithFeedback} from '@components/Pressable';
import createCustomBottomTabNavigator from '@libs/Navigation/AppNavigator/createCustomBottomTabNavigator';
import Navigation from '@libs/Navigation/Navigation';
import {BottomTabNavigatorParamList} from '@libs/Navigation/types';
import SidebarScreen from '@pages/home/sidebar/SidebarScreen';
import CONST from '@src/CONST';
import ROUTES from '@src/ROUTES';
import SCREENS from '@src/SCREENS';

const Tab = createCustomBottomTabNavigator<BottomTabNavigatorParamList>();

const propTypes = {
    /* Navigation functions provided by React Navigation */
    navigation: PropTypes.shape({
        goBack: PropTypes.func.isRequired,
    }).isRequired,
};

function SeconedTab() {
    return (
        <View>
            <Text style={{color: 'white', fontSize: 30}}>Expensify settings</Text>

            <PressableWithFeedback
                role={CONST.ACCESSIBILITY_ROLE.BUTTON}
                accessibilityLabel="Workspaces"
                onPress={() => {
                    Navigation.navigate(ROUTES.SETTINGS_WORKSPACES);
                }}
            >
                <Text style={{color: 'white', fontSize: 30}}>Workspaces</Text>
            </PressableWithFeedback>
        </View>
    );
}

function ThirdTab() {
    return (
        <View>
            <Text style={{color: 'white', fontSize: 30}}>Cathy’s Croissants</Text>
        </View>
    );
}

function BottomTabNavigator() {
    return (
        <Tab.Navigator screenOptions={{headerShown: false}}>
            <Tab.Screen
                name={SCREENS.HOME}
                component={SidebarScreen}
            />
            <Tab.Screen
                name={SCREENS.SETTINGS_IDEAL}
                component={SeconedTab}
            />
            <Tab.Screen
                name={SCREENS.WORKSPACE_SETTINGS_IDEAL}
                component={ThirdTab}
            />
        </Tab.Navigator>
    );
}

BottomTabNavigator.propTypes = propTypes;
BottomTabNavigator.displayName = 'BottomTabNavigator';

export default BottomTabNavigator;
