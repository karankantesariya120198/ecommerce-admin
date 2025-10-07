import { Form, Checkbox } from 'antd';

const FormCheckbox = ({ 
    name, 
    rules = [], 
    children, 
    id,
    ...rest 
}) => {
    const inputId = id || `form-checkbox-${name}`;
    return (
        <Form.Item 
            name={name} 
            valuePropName="checked" 
            rules={rules} 
            style={{ marginBottom: 16 }} 
            htmlFor={inputId}
            {...rest}
        >
            <Checkbox id={inputId}>
                {children}
            </Checkbox>
        </Form.Item>
    );
};

export default FormCheckbox;