import * as React from "react";
import { TextInputProps } from "react-native";
export declare class FloatingInput extends React.Component {
    props: {
        inputProps?: TextInputProps;
        styles?: {
            input?: any;
            label?: any;
            floatingLabel?: any;
            underline?: any;
            button?: any;
            root?: any;
        };
        multiline?: boolean;
        value?: string;
        label?: string;
        type?: "date" | "password" | "text";
        numberOfLines?: number;
        options?: any[];
        selected?: any;
        onOptionSelect?: (option: any) => void;
        date?: Date;
        onDateSelect?: (date: Date) => void;
        placeholder?: string;
        onFocus?: () => void;
        onChangeText?: (value: string) => void;
    };
    state: any;
    floatLabel(): void;
    unFloatLabel(): void;
    refreshLabel(): void;
    constructor(props: any);
    componentDidMount(): void;
    componentDidUpdate(prevProps: any, prevState: any): void;
    handleFocus(): void;
    render(): React.ReactNode;
}
