import { message } from "antd";

/**
 * A reusable Ant Design message notification component.
 * Supports: success, error, warning, info, loading.
 */
const MessageNotification = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const show = (type, content, duration = 3) => {
        messageApi.open({
            type, // 'success' | 'error' | 'warning' | 'info' | 'loading'
            content,
            duration
        });
    };

    return {
        contextHolder, // Must be placed inside component JSX
        show
    };
};

export default MessageNotification;
