import axios from 'axios';
// import { formatDate } from '../utils/datepicker';

interface PostParams {
    page?: number;
    perPage?: number;
}

export const getPost = (params: PostParams) => {

    return axios.get(`https://api.github.com/search/repositories`, {
        params
    });
};
