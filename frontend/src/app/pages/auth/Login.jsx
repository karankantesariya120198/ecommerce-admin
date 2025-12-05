import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Flex } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { FormInput, FormCheckbox, FormButton } from "../../../app/components/common/forms/index";
import { MessageNotification } from "../../../app/components/common/index";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../app/store/slices/index";

const Login = () => {
    const [form] = Form.useForm();
    const { contextHolder, show } = MessageNotification();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error, isAuthenticated } = useSelector(state => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            form.resetFields();
            navigate('/dashboard');
        }
    }, [isAuthenticated]);

    const onFinish = async values => {
        try {
            await dispatch(loginUser(values)).unwrap();
        } catch (err) {
            show('error', typeof err.error === 'string' ? err.error : 'Login failed. Please try again.');
        }
    };

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
                    {...formItemLayout}
                    form={form}
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    style={{ maxWidth: 360, margin: "auto" }}
                    scrollToFirstError
                >
                    <FormInput
                        name="email"
                        label="E-mail"
                        placeholder="Email Address"
                        rules={[
                            { type: "email", message: "The input is not valid E-mail" },
                            { required: true, message: "Please input your E-mail" },
                        ]}
                    />

                    <FormInput
                        name="password"
                        label="Password"
                        type="password"
                        placeholder="Password"
                        rules={[{ required: true, message: "Please input your Password" }]}
                        hasFeedback
                    />
                
                    <FormCheckbox name="remember">Remember me</FormCheckbox>

                    <FormButton htmlType="submit" block={true}>
                        Log in
                    </FormButton>

                    <div style={{ textAlign: "center", marginTop: "16px" }}>
                        <a
                            onClick={(e) => {
                                e.preventDefault();
                                navigate('/');
                            }}
                            style={{
                                fontWeight: 500,
                                color: '#1677ff',
                                textDecoration: 'inherit',
                            }}
                        >
                            Forgot password
                        </a>
                        {" "}|{" "}
                        <a
                            style={{
                                fontWeight: 500,
                                color: '#1677ff',
                                textDecoration: 'inherit',
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                navigate('/signup');
                            }}
                        >
                            Register now!
                        </a>
                    </div>
                </Form>
            </Card>
        </Flex>
    );
};

export default Login;
