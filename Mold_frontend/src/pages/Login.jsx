import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/styles/login.css";
import logo from "../assets/images/logo2.png";
import { getToken, saveToken } from "../utils/auth";
import { login } from "../services/apis";

export default function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (getToken()) {
        navigate("/");
        }
    }, []);

    useEffect(() => {
        document.title = "登入 - 智能製造平台";
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        login(username, password).then((response) => {
            setLoading(false);
            if (response.status === 0) {
                saveToken(`Bearer ${response.token}`, rememberMe);
                toast.success("登入成功！", { autoClose: 2000 });

                setTimeout(() => {
                    navigate("/");
                }, 2000);
            } else {
                toast.error(response.message || "登入失敗", { autoClose: 2000 });
            }
        }).catch((error) => {
            setLoading(false);
            console.error(error);
            toast.error("發生錯誤，請稍後再試", { autoClose: 2000 });
        });
    }

    return (
        <div className="vh-100 vw-100 d-flex justify-content-center align-items-center bg-light">
            <Card
                className="shadow-sm rounded-4 p-4"
                style={{ width: "100%", maxWidth: "420px", minWidth: "320px" }}
            >
                <div className="text-center mb-4">
                    <img
                        src={logo}
                        alt="Logo"
                        style={{ width: "300px", marginBottom: "10px" }}
                    />
                    <h3 className="fw-bold">模具管理系統</h3>
                </div>

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formUsername">
                        <Form.Label>帳號</Form.Label>
                        <Form.Control type="text" placeholder="請輸入帳號" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>密碼</Form.Label>
                        <Form.Control type="password" placeholder="請輸入密碼" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </Form.Group>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <Form.Check
                            type="checkbox"
                            label="記住我"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <a href="#" style={{ fontSize: "0.9rem" }}>忘記密碼？</a>
                    </div>

                    <div className="d-grid">
                        <Button variant="primary" type="submit" disabled={loading}>
                            {/* 登入 */}
                            {loading ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    登入中...
                                </>
                            ) : (
                                "登入"
                            )}
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
}
