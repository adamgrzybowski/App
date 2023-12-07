import {useNavigationState} from '@react-navigation/native';
import {StackNavigationHelpers} from '@react-navigation/stack/lib/typescript/src/types';
import React from 'react';
import {View} from 'react-native';
import Icon from '@components/Icon';
import * as Expensicons from '@components/Icon/Expensicons';
import {PressableWithFeedback} from '@components/Pressable';
import useWindowDimensions from '@hooks/useWindowDimensions';
import Navigation from '@libs/Navigation/Navigation';
import BottomTabBarFloatingActionButton from '@pages/home/sidebar/BottomTabBarFloatingActionButton';
import styles from '@styles/styles';
import CONST from '@src/CONST';
import ROUTES from '@src/ROUTES';
import SCREENS from '@src/SCREENS';

type BottomTabBarProps = {
    navigation: StackNavigationHelpers;
};

function BottomTabBar({navigation}: BottomTabBarProps) {
    const {isSmallScreenWidth} = useWindowDimensions();

    const currentTabName = useNavigationState((state) => Navigation.getTabName(state));

    return (
        <View style={styles.bottomTabBarContainer}>
            <PressableWithFeedback
                onPress={() => {
                    navigation.push(SCREENS.HOME);
                    if (!isSmallScreenWidth) {
                        Navigation.navigate(ROUTES.REPORT);
                    }
                }}
                role={CONST.ACCESSIBILITY_ROLE.BUTTON}
                accessibilityLabel="Chats"
            >
                <Icon
                    src={Expensicons.ChatBubble}
                    fill={currentTabName === SCREENS.HOME ? 'white' : undefined}
                />
            </PressableWithFeedback>
            <BottomTabBarFloatingActionButton />
            <PressableWithFeedback
                onPress={() => {
                    navigation.push(SCREENS.SETTINGS_IDEAL);
                    if (!isSmallScreenWidth) {
                        Navigation.navigate(ROUTES.WORKSPACES_IDEAL);
                    }
                }}
                role={CONST.ACCESSIBILITY_ROLE.BUTTON}
                accessibilityLabel="Settings"
            >
                <Icon
                    src={Expensicons.Gear}
                    fill={currentTabName === SCREENS.SETTINGS_IDEAL ? 'white' : undefined}
                />
            </PressableWithFeedback>
        </View>
    );
}

BottomTabBar.displayName = 'BottomTabBar';

export default BottomTabBar;
