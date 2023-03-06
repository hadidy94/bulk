import ApiClient from '../ApiClient';
import { useQuery } from 'react-query';

export const uploadTemplate = async (fileData) => {
    const data = await ApiClient.post(`/api/v1/bulk-upload-request`, fileData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return data;
}


export const getByBatchId = async (id) => {
    const result = await ApiClient.get(`/api/v1/batch/${id}`);
    return result;
}


export const bulkUploadList = async (status, page) => {
    const result = await ApiClient.get(`/api/v1/bulk-upload-request?page=${page}&status=${status}`);
    return result;
}



export const getListById = async (id, status, page) => {
    const result = await ApiClient.get(`/api/v1/bulk-upload-request/${id}/products?page=${page}&status=${status}`);
    return result;
}


export const useList = (id) => {
    return useQuery(['post', id], () => getListById(id));
}

export const deleteBulkList = async (id) => {
    const result = await ApiClient.delete(`/api/v1/bulk-upload-request/${id}/delete`);
    return result;
}