import { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Modal, Form, Upload, Button, Row, Col, Switch, Input } from "antd";
import { UploadOutlined, PlusOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { FormButton, FormInput, FormSelect } from "../../components/common/forms/index";
import { MessageNotification } from "../../components/common/index";
import { addCategory, updateCategory, deleteCategory } from "../../store/slices/categorySlice";

const CategoryForm = ({ open, onOk, onCancel, initialValues, data }) => {
    const [form] = Form.useForm();
    const fileRef = useRef();
    const { contextHolder, show } = MessageNotification();
    const dispatch = useDispatch();
    const categories = data || [];

    // Set initial values for edit (useEffect instead of render)
    useEffect(() => {
        if (open && initialValues) {
            form.setFieldsValue({
                name: initialValues.name,
                slug: initialValues.slug,
                description: initialValues.description,
                parent_id: initialValues.parent_id ?? null,
                status: initialValues.status,
                featured: initialValues.featured ? true : false,
                specifications: initialValues.specifications && initialValues.specifications.length > 0 ? initialValues.specifications : [],
                icon: initialValues.file ? [{
                    uid: initialValues.file.id,
                    thumbUrl: initialValues.file.base64Url,
                    name: initialValues.file.name,
                    size: initialValues.file.sizeKB * 1024, // Convert KB to Bytes
                    type: `${initialValues.file.type}/${initialValues.file.format}`,
                }] : [],
            });
        } else if (open && !initialValues) {
            form.resetFields();
        }
    }, [open, initialValues]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const isEdit = Boolean(initialValues);
            const action = isEdit ? 'updateCategory' : 'addCategory';
            const payload = isEdit ? { id: initialValues.id, data: values } : values;
            // Dispatch redux action
            const result = await dispatch(eval(action)(payload));
            const response = result.payload;
            if (response.success === false) {
                if (response.errors && typeof response.errors === 'object') {
                    const fieldErrors = Object.entries(response.errors).map(([key, val]) => ({
                        name: key,
                        errors: Array.isArray(val) ? val : [val],
                    }));
                    form.setFields(fieldErrors);
                } else if (response.errors) {
                    show("error", response.errors || "Failed to process category.");
                } else {
                    show("error", response.message || "Failed to process category.");
                }
            } else {
                show("success", `Category ${isEdit ? 'updated' : 'added'} successfully.`);
                form.resetFields();
                onOk(true);
            }
        } catch (error) {
            console.error("Failed to category submit form:", error);
            show("error", error.message || "Failed to process category.");
        }
    };

    const handleCancel = () => {
        onCancel();
        form.resetFields();
    };

    return (
        <Modal
            title={
                <div key="header" className="gradient-text-btn" style={{ borderBottom: '1px solid #eee', paddingBottom: 15, fontSize: '20px', fontWeight: 'bold'}}>
                    <span>{initialValues ? "Edit Category" : "Add Category"}</span>
                </div>
            }
            open={open}
            onCancel={handleCancel}
            width={700}
            style={{ top: 80 }}
            footer={[
                <div key="footer" style={{ borderTop: '1px solid #eee', paddingTop: 15, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <FormButton
                        htmlType="button"
                        type="primary"
                        children="Cancel"
                        onClick={handleCancel}
                    />
                    <FormButton
                        children="Submit"
                        htmlType="submit"
                        type="primary"
                        onClick={handleOk}
                    />
                </div>
            ]}
            closable={false} // Remove close icon in the header
        >
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                name="categoryForm"
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <FormInput
                            name="name"
                            label="Category Name"
                            placeholder="Please enter category name"
                            rules={[{ required: true, message: 'Please enter category name' }]}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            name="slug"
                            label="Category Slug"
                            placeholder="Please enter category slug"
                            rules={[{ required: true, message: 'Please enter category slug' }]}
                        />
                    </Col>
                </Row>

                <FormInput
                    name="description"
                    label="Category Description"
                    type="textarea"
                    placeholder="Please enter category description"
                    rules={[{ required: true, message: 'Please enter category description' }]}
                />

                <Row gutter={16}>
                    <Col span={12}>
                        <FormSelect
                            name="parent_id"
                            label="Parent Category"
                            placeholder="Please select a parent category"
                            options={categories.filter(cat => !cat.parent_id).map(cat => ({ label: cat.name, value: cat.id }))}
                        />
                    </Col>
                    <Col span={6}>
                        <FormSelect
                            name="status"
                            label="Status"
                            placeholder="Select your status"
                            rules={[{ required: true, message: "Please select a status!" }]}
                            options={[
                                { label: "Active", value: 1 },
                                { label: "Inactive", value: 0 }
                            ]}
                        />  
                    </Col>
                    <Col span={6}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Form.Item
                                name="featured"
                                label="Featured"
                                id="featured-switch"
                                valuePropName="checked"
                                style={{ textAlign: 'center' }}
                            >
                                <Switch />
                            </Form.Item>
                        </div>
                    </Col>
                </Row>

                {/* Specifications Field */}
                <Form.Item
                    name="specifications"
                    label="Category Specifications"
                    id="specifications"
                >
                    <Form.List name="specifications">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Row key={key} gutter={8} style={{ marginBottom: 8 }}>
                                        <Col span={10}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'key']}
                                                rules={[{ required: true, message: 'Missing specification name' }]}
                                            >
                                                <Input placeholder="Specification name (e.g., Warranty)" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'value']}
                                                rules={[{ required: true, message: 'Missing specification value' }]}
                                            >
                                                <Input placeholder="Specification value (e.g., 1 year)" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={2}>
                                            <div style={{ display: 'flex', alignItems: 'center'}}>
                                                <Button
                                                    type="text"
                                                    danger
                                                    icon={<CloseCircleOutlined />}
                                                    onClick={() => remove(name)}
                                                    
                                                >
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                ))}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        block
                                        icon={<PlusOutlined />}
                                    >
                                        Add Specification
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form.Item>

                <Form.Item
                    name="icon"
                    id="category-icon"
                    label="Category Icon"
                    valuePropName="fileList"
                    getValueFromEvent={e => Array.isArray(e) ? e : e && e.fileList}
                    rules={!initialValues?.icon ? [{ required: true, message: 'Please upload a category icon' }] : []}
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
            </Form>
        </Modal>
    );
};

export default CategoryForm;