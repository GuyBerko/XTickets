import axios from 'axios';

const buildClient = ({ req }) => {
  console.log(process.env.NODE_ENV);//process.env.NODE_ENV === 'production'
  if (typeof window === 'undefined') {
    return axios.create({
      baseURL: true ? 'http://guy-berkovich.com' : 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
      withCredentials: true
    });
  }
  return axios.create({ baseURL: '/' });
};

export default buildClient;