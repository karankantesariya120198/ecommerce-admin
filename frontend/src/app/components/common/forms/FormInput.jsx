import { Form, Input, InputNumber } from 'antd';

const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};

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
            {...formItemLayout}
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