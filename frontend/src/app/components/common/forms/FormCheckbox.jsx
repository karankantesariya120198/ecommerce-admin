import { Form, Checkbox } from 'antd';

const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};

const FormCheckbox = ({ 
    name, 
    rules = [], 
    children, 
    ...rest 
}) => {
    return (
        <Form.Item 
            {...formItemLayout}
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