// 儲存 token
export function saveToken(token, remember) {
    if (remember) {
        localStorage.setItem("token", token);
    } else {
        sessionStorage.setItem("token", token);
    }
}

// 讀取 token
export function getToken() {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
}

// 移除 token
export function clearToken() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
}

// 判斷是否已登入
export function isAuthenticated() {
    return !!getToken();
}
