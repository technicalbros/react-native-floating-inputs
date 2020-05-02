import * as React from "react";
import {
    Animated,
    Modal,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View
} from "react-native";
import {ActionSheet, Body, Button, CheckBox, Header, Icon, Left, List, ListItem, Right, Title} from "native-base";
import DateTimePicker, {DateTimePickerProps} from "react-native-modal-datetime-picker";
import {updateState} from "react-extended-component";
import * as _ from "lodash";
import withStyles from "@technicalbros/react-native-styles/withStyles";
import material from "native-base/src/theme/variables/material";

export interface FloatingInputProps {
    inputProps?: TextInputProps,
    styles?: {
        closeButton?: any;
        input?: any,
        label?: any,
        floatingLabel?: any,
        underline?: any,
        button?: any,
        root?: any,
        safeAreaView?: any,
        header?: any,
        confirmButton?: any,
        cancelButton?: any,
        confirmButtonText?: any,
        cancelButtonText?: any
    },
    labelFontSize?: number,
    labelShrinkFontSize?: number,
    icon?: any,
    multiple?: boolean,
    multiline?: boolean,
    selectionMode?: "ActionSheet" | "Modal"
    value?: string,
    label?: string,
    type?: "date" | "password" | "text" | "time" | "datetime"
    numberOfLines?: number,
    disabled?: boolean,
    options?: any[],
    selected?: any,
    onOptionSelect?: (option: any) => void,
    datepickerProps?: DateTimePickerProps
    onSubmitEditing?: () => void,
    date?: Date,
    onDateSelect?: (date: Date) => void,
    placeholder?: string,
    onFocus?: () => void,
    onChangeText?: (value: string) => void
}

// @ts-ignore
@withStyles({
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
        backgroundColor: material.brandPrimary
    },
    closeButton: {
        color: material.brandPrimaryContrast,
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
        backgroundColor: material.brandSecondary,
    },
    confirmButtonText: {
        color: material.brandSecondaryContrast
    }
})
export default class FloatingInput extends React.Component<FloatingInputProps, any> {

    state: any = {
        labelTop: new Animated.Value(20),
        labelFontSize: new Animated.Value(this.props.labelFontSize),
        focused: false,
        tmp_selected: this.props.selected || [],
        value: this.props.value
    }

    static defaultProps: Partial<FloatingInputProps> = {
        selectionMode: "ActionSheet",
        type: "text",
        labelFontSize: 16,
        labelShrinkFontSize: 12
    }

    constructor(props) {
        super(props);

        if (this.props.options) {
            if (this.props.multiple) {
                this.state.selected = this.props.selected || []
            } else if (this.props.selected !== undefined) {
                this.state.selected = this.props.selected
                const option = this.props.options.find(({value}) => value === this.state.selected);
                if (option) this.state.value = option.label;
            }
        }

        if (this.props.date && this.props.type === "date") {
            this.state.value = this.props.date.toDateString()
            this.state.date = this.props.date;
        }
    }

    componentDidMount(): void {
        this.refreshLabel()
    }

    componentDidUpdate(prevProps, prevState): void {

        if (prevProps.value !== this.props.value && this.props.value !== undefined) {
            this.setState({value: this.transformValueToString(this.props.value)})
        }

        if (this.props.date !== undefined && this.props.date !== prevProps.date) {
            this.setState({date: this.props.date, value: this.transformValueToString(this.props.date)})
        }

        if (this.props.selected !== undefined && !_.isEqual(this.props.selected, prevProps.selected)) {
            if (this.props.multiple) {
                this.setState({
                    selected: [...this.props.selected]
                })
            } else {
                this.setState({
                    selected: this.props.selected
                })
            }
        }

        if (!_.isEqual(this.state.selected, prevState.selected) || !_.isEqual(this.props.options, prevProps.options)) {
            if (this.state.selected) {
                if (!this.props.multiple) {
                    const option = _.find(this.props.options, {value: this.state.selected})
                    if (option)
                        this.setState({value: option.label})
                } else {
                    this.setState({value: this.state.selected.map(value => this.props.options.find(({value: val}) => value === val)).filter(option => !!option).map(({label}) => label).join(", ")})
                }
            } else {
                this.setState({value: null})
            }
        }

        if (this.state.focused !== prevState.focused || this.state.value !== prevState.value) {
            this.refreshLabel()
        }
    }

    floatLabel() {
        Animated.spring(this.state.labelTop, {
            toValue: 0
        }).start()
        Animated.spring(this.state.labelFontSize, {
            toValue: this.props.labelShrinkFontSize
        }).start()
    }

    unFloatLabel() {
        Animated.spring(this.state.labelTop, {
            toValue: 20
        }).start()
        Animated.spring(this.state.labelFontSize, {
            toValue: this.props.labelFontSize
        }).start()
    }

    refreshLabel() {
        if (this.state.value || this.state.focused) {
            this.floatLabel()
        } else {
            this.unFloatLabel()
        }
    }

    transformValueToString(value) {
        const {type} = this.props;
        if (value && typeof value === "object") {
            if (type === "date") {
                value = value.toDateString()
            } else if (type === "time") {
                value = value.toTimeString()
            } else if (type === "datetime") {
                value = value.toLocaleDateString()
            }
        }
        return value;
    }

    isSelected(option) {
        return this.state.tmp_selected.indexOf(option.value) !== -1
    }

    toggleSelected(option) {
        const {multiple, onOptionSelect} = this.props;
        if (multiple) {
            updateState(this, state => {
                if (this.isSelected(option)) {
                    _.pull(state.tmp_selected, option.value)
                } else {
                    state.tmp_selected.push(option.value)
                }
                return state;
            })
        } else {
            this.setState({
                value: option.value ? option.label : null
            })
            this.unfocus()
            onOptionSelect && onOptionSelect(option)
        }
    }

    selectOption(option) {
        const {onOptionSelect} = this.props;
        this.setState({selected: option.value})
        this.unfocus()
        onOptionSelect && onOptionSelect(option)
    }

    selectedOptions() {
        return this.state.tmp_selected.map(val => this.props.options.find(({value}) => value === val)).filter(value => !!value)
    }

    unfocus() {
        this.setState({focused: false})
    }

    focus() {
        const {onFocus} = this.props;
        this.setState({focused: true})
        onFocus && onFocus()
    }

    handleFocus() {
        const {options, selectionMode, disabled, multiple, label} = this.props;

        if (disabled)
            return;

        if (options && selectionMode === "ActionSheet" && !multiple) {
            ActionSheet.show({
                options: [...options.map(({label}) => label), "Cancel"],
                title: label,
                destructiveButtonIndex: options.indexOf(options.find(({value}) => !value)),
                cancelButtonIndex: options.length
            }, index => {
                const option = options[index];
                if (option) {
                    this.selectOption(option)
                }
            })
        }
        this.focus()
    }

    render(): React.ReactNode {
        const {styles, options, disabled, datepickerProps, type, icon, onFocus, selectionMode, onDateSelect, onSubmitEditing, onChangeText, onOptionSelect, inputProps, numberOfLines, label, placeholder, multiple} = this.props;
        let {value, focused} = this.state;
        const is_picker = type === "date" || type === "time" || type === "datetime" || !!options
        return <View style={styles.root}>
            <View style={{
                position: "relative",
                minHeight: 50,
                flexDirection: "column",
                justifyContent: "flex-end"
            }}>
                {
                    !!label &&
                    <Animated.Text style={{
                        ...styles.label,
                        fontSize: this.state.labelFontSize,
                        top: this.state.labelTop
                    }}>
                        {label}
                    </Animated.Text>
                }
                {
                    is_picker ?
                        <TouchableOpacity onPress={() => {
                            this.handleFocus()
                        }}>
                            <Text numberOfLines={1} style={{
                                paddingTop: 12,
                                flexDirection: "column",
                                ...styles.input,
                                ...styles.button
                            }}>{value}</Text>
                        </TouchableOpacity>
                        :
                        <TextInput
                            placeholder={placeholder}
                            value={value || value === 0 ? String(value) : ''}
                            onSubmitEditing={onSubmitEditing}
                            secureTextEntry={type === "password"}
                            onChangeText={value => {
                                this.setState({value})
                                onChangeText && onChangeText(value)
                            }}
                            editable={!disabled}
                            onBlur={() => this.unfocus()}
                            onFocus={() => this.focus()}
                            style={styles.input}
                            {...inputProps}
                        />
                }
                {
                    icon && <View style={{position: "absolute", right: 12, top: 12}}>
                        {icon}
                    </View>
                }
                {
                    (type === "date" || type === "time" || type === "datetime") && <DateTimePicker
                        confirmTextIOS={"Confirm"}
                        isVisible={!!this.state.focused}
                        date={this.state.date || new Date()}
                        onConfirm={date => {
                            this.unfocus()
                            const value = this.transformValueToString(date)
                            this.setState({date, value})
                            onDateSelect && onDateSelect(date)
                        }}
                        titleIOS={label}
                        onCancel={() => this.setState({focused: false})}
                        mode={type === "date" ? "date" : type === "datetime" ? "datetime" : "time"}
                        {...datepickerProps}
                    />
                }
            </View>
            <View style={styles.underline}/>
            {
                !!options && (selectionMode === "Modal" || multiple) &&
                <Modal animated animationType="slide" onShow={() => {
                    if (multiple) {
                        this.setState({tmp_selected: [...this.state.selected]})
                    }
                }} visible={focused} onRequestClose={() => this.unfocus()}>
                    <Header androidStatusBarColor={styles.header.backgroundColor} style={styles.header}>
                        <Body>
                            <Title>
                                {label}
                            </Title>
                        </Body>
                        <Icon
                            onPress={() => this.unfocus()} style={{...styles.closeButton, position: "absolute"}}
                            name="x" type="Feather"
                        />
                    </Header>
                    <SafeAreaView style={styles.safeAreaView}>
                        <View style={{flex: 1, backgroundColor: "white", padding: 8, paddingBottom: 20}}>
                            <ScrollView style={{flex: 1, margin: -8}}>
                                <List>
                                    {
                                        options.map(option =>
                                            <ListItem
                                                key={option.value}
                                                onPress={() => this.toggleSelected(option)}
                                            >
                                                <Left>
                                                    <Text>{option.label}</Text>
                                                </Left>
                                                {
                                                    multiple &&
                                                    <Right style={{marginRight: 15}}>
                                                        <CheckBox
                                                            onPress={() => this.toggleSelected(option)}
                                                            checked={this.isSelected(option)}
                                                            color="green"
                                                        />
                                                    </Right>
                                                }
                                            </ListItem>
                                        )
                                    }
                                </List>
                            </ScrollView>
                            {
                                multiple &&
                                <View style={{flexDirection: "row"}}>
                                    <View style={{padding: 8, flex: 1}}>
                                        <Button
                                            style={styles.confirmButton}
                                            full
                                            onPress={() => {
                                                const options = this.selectedOptions()
                                                this.setState({selected: options.map(({value}) => value)})
                                                onOptionSelect && onOptionSelect(options)
                                                this.unfocus()
                                            }}
                                        >
                                            <Text style={styles.confirmButtonText}>Choose</Text>
                                        </Button>
                                    </View>
                                </View>
                            }
                        </View>
                    </SafeAreaView>
                </Modal>
            }
        </View>
    }
}
