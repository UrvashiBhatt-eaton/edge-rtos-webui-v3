var md5 = require("md5");
var _chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
var _nc = 0;

const generateNonce = (length) => {
  var nonce = "";
  var charsLength = _chars.length;

  for (var i = 0; i < length; ++i) {
    nonce += _chars[Math.floor(Math.random() * charsLength)];
  }

  return nonce;
};

const getNc = () => {
  _nc++;
  var zeros = 8 - _nc.toString().length;
  var nc = "";
  for (var i = 0; i < zeros; i++) {
    nc += "0";
  }
  return nc + _nc;
};

/** Class representing a communication link to PX Green.
 * This is based on the PB file that is already a part of the
 * existing PX Green implementation.
 *
 */
const PB = class {
  constructor() {
    this.dataURL = null;
    this.authEnabled = true;
    this.firmwareUpgradeInProgress = false;
    this.cancelClicked = false;
    this.sessionExpired = false;
    this.connect = {
      // Object to store the authentication info
      props: undefined,
      type: undefined,
      un: "",
      pd: ""
    };
    this.rt = null;
    this.refreshRate = 0;
    this.channelUriMaxSize = 20;
    this.resetFromUserManagementFlag = false;
    this.t = (str) => str;
    this.raw2readable = undefined;
    this.readable2raw = undefined;
  }
  generateResponse(method, path, nc, cnonce) {
    var ha1 = md5(this.connect.un + ":" + this.connect.props.realm + ":" + this.connect.pd);
    var ha2 = md5(method + ":" + path);
    return md5(
      ha1 + ":" + this.connect.props.nonce + ":" + nc + ":" + cnonce + ":" + this.connect.props.qop + ":" + ha2
    );
  }

  init(url, auth, refreshRate, channelUriMaxSize, raw2readable, readable2raw) {
    if (location.href.indexOf("localhost") != -1) {
      this.dataURL = url;
    } else {
      this.dataURL = location.origin;
    }
    this.authEnabled = auth;
    this.refreshRate = refreshRate;
    this.channelUriMaxSize = channelUriMaxSize;
    this.raw2readable = raw2readable;
    this.readable2raw = readable2raw;
    return true;
  }

  close(url) {
    this.clearRealtimeSubscription();
  }

  fetch(method, url, data, n, skipAuth) {
    const t = this.t;
    if (this.firmwareUpgradeInProgress && url.indexOf("rs/param/") > 0) {
      // To remove rs/params traffic during fw update
      return Promise.reject(t("Firmware update in progress"));
    } else if (this.cancelClicked) {
      return Promise.reject("session_aborted");
    } else {
      if (this.sessionExpired) {
        return Promise.reject("session_expired"); //Clearing network traffic if session expired
      }

      let options = {};
      const headers = skipAuth || !this.authEnabled ? {} : { Authorization: this.createAuthHeader(method, url) };

      n = n || 2; // Retry count on network failure

      if (!(method || "").match(/GET/i)) {
        headers["Content-Type"] = "application/json";
        if (data != null) {
          options.body = JSON.stringify(data);
        }
      }

      return fetch(
        this.dataURL + url,
        Object.assign(
          {
            method: method || "GET",
            headers: headers
          },
          options,
          { redirect: "manual" }
        )
      )
        .catch((error) => {
          if (n === 1) {
            return Promise.reject("device_connection_lost");
          }
          return this.fetch(method, url, data, n - 1);
        })
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response);
          } else if (response.status == 401 && response.statusText == t("Authorization Required")) {
            if (url.indexOf("rs/users/accounts/curruser") > 0) {
              if (!this.resetFromUserManagementFlag) {
                this.storeAuthInfo(response);
                return this.fetch(method, url, data);
              } else {
                this.deleteLocalStorage();
                window.location.href = "/";
              }
            } else if (this.connect.props && this.opaqueExtractor(response) != this.connect.props.opaque) {
              return Promise.reject("device_restarted");
            } else {
              this.sessionExpired = true;
              return Promise.reject("session_expired");
            }
          } else if (response.status == 423 && response.statusText == t("User Locked Temporarily")) {
            this.deleteLocalStorage();
            return Promise.reject(response);
          } else if (response.status == 0 && response.type == "opaqueredirect") {
            return Promise.reject("url_redirection");
          } else {
            return Promise.reject(response);
          }
        });
    }
  }

  setLogin(user, key) {
    var old = {
      un: this.connect.un,
      pd: this.connect.pd
    };
    if (!this.sessionExpired) {
      this.connect.un = user;
      this.connect.pd = key;
    } else {
      this.sessionExpired = false;
    }
    return old;
  }

  createAuthHeader(method, path) {
    var header, obj;
    if (this.checkIfLocalStorageExists() && (obj = this.retrieveFromLocalStorage())) {
      var auth = {
        nonce: obj.nonce,
        opaque: obj.opaque,
        qop: obj.qop,
        realm: obj.realm,
        type: obj.type,
        algorithm: obj.algorithm
      };
      this.connect.props = auth;
      if (auth.type === "TK_Digest") {
        this.connect.type = "DIGEST";
      } else if (auth.type === "TK_Basic") {
        this.connect.type = "BASIC";
      }
    } else if (location.href.indexOf("login") < 0) {
      window.location.href = "/";
    } else {
      this.connect = {
        digest: undefined,
        type: undefined,
        un: this.connect.un,
        pd: this.connect.pd
      };
    }

    if (this.connect.type === "DIGEST" && this.connect.props) {
      header = this.createDigestHeader(method, path);
    } else {
      header = "Auth_TK";
    }
    return header;
  }

  // ///////////////
  // Digest Auth //
  // ///////////////
  // Everything needed to create a Digest Authentication header
  createDigestHeader(method, path) {
    if (!this.connect.props || !this.connect.un) {
      return;
    }
    var nc = getNc();
    var cnonce = generateNonce(16);
    return (
      this.connect.props.type +
      " " +
      'username="' +
      this.connect.un +
      '", ' +
      'realm="' +
      this.connect.props.realm +
      '", ' +
      'nonce="' +
      this.connect.props.nonce +
      '", ' +
      'uri="' +
      path +
      '", ' +
      "algorithm=MD5, " +
      'response="' +
      this.generateResponse(method, path, nc, cnonce) +
      '", ' +
      'opaque="' +
      this.connect.props.opaque +
      '", ' +
      "qop=" +
      this.connect.props.qop +
      ", " +
      "nc=" +
      nc +
      ", " +
      'cnonce="' +
      cnonce +
      '"'
    );
  }

  initializeRealtimeSubscription(callback, rate = 5000) {
    this.rt = setInterval(() => callback(), rate);
  }

  clearRealtimeSubscription() {
    if (this.rt) {
      clearInterval(this.rt);
    }
  }

  checkIfLocalStorageExists() {
    if (this.retrieveFromLocalStorage() !== undefined) {
      return true;
    } else {
      return false;
    }
  }

  retrieveFromLocalStorage() {
    let data = JSON.parse(localStorage.getItem(md5(this.connect.un)));
    return data;
  }

  storeInLocalStorage(data) {
    localStorage.setItem(md5(this.connect.un), JSON.stringify(data));
  }

  deleteLocalStorage() {
    localStorage.removeItem(md5(this.connect.un));
  }

  //opaque extractor
  opaqueExtractor(data) {
    const header = data.headers.get("www-authenticate");
    const type = header.split(" ")[0];
    const rows = data.headers.get("www-authenticate").replace(type, "").split(",");
    const auth = {
      type: type
    };
    if (auth.type === "TK_Digest") {
      for (var i = 0; i < rows.length; i++) {
        var e = rows[i].split("=");
        auth[e[0].trim()] = e[1].trim().replace('"', "").replace('"', "");
      }
      return auth.opaque;
    }
  }

  storeAuthInfo(serverResponse) {
    const header = serverResponse.headers.get("www-authenticate");
    const type = header.split(" ")[0];
    const rows = serverResponse.headers.get("www-authenticate").replace(type, "").split(",");
    const auth = {
      type: type
    };
    if (auth.type === "TK_Digest") {
      for (var i = 0; i < rows.length; i++) {
        var e = rows[i].split("=");
        auth[e[0].trim()] = e[1].trim().replace('"', "").replace('"', "");
      }
      this.connect.props = auth;
      this.connect.type = "DIGEST";
      //Storing Digest info in localStorage
      this.storeInLocalStorage(auth);
    }
  }

  // Function to get refresh rate
  getRefreshRate() {
    return this.refreshRate;
  }
};

export default PB;
