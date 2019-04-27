import axios from './requestServices';

export const getAllData = async () => {
    try {
        const result = await axios.get('/backdoor/get-all-data');
        return result;
    } catch (e) {
        console.error('get all data error', e);
    }
};
