import Cookies from "js-cookie";
export default function () {
  Storage.prototype.setObject = function (key, value) {
    this.setItem(key, JSON.stringify(value));
  };

  Storage.prototype.getObject = function (key) {
    var value = this.getItem(key) || "{}";
    if (value === "undefined" || value === "null") {
      value = "{}";
    }

    return (value && JSON.parse(value)) || {};
  };

  Storage.prototype.getAccessToken = function () {
    // sync accessToken from cookie if dont have accessToken from localStorage
    let accessToken = this.getItem("accessToken");
    let accessTokenFromCookie = Cookies.get("accessToken");
    let userDataFromCookie = Cookies.get("user");
    accessToken = !accessToken ? accessTokenFromCookie : accessToken
    
    if(accessToken){
      this.setItem('accessToken', accessToken)
    }

    if(userDataFromCookie){
      this.setItem('user', userDataFromCookie)
    }
    
    return accessToken
  };
}
