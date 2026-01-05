import { useRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Col, Form, Modal, Row, Upload, Button, Switch, Input } from "antd";
import { CloseCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { FormButton, FormInput, FormSelect } from "../../components/common/forms";
import { MessageNotification } from "../../components/common";
import { addSubcategory, updateSubcategory, fetchCategories } from "../../store/slices/index";

const SubcategoryForm = ({ open, onOk, onCancel, initialValues }) => {
    const [form] = Form.useForm();
    const fileRef = useRef();
    const { contextHolder, show } = MessageNotification();
    const dispatch = useDispatch();
    const [categoryOptions, setCategoryOptions] = useState([]);

    // Fetch categories when modal opens
    useEffect(() => {
        if (open) {
            dispatch(fetchCategories())
                .unwrap()
                .then(data => {
                    let result = data.payload;
                    if (Array.isArray(result) && result.length > 0) {
                        setCategoryOptions(result.map(cat => ({ label: cat.name, value: cat.id })));
                    }
                })
                .catch(() => setCategoryOptions([]));
        }
    }, [open, dispatch]);

    // Set initial values for edit (useEffect instead of render)
    useEffect(() => {
        if (open && initialValues) {
            form.setFieldsValue({
                name: initialValues.name,
                slug: initialValues.slug,
                specifications: initialValues.specifications && initialValues.specifications.length > 0 ? initialValues.specifications : [],
                featured: initialValues.featured ? true : false,
                icon: initialValues.file ? [{
                    uid: initialValues.file.id,
                    thumbUrl: initialValues.file.base64Url,
                    name: initialValues.file.name,
                    size: initialValues.file.sizeKB * 1024, // Convert KB to Bytes
                    type: `${initialValues.file.type}/${initialValues.file.format}`,
                }] : [],
                category_id: initialValues.category_id,
                status: initialValues.status,
                description: initialValues.description,
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
                dispatch(updateSubcategory({ id: initialValues.id, data: values }));
                form.resetFields();
                onOk(true);
            } else {
                // Create category
                dispatch(addSubcategory(values));
                form.resetFields();
                onOk(true);
            }
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
    };

    return (
        <Modal
            title= {
                <div key="header" className="gradient-text-btn" style={{ borderBottom: '1px solid #eee', paddingBottom: 15, fontSize: '20px', fontWeight: 'bold'}}>
                    <span>{initialValues ? "Edit Subcategory" : "Add Subcategory"}</span>
                </div>
            }
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            width={700}
            style={{ top: 80 }}
            footer={[
                <div key="footer" style={{ borderTop: '1px solid #eee', paddingTop: 15, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <FormButton
                        htmlType="button"
                        type="danger"
                        children="Cancel"
                        onClick={handleCancel}
                    />
                    <FormButton
                        htmlType="submit"
                        type="primary"
                        children="Submit"
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
                name="subcategoryForm"
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <FormInput
                            name="name"
                            label="Subcategory Name"
                            placeholder="Please enter subcategory name"
                            rules={[{ required: true, message: 'Please enter subcategory name' }]}
                            style={{ width: "100%" }}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            name="slug"
                            label="Subcategory Slug"
                            placeholder="Please enter subcategory slug"
                            rules={[{ required: true, message: 'Please enter subcategory slug' }]}
                        />
                    </Col>
                </Row>

                <FormInput
                    name="description"
                    label="Subcategory Description"
                    type="textarea"
                    placeholder="Please enter subcategory description"
                    rules={[{ required: true, message: 'Please enter subcategory description' }]}
                />

                <Row gutter={16}>
                    <Col span={12}>
                        <FormSelect
                            name="category_id"
                            label="Category"
                            placeholder="Select your category"
                            rules={[{ required: true, message: "Please select a category!" }]}
                            options={categoryOptions}
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

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="icon"
                            label="Subcategory Icon"
                            valuePropName="fileList"
                            getValueFromEvent={e => Array.isArray(e) ? e : e && e.fileList}
                            rules={[{ required: true, message: 'Please upload a subcategory icon' }]}
                            style={{ width: "100%" }}
                        >
                            <Upload
                                name="icon"
                                listType="picture"
                                maxCount={1}
                                beforeUpload={() => false}
                                accept="image/*"
                                ref={fileRef}
                                defaultFileList={[]}
                                style={{ width: "100%" }}
                            >
                                <Button icon={<UploadOutlined />} style={{ width: "100%", textAlign: "left" }}>Click to Upload</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}

export default SubcategoryForm;