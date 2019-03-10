"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var react_native_1 = require("react-native");
var native_base_1 = require("native-base");
var react_native_modal_datetime_picker_1 = __importDefault(require("react-native-modal-datetime-picker"));
var react_extended_component_1 = require("react-extended-component");
var _ = __importStar(require("lodash"));
var withStyles_1 = __importDefault(require("@technicalbros/react-native-styles/withStyles"));
var material_1 = __importDefault(require("native-base/src/theme/variables/material"));
// @ts-ignore
var FloatingInput = /** @class */ (function (_super) {
    __extends(FloatingInput, _super);
    function FloatingInput(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            labelTop: new react_native_1.Animated.Value(20),
            labelFontSize: new react_native_1.Animated.Value(16),
            focused: false,
            tmp_selected: _this.props.selected || [],
            value: _this.props.value
        };
        if (_this.props.options) {
            if (_this.props.multiple) {
                _this.state.selected = _this.props.selected || [];
            }
            else if (_this.props.selected !== undefined) {
                _this.state.selected = _this.props.selected;
                var option = _this.props.options.find(function (_a) {
                    var value = _a.value;
                    return value === _this.state.selected;
                });
                if (option)
                    _this.state.value = option.label;
            }
        }
        if (_this.props.date && _this.props.type === "date") {
            _this.state.value = _this.props.date.toDateString();
            _this.state.date = _this.props.date;
        }
        return _this;
    }
    FloatingInput.prototype.componentDidMount = function () {
        this.refreshLabel();
    };
    FloatingInput.prototype.componentDidUpdate = function (prevProps, prevState) {
        var _this = this;
        if (prevProps.value !== this.props.value && this.props.value !== undefined) {
            this.setState({ value: this.transformValueToString(this.props.value) });
        }
        if (this.props.date !== undefined && this.props.date !== prevProps.date) {
            this.setState({ date: this.props.date, value: this.transformValueToString(this.props.date) });
        }
        if (this.props.selected !== undefined && !_.isEqual(this.props.selected, prevProps.selected)) {
            if (this.props.multiple) {
                this.setState({
                    selected: this.props.selected.slice()
                });
            }
            else {
                this.setState({
                    selected: this.props.selected
                });
            }
        }
        if (!_.isEqual(this.state.selected, prevState.selected) || !_.isEqual(this.props.options, prevProps.options)) {
            if (this.state.selected) {
                if (!this.props.multiple) {
                    var option = _.find(this.props.options, { value: this.state.selected });
                    if (option)
                        this.setState({ value: option.label });
                }
                else {
                    this.setState({ value: this.state.selected.map(function (value) { return _this.props.options.find(function (_a) {
                            var val = _a.value;
                            return value === val;
                        }); }).filter(function (option) { return !!option; }).map(function (_a) {
                            var label = _a.label;
                            return label;
                        }).join(", ") });
                }
            }
            else {
                this.setState({ value: null });
            }
        }
        if (this.state.focused !== prevState.focused || this.state.value !== prevState.value) {
            this.refreshLabel();
        }
    };
    FloatingInput.prototype.floatLabel = function () {
        react_native_1.Animated.spring(this.state.labelTop, {
            toValue: 0
        }).start();
        react_native_1.Animated.spring(this.state.labelFontSize, {
            toValue: 12
        }).start();
    };
    FloatingInput.prototype.unFloatLabel = function () {
        react_native_1.Animated.spring(this.state.labelTop, {
            toValue: 20
        }).start();
        react_native_1.Animated.spring(this.state.labelFontSize, {
            toValue: 16
        }).start();
    };
    FloatingInput.prototype.refreshLabel = function () {
        if (this.state.value || this.state.focused) {
            this.floatLabel();
        }
        else {
            this.unFloatLabel();
        }
    };
    FloatingInput.prototype.transformValueToString = function (value) {
        var type = this.props.type;
        if (value && typeof value === "object") {
            if (type === "date") {
                value = value.toDateString();
            }
            else if (type === "time") {
                value = value.toTimeString();
            }
            else if (type === "datetime") {
                value = value.toLocaleDateString();
            }
        }
        return value;
    };
    FloatingInput.prototype.isSelected = function (option) {
        return this.state.tmp_selected.indexOf(option.value) !== -1;
    };
    FloatingInput.prototype.toggleSelected = function (option) {
        var _this = this;
        var _a = this.props, multiple = _a.multiple, onOptionSelect = _a.onOptionSelect;
        if (multiple) {
            react_extended_component_1.updateState(this, function (state) {
                if (_this.isSelected(option)) {
                    _.pull(state.tmp_selected, option.value);
                }
                else {
                    state.tmp_selected.push(option.value);
                }
                return state;
            });
        }
        else {
            this.setState({
                value: option.value ? option.label : null
            });
            this.unfocus();
            onOptionSelect && onOptionSelect(option);
        }
    };
    FloatingInput.prototype.selectOption = function (option) {
        var onOptionSelect = this.props.onOptionSelect;
        this.setState({ selected: option.value });
        this.unfocus();
        onOptionSelect && onOptionSelect(option);
    };
    FloatingInput.prototype.selectedOptions = function () {
        var _this = this;
        return this.state.tmp_selected.map(function (val) { return _this.props.options.find(function (_a) {
            var value = _a.value;
            return value === val;
        }); }).filter(function (value) { return !!value; });
    };
    FloatingInput.prototype.unfocus = function () {
        this.setState({ focused: false });
    };
    FloatingInput.prototype.focus = function () {
        var onFocus = this.props.onFocus;
        this.setState({ focused: true });
        onFocus && onFocus();
    };
    FloatingInput.prototype.handleFocus = function () {
        var _this = this;
        var _a = this.props, options = _a.options, selectionMode = _a.selectionMode, disabled = _a.disabled, multiple = _a.multiple, label = _a.label;
        if (disabled)
            return;
        if (options && selectionMode === "ActionSheet" && !multiple) {
            native_base_1.ActionSheet.show({
                options: options.map(function (_a) {
                    var label = _a.label;
                    return label;
                }).concat(["Cancel"]),
                title: label,
                destructiveButtonIndex: options.indexOf(options.find(function (_a) {
                    var value = _a.value;
                    return !value;
                })),
                cancelButtonIndex: options.length
            }, function (index) {
                var option = options[index];
                if (option) {
                    _this.selectOption(option);
                }
            });
        }
        this.focus();
    };
    FloatingInput.prototype.render = function () {
        var _this = this;
        var _a = this.props, styles = _a.styles, options = _a.options, disabled = _a.disabled, datepickerProps = _a.datepickerProps, type = _a.type, icon = _a.icon, onFocus = _a.onFocus, selectionMode = _a.selectionMode, onDateSelect = _a.onDateSelect, onSubmitEditing = _a.onSubmitEditing, onChangeText = _a.onChangeText, onOptionSelect = _a.onOptionSelect, inputProps = _a.inputProps, numberOfLines = _a.numberOfLines, label = _a.label, placeholder = _a.placeholder, multiple = _a.multiple;
        var _b = this.state, value = _b.value, focused = _b.focused;
        var is_picker = type === "date" || type === "time" || type === "datetime" || !!options;
        return <react_native_1.View style={styles.root}>
            <react_native_1.View style={{
            position: "relative",
            minHeight: 50,
            flexDirection: "column",
            justifyContent: "flex-end"
        }}>
                {!!label &&
            <react_native_1.Animated.Text style={__assign({}, styles.label, { fontSize: this.state.labelFontSize, top: this.state.labelTop })}>
                        {label}
                    </react_native_1.Animated.Text>}
                {is_picker ?
            <react_native_1.TouchableOpacity onPress={function () {
                _this.handleFocus();
            }}>
                            <react_native_1.Text numberOfLines={1} style={__assign({ paddingTop: 12, flexDirection: "column" }, styles.input, styles.button)}>{value}</react_native_1.Text>
                        </react_native_1.TouchableOpacity>
            :
                <react_native_1.TextInput placeholder={placeholder} value={value || value === 0 ? String(value) : ''} onSubmitEditing={onSubmitEditing} secureTextEntry={type === "password"} onChangeText={function (value) {
                    _this.setState({ value: value });
                    onChangeText && onChangeText(value);
                }} editable={!disabled} onBlur={function () { return _this.unfocus(); }} onFocus={function () { return _this.focus(); }} style={styles.input} {...inputProps}/>}
                {icon && <react_native_1.View style={{ position: "absolute", right: 12, top: 12 }}>
                        {icon}
                    </react_native_1.View>}
                {(type === "date" || type === "time" || type === "datetime") && <react_native_modal_datetime_picker_1.default confirmTextIOS={"Confirm"} isVisible={!!this.state.focused} date={this.state.date || new Date()} onConfirm={function (date) {
            _this.unfocus();
            var value = _this.transformValueToString(date);
            _this.setState({ date: date, value: value });
            onDateSelect && onDateSelect(date);
        }} titleIOS={label} onCancel={function () { return _this.setState({ focused: false }); }} mode={type === "date" ? "date" : type === "datetime" ? "datetime" : "time"} {...datepickerProps}/>}
            </react_native_1.View>
            <react_native_1.View style={styles.underline}/>
            {!!options && (selectionMode === "Modal" || multiple) &&
            <react_native_1.Modal animated animationType="slide" onShow={function () {
                if (multiple) {
                    _this.setState({ tmp_selected: _this.state.selected.slice() });
                }
            }} visible={focused} onRequestClose={function () { return _this.unfocus(); }}>
                    <native_base_1.Header style={styles.header}>
                        <native_base_1.Title style={{ textAlign: "center", padding: 8 }}>
                            {label}
                        </native_base_1.Title>
                        <native_base_1.Icon onPress={function () { return _this.unfocus(); }} style={__assign({}, styles.closeButton, { position: "absolute" })} name="x" type="Feather"/>
                    </native_base_1.Header>
                    <react_native_1.SafeAreaView style={styles.safeAreaView}>
                        <react_native_1.View style={{ flex: 1, backgroundColor: "white", padding: 8, paddingBottom: 20 }}>
                            <react_native_1.ScrollView style={{ flex: 1, margin: -8 }}>
                                <native_base_1.List>
                                    {options.map(function (option) {
                return <native_base_1.ListItem key={option.value} onPress={function () { return _this.toggleSelected(option); }}>
                                                <native_base_1.Left>
                                                    <react_native_1.Text>{option.label}</react_native_1.Text>
                                                </native_base_1.Left>
                                                {multiple &&
                    <native_base_1.Right style={{ marginRight: 15 }}>
                                                        <native_base_1.CheckBox onPress={function () { return _this.toggleSelected(option); }} checked={_this.isSelected(option)} color="green"/>
                                                    </native_base_1.Right>}
                                            </native_base_1.ListItem>;
            })}
                                </native_base_1.List>
                            </react_native_1.ScrollView>
                            {multiple &&
                <react_native_1.View style={{ flexDirection: "row" }}>
                                    <react_native_1.View style={{ padding: 8, flex: 1 }}>
                                        <native_base_1.Button style={styles.confirmButton} full onPress={function () {
                    var options = _this.selectedOptions();
                    _this.setState({ selected: options.map(function (_a) {
                            var value = _a.value;
                            return value;
                        }) });
                    onOptionSelect && onOptionSelect(options);
                    _this.unfocus();
                }}>
                                            <react_native_1.Text style={styles.confirmButtonText}>Choose</react_native_1.Text>
                                        </native_base_1.Button>
                                    </react_native_1.View>
                                </react_native_1.View>}
                        </react_native_1.View>
                    </react_native_1.SafeAreaView>
                </react_native_1.Modal>}
        </react_native_1.View>;
    };
    FloatingInput.defaultProps = {
        selectionMode: "ActionSheet",
        type: "text"
    };
    FloatingInput = __decorate([
        withStyles_1.default({
            root: {
                flexDirection: "column"
            },
            underline: {
                borderTopWidth: 1,
                borderColor: "gray"
            },
            input: {
                height: 40,
                paddingLeft: 0
            },
            header: {
                backgroundColor: material_1.default.brandPrimary
            },
            closeButton: {
                color: material_1.default.brandPrimaryContrast,
                right: 10,
                bottom: 8
            },
            label: {
                position: "absolute",
            },
            floatingLabel: {
                top: 0,
                fontSize: 12
            },
            safeAreaView: {
                flex: 1,
            },
            confirmButton: {
                backgroundColor: material_1.default.brandSecondary,
            },
            confirmButtonText: {
                color: material_1.default.brandSecondaryContrast
            }
        }),
        __metadata("design:paramtypes", [Object])
    ], FloatingInput);
    return FloatingInput;
}(React.Component));
exports.default = FloatingInput;
