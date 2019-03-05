import * as React from "react";
import {
    TextInput,
    View,
    Text,
    Animated,
    TextInputProps,
    TouchableOpacity,
    Modal,
    SafeAreaView,
    ScrollView
} from "react-native";
import {
    ActionSheet,
    List,
    ListItem,
    Header,
    Body,
    Left,
    Right,
    CheckBox,
    Button,
    Title, Root
} from "native-base";
import DateTimePicker from "react-native-modal-datetime-picker";
import {updateState} from "react-extended-component";
import * as _ from "lodash";
import withStyles from "@technicalbros/react-native-styles/withStyles";


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
    label: {
        position: "absolute",
    },
    floatingLabel: {
        top: 0,
        fontSize: 12
    },
    safeAreaView: {
        flex: 1,
    }
})
export class FloatingInput extends React.Component<{
    inputProps?: TextInputProps,
    styles?: {
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
    icon?: any,
    multiple?: boolean,
    multiline?: boolean,
    selectionMode?: "ActionSheet" | "Modal"
    value?: string,
    label?: string,
    type?: "date" | "password" | "text"
    numberOfLines?: number,
    options?: any[],
    selected?: any,
    onOptionSelect?: (option: any) => void,
    onSubmitEditing?: () => void,
    date?: Date,
    onDateSelect?: (date: Date) => void,
    placeholder?: string,
    onFocus?: () => void,
    onChangeText?: (value: string) => void
}> {

    state: any = {
        labelTop: new Animated.Value(20),
        labelFontSize: new Animated.Value(16),
        focused: false,
        value: this.props.value
    }

    static defaultProps = {
        selectionMode: "ActionSheet"
    }

    floatLabel() {
        Animated.spring(this.state.labelTop, {
            toValue: 0
        }).start()
        Animated.spring(this.state.labelFontSize, {
            toValue: 12
        }).start()
    }

    unFloatLabel() {
        Animated.spring(this.state.labelTop, {
            toValue: 20
        }).start()
        Animated.spring(this.state.labelFontSize, {
            toValue: 16
        }).start()
    }

    refreshLabel() {
        if (this.state.value || this.state.focused) {
            this.floatLabel()
        } else {
            this.unFloatLabel()
        }
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
            this.setState({value: this.props.value})
            this.refreshLabel()
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

        if (this.state.focused !== prevState.focused) {
            this.refreshLabel()
        }

        if (this.props.date !== undefined && this.props.date !== prevProps.date) {
            this.setState({value: this.props.date.toDateString()})
        }
    }

    render(): React.ReactNode {
        const {styles, options, type, icon, onFocus, selectionMode, onDateSelect, onSubmitEditing, onChangeText, onOptionSelect, inputProps, numberOfLines, label, placeholder, multiple} = this.props;
        let {value, focused} = this.state;
        const is_picker = type === "date" || !!options
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
                            <Text style={{
                                paddingTop: 12,
                                flexDirection: "column",
                                ...styles.input,
                                ...styles.button
                            }}>{value}</Text>
                        </TouchableOpacity>
                        :
                        <TextInput
                            placeholder={placeholder}
                            value={value}
                            onSubmitEditing={onSubmitEditing}
                            secureTextEntry={type === "password"}
                            onChangeText={value => {
                                this.setState({value})
                                onChangeText && onChangeText(value)
                            }}
                            onBlur={() => {
                                this.setState({focused: false})
                            }}
                            onFocus={() => {
                                this.setState({focused: true})
                                onFocus && onFocus()
                            }}
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
                    type === "date" && <DateTimePicker
                        confirmTextIOS={"Confirm"}
                        isVisible={!!this.state.focused}
                        date={this.state.date || new Date()}
                        onConfirm={date => {
                            this.setState({date, value: date.toDateString(), focused: false})
                            onDateSelect && onDateSelect(date)
                        }}
                        titleIOS={label}
                        onCancel={() => this.setState({focused: false})}
                        mode={"date"}
                    />
                }
            </View>
            <View style={styles.underline}/>
            {
                !!options && (selectionMode === "Modal" || multiple) &&
                <Modal animated animationType="slide" onShow={() => {
                    if (multiple) {
                        this.setState({selected: [...this.props.selected]})
                    } else {
                        this.setState({selected: this.props.selected})
                    }
                }} visible={focused} onRequestClose={() => this.unfocus()}>
                    <Root>
                        <Header style={styles.header}>
                            <Body style={{flexDirection: "row", justifyContent: "center"}}>
                            <Title style={{textAlign: "center", padding: 8}}>
                                {label}
                            </Title>
                            </Body>
                        </Header>
                        <SafeAreaView style={styles.safeAreaView}>
                            <View style={{flex: 1, backgroundColor: "white", padding: 8, paddingBottom: 20}}>
                                <ScrollView style={{flex: 1}}>
                                    <List style={{padding: 8}}>
                                        {
                                            options.map(option =>
                                                <ListItem
                                                    key={option.value}
                                                    selected={!multiple && option.value === this.state.selected}
                                                    onPress={() => {
                                                        if (multiple) {
                                                            updateState(this, state => {
                                                                if (this.isSelected(option)) {
                                                                    _.pull(state.selected, option.value)
                                                                } else {
                                                                    state.selected.push(option.value)
                                                                }
                                                                return state;
                                                            })
                                                        } else {
                                                            this.setState({
                                                                value: option.value ? option.label : null,
                                                                focused: false
                                                            })
                                                            onOptionSelect && onOptionSelect(option)
                                                        }
                                                    }}
                                                >
                                                    <Left>
                                                        <Text>{option.label}</Text>
                                                    </Left>
                                                    {
                                                        multiple &&
                                                        <Right>
                                                            <CheckBox
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
                                                onPress={() => this.unfocus()}
                                                danger
                                                full
                                                style={styles.cancelButton}
                                            >
                                                <Text style={styles.cancelButtonText}>Cancel</Text>
                                            </Button>
                                        </View>
                                        <View style={{padding: 8, flex: 1}}>
                                            <Button
                                                style={styles.confirmButton}
                                                full
                                                onPress={() => {
                                                    const options = this.selectedOptions()
                                                    onOptionSelect && onOptionSelect(options)
                                                    this.setState({value: options.map(({label}) => label).join(", ")})
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
                    </Root>
                </Modal>
            }
        </View>
    }

    isSelected(option) {
        return this.state.selected.indexOf(option.value) !== -1
    }

    unfocus() {
        this.setState({focused: false})
    }

    selectedOptions() {
        return this.state.selected.map(val => this.props.options.find(({value}) => value === val))
    }

    handleFocus() {
        const {options, selectionMode, onOptionSelect, multiple, label} = this.props;
        if (options && selectionMode === "ActionSheet" && !multiple) {
            ActionSheet.show({
                options: [...options.map(({label}) => label), "Cancel"],
                title: label,
                destructiveButtonIndex: options.indexOf(options.find(({value}) => !value)),
                cancelButtonIndex: options.length
            }, index => {
                const option = options[index];
                if (option) {
                    this.setState({value: option.value ? option.label : null, focused: false})
                    onOptionSelect && onOptionSelect(option)
                }
            })
        }
        this.setState({focused: true})
    }
}
