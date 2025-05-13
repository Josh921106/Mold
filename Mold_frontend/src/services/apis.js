import axios from "axios";
import { getToken, clearToken } from "../utils/auth";

function getBaseURL() {
    try {
        console.log('API URL:', `http://${window.location.hostname}:3000/api`);
        return `http://${window.location.hostname}:3000/api`;
    } catch (error) {
        console.error('無法取得設備 IP，將使用預設值，錯誤訊息:', error);
        return 'http://localhost:3000/api';
    }
}

const createAPI = () => {
    const instance = axios.create({
        baseURL: getBaseURL(),
        headers: {
            "Content-Type": "application/json",
        },
    });

    instance.interceptors.request.use((config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    });

    return instance;
}

const api = createAPI();

// 自動處理錯誤的 wrapper
const safeRequest = async (method, url, data = null) => {
    try {
        // const instance = createAPI();
        // const response = data
        //     ? await instance[method](url, data)
        //     : await instance[method](url);
        const response = data
            ? await api[method](url, data)
            : await api[method](url);
        return response.data;
    } catch (error) {
        return { status: -1, error };
    }
};

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${getBaseURL()}/login`, { username, password });
        return response.data;
    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            if (status === 401 || status === 403) {
                return { status: -1, message: "用戶名或密碼錯誤" };
            } else if (status === 500) {
                return { status: -1, message: "伺服器錯誤" };
            } else {
                return { status: -1, message: data.message || "發生錯誤，請稍後再試" };
            }
        } else {
            return { status: -1, message: "無法連接到伺服器，請檢查網路連線" };
        }
    }
};

export function logout(navigate) {
    clearToken();
    navigate("/login");
}
