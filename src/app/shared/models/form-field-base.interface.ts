export interface FormFieldBase {
    label: string;
    formControlName: string;
    type: string;
    required?: boolean;
    placeholder?: string;
    errorMessage?: {[key: string]: string};
    validators?: any[];
    asyncValidators?: any[];
    width?: string;
}