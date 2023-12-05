import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Text, View} from 'react-native';
import ReportScreenWrapper from '@libs/Navigation/AppNavigator/ReportScreenWrapper';
import getCurrentUrl from '@libs/Navigation/currentUrl';
import type {CentralPaneNavigatorParamList} from '@navigation/types';
import useThemeStyles from '@styles/useThemeStyles';
import SCREENS from '@src/SCREENS';

const Stack = createStackNavigator<CentralPaneNavigatorParamList>();

const url = getCurrentUrl();
const openOnAdminRoom = url ? new URL(url).searchParams.get('openOnAdminRoom') : undefined;

function TestScreen() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: 'white', fontSize: 50}}>WORKSPACES</Text>
        </View>
    );
}
function TestScreen2() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: 'white', fontSize: 50}}>TEST SCREEN 2</Text>
        </View>
    );
}

function BaseCentralPaneNavigator() {
    const styles = useThemeStyles();
    const options = {
        headerShown: false,
        title: 'New Expensify',

        // Prevent unnecessary scrolling
        cardStyle: styles.cardStyleNavigator,
    };
    return (
        <Stack.Navigator screenOptions={options}>
            <Stack.Screen
                name={SCREENS.REPORT}
                // We do it this way to avoid adding the url params to url
                initialParams={{openOnAdminRoom: openOnAdminRoom === 'true' || undefined}}
                component={ReportScreenWrapper}
            />
            <Stack.Screen
                name={SCREENS.WORKSPACES_IDEAL}
                component={TestScreen}
            />
            <Stack.Screen
                name={SCREENS.OVERVIEW_IDEAL}
                component={TestScreen2}
            />
        </Stack.Navigator>
    );
}

export default BaseCentralPaneNavigator;
