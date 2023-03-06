import ApiClient from '../ApiClient';



export const getProductById = async (id) => {
    const result = await ApiClient.get(`/api/v1/bulk-upload-request-products/${id}`);
    return result;
}

export const deleteProductById = async (id) => {
    const result = await ApiClient.delete(`/api/v1/bulk-upload-request-products/${id}/delete`);
    return result;
}

export const deleteMultibleProducts = async (Products) => {
    const data = await ApiClient.post(`/api/v1/bulk-upload-request-products/delete-multiple/delete`, Products);
    return data;
}