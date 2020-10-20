import axios from 'axios';

const geolocation = axios.create({
  baseURL: 'http://api.ipstack.com',
});

export default geolocation;
