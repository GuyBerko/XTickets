import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, body, useFormData = false, onSuccess = () => { } }) => {
  const [errors, setErros] = useState(null);

  const doRequest = async (params = {}) => {
    try {
      setErros(null);
      const data = useFormData ? params : { ...body, ...params };
      const result = await axios[method](url, data);
      onSuccess(result.data);
    }
    catch (err) {
      setErros(
        <div className="alert alert-danger">
          <h4>Ops...</h4>
          <ul className="my-0">
            { err.response.data.errors.map((err, index) => (<li key={ `error-${index}` }>{ err.message }</li>)) }
          </ul>
        </div>
      );
    }
  };

  return [doRequest, errors];
};

export default useRequest;