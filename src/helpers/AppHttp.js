import vm from '../main';

export default {
 get(url) {
  return new Promise((resolve, reject) => {
   vm.$axios
    .get(url)
    .then((res) => {
     resolve(res);
    })
    .catch((err) => {
     reject(err);
    });
  });
 },
 post(url, payload = null, headers = null) {
  return new Promise((resolve, reject) => {
   vm.$axios
    .post(url, payload, headers)
    .then((res) => {
     resolve(res);
    })
    .catch((err) => {
     reject(err);
    });
  });
 },
 put(url, payload = null) {
  return new Promise((resolve, reject) => {
   vm.$axios
    .put(url, payload)
    .then((res) => {
     resolve(res);
    })
    .catch((err) => {
     reject(err);
    });
  });
 },
 delete(url, payload = null) {
  let sendData = null;
  if (payload) {
   sendData = {
    data: payload,
   };
  }

  return new Promise((resolve, reject) => {
   vm.$axios
    .delete(url, sendData)
    .then((res) => {
     resolve(res);
    })
    .catch((err) => {
     reject(err);
    });
  });
 },
 request(options) {
  return new Promise((resolve, reject) => {
   vm
    .$axios(options)
    .then((res) => {
     resolve(res);
    })
    .catch((err) => {
     reject(err);
    });
  });
 },
 patch(url, payload) {
  return new Promise((resolve, reject) => {
   vm.$axios
    .patch(url, payload)
    .then((res) => {
     resolve(res);
    })
    .catch((err) => {
     reject(err);
    });
  });
 },
};
