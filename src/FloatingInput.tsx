import * as React from "react";
import {TextInput, View, Text, Animated, TextInputProps, TouchableOpacity} from "react-native";
import {withStyles} from "@technicalbros/react-native-styles";
import {ActionSheet} from "native-base";
import DateTimePicker from "react-native-modal-datetime-picker";


// @ts-ignore
@withStyles({
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
    }
})
export class FloatingInput extends React.Component {

    // @ts-ignore
    props: {
        inputProps?: TextInputProps,
        styles?: {
            input?: any,
            label?: any,
            floatingLabel?: any,
            underline?: any,
            button?: any,
            root?: any
        },
        multiline?: boolean,
        value?: string,
        label?: string,
        type?: "date" | "password" | "text"
        numberOfLines?: number,
        options?: any[],
        selected?: any,
        onOptionSelect?: (option: any) => void,
        date?: Date,
        onDateSelect?: (date: Date) => void,
        placeholder?: string,
        onFocus?: () => void,
        onChangeText?: (value: string) => void
    }

    state: any = {
        labelTop: new Animated.Value(20),
        labelFontSize: new Animated.Value(16),
        focused: false,
        selected: this.props.selected,
        value: this.props.value
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
        if (this.props.selected && this.props.options) {
            const option = this.props.options.find(({value}) => value === this.state.selected);
            if (option) this.state.value = option.label;
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

        if (this.state.selected !== prevState.selected && this.props.options) {
            this.setState({value: this.props.options.find(({value}) => value === this.state.selected)})
        }

        if (this.state.focused !== prevState.focused) {
            this.refreshLabel()
        }

        if (this.props.onChangeText && this.state.value !== prevState.value) {
            this.props.onChangeText(this.state.value)
        }

        if (this.props.date !== undefined && this.props.date !== prevProps.date) {
            this.setState({value: this.props.date.toDateString()})
        }
    }

    handleFocus() {
        const {options, onOptionSelect, label} = this.props;
        if (this.props.options) {
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

    render(): React.ReactNode {
        const {styles, options, type, onFocus, onDateSelect, inputProps, numberOfLines, label, placeholder} = this.props;
        let {value} = this.state;
        const is_picker = type === "date" || !!options
        return <View style={{flexDirection: "column", ...styles.root}}>
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
                            secureTextEntry={type === "password"}
                            onChangeText={value => this.setState({value})}
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
        </View>
    }

}
