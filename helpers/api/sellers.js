import ApiClient from '../ApiClient';

export const getSellers = async () => {
    const data  = await ApiClient.get('/api/v1/sellers');
    return data.payload;
}

