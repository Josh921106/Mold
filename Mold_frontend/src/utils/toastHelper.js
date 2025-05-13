import { toast } from "react-toastify";

/**
 * 顯示成功訊息
 * @param {string} message 成功訊息
 * @param {string} position Toast 位置（預設 top-right）
 */
export function showSuccess(message, position = "top-right") {
    toast.success(message, {
        position,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
}

/**
 * 顯示錯誤訊息
 * @param {string} message 錯誤訊息
 * @param {string} position Toast 位置（預設 top-right）
 */
export function showError(message, position = "top-right") {
    toast.error(message, {
        position,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
}
