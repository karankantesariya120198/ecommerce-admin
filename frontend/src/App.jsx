import { ConfigProvider } from "antd";
import ErrorBoundary from "./app/components/common/ErrorBoundary";
import { Route, Routes, Navigate } from "react-router-dom";
import { 
    Signup,
    Login,
    Dashboard,
    Profile,
    Setting,
    CategoryList,
    SubcategoryList,
    SubcategoryDetail,
    ProductList,
    ProductDetail
} from "./app/pages/index";
import { AppLayout } from "./app/components/layout/index"

function isTokenExpired(token) {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    } catch (e) {
        return true;
    }
}

function PrivateRoute({ children }) {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
    }
    return children;
}

function App() {
    const token = localStorage.getItem('token');
    const isExpired = isTokenExpired(token);

    return (
        <ErrorBoundary>
            <ConfigProvider
                theme={{
                    components: {
                        Layout: {
                            siderBg: "#001529",
                        },
                    },
                }}
            >
                <Routes>
                    <Route
                        path="/"
                        element={
                            token && !isExpired ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
                        }
                    />
                    <Route
                        path="/login"
                        element={token && !isExpired ? <Navigate to="/dashboard" replace /> : <Login />}
                    />
                    <Route
                        path="/signup"
                        element={token && !isExpired ? <Navigate to="/dashboard" replace /> : <Signup />}
                    />

                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <AppLayout />
                            </PrivateRoute>
                        }
                    >
                        <Route path='dashboard' index element={<Dashboard />} />
                        <Route path='categories' element={<CategoryList />} />
                        <Route path='subcategories' element={<SubcategoryList />} />
                        <Route path='subcategories/:id' element={<SubcategoryDetail />} />
                        <Route path='products' element={<ProductList />} />
                        <Route path='products/:id' element={<ProductDetail />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="settings" element={<Setting />} />
                    </Route>
                </Routes>
            </ConfigProvider>
        </ErrorBoundary>
    );
}

export default App;
