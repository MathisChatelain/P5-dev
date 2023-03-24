const instance = axios.create({
    baseURL: 'http://localhost:8000/api/',
    timeout: 10000,
    headers: { 
      'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  });

export default instance;