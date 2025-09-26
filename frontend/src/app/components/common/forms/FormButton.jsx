import { forwardRef } from "react";
import { Button } from "antd";

const FormButton = forwardRef((
    { 
        type = "primary", 
        htmlType = "button",
        block = false,
        size = '',
        children, 
        ...rest 
    }, 
    ref
) => (
    <Button 
        block={block} 
        ref={ref} 
        type={type} 
        htmlType={htmlType} 
        size={size}
        {...rest}
    >
        {children}
    </Button>
));

export default FormButton;