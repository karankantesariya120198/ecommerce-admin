import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Card, Flex, Form, Select } from "antd";
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
            const resultAction = await dispatch(signupUser({
                ...values,
                password: encodeURIComponent(values.password),
                confirm: encodeURIComponent(values.confirm)
            }));

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

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    };

    return (
        <Flex
            justify="center"
            align="center"
            style={{
                height: "100vh",
            }}
        >
            <Card
                hoverable={true}
                size="default"
                style={{
                    width: "100%",
                    maxWidth: "500px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "rgba(255, 255, 255, 0.6)",
                }}
                title={
                    <Flex justify="center" align="center" style={{ marginBottom: "8px", marginTop: "16px" }}>
                        <UserOutlined style={{ fontSize: 48, color: "#1677ff" }} />
                    </Flex>
                }
            >
                {contextHolder}
                <Form 
                    form={form} 
                    name="register" 
                    onFinish={onFinish} 
                    initialValues={{ prefix: "91" }}
                    {...formItemLayout}
                    scrollToFirstError
                >
                    <FormInput
                        name="email"
                        label="E-mail"
                        rules={[
                            { type: "email", message: "The input is not valid E-mail" },
                            { required: true, message: "Please input your E-mail" }
                        ]}
                    />

                    <FormInput
                        name="password"
                        label="Password"
                        type="password"
                        hasFeedback
                        rules={[{ required: true, message: "Please input your password" }]}
                    />

                    <FormInput
                        name="confirm"
                        label="Confirm Password"
                        type="password"
                        hasFeedback
                        rules={[
                            { required: true, message: "Please confirm your password" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Passwords do not match"));
                                }
                            })
                        ]}
                    />

                    <FormInput
                        name="nickname"
                        label="Nickname"
                        tooltip="What do you want others to call you?"
                        rules={[{ required: true, message: "Please input your nickname", whitespace: true }]}
                    />

                    <FormInput
                        name="phone"
                        label="Phone Number"
                        addonBefore={prefixSelector}
                        rules={[{ required: true, message: "Please input your phone number" }]}
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

                    <FormButton htmlType="submit" block ={true}>
                        Sign Up
                    </FormButton>
                    <div style={{ marginTop: "16px", textAlign: "end" }}>
                        <a 
                            style={{
                                fontWeight: 500,
                                color: '#646cff',
                                textDecoration: 'inherit',
                                marginTop: '10px'
                            }}
                            onClick={(e) => { e.preventDefault(); navigate('/login') }}
                        >
                            or Login now!
                        </a>
                    </div>
                </Form>
            </Card>
        </Flex>
    );
}

export default Signup;
