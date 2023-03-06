import ApiClient from '../ApiClient';

export const getTemplate = async (requiredData) => {
    const data = await ApiClient.post(`/api/v1/download-template`, requiredData);
    return data;
}
