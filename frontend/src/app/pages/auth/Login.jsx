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
            <Flex justify="center" align="center" style={{ marginBottom: 24 }}>
                <UserOutlined style={{ fontSize: 48, color: "#1677ff" }} />
            </Flex>

            <Form form={form} name="login" initialValues={{ remember: true }} onFinish={onFinish}>
                <FormInput
                    name="email"
                    label="E-mail"
                    placeholder="Email Address"
                    // prefix={<UserOutlined />}
                    rules={[
                        { type: "email", message: "The input is not valid E-mail!" },
                        { required: true, message: "Please input your E-mail!" }
                    ]}
                />

                <FormInput
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="Password"
                    // prefix={<LockOutlined />}
                    rules={[{ required: true, message: "Please input your Password!" }]}
                />

                <FormCheckbox name="remember">Remember me</FormCheckbox>

                <FormButton htmlType="submit" block>
                    Log in
                </FormButton>

                <div style={{ textAlign: "center", marginTop: 8 }}>
                    <a
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/');
                        }}
                        style={{
                            fontWeight: 500,
                            color: '#646cff',
                            textDecoration: 'inherit'
                        }}
                    >
                        Forgot password?
                    </a>
                    {" "}|{" "}
                    <a
                        style={{
                            fontWeight: 500,
                            color: '#646cff',
                            textDecoration: 'inherit'
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
    );
};

export default Login;
