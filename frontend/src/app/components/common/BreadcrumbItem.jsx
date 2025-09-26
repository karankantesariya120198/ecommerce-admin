import { useNavigate } from "react-router-dom";
import { Breadcrumb } from 'antd';

const BreadcrumbItem = ({ items, ...props }) => {
    const navigate = useNavigate();

    const breadcrumbItems = items.map((i) => ({
        title: i.path ? (
            <a
                onClick={(e) => {
                    e.preventDefault();
                    navigate(i.path);
                }}
            >
                { i.title }
            </a>
        ) : (
            i.title
        ),
    }));
    
    return <Breadcrumb items={breadcrumbItems} {...props} />;
};

export default BreadcrumbItem;