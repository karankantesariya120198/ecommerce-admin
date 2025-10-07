import { Form, Select } from 'antd';

const FormSelect = ({
    name,
    label,
    placeholder,
    options = [],
    rules = [],
    ...props
}) => {
  return (
    <Form.Item
        name={name}
        label={label}
        rules={rules}
    >
        <Select placeholder={placeholder} {...props}>
            {options.map(
                option => (
                    <Select.Option key={option.value} value={option.value}>
                        {option.label}
                    </Select.Option>
                )
            )}
        </Select>
    </Form.Item>
  );
};

export default FormSelect;  