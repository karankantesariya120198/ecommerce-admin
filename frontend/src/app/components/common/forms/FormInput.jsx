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
    ...rest 
}) => {
    let inputElement = <Input placeholder={placeholder} addonBefore={addonBefore} {...rest} />;
    if (type === "password") {
        inputElement = <Input.Password placeholder={placeholder} addonBefore={addonBefore} {...rest} />;
    } else if (type === "textarea") {
        inputElement = <Input.TextArea placeholder={placeholder} {...rest} />;
    } else if (type === "number") {
        inputElement = <InputNumber placeholder={placeholder} {...rest} />;
    } else {
        inputElement = <Input placeholder={placeholder} addonBefore={addonBefore} {...rest} />;
    }

    return (
        <Form.Item
            name={name}
            label={label}
            rules={rules}
            tooltip={tooltip}
            hasFeedback={hasFeedback}
            style={{ width: "100%" }}
        >
            {inputElement}
        </Form.Item>
    );
};

export default FormInput;