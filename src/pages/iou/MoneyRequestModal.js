import _ from 'underscore';
import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import lodashGet from 'lodash/get';
import {withOnyx} from 'react-native-onyx';
import MoneyRequestAmountPage from './steps/MoneyRequestAmountPage';
import MoneyRequestParticipantsPage from './steps/MoneyRequstParticipantsPage/MoneyRequestParticipantsPage';
import MoneyRequestConfirmPage from './steps/MoneyRequestConfirmPage';
import styles from '../../styles/styles';
import * as IOU from '../../libs/actions/IOU';
import ONYXKEYS from '../../ONYXKEYS';
import withLocalize, {withLocalizePropTypes} from '../../components/withLocalize';
import compose from '../../libs/compose';
import * as OptionsListUtils from '../../libs/OptionsListUtils';
import FullScreenLoadingIndicator from '../../components/FullscreenLoadingIndicator';
import AnimatedStep from '../../components/AnimatedStep';
import ScreenWrapper from '../../components/ScreenWrapper';
import CONST from '../../CONST';
import * as PersonalDetails from '../../libs/actions/PersonalDetails';
import withCurrentUserPersonalDetails from '../../components/withCurrentUserPersonalDetails';
import reportPropTypes from '../reportPropTypes';
import * as ReportUtils from '../../libs/ReportUtils';
import * as ReportScrollManager from '../../libs/ReportScrollManager';
import useOnNetworkReconnect from '../../hooks/useOnNetworkReconnect';
import * as DeviceCapabilities from '../../libs/DeviceCapabilities';
import HeaderWithBackButton from '../../components/HeaderWithBackButton';
import * as CurrencyUtils from '../../libs/CurrencyUtils';
import Navigation from '../../libs/Navigation/Navigation';

/**
 * A modal used for requesting money, splitting bills or sending money.
 */
const propTypes = {
    /** Whether the request is for a single request or a group bill split */
    hasMultipleParticipants: PropTypes.bool,

    /** The type of IOU report, i.e. bill, request, send */
    iouType: PropTypes.string,

    /** The report passed via the route */
    // eslint-disable-next-line react/no-unused-prop-types
    report: reportPropTypes,

    // Holds data related to request view state, rather than the underlying request data.
    iou: PropTypes.shape({
        /** Whether or not transaction creation has resulted to error */
        error: PropTypes.bool,

        // Selected Currency Code of the current request
        selectedCurrencyCode: PropTypes.string,
    }),

    /** Personal details of all the users */
    allPersonalDetails: PropTypes.shape({
        /** Primary login of participant */
        login: PropTypes.string,

        /** Display Name of participant */
        displayName: PropTypes.string,

        /** Avatar url of participant */
        avatar: PropTypes.string,
    }),

    /** Personal details of the current user */
    currentUserPersonalDetails: PropTypes.shape({
        // Local Currency Code of the current user
        localCurrencyCode: PropTypes.string,
    }),

    ...withLocalizePropTypes,
};

const defaultProps = {
    hasMultipleParticipants: false,
    report: {
        participants: [],
    },
    iouType: CONST.IOU.MONEY_REQUEST_TYPE.REQUEST,
    currentUserPersonalDetails: {
        localCurrencyCode: CONST.CURRENCY.USD,
    },
    allPersonalDetails: {},
    iou: {
        error: false,
        selectedCurrencyCode: null,
    },
};

// Determines type of step to display within Modal, value provides the title for that page.
const Steps = {
    MoneyRequestAmount: 'moneyRequest.amount',
    MoneyRequestParticipants: 'moneyRequest.participants',
    MoneyRequestConfirm: 'moneyRequest.confirm',
};

function MoneyRequestModal(props) {
    // Skip MoneyRequestParticipants step if participants are passed in
    const reportParticipants = lodashGet(props, 'report.participants', []);
    const steps = useMemo(
        () => (reportParticipants.length ? [Steps.MoneyRequestAmount, Steps.MoneyRequestConfirm] : [Steps.MoneyRequestAmount, Steps.MoneyRequestParticipants, Steps.MoneyRequestConfirm]),
        [reportParticipants.length],
    );

    const [stepIndexStack, setStepIndexStack] = useState([0]);

    const getCurrentStepIndex = useCallback(() => stepIndexStack[stepIndexStack.length - 1], [stepIndexStack]);
    const getPreviousStepIndex = useCallback(() => (stepIndexStack.length > 1 ? stepIndexStack[stepIndexStack.length - 2] : -1), [stepIndexStack]);

    const [direction, setDirection] = useState(null);

    const stepIndexStackPush = useCallback(
        (stepIndex) => {
            setStepIndexStack([...stepIndexStack, stepIndex]);
            setDirection('in');
        },
        [stepIndexStack],
    );

    const stepIndexStackPop = useCallback(() => {
        if (stepIndexStack.length === 0) {
            return;
        }
        setStepIndexStack(stepIndexStack.slice(0, -1));
        setDirection('out');
    }, [stepIndexStack]);

    const [selectedOptions, setSelectedOptions] = useState(
        ReportUtils.isPolicyExpenseChat(props.report)
            ? OptionsListUtils.getPolicyExpenseReportOptions(props.report)
            : OptionsListUtils.getParticipantsOptions(props.report, props.allPersonalDetails),
    );
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        PersonalDetails.openMoneyRequestModalPage();
        IOU.setMoneyRequestDescription('');
    }, []);

    // We update selected currency when PersonalDetails.openMoneyRequestModalPage finishes
    // props.currentUserPersonalDetails might be stale data or might not exist if user is signing in
    useEffect(() => {
        if (_.isUndefined(props.currentUserPersonalDetails.localCurrencyCode)) {
            return;
        }
        IOU.setIOUSelectedCurrency(props.currentUserPersonalDetails.localCurrencyCode);
    }, [props.currentUserPersonalDetails.localCurrencyCode]);

    // User came back online, so let's refetch the currency details based on location
    useOnNetworkReconnect(PersonalDetails.openMoneyRequestModalPage);

    /**
     * Decides our animation type based on whether we're increasing or decreasing
     * our step index.
     * @returns {String|null}
     */

    /**
     * Retrieve title for current step, based upon current step and type of request
     *
     * @returns {String}
     */
    const titleForStep = useMemo(() => {
        if (getCurrentStepIndex() === 0) {
            const confirmIndex = _.indexOf(steps, Steps.MoneyRequestConfirm);
            if (getPreviousStepIndex() === confirmIndex) {
                return props.translate('iou.amount');
            }
            if (props.iouType === CONST.IOU.MONEY_REQUEST_TYPE.SEND) {
                return props.translate('iou.sendMoney');
            }
            return props.translate(props.hasMultipleParticipants ? 'iou.splitBill' : 'iou.requestMoney');
        }
        return props.translate('iou.cash');
        // eslint-disable-next-line react-hooks/exhaustive-deps -- props does not need to be a dependency as it will always exist
    }, [getCurrentStepIndex, props.translate, steps]);

    /**
     * Navigate to a provided step.
     *
     * @param {Number} stepIndex
     * @type {(function(*): void)|*}
     */
    const navigateToStep = useCallback(
        (stepIndex) => {
            if (stepIndex < 0 || stepIndex > steps.length) {
                return;
            }

            if (getCurrentStepIndex() === stepIndex) {
                return;
            }

            stepIndexStackPush(stepIndex);
        },
        [getCurrentStepIndex, stepIndexStackPush, steps.length],
    );

    /**
     * Navigate to the previous request step if possible
     */
    const navigateToPreviousStep = useCallback(() => {
        if (getPreviousStepIndex() === -1) {
            Navigation.dismissModal();
            return;
        }

        stepIndexStackPop();
    }, [getPreviousStepIndex, stepIndexStackPop]);

    /**
     * Navigate to the next request step if possible
     */
    const navigateToNextStep = useCallback(() => {
        if (getCurrentStepIndex() >= steps.length - 1) {
            return;
        }

        stepIndexStackPush(getCurrentStepIndex() + 1);
    }, [getCurrentStepIndex, steps, stepIndexStackPush]);

    /**
     * Checks if user has a GOLD wallet then creates a paid IOU report on the fly
     *
     * @param {String} paymentMethodType
     */
    const sendMoney = useCallback(
        (paymentMethodType) => {
            const currency = props.iou.selectedCurrencyCode;
            const trimmedComment = props.iou.comment.trim();
            const participant = selectedOptions[0];

            if (paymentMethodType === CONST.IOU.PAYMENT_TYPE.ELSEWHERE) {
                IOU.sendMoneyElsewhere(props.report, amount, currency, trimmedComment, props.currentUserPersonalDetails.accountID, participant);
                return;
            }

            if (paymentMethodType === CONST.IOU.PAYMENT_TYPE.PAYPAL_ME) {
                IOU.sendMoneyViaPaypal(props.report, amount, currency, trimmedComment, props.currentUserPersonalDetails.accountID, participant);
                return;
            }

            if (paymentMethodType === CONST.IOU.PAYMENT_TYPE.EXPENSIFY) {
                IOU.sendMoneyWithWallet(props.report, amount, currency, trimmedComment, props.currentUserPersonalDetails.accountID, participant);
            }
        },
        [amount, props.iou.comment, selectedOptions, props.currentUserPersonalDetails.accountID, props.iou.selectedCurrencyCode, props.report],
    );

    /**
     * @param {Array} selectedParticipants
     */
    const createTransaction = useCallback(
        (selectedParticipants) => {
            const reportID = lodashGet(props.route, 'params.reportID', '');
            const trimmedComment = props.iou.comment.trim();

            // IOUs created from a group report will have a reportID param in the route.
            // Since the user is already viewing the report, we don't need to navigate them to the report
            if (props.hasMultipleParticipants && CONST.REGEX.NUMBER.test(reportID)) {
                IOU.splitBill(
                    selectedParticipants,
                    props.currentUserPersonalDetails.login,
                    props.currentUserPersonalDetails.accountID,
                    amount,
                    trimmedComment,
                    props.iou.selectedCurrencyCode,
                    reportID,
                );
                return;
            }

            // If the request is created from the global create menu, we also navigate the user to the group report
            if (props.hasMultipleParticipants) {
                IOU.splitBillAndOpenReport(
                    selectedParticipants,
                    props.currentUserPersonalDetails.login,
                    props.currentUserPersonalDetails.accountID,
                    amount,
                    trimmedComment,
                    props.iou.selectedCurrencyCode,
                );
                return;
            }

            IOU.requestMoney(
                props.report,
                amount,
                props.iou.selectedCurrencyCode,
                props.currentUserPersonalDetails.login,
                props.currentUserPersonalDetails.accountID,
                selectedParticipants[0],
                trimmedComment,
            );
        },
        [
            amount,
            props.iou.comment,
            props.currentUserPersonalDetails.login,
            props.currentUserPersonalDetails.accountID,
            props.hasMultipleParticipants,
            props.iou.selectedCurrencyCode,
            props.report,
            props.route,
        ],
    );

    const currentStep = steps[getCurrentStepIndex()];

    const isEditingAmountAfterConfirm = getCurrentStepIndex() === 0 && getPreviousStepIndex() !== -1;
    const reportID = lodashGet(props, 'route.params.reportID', '');
    const modalHeader = (
        <HeaderWithBackButton
            title={titleForStep}
            onBackButtonPress={navigateToPreviousStep}
        />
    );
    const amountButtonText = isEditingAmountAfterConfirm ? props.translate('common.save') : props.translate('common.next');
    const enableMaxHeight = DeviceCapabilities.canUseTouchScreen() && currentStep === Steps.MoneyRequestParticipants;
    const bankAccountRoute = ReportUtils.getBankAccountRoute(props.report);

    return (
        <ScreenWrapper
            includeSafeAreaPaddingBottom={false}
            shouldEnableMaxHeight={enableMaxHeight}
        >
            {({didScreenTransitionEnd, safeAreaPaddingBottomStyle}) => (
                <>
                    <View style={[styles.pRelative, styles.flex1]}>
                        {!didScreenTransitionEnd && <FullScreenLoadingIndicator />}
                        {didScreenTransitionEnd && (
                            <>
                                {currentStep === Steps.MoneyRequestAmount && (
                                    <AnimatedStep
                                        direction={direction}
                                        style={[styles.flex1, safeAreaPaddingBottomStyle]}
                                    >
                                        {modalHeader}
                                        <MoneyRequestAmountPage
                                            onStepComplete={(value, selectedCurrencyCode) => {
                                                const amountInSmallestCurrencyUnits = CurrencyUtils.convertToSmallestUnit(selectedCurrencyCode, Number.parseFloat(value));
                                                IOU.setIOUSelectedCurrency(selectedCurrencyCode);
                                                setAmount(amountInSmallestCurrencyUnits);
                                                if (isEditingAmountAfterConfirm) {
                                                    navigateToPreviousStep();
                                                } else {
                                                    navigateToNextStep();
                                                }
                                            }}
                                            reportID={reportID}
                                            hasMultipleParticipants={props.hasMultipleParticipants}
                                            selectedAmount={CurrencyUtils.convertToWholeUnit(props.iou.selectedCurrencyCode, amount)}
                                            navigation={props.navigation}
                                            route={props.route}
                                            iouType={props.iouType}
                                            buttonText={amountButtonText}
                                        />
                                    </AnimatedStep>
                                )}
                                {currentStep === Steps.MoneyRequestParticipants && (
                                    <AnimatedStep
                                        style={[styles.flex1]}
                                        direction={direction}
                                    >
                                        {modalHeader}
                                        <MoneyRequestParticipantsPage
                                            participants={selectedOptions}
                                            hasMultipleParticipants={props.hasMultipleParticipants}
                                            onAddParticipants={setSelectedOptions}
                                            onStepComplete={navigateToNextStep}
                                            safeAreaPaddingBottomStyle={safeAreaPaddingBottomStyle}
                                            iouType={props.iouType}
                                        />
                                    </AnimatedStep>
                                )}
                                {currentStep === Steps.MoneyRequestConfirm && (
                                    <AnimatedStep
                                        style={[styles.flex1, safeAreaPaddingBottomStyle]}
                                        direction={direction}
                                    >
                                        {modalHeader}
                                        <MoneyRequestConfirmPage
                                            onConfirm={(selectedParticipants) => {
                                                createTransaction(selectedParticipants);
                                                ReportScrollManager.scrollToBottom();
                                            }}
                                            onSendMoney={(paymentMethodType) => {
                                                sendMoney(paymentMethodType);
                                                ReportScrollManager.scrollToBottom();
                                            }}
                                            hasMultipleParticipants={props.hasMultipleParticipants}
                                            participants={_.filter(selectedOptions, (option) => props.currentUserPersonalDetails.accountID !== option.accountID)}
                                            iouAmount={amount}
                                            iouType={props.iouType}
                                            // The participants can only be modified when the action is initiated from directly within a group chat and not the floating-action-button.
                                            // This is because when there is a group of people, say they are on a trip, and you have some shared expenses with some of the people,
                                            // but not all of them (maybe someone skipped out on dinner). Then it's nice to be able to select/deselect people from the group chat bill
                                            // split rather than forcing the user to create a new group, just for that expense. The reportID is empty, when the action was initiated from
                                            // the floating-action-button (since it is something that exists outside the context of a report).
                                            canModifyParticipants={!_.isEmpty(reportID)}
                                            navigateToStep={navigateToStep}
                                            policyID={props.report.policyID}
                                            bankAccountRoute={bankAccountRoute}
                                        />
                                    </AnimatedStep>
                                )}
                            </>
                        )}
                    </View>
                </>
            )}
        </ScreenWrapper>
    );
}

MoneyRequestModal.displayName = 'MoneyRequestModal';
MoneyRequestModal.propTypes = propTypes;
MoneyRequestModal.defaultProps = defaultProps;

export default compose(
    withLocalize,
    withCurrentUserPersonalDetails,
    withOnyx({
        report: {
            key: ({route}) => `${ONYXKEYS.COLLECTION.REPORT}${lodashGet(route, 'params.reportID', '')}`,
        },
        iou: {
            key: ONYXKEYS.IOU,
        },
        allPersonalDetails: {
            key: ONYXKEYS.PERSONAL_DETAILS_LIST,
        },
    }),
)(MoneyRequestModal);
