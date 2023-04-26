import {getStateFromPath} from '@react-navigation/core';
import linkinConfig from '../../src/libs/Navigation/linkingConfig';

describe('getStateFromPath', () => {
    describe('Simple UP examples', () => {
        it('Generates proper state for /settings', () => {
            const desiredState = {
                index: 1,
                routes: [
                    {
                        name: 'Home',
                    },
                    {
                        name: 'RightModalNavigator',
                        state: {
                            routes: [
                                {
                                    name: 'Settings',
                                    state: {
                                        routes: [
                                            {
                                                name: 'Settings_Root',
                                                path: '/settings',
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            };

            const url = '/settings';
            const state = getStateFromPath(url, linkinConfig.config);
            expect(state).toEqual(desiredState);
        });

        it('Generates proper state for /settings/profile', () => {
            const desiredState = {
                index: 1,
                routes: [
                    {
                        name: 'Home',
                    },
                    {
                        name: 'RightModalNavigator',
                        state: {
                            routes: [
                                {
                                    name: 'Settings',
                                    state: {
                                        index: 1,
                                        routes: [
                                            {
                                                name: 'Settings_Root',
                                            },
                                            {
                                                name: 'Settings_Profile',
                                                path: '/settings/profile',
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            };

            const url = '/settings/profile';
            const state = getStateFromPath(url, linkinConfig.config);
            expect(state).toEqual(desiredState);
        });

        it('Generates proper state for /settings/profile/display-name', () => {
            const desiredState = {
                index: 1,
                routes: [
                    {
                        name: 'Home',
                    },
                    {
                        name: 'RightModalNavigator',
                        state: {
                            routes: [
                                {
                                    name: 'Settings',
                                    state: {
                                        index: 2,
                                        routes: [
                                            {
                                                name: 'Settings_Root',
                                            },
                                            {
                                                name: 'Settings_Profile',
                                            },
                                            {
                                                name: 'Settings_Display_Name',
                                                path: '/settings/profile/display-name',
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            };

            const url = '/settings/profile/display-name';
            const state = getStateFromPath(url, linkinConfig.config);
            expect(state).toEqual(desiredState);
        });
    });

    // This part is guessing how it should look like. There may be some differences
    describe('UP examples with params', () => {
        it('Generates routes with params for /workspace/1', () => {
            const desiredState = {
                index: 1,
                routes: [
                    {
                        name: 'Home',
                    },
                    {
                        name: 'RightModalNavigator',
                        state: {
                            routes: [
                                {
                                    name: 'Settings',
                                    state: {
                                        index: 2,
                                        routes: [
                                            {
                                                name: 'Settings_Root',
                                            },
                                            {
                                                name: 'Settings_Workspaces',
                                                params: {
                                                    policyID: '1',
                                                },

                                                // There is an open question if the routes under the focues one should have 'path' property.
                                                // That applies to all other states in this test.
                                            },
                                            {
                                                name: 'Workspace_Initial',
                                                path: '/workspace/1',
                                                params: {
                                                    policyID: '1',
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            };
            const url = '/workspace/1';
            const state = getStateFromPath(url, linkinConfig.config);
            expect(state).toEqual(desiredState);
        });

        it('Generates routes with params for /workspace/1/bills', () => {
            const desiredState = {
                index: 1,
                routes: [
                    {
                        name: 'Home',
                    },
                    {
                        name: 'RightModalNavigator',
                        state: {
                            routes: [
                                {
                                    name: 'Settings',
                                    state: {
                                        index: 2,
                                        routes: [
                                            {
                                                name: 'Settings_Root',
                                            },
                                            {
                                                name: 'Settings_Workspaces',
                                                params: {
                                                    policyID: '1',
                                                },
                                            },
                                            {
                                                name: 'Workspace_Initial',
                                                params: {
                                                    policyID: '1',
                                                },
                                            },
                                            {
                                                name: 'Workspace_Bills',
                                                params: {
                                                    policyID: '1',
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            };
            const url = '/workspace/1/bills';
            const state = getStateFromPath(url, linkinConfig.config);
            expect(state).toEqual(desiredState);
        });
    });
});
