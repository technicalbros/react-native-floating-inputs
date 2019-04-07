# @technicalbros/react-native-floating-inputs

All in one floating inputs for react native. Currently it supports password, date, datetime, time & select.

**Installation**

1. Run `yarn add lodash native-base moment` or `npm install lodash native-base`
2. Run `react-native link`

**Basic Usage**

```tsx
import * as React from "react";
import {FloatingInput} from "@technicalbros/react-native-floating-inputs";

export default class AppComponent extends React.Component{
    
    state = {
        value: ""
    }
    
    render(){
        return <View style={{flex:1}}>
        	<FloatingInput
            	value={this.state.value}
                onChangeText={value => this.setState({value})}
            />
        </View>
    }
    
}
```

**Prop Types Declaration**

```typescript
class FloatingInput extends React.Component<{
    inputProps?: TextInputProps;
    styles?: {
        closeButton?: any;
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
    type?: "date" | "password" | "text" | "time" | "datetime";
    numberOfLines?: number;
    disabled?: boolean;
    options?: any[];
    selected?: any;
    onOptionSelect?: (option: any) => void;
    datepickerProps?: DateTimePickerProps;
    onSubmitEditing?: () => void;
    date?: Date;
    onDateSelect?: (date: Date) => void;
    placeholder?: string;
    onFocus?: () => void;
    onChangeText?: (value: string) => void;
}> {
    floatLabel(): void;
    unFloatLabel(): void;
    refreshLabel(): void;
    transformValueToString(value: any): any;
    isSelected(option: any): boolean;
    toggleSelected(option: any): void;
    selectOption(option: any): void;
    selectedOptions(): any;
    unfocus(): void;
    focus(): void;
    handleFocus(): void;
    render(): React.ReactNode;
}

```

