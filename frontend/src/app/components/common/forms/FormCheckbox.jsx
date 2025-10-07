import { Form, Checkbox } from 'antd';

const FormCheckbox = ({ 
    name, 
    rules = [], 
    children, 
    ...rest 
}) => {
    return (
        <Form.Item 
            name={name} 
            valuePropName="checked" 
            rules={rules} 
            style={{ marginBottom: 16 }} 
            {...rest}
        >
            <Checkbox>
                {children}
            </Checkbox>
        </Form.Item>
    );
};

export default FormCheckbox;