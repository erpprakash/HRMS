import axios from 'axios';

const customFetch = axios.create({
  baseURL: 'http://192.168.90.35:5100/api/crm',
});

export default customFetch;