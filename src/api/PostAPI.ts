import axios from 'axios';
import dayjs from 'dayjs';
export const getPost = (page: number = 1, perPage: number = 9) => {
    const referenceDate = dayjs('2017-10-22');
    const formattedDate = referenceDate.format('YYYY-MM-DD');

    return axios.get(`https://api.github.com/search/repositories`, {
        params: {
            q: `created:>${formattedDate}`,
            sort: 'stars',
            order: 'desc',
            page,
            per_page: perPage,
        }
    });
};