import { forwardRef } from "react";
import { Button } from "antd";
import { createStyles } from 'antd-style';

const useStyle = createStyles(({ prefixCls, css }) => ({
    linearGradientButton: css`
        &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous),
        &.${prefixCls}-btn-dangerous:not([disabled]) {
            position: relative;
            overflow: hidden;
        }
        &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous)::before {
            content: '';
            position: absolute;
            inset: 0;
            z-index: 0;
            background: linear-gradient(135deg, #6253e1, #04befe);
            opacity: 1;
            transition: opacity 0.3s;
            border-radius: inherit;
        }
        &.${prefixCls}-btn-dangerous:not([disabled])::before {
            content: '';
            position: absolute;
            inset: 0;
            z-index: 0;
            background: linear-gradient(135deg, #ff522fcb, #dd2477d8);
            opacity: 1;
            transition: opacity 0.3s;
            border-radius: inherit;
        }
        &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous):hover::before,
        &.${prefixCls}-btn-dangerous:not([disabled]):hover::before {
            opacity: 0.8;
        }
        &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) > span,
        &.${prefixCls}-btn-dangerous:not([disabled]) > span {
            position: relative;
            z-index: 1;
            color: #fff !important;
        }
    `
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
            type={type === 'danger' ? 'default' : type}
            danger={type === 'danger'}
            htmlType={htmlType}
            size={size}
            {...rest}
        >
            {children}
        </Button>
    );
});

export default FormButton;