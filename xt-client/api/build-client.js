import axios from 'axios';

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    return axios.create({
      baseURL: process.env.NODE_ENV === 'production' ? 'http://guy-berkovich.com' : 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
      withCredentials: true
    });
  }
  return axios.create({ baseURL: '/' });
};

export default buildClient;