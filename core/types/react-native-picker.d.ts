// filepath: /c:/Users/fujid/Desktop/CSB430/JobOfferRatingTool/JobOfferTool/types/react-native-picker.d.ts
declare module '@react-native-picker/picker' {
    import { ComponentType } from 'react';
    import { ViewProps } from 'react-native';
  
    export interface PickerProps extends ViewProps {
      selectedValue?: any;
      onValueChange?: (itemValue: any, itemIndex: number) => void;
      enabled?: boolean;
      mode?: 'dialog' | 'dropdown';
      prompt?: string;
      itemStyle?: any;
    }
  
    export interface PickerItemProps {
      label: string;
      value: any;
      color?: string;
    }
  
    export const Picker: ComponentType<PickerProps> & {
      Item: ComponentType<PickerItemProps>;
    };
    
    declare module '@react-native-picker/picker' {
  import { ComponentType } from 'react';
  import { ViewProps } from 'react-native';

  export interface PickerProps extends ViewProps {
    selectedValue?: any;
    onValueChange?: (itemValue: any, itemIndex: number) => void;
    enabled?: boolean;
    mode?: 'dialog' | 'dropdown';
    prompt?: string;
    itemStyle?: any;
  }

  export interface PickerItemProps {
    label: string;
    value: any;
    color?: string;
  }

  export const Picker: ComponentType<PickerProps>;
  export const PickerItem: ComponentType<PickerItemProps>;
}
  }