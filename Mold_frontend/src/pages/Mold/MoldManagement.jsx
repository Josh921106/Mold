import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import logo from "../../assets/images/logo2.png";
import "../../assets/styles/mold.css";
import { clearToken, isAuthenticated } from "../../utils/auth";
import MoldGrid from "./MoldGrid";

export default function MoldMangement() {
	const navigate = useNavigate();
	const [selectedIndex, setSelectedIndex] = useState(0);

	useEffect(() => {
		if (!isAuthenticated()) {
		navigate("/login");
		}
	}, []);

	useEffect(() => {
		document.title = "模具管理系統";
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

  	return (
		<div style={{ minHeight: "100dvh", backgroundColor: "#f8f8f8", position: 'relative' }} className="vw-100 user-select-none py-1">
			<div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 999 }}>
				<button
				className=""
				style={{ backgroundColor: "transparent", color: "red", fontSize: "22px", border: "none" }}
				onClick={() => {
					localStorage.removeItem('gridParts')
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

			<MoldGrid />

			<div className="legend-container">
				<div className="legend-item">
					<div className="legend-box empty"></div>
					<span>空儲位</span>
				</div>
				<div className="legend-item">
					<div className="legend-box using"></div>
					<span>模具使用中</span>
				</div>
				<div className="legend-item">
					<div className="legend-box stored"></div>
					<span>模具存放</span>
				</div>
				<div className="legend-item">
					<div className="legend-box abnormal"></div>
					<span>異常狀態（包含維修、保養）</span>
				</div>
			</div>
	</div>
  );
}
