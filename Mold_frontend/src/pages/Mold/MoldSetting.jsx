import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Upload, Search } from 'lucide-react';
import logo from "../../assets/images/logo2.png";
import "../../assets/styles/mold.css";
import { clearToken, isAuthenticated } from "../../utils/auth";

export default function MoldSetting() {
    const [selectedIndex, setSelectedIndex] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPart, setSelectedPart] = useState(null);
    const navigate = useNavigate();
    const [modalSelectedIndex, setModalSelectedIndex] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewImageSrc, setPreviewImageSrc] = useState("");

    const defaultRows = [
        { productId: "C032130", name: "C03-2\"3000# 三通 84Ø", module: "837", line: "4", customer: "柏緯", count: "937", limit: "2000", image: null, preview: "", date: "2025-05-08" },
        { productId: "C031139", name: "八角由任內體公體(要熱處理標記)", module: "628", line: "4", customer: "榮寰", count: "612", limit: "3000", image: null, preview: "", date: "2025-05-08" },
        { productId: "C032148", name: "三通 84Ø(要有標記)", module: "345", line: "1", customer: "柏緯", count: "357", limit: "3000", image: null, preview: "", date: "2025-05-08" },
        { productId: "B201001", name: "導套 CUR-01840-01-01", module: "684", line: "2", customer: "冠億", count: "521", limit: "2000", image: null, preview: "", date: "2025-05-08" },
        { productId: "C031073", name: "1/2\"圓型由任公體", module: "953", line: "3", customer: "柏緯", count: "689", limit: "1500", image: null, preview: "", date: "2025-05-08" },
        { productId: "C031120", name: "C03-3\"六角短管", module: "425", line: "3", customer: "柏緯", count: "573", limit: "6000", image: null, preview: "", date: "2025-05-08" },
        { productId: "B062011", name: "B06-#208凸輪", module: "752", line: "2", customer: "鑌鑫", count: "1126", limit: "3000", image: null, preview: "", date: "2025-05-08" },
        { productId: "C031002", name: "六角凸嘴螺帽", module: "541", line: "2", customer: "蔡豪", count: "2683", limit: "10000", image: null, preview: "", date: "2025-05-08" },
        { productId: "C081033", name: "重型六角螺帽", module: "635", line: "1", customer: "振家", count: "375", limit: "10000", image: null, preview: "", date: "2025-05-08" },
        { productId: "C031083", name: "八角由任內體母體", module: "258", line: "1", customer: "柏緯", count: "1053", limit: "5000", image: null, preview: "", date: "2025-05-08" },
        { productId: "C032160", name: "C03-3\"3000# 三通 88Ø", module: "672", line: "5", customer: "柏緯", count: "789", limit: "2500", image: null, preview: "", date: "2025-05-08" },
        { productId: "B202016", name: "導套 CUR-01850-03-01", module: "456", line: "2", customer: "冠億", count: "532", limit: "2000", image: null, preview: "", date: "2025-05-08" },
        { productId: "C081035", name: "重型六角螺螺帽", module: "813", line: "1", customer: "振家", count: "1245", limit: "8000", image: null, preview: "", date: "2025-05-08" }
    ];

    // 如果有 localStorage 的資料就使用，否則抓預設
    const [rows, setRows] = useState(() => {
        const saved = localStorage.getItem("moldRows");
        return saved ? JSON.parse(saved) : defaultRows;
    });

    // 檢查預設資料變化，如果有變化存到 localStorage
    useEffect(() => {
        localStorage.setItem("moldRows", JSON.stringify(rows));
    }, [rows]);

    // 檢查登入狀態
    useEffect(() => {
        if (!isAuthenticated()) {
            navigate("/login");
        }
    }, []);

    const handleSelect = (index) => {
        setSelectedIndex(index);
        setTimeout(() => {
            if (index === 0) {
                navigate("/");
            } else if (index === 1) {
                navigate("/settings");
            }
        }, 100);
    };

    const handleDeleteRow = (index) => {
        const newRows = [...rows];
        newRows.splice(index, 1); // 刪除陣列指定索引的元素
        setRows(newRows);
    };

    // 關鍵字過濾模具資料
    const filteredRows = rows.filter((row) => {
        const keyword = searchKeyword.trim().toLowerCase();
        if (!keyword) return true;
        // 檢查 id、名稱、客戶是否包含關鍵字
        return (
            row.productId?.toLowerCase().includes(keyword) ||
            row.name?.toLowerCase().includes(keyword) ||
            row.customer?.toLowerCase().includes(keyword)
        );
    });

    const handleEdit = (index) => {
        const part = rows[index]; // 取得要編輯的模具資料
        setSelectedPart({
            Id: part.productId,
            name: part.name,
            module: part.module,
            line: part.line,
            customer: part.customer,
            count: part.count,
            limit: part.limit,
            date: part.date,
            status: `在庫：0 現場：${part.count} 維修：0 報廢：0`,
            imageUrl: "",
        });
        setModalSelectedIndex(index);
        setModalVisible(true);
    };

    // 處理輸入框的值改變事件
    const handleChange = (index, field, value) => {
        const updatedRows = [...rows];
        if (field === "image" && value) {
            const reader = new FileReader(); // 讀取檔案內容
            reader.onloadend = () => {
                updatedRows[index] = {
                    ...updatedRows[index],
                    image: value,
                    preview: reader.result,
                };
                setRows(updatedRows);
            };
            reader.readAsDataURL(value);
        } else {
            updatedRows[index][field] = value;
            setRows(updatedRows);
        }
    };

    const handlePreview = (src) => {
        setPreviewImageSrc(src); // 設定預覽圖片的 URL
        setShowPreviewModal(true);
    };

    return (
        <div className="vh-100 vw-100 user-select-none">
            <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 999 }}>
                <button
                    className=""
                    style={{ backgroundColor: "transparent", color: "red", fontSize: "22px", border: "none" }}
                    onClick={() => {
                        localStorage.removeItem("moldRows");
                        clearToken();
                        navigate("/login");
                    }}
                >
                    登出
                </button>
            </div>
            <div className="header">
                <div className="logo-container">
                    <img src={logo} alt="Logo" className="logo" />
                </div>
                <div className="text-container">
                    <h1 className="title">模具管理系統</h1>
                    <div className="subtitle">
                        {["模具管理", "模具基本資料設定"].map((text, index) => (
                            <span
                                key={index}
                                className={`model ${selectedIndex === index ? 'selected' : ''}`}
                                onClick={() => handleSelect(index)}
                            >
                                {text}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-end">
                <div style={{ width: "250px", marginTop: "-65px", paddingRight: "50px" }}>
                    <div className="search-box input-group bg-light rounded">
                        <input
                            type="text"
                            className="form-control border-0 bg-light"
                            placeholder="搜尋"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            style={{ fontSize: "1rem" }}
                        />
                        <span className="input-group-text bg-light border-0">
                            <Search size={18} />
                        </span>
                    </div>
                </div>
            </div>
            <div className="table-scroll mx-auto">
                <table className="table table-bordered text-center align-middle">
                    <thead className="sticky-top">
                        <tr className="table-secondary text-center align-middle">
                            <th style={{ width: "30px" }}>序號</th>
                            <th style={{ width: "100px" }}>產品編號</th>
                            <th style={{ width: "120px" }}>鍛品名稱</th>
                            <th style={{ width: "70px" }}>模數</th>
                            <th style={{ width: "50px" }}>生產線別</th>
                            <th style={{ width: "70px" }}>客戶</th>
                            <th style={{ width: "70px" }}>鍛打數</th>
                            <th style={{ width: "120px" }}>
                                鍛打數上限
                                <br />
                                <small className="text-muted">（維修保養建議數量）</small>
                            </th>
                            <th style={{ width: "180px" }}>鍛品照片</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRows.map((row, index) => (
                            <tr key={index} style={{ height: "55px" }}>
                                <td>{index + 1}</td>
                                <td>{row.productId}</td>
                                <td>{row.name}</td>
                                <td>{row.module}</td>
                                <td>
                                    <select
                                        className="form-select form-select-sm text-center"
                                        value={row.line}
                                        style={{ width: "60px", textAlignLast: "center", margin: "0 auto" }}
                                        onChange={(e) => handleChange(index, "line", e.target.value)}
                                    >
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                    </select>
                                </td>
                                <td>{row.customer}</td>
                                <td>{row.count}</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        className="custom-number"
                                        value={row.limit}
                                        onChange={(e) => handleChange(index, "limit", Math.max(0, Number(e.target.value)))}
                                    />
                                </td>
                                <td>
                                    {row.preview ? (
                                        <span
                                            onClick={() => handlePreview(row.preview)}
                                            style={{
                                                color: "#0d6efd",
                                                textDecoration: "underline",
                                                cursor: "pointer",
                                                display: "inline-flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            點我預覽照片
                                            <Upload size={16} className="ms-2" />
                                        </span>
                                    ) : (
                                        <label
                                            className="d-inline-flex align-items-center mb-2"
                                            style={{ color: "#6c757d", textDecoration: "underline", cursor: "pointer" }}
                                        >
                                            點選以上傳照片
                                            <Upload size={16} className="ms-2" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleChange(index, "image", e.target.files[0])}
                                                hidden
                                            />
                                        </label>
                                    )}
                                    <span
                                        className="text-primary ms-5"
                                        role="button"
                                        onClick={() => handleEdit(index)}
                                    >
                                        編輯
                                    </span>
                                    <span
                                        className="text-danger ms-3"
                                        role="button"
                                        onClick={() => handleDeleteRow(index)}
                                    >
                                        刪除
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {modalVisible && selectedPart && (
                <div className="modal-backdrop" style={{ backdropFilter: 'blur(3px)', backgroundColor: 'rgba(0, 0, 0, 0.2)', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '1200px', height: '450px', backgroundColor: '#fff', borderRadius: '12px', border: '3px solid #989191', boxShadow: '0 6px 20px rgba(0,0,0,0.2)', fontFamily: 'Lenter', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{ backgroundColor: '#405E69', padding: '14px 16px', position: 'relative' }}>
                            <h1 style={{ paddingRight: "3px", fontSize: '30px', color: '#fff', margin: 0 }}>模具基本資料設定</h1>
                            <button type="button" className="btn-close btn-close-white" style={{ position: 'absolute', top: '18px', right: '14px', fontSize: '20px' }} onClick={() => { setSelectedPart(null); setModalVisible(false); }}></button>
                        </div>
                        <div style={{ backgroundColor: '#F1F1F2', padding: '42px 40px', flex: 1, display: 'flex', flexDirection: 'row', gap: '30px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                {[
                                    { label: '產品編號', value: selectedPart.Id },
                                    { label: '緞品名稱', value: selectedPart.name },
                                    { label: '異動日期', value: selectedPart.date },
                                    { label: '模數', value: selectedPart.module },
                                ].map((item, index) => (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', color: '#405E69', fontSize: '17px', fontWeight: 'bold' }}>
                                        <div style={{ width: '92px', height: '50px', backgroundColor: '#E7E1C4', color: '#405E69', fontSize: '15px', lineHeight: '50px', textAlign: 'center', borderRadius: '4px', marginRight: '24px', border: '2px solid #BDBDBD', fontWeight: 'bold' }}>
                                            {item.label}
                                        </div>
                                        <span>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                {[
                                    { label: '生產線別', value: selectedPart.line },
                                    { label: '客戶', value: selectedPart.customer },
                                    { label: '在庫狀況', value: selectedPart.status },
                                ].map((item, index) => (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', color: '#405E69', fontSize: '17px', fontWeight: 'bold' }}>
                                        <div style={{ width: '92px', height: '50px', backgroundColor: '#E7E1C4', color: '#405E69', fontSize: '15px', lineHeight: '50px', textAlign: 'center', borderRadius: '4px', marginRight: '24px', border: '2px solid #BDBDBD', fontWeight: 'bold' }}>
                                            {item.label}
                                        </div>
                                        {item.label === '在庫狀況' ? (
                                            <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
                                                {item.value.split(' ').map((val, i) => (
                                                    <span key={i}>{val}</span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span>{item.value}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                {[
                                    { label: '鍛打數', value: selectedPart.count },
                                    { label: '鍛品照片', value: selectedPart.imageUrl },
                                    { label: '鍛打數上限', value: selectedPart.limit },
                                ].map((item, index) => (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', color: '#405E69', fontSize: '17px', fontWeight: 'bold' }}>
                                        <div style={{ width: '92px', height: '50px', backgroundColor: '#E7E1C4', color: '#405E69', fontSize: '15px', lineHeight: '50px', textAlign: 'center', borderRadius: '4px', marginRight: '24px', border: '2px solid #BDBDBD', fontWeight: 'bold' }}>
                                            {item.label}
                                        </div>
                                        {item.label === '鍛品照片' ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                {item.value && item.value !== logo && (
                                                    <img
                                                        src={item.value}
                                                        alt="模具示意圖"
                                                        style={{ width: '150px', height: '150px', objectFit: 'contain', border: 'none' }}
                                                    />
                                                )}
                                                {rows[modalSelectedIndex]?.preview ? (
                                                    <span
                                                        onClick={() => handlePreview(rows[modalSelectedIndex].preview)}
                                                        style={{
                                                            color: "#0d6efd",
                                                            textDecoration: "underline",
                                                            cursor: "pointer",
                                                            display: "inline-flex",
                                                            alignItems: "center",
                                                            marginTop: "10px"
                                                        }}
                                                    >
                                                        點我預覽照片
                                                        <Upload size={16} className="ms-2" />
                                                    </span>
                                                ) : (
                                                    <label
                                                        className="d-inline-flex align-items-center mt-2"
                                                        style={{
                                                            color: "#6c757d",
                                                            textDecoration: "underline",
                                                            cursor: "pointer"
                                                        }}
                                                    >
                                                        點選以上傳照片
                                                        <Upload size={16} className="ms-2" />
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) =>
                                                                handleChange(modalSelectedIndex, "image", e.target.files[0])
                                                            }
                                                            hidden
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        ) : (
                                            <span>{item.value}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showPreviewModal && (
                <div
                    className="modal show fade d-block"
                    tabIndex="-1"
                    style={{
                        backdropFilter: 'blur(3px)',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        zIndex: 1050,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onClick={() => setShowPreviewModal(false)} // 點空白區關閉
                >
                    <div
                        className="modal-dialog modal-dialog-centered"
                        style={{ maxWidth: '600px' }}
                        onClick={(e) => e.stopPropagation()} // 阻止圖片點擊關閉
                    >
                        <div className="modal-content">
                            <div className="modal-body text-center">
                                <img
                                    src={previewImageSrc}
                                    alt="預覽圖片"
                                    style={{ maxWidth: "100%", maxHeight: "80vh" }}
                                />
                            </div>
                            <div className="modal-footer justify-content-center">
                                <button className="btn btn-secondary" onClick={() => setShowPreviewModal(false)}>
                                    關閉
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}