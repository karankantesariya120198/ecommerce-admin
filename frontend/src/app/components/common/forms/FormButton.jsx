import { forwardRef } from "react";
import { Button } from "antd";
import { createStyles } from 'antd-style';

const useStyle = createStyles(({ prefixCls, css }) => ({
    linearGradientButton: css`
        &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
            > span {
                position: relative;
            }

            &::before {
                content: '';
                background: linear-gradient(135deg, #6253e1, #04befe);
                position: absolute;
                inset: -1px;
                opacity: 1;
                transition: all 0.3s;
                border-radius: inherit;
            }

            &:hover::before {
                opacity: 0;
            }
        }
    `,
}));

const FormButton = forwardRef((
    { 
        type = "", 
        htmlType = "button",
        block = false,
        size = '',
        children, 
        ...rest 
    }, 
    ref
) => {
    const { styles } = useStyle();
    return (
        <Button
            className={styles.linearGradientButton}
            block={block}
            ref={ref}
            type={type}
            htmlType={htmlType}
            size={size}
            {...rest}
        >
            {children}
        </Button>
    );
});

export default FormButton;