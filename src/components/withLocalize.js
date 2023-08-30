import React, {createContext, forwardRef} from 'react';
import PropTypes from 'prop-types';
import {withOnyx} from 'react-native-onyx';
import lodashGet from 'lodash/get';
import getComponentDisplayName from '../libs/getComponentDisplayName';
import ONYXKEYS from '../ONYXKEYS';
import * as Localize from '../libs/Localize';
import DateUtils from '../libs/DateUtils';
import * as NumberFormatUtils from '../libs/NumberFormatUtils';
import * as LocaleDigitUtils from '../libs/LocaleDigitUtils';
import CONST from '../CONST';
import compose from '../libs/compose';
import withCurrentUserPersonalDetails from './withCurrentUserPersonalDetails';
import * as LocalePhoneNumber from '../libs/LocalePhoneNumber';

const LocaleContext = createContext(null);

const withLocalizePropTypes = {
    /** Returns translated string for given locale and phrase */
    translate: PropTypes.func.isRequired,

    /** Formats number formatted according to locale and options */
    numberFormat: PropTypes.func.isRequired,

    /** Converts a datetime into a localized string representation that's relative to current moment in time */
    datetimeToRelative: PropTypes.func.isRequired,

    /** Formats a datetime to local date and time string */
    datetimeToCalendarTime: PropTypes.func.isRequired,

    /** Updates date-fns internal locale */
    updateLocale: PropTypes.func.isRequired,

    /** Returns a locally converted phone number for numbers from the same region
     * and an internationally converted phone number with the country code for numbers from other regions */
    formatPhoneNumber: PropTypes.func.isRequired,

    /** Gets the standard digit corresponding to a locale digit */
    fromLocaleDigit: PropTypes.func.isRequired,

    /** Gets the locale digit corresponding to a standard digit */
    toLocaleDigit: PropTypes.func.isRequired,
};

const localeProviderPropTypes = {
    /** The user's preferred locale e.g. 'en', 'es-ES' */
    preferredLocale: PropTypes.string,

    /** Actual content wrapped by this component */
    children: PropTypes.node.isRequired,

    /** The current user's personalDetails */
    currentUserPersonalDetails: PropTypes.shape({
        /** Timezone of the current user */
        timezone: PropTypes.shape({
            /** Value of the selected timezone */
            selected: PropTypes.string,
        }),
    }),
};

const localeProviderDefaultProps = {
    preferredLocale: CONST.LOCALES.DEFAULT,
    currentUserPersonalDetails: {},
};

class LocaleContextProvider extends React.Component {
    /**
     * The context this component exposes to child components
     * @returns {object} translation util functions and locale
     */
    getContextValue() {
        return {
            translate: this.translate.bind(this),
            numberFormat: this.numberFormat.bind(this),
            datetimeToRelative: this.datetimeToRelative.bind(this),
            datetimeToCalendarTime: this.datetimeToCalendarTime.bind(this),
            updateLocale: this.updateLocale.bind(this),
            formatPhoneNumber: this.formatPhoneNumber.bind(this),
            fromLocaleDigit: this.fromLocaleDigit.bind(this),
            toLocaleDigit: this.toLocaleDigit.bind(this),
            preferredLocale: this.props.preferredLocale,
        };
    }

    /**
     * @param {String} phrase
     * @param {Object} [variables]
     * @returns {String}
     */
    translate(phrase, variables) {
        return Localize.translate(this.props.preferredLocale, phrase, variables);
    }

    /**
     * @param {Number} number
     * @param {Intl.NumberFormatOptions} options
     * @returns {String}
     */
    numberFormat(number, options) {
        return NumberFormatUtils.format(this.props.preferredLocale, number, options);
    }

    /**
     * @param {String} datetime
     * @returns {String}
     */
    datetimeToRelative(datetime) {
        return DateUtils.datetimeToRelative(this.props.preferredLocale, datetime);
    }

    /**
     * @param {String} datetime - ISO-formatted datetime string
     * @param {Boolean} [includeTimezone]
     * @param {Boolean} isLowercase
     * @returns {String}
     */
    datetimeToCalendarTime(datetime, includeTimezone, isLowercase = false) {
        return DateUtils.datetimeToCalendarTime(this.props.preferredLocale, datetime, includeTimezone, lodashGet(this.props, 'currentUserPersonalDetails.timezone.selected'), isLowercase);
    }

    /**
     * Updates date-fns internal locale to the user preferredLocale
     */
    updateLocale() {
        DateUtils.setLocale(this.props.preferredLocale);
    }

    /**
     * @param {String} phoneNumber
     * @returns {String}
     */
    formatPhoneNumber(phoneNumber) {
        return LocalePhoneNumber.formatPhoneNumber(phoneNumber);
    }

    /**
     * @param {String} digit
     * @returns {String}
     */
    toLocaleDigit(digit) {
        return LocaleDigitUtils.toLocaleDigit(this.props.preferredLocale, digit);
    }

    /**
     * @param {String} localeDigit
     * @returns {String}
     */
    fromLocaleDigit(localeDigit) {
        return LocaleDigitUtils.fromLocaleDigit(this.props.preferredLocale, localeDigit);
    }

    render() {
        return <LocaleContext.Provider value={this.getContextValue()}>{this.props.children}</LocaleContext.Provider>;
    }
}

LocaleContextProvider.propTypes = localeProviderPropTypes;
LocaleContextProvider.defaultProps = localeProviderDefaultProps;

const Provider = compose(
    withCurrentUserPersonalDetails,
    withOnyx({
        preferredLocale: {
            key: ONYXKEYS.NVP_PREFERRED_LOCALE,
        },
    }),
)(LocaleContextProvider);

Provider.displayName = 'withOnyx(LocaleContextProvider)';

export default function withLocalize(WrappedComponent) {
    const WithLocalize = forwardRef((props, ref) => (
        <LocaleContext.Consumer>
            {(translateUtils) => (
                <WrappedComponent
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...translateUtils}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...props}
                    ref={ref}
                />
            )}
        </LocaleContext.Consumer>
    ));

    WithLocalize.displayName = `withLocalize(${getComponentDisplayName(WrappedComponent)})`;

    return WithLocalize;
}

export {withLocalizePropTypes, Provider as LocaleContextProvider, LocaleContext};
