import api from './api';

export const productService = {
    fetchAll: async () => {
        const response = await api.get('/api/products');
        return response.data;
    },
    fetchById: async (id) => {
        const response = await api.get(`/api/products/${id}`);
        return response.data;
    },
    create: async (productData) => {
        const response = await api.post('/api/products', productData);
        return response.data;
    },
    update: async (id, productData) => {
        const response = await api.put(`/api/products/${id}`, productData);
        return response.data;
    },
    delete: async (id) => {
        await api.delete(`/api/products/${id}`);
    }
};
