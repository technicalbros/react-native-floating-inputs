import * as React from "react";
import { TextInputProps } from "react-native";
export declare class FloatingInput extends React.Component<{
    inputProps?: TextInputProps;
    styles?: {
        input?: any;
        label?: any;
        floatingLabel?: any;
        underline?: any;
        button?: any;
        root?: any;
        safeAreaView?: any;
        header?: any;
        confirmButton?: any;
        cancelButton?: any;
        confirmButtonText?: any;
        cancelButtonText?: any;
    };
    icon?: any;
    multiple?: boolean;
    multiline?: boolean;
    selectionMode?: "ActionSheet" | "Modal";
    value?: string;
    label?: string;
    type?: "date" | "password" | "text";
    numberOfLines?: number;
    options?: any[];
    selected?: any;
    onOptionSelect?: (option: any) => void;
    onSubmitEditing?: () => void;
    date?: Date;
    onDateSelect?: (date: Date) => void;
    placeholder?: string;
    onFocus?: () => void;
    onChangeText?: (value: string) => void;
}> {
    state: any;
    static defaultProps: {
        selectionMode: string;
    };
    floatLabel(): void;
    unFloatLabel(): void;
    refreshLabel(): void;
    constructor(props: any);
    componentDidMount(): void;
    componentDidUpdate(prevProps: any, prevState: any): void;
    render(): React.ReactNode;
    isSelected(option: any): boolean;
    unfocus(): void;
    selectedOptions(): any;
    handleFocus(): void;
}
