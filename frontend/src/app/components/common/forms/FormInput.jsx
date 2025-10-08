import { Form, Input, InputNumber } from 'antd';


const FormInput = ({ 
    name, 
    label,
    placeholder, 
    type = "text", 
    hasFeedback = false,
    tooltip,
    addonBefore,
    addonAfter,
    rules = [],
    id,
    ...rest 
}) => {
    // Generate a default id if not provided
    const inputId = id || `form-input-${name}`;
    let inputElement;
    if (type === "password") {
        inputElement = <Input.Password id={inputId} placeholder={placeholder} addonBefore={addonBefore} {...rest} />;
    } else if (type === "textarea") {
        inputElement = <Input.TextArea id={inputId} placeholder={placeholder} {...rest} />;
    } else if (type === "number") {
        inputElement = <InputNumber id={inputId} placeholder={placeholder} {...rest} />;
    } else {
        inputElement = <Input id={inputId} placeholder={placeholder} addonBefore={addonBefore} {...rest} />;
    }

    return (
        <Form.Item
            name={name}
            label={label}
            rules={rules}
            tooltip={tooltip}
            hasFeedback={hasFeedback}
            style={{ width: "100%" }}
            htmlFor={inputId}
        >
            {inputElement}
        </Form.Item>
    );
};

export default FormInput;