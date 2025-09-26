import { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Modal, Form, Upload, Button } from "antd";
import { UploadOutlined, CloseOutlined } from '@ant-design/icons';
import { FormInput } from "../../components/common/forms/index";
import { MessageNotification } from "../../components/common/index";
import { addCategory, updateCategory } from "../../store/slices/index";

const CategoryForm = ({ open, onOk, onCancel, initialValues }) => {
    const [form] = Form.useForm();
    const fileRef = useRef();
    const { contextHolder, show } = MessageNotification();
    const dispatch = useDispatch();

    // Set initial values for edit (useEffect instead of render)
    useEffect(() => {
        if (open && initialValues) {
            form.setFieldsValue({
                name: initialValues.name,
                icon: initialValues.file ? [{
                    uid: initialValues.file.id,
                    thumbUrl: initialValues.file.base64Url,
                    name: initialValues.file.name,
                    size: initialValues.file.sizeKB * 1024, // Convert KB to Bytes
                    type: `${initialValues.file.type}/${initialValues.file.format}`,
                }] : [],
                quantity: initialValues.quantity
            });
        } else if (open && !initialValues) {
            form.resetFields();
        }
    }, [open, initialValues]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (initialValues) {
                // Edit category
                dispatch(updateCategory({ id: initialValues.id, data: values }));
            } else {
                // Create category
                dispatch(addCategory(values));
                show("success", "Subcategory added successfully.");
            }
            form.resetFields();
            onOk(true);
        } catch (error) {
            if (error?.response) {
                if (error.response.status === 400 && error.response.data?.errors) {
                    const serverErrors = error.response.data.errors;
                    const fieldErrors = Object.keys(serverErrors).map(key => ({
                        name: key,
                        errors: [serverErrors[key]]
                    }));
                    form.setFields(fieldErrors);
                } else if (error.response.status === 409) {
                    show("error", error.response.data?.error || "Category name already exists.");
                } else {
                    // Other known server errors
                    show("error", error.response.data?.message || "Something went wrong.");
                }
            } else {
                console.error("Category operation error:", error?.stack || error);
            }
        }
    };

    const handleCancel = () => {
        onCancel();
        form.resetFields();
    };

    return (
        <Modal
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            width={500}
            centered
            footer={null}
            closable={false}
            bodyStyle={{ padding: 0, borderRadius: 12, overflow: 'hidden' }}
        >
            {/* Custom Header */}
            <div 
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '20px 24px 12px 24px', 
                    borderBottom: '1px solid #f0f0f0', 
                    background: '#fff', 
                    borderTopLeftRadius: 12, 
                    borderTopRightRadius: 12 
                }}
            >
                <div style={{ fontWeight: 600, fontSize: 20 }}>
                    {initialValues ? "Edit Category" : "Add Category"}
                </div>
                <Button
                    type="text"
                    icon={<CloseOutlined style={{ fontSize: 18 }} />}
                    onClick={handleCancel}
                    style={{ color: '#999999ff', boxShadow: 'none' }}
                />
            </div>
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                style={{ width: "100%", padding: "10px", background: "#fff" }}
            >
                <FormInput
                    name="name"
                    label="Category Name"
                    placeholder="Please enter category name"
                    rules={[{ required: true, message: 'Please enter category name' }]}
                />
                <Form.Item
                    name="icon"
                    label="Category Icon"
                    valuePropName="fileList"
                    getValueFromEvent={e => Array.isArray(e) ? e : e && e.fileList}
                    rules={[{ required: true, message: 'Please upload a category icon' }]}
                >
                    <Upload
                        name="icon"
                        listType="picture"
                        maxCount={1}
                        beforeUpload={() => false}
                        accept="image/*"
                        ref={fileRef}
                        defaultFileList={
                            initialValues?.iconUrl
                                ? [
                                    {
                                        url: initialValues.iconUrl,
                                    },
                                ]
                                : []
                        }
                        style={{ width: "100%" }}
                    >
                        <Button icon={<UploadOutlined />} style={{ width: "100%", height: 44, textAlign: "left" }}>Click to Upload</Button>
                    </Upload>
                </Form.Item>
                <FormInput
                    name="quantity"
                    label="Quantity"
                    type="number"
                    placeholder="Please enter quantity"
                    rules={[
                        { required: true, message: 'Please enter quantity' },
                        { type: 'number', min: 0, message: 'Quantity must be a non-negative number' }
                    ]}
                    style={{ width: "100%" }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                    <Button onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button type="primary" onClick={handleOk} >
                        {initialValues ? 'Update' : 'Add'}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default CategoryForm;