import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Card, Form, Select } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { FormInput, FormButton, FormSelect, FormCheckbox } from "../../../app/components/common/forms/index";
import { MessageNotification } from "../../../app/components/common/index";
import { signupUser } from "../../store/slices/index";

const { Option } = Select;

const Signup = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { contextHolder, show } = MessageNotification();

    const onFinish = async values => {
        try {
            const resultAction = await dispatch(signupUser(values));
            if (signupUser.fulfilled.match(resultAction)) {
                show('success', 'Signup successful!');
                // Reset form fields and redirect to login page  
                form.resetFields();
                navigate("/login");
            } else {
                if (resultAction.payload && resultAction.payload.errors) {
                    const serverErrors = resultAction.payload.errors;
                    const fieldErrors = Object.keys(serverErrors).map(key => ({
                        name: key,
                        errors: [serverErrors[key]]
                    }));
                    form.setFields(fieldErrors);
                } else {
                    show('error', resultAction.payload?.message || 'Signup failed. Please try again.');
                }
            }
        } catch (error) {
            show("error", "An unexpected error occurred. Please try again.");
        }
    };

    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
            <Select style={{ width: 70 }}>
                <Option value="91">+91</Option>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        </Form.Item>
    );

    return (
        <Card
            hoverable={true}
            style={{
                maxWidth: 400,
                margin: "auto",
                padding: "20px",
                backgroundColor: "rgba(255, 255, 255, 0.6)", // Slightly transparent background
                boxShadow: "none",
                border: "none",
            }}
        >
            {contextHolder}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
                <UserOutlined style={{ fontSize: 48, color: "#1677ff" }} />
            </div>

            <Form form={form} name="register" onFinish={onFinish} initialValues={{ prefix: "91" }}>
                <FormInput
                    name="email"
                    label="E-mail"
                    rules={[
                        { type: "email", message: "The input is not valid E-mail!" },
                        { required: true, message: "Please input your E-mail!" }
                    ]}
                />

                <FormInput
                    name="password"
                    label="Password"
                    type="password"
                    hasFeedback
                    rules={[{ required: true, message: "Please input your password!" }]}
                />

                <FormInput
                    name="confirm"
                    label="Confirm Password"
                    type="password"
                    hasFeedback
                    rules={[
                        { required: true, message: "Please confirm your password!" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("Passwords do not match!"));
                            }
                        })
                    ]}
                />

                <FormInput
                    name="nickname"
                    label="Nickname"
                    tooltip="What do you want others to call you?"
                    rules={[{ required: true, message: "Please input your nickname!", whitespace: true }]}
                />

                <FormInput
                    name="phone"
                    label="Phone Number"
                    addonBefore={prefixSelector}
                    rules={[{ required: true, message: "Please input your phone number!" }]}
                />

                <FormInput
                    name="intro"
                    label="Intro"
                    type="textarea"
                    rules={[{ required: true, message: "Please input Intro" }]}
                />

                <FormSelect
                    name="gender"
                    label="Gender"
                    placeholder="Select your gender"
                    rules={[{ required: true, message: "Please select gender!" }]}
                    options={[
                        { label: "Male", value: "male" },
                        { label: "Female", value: "female" },
                        { label: "Other", value: "other" }
                    ]}
                />

                <FormCheckbox
                    name="agreement"
                    rules={[
                        {
                        validator: (_, value) =>
                            value ? Promise.resolve() : Promise.reject(new Error("Should accept agreement"))
                        }
                    ]}
                >
                    I have read the <a href="">agreement</a>
                </FormCheckbox>

                <Form.Item>
                    <FormButton htmlType="submit" block={true}>Register</FormButton>
                    or {' '}
                    <a 
                        style={{
                            fontWeight: 500,
                            color: '#646cff',
                            textDecoration: 'inherit'
                        }}
                        onClick={(e) => { e.preventDefault(); navigate('/login') }}
                    >
                        Login now!
                    </a>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default Signup;
