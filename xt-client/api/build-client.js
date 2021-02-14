import axios from 'axios';

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    return axios.create({
      // baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local', for dev only
      baseURL: 'http://www.guy-berkovich.com',
      headers: req.headers
    });
  }
  return axios.create({ baseURL: '/' });
};

export default buildClient;