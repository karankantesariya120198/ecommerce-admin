import { useRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Col, Form, Modal, Row, Upload, Button } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { FormInput, FormSelect } from "../../components/common/forms";
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
                    if (Array.isArray(data)) {
                        setCategoryOptions(data.map(cat => ({ label: cat.name, value: cat.id })));
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
                icon: initialValues.file ? [{
                    uid: initialValues.file.id,
                    thumbUrl: initialValues.file.base64Url,
                    name: initialValues.file.name,
                    size: initialValues.file.sizeKB * 1024, // Convert KB to Bytes
                    type: `${initialValues.file.type}/${initialValues.file.format}`,
                }] : [],
                categoryId: initialValues.categoryId,
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
            title={initialValues ? "Edit Subcategory" : "Add Subcategory"}
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            width={500}
            centered
        >
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                style={{ width: "100%" }}
            >
                <Row>
                    <Col span={24}>
                        <FormInput
                            name="name"
                            label="Subcategory Name"
                            placeholder="Please enter subcategory name"
                            rules={[{ required: true, message: 'Please enter subcategory name' }]}
                            style={{ width: "100%" }}
                        />
                    </Col>
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
                    <Col span={24}>
                        <FormSelect
                            name="categoryId"
                            label="Category"
                            placeholder="Select your category"
                            rules={[{ required: true, message: "Please select a category!" }]}
                            options={categoryOptions}
                        />
                    </Col>
                    <Col span={24}>
                        <FormSelect
                            name="status"
                            label="Status"
                            placeholder="Select your status"
                            rules={[{ required: true, message: "Please select a status!" }]}
                            options={[
                                { label: "Active", value: "active" },
                                { label: "Inactive", value: "inactive" }
                            ]}
                        />
                    </Col>
                    <Col span={24}>
                        <FormInput
                            name="description"
                            label="Description"
                            type="textarea"
                            placeholder="Please enter description"
                            rules={[{ required: true, message: 'Please enter description' }]}
                            style={{ width: "100%" }}
                        />
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}

export default SubcategoryForm;