import axios from "axios";
import { showAlert } from "../components/core/errorhandling";
import { apiUrl } from "./urls";
import { connect } from "react-redux";
// import AesUtil from "./AESUtil";
// const aesUtil = new AesUtil(256, 1000);

const instance = axios.create({
  baseURL: apiUrl,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-cache" },
});
//let auth = ''
// instance.interceptors.request.use(function (request) {
//     let paramString = JSON.stringify(request.data),
//         salt = aesUtil.generateSalt(),
//         iv = aesUtil.generateiv(),
//         encryptParam = { _r: aesUtil.encrypt(salt, iv, paramString)};
//     request.data = encryptParam;
//     request.headers['_1'] = salt;
//     request.headers['_2'] = iv;
//     return request;
//   },function(error,response){
//     showAlert();
//     return Promise.reject(error);
//   });
instance.interceptors.request.use(
  (config) => {
    config.headers = {
      Authorization: sessionStorage.getItem("Authorization"),
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    let { response } = error;
    if (!response.data.error) {
      return Promise.resolve(response);
    } else {
      showAlert();
      return Promise.reject(error);
    }
  }
);

const mapStateToProps = ({ storeState }) => {
  // console.log(storeState, ">>APi Services");
  return { auth: storeState.userBO.Authorization };
};

export const loginApi = (param) => {
  let subURL =
    "me?fields=:all,organisationUnits[id,name~rename(displayName)],userGroups[id],userCredentials[:all,!user,userRoles[id,name]],userRoles[id,name]";

  return axios({
    method: "GET",
    url: `${apiUrl}${subURL}`,
    headers: { Authorization: param },
    // data: param
  }).then((res) => {
    return res;
  });
};

export const multipartPostCall =  (url,param) => {
  const authorizationToken = sessionStorage.getItem("Authorization");
  return axios({
    method: "POST",
    url: `${apiUrl}${url}`,
    //headers: {...header,...{'Content-Type': 'multipart/form-data' }},

    //   'Content-Security-Policy': 'self',
    // 'X-Content-Type-Options': 'nosniff',
    // 'X-XSS-Protection': "1; mode=block" },
    headers: {
      Authorization: authorizationToken,
      "Cache-Control": "no-cache",
      "Content-Type": "multipart/form-data",
      "Content-Security-Policy": "self",
      "X-Content-Type-Options": "nosniff",
      "X-XSS-Protection": "1; mode=block"
    },
    data: param
})
}

export default connect(mapStateToProps, null)(instance);
