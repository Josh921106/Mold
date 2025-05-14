import React, { useState, useEffect } from "react";
import { Pencil, CirclePlus, Trash2 } from 'lucide-react';
import sss from "../../assets/images/sss.png";
import "../../assets/styles/mold.css";
import { useDrag, useDrop } from "react-dnd";
import 'react-toastify/dist/ReactToastify.css'
import { toast } from "react-toastify";

const rawData = [
	{ code: "C032130", name: "C03-2\"3000# 三通 84\u00d8", qty: 837, line: 4, customer: "柏瑋", shots: 937, type: "using" },
	{ code: "C031139", name: "八角由任內體公體(要熱處理標記)", qty: 628, line: 4, customer: "榮璋", shots: 612, type: "abnormal" },
	{ code: "C032148", name: "三通 84\u00d8(要有標記)", qty: 345, line: 1, customer: "柏瑋", shots: 357, type: "abnormal" },
	{ code: "B201001", name: "導套 CUR-01840-01-01", qty: 684, line: 2, customer: "冠億", shots: 521, type: "stored" },
	{ code: "C031073", name: "1/2圓型由任公體", qty: 953, line: 3, customer: "柏瑋", shots: 689, type: "using" },
	{ code: "C031120", name: "C03-3\"六角短管", qty: 425, line: 3, customer: "柏瑋", shots: 573, type: "using" },
	{ code: "B062011", name: "B06-#208凸輪", qty: 752, line: 2, customer: "鑄鑫", shots: 1126, type: "stored" },
	{ code: "C301002", name: "六角凸膜螺巴", qty: 541, line: 2, customer: "蓁豪", shots: 2683, type: "abnormal" },
	{ code: "C081033", name: "雙型六角螺巴", qty: 635, line: 1, customer: "振家", shots: 375, type: "stored" },
	{ code: "C031083", name: "八角由任內體母體", qty: 258, line: 1, customer: "柏瑋", shots: 1053, type: "stored" },
	{ code: "C032156", name: "C03-4\"四通 90\u00d8", qty: 512, line: 2, customer: "柏瑋", shots: 821, type: "using" },
	{ code: "B202015", name: "導套 CUR-01850-02-03", qty: 789, line: 3, customer: "冠億", shots: 654, type: "stored" },
	{ code: "C031098", name: "1/4圓型由任母體", qty: 321, line: 1, customer: "榮璋", shots: 987, type: "abnormal" },
];

// 隨機分配資料
const generateInitialParts = () => {
	const blank = Array.from({ length: 18 }, () => []);
	const usedIndexes = new Set();
	while (usedIndexes.size < rawData.length) {
		const randGrid = Math.floor(Math.random() * 18);
		const randDataIdx = Math.floor(Math.random() * rawData.length);

		// 確保不重複使用同一個資料索引
		if (usedIndexes.has(randDataIdx)) continue;
		if (blank[randGrid].length >= 3) continue; // 儲位最多 3 個模具

		usedIndexes.add(randDataIdx);
		blank[randGrid].push({ ...rawData[randDataIdx], imageUrl: sss, status: "filled" });
	}
	return blank;
};

// 可拖曳的模具子單元元件
const DraggablePart = ({ part, index, subIndex, children }) => {
	const [{ isDragging }, drag] = useDrag(() => ({
		type: 'PART', // 定義拖曳項目的類型，稍後會在 useDrop 中使用
		item: { part, fromIndex: index, fromSubIndex: subIndex }, // 拖曳時傳遞的資料
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	}));
	return (
		<div
			ref={drag}
			style={{
				opacity: isDragging ? 0.5 : 1,
				cursor: 'grab',
				width: '100%',
				display: 'flex',
				height: '100%'
			}}
			className={`grid-subcell hover-effect ${part ? part.type : 'empty'}`}
			onClick={children.props.onClick}
			key={children.key}>
			{children.props.children}
		</div>
	);
};

export default function MoldGridEnhanced() {
	//獲取 parts
	const [parts, setParts] = useState(() => {
		const savedParts = localStorage.getItem('gridParts');
		return savedParts ? JSON.parse(savedParts) : generateInitialParts();
	});

	const [selectedPart, setSelectedPart] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [showAddModal, setShowAddModal] = useState(null);
	const [inputCode, setInputCode] = useState("");
	const [draggedItem, setDraggedItem] = useState(null);
	// parts 更新，保存到 localStorage
	useEffect(() => {
		localStorage.setItem('gridParts', JSON.stringify(parts));
	}, [parts]);

	const [, drop] = useDrop(() => ({
		accept: 'PART', // 指定此區域可以接收的拖曳項目
		drop: (item, monitor) => {
			// 取得拖曳來源的索引和目標的索引
			const { fromIndex, fromSubIndex, part } = item;
			const toIndex = monitor.getHandlerId(); // 取得目標的 index
			if (fromIndex === toIndex) {
				return;
			}
			setParts(prevParts => {
				const newParts = prevParts.map(cellParts => [...cellParts]); // 複製 parts
				// 移除拖曳來源的 part
				newParts[fromIndex] = newParts[fromIndex].filter((_, i) => i !== fromSubIndex);
				// 檢查目標位置是否有足夠空間
				if (newParts[toIndex].length < 3) {
					// 將拖曳的 part 添加到目標位置
					newParts[toIndex].push({ ...part, status: "filled" });
				} else {
					toast.error("儲位已滿", { autoClose: 1200 })
					// 將拖曳的項目放回原位
					if (!newParts[fromIndex]) {
						newParts[fromIndex] = [{ ...part, status: "filled" }];
					} else {
						newParts[fromIndex].splice(fromSubIndex, 0, { ...part, status: "filled" });
					}
					return prevParts;
				}
				return newParts;
			});
		},
		collect: (monitor) => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
			handlerId: monitor.getHandlerId(),
		}),
	}));

	const handleEditClick = (part, index, subIndex) => {
		if (index === 0 && part && part.code) {
			setSelectedPart({
				...part,
				status: `在庫：0 現場：${part.shots} 維修：0 報廢：0`,
			});
			setModalVisible(true);
		} else if (!part || !part.code) {
			setShowAddModal({ index, subIndex });
			setInputCode("");
		} else {
			setSelectedPart({
				...part,
				status: `在庫：0 現場：${part.shots} 維修：0 報廢：0`,
			});
			setModalVisible(true);
		}
	};

	const handleAddSubcell = (index) => {
		setParts(prev => {
			const updated = [...prev];
			const currentCell = updated[index];
			if (!currentCell || currentCell.length >= 3) return updated;
			const newBlank = {
				code: "",
				name: "",
				qty: 0,
				line: 0,
				customer: "",
				shots: 0,
				type: "empty",
				imageUrl: sss,
				status: "blank"
			};
			updated[index] = [...(currentCell || []), newBlank];
			return updated;
		});
		setParts(prev => [...prev]);
	};

	const handleTrashClick = (index, subIndex) => {
		setParts(prev => {
			const updated = [...prev];
			updated[index] = updated[index].filter((_, i) => i !== subIndex);
			return updated;
		});
	};

	const handleCodeSubmit = () => {
		const found = rawData.find(item => item.code === inputCode);
		if (!found) return toast.error("找不到該產品編號", { autoClose: 1200 });
		setParts(prev => {
			const updated = [...prev];
			const { index, subIndex } = showAddModal;
			if (updated[index].length === 0) {
				updated[index] = [{ ...found, imageUrl: sss, status: "filled" }];
			} else {
				updated[index][subIndex] = { ...found, imageUrl: sss, status: "filled" };
			}
			return updated;
		});
		setShowAddModal(null);
		setInputCode("");
	};

	return (
		<div className="grid-wrapper">
			<div className="grid-container">
				{parts.map((cellParts, index) => {
					const [{ isOver }, drop] = useDrop(() => ({
						accept: 'PART',
						drop: (item) => {
							const { fromIndex, fromSubIndex, part } = item;

							if (fromIndex === index) return;

							setParts(prevParts => {
								const newParts = prevParts.map(cell => [...cell]);
								// 移除來源
								newParts[fromIndex] = newParts[fromIndex].filter((_, i) => i !== fromSubIndex);
								// 替代空格或新增
								const targetEmptyIndex = newParts[index].findIndex(p => p.type === "empty" || p.status === "blank");
								if (targetEmptyIndex !== -1) {
									newParts[index][targetEmptyIndex] = { ...part, status: "filled" };
								} else if (newParts[index].length < 3) {
									newParts[index].push({ ...part, status: "filled" });
								} else {
									toast.error("儲位已滿", { autoClose: 1200 })
									newParts[fromIndex].splice(fromSubIndex, 0, { ...part, status: "filled" });
									return prevParts;
								}
								return newParts;
							});
						},
						collect: (monitor) => ({
							isOver: monitor.isOver(),
						}),
					}));

					return (
						<div key={index} className="grid-item" ref={drop} data-grid-index={index}>
							<div className="subcell-container" style={{ display: "flex", height: "100%", width: "100%" }}>
								{cellParts.length > 0 ? (cellParts.map((part, subIndex) => (
									<DraggablePart key={subIndex} part={part} index={index} subIndex={subIndex}>
										<div
											className={`grid-subcell hover-effect ${part ? part.type : 'empty'}`}
											style={{ width: `${100 / cellParts.length}%` }}>
											<div className="overlay"></div>
											<div className={`actions ${cellParts.length > 1 ? 'vertical' : 'horizontal'}`}>
												<button className="action-btn" onClick={(e) => { e.stopPropagation(); handleEditClick(part, index, subIndex); }}>
													<Pencil size={25} />
												</button>
												<button className="action-btn" onClick={(e) => { e.stopPropagation(); handleAddSubcell(index); }}>
													<CirclePlus size={25} />
												</button>
												<button className="action-btn" onClick={(e) => { e.stopPropagation(); handleTrashClick(index, subIndex); }}>
													<Trash2 size={25} />
												</button>
											</div>
											<div className="part-text">
												{part && part.code ? (
													<>
														<div style={{ fontSize: "clamp(9px, 2vw, 22px)", wordBreak: "break-word", whiteSpace: "normal", width: "100%", textAlign: "center", lineHeight: "1.1" }}>
															{part.code}
														</div>
														<div style={{ fontSize: "14px", textAlign: "center", wordBreak: "break-word", whiteSpace: "normal", width: "100%" }}>
															{part.name}
														</div>
													</>
												) : (
													<div />
												)}
											</div>
										</div>
									</DraggablePart>
								))
								) : (
									<div className="grid-subcell hover-effect empty" style={{ width: "100%" }}>
										<div className="overlay">
											<div className="actions horizontal">
												<button className="action-btn" onClick={(e) => { e.stopPropagation(); handleEditClick(null, index, 0); }}>
													<Pencil size={25} />
												</button>
												<button className="action-btn" onClick={(e) => { e.stopPropagation(); handleAddSubcell(index); }}>
													<CirclePlus size={25} />
												</button>
												<button className="action-btn" onClick={(e) => { e.stopPropagation(); handleTrashClick(index, 0); }}>
													<Trash2 size={25} />
												</button>
											</div>
										</div>
										<div style={{ textAlign: "center" }}></div>
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>
			{modalVisible && selectedPart && (
				<div
					className="modal-backdrop"
					style={{
						backdropFilter: 'blur(3px)',
						backgroundColor: 'rgba(0, 0, 0, 0.2)',
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
				>
					<div
						style={{
							width: '60%', 
							height: 'auto', 
							backgroundColor: '#fff',
							borderRadius: '12px',
							border: '3px solid #989191',
							boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
							fontFamily: 'Lenter',
							display: 'flex',
							flexDirection: 'column', 
							overflow: 'hidden',
						}}
					>
						<div
							style={{
								backgroundColor: '#405E69',
								padding: '14px 16px',
								display: 'flex',
								justifyContent: 'flex-end',
							}}
						>
							<button
								type="button"
								className="btn-close btn-close-white"
								onClick={() => {
									setSelectedPart(null);
									setModalVisible(false);
								}}
							></button>
						</div>
						<div
							style={{
								backgroundColor: '#F1F1F2',
								padding: '24px 30px',
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center', 
							}}
						>
							<div style={{ flex: 1, marginRight: '20px' }}> 
								<div className="row g-4">
									{[
										{ label: '產品編號', value: selectedPart.code },
										{ label: '產品名稱', value: selectedPart.name },
										{ label: '模數', value: selectedPart.qty },
										{ label: '生產線別', value: selectedPart.line },
										{ label: '客戶', value: selectedPart.customer },
										{ label: '總打數', value: selectedPart.shots },
										{ label: '在庫狀況', value: selectedPart.status },
									].map((item, index) => (
										<div
											className={index < 6 ? 'col-6' : 'col-12'}
											key={index}
											style={{
												display: 'flex',
												alignItems: 'center',
												color: '#405E69',
												fontSize: '17px',
												fontWeight: 'bold',
											}}
										>
											<div
												style={{
													width: '92px',
													height: '50px',
													backgroundColor: '#E7E1C4',
													color: '#405E69',
													fontSize: '16px',
													lineHeight: '50px',
													textAlign: 'center',
													borderRadius: '4px',
													marginRight: '24px',
													border: '2px solid #BDBDBD',
													fontWeight: 'bold',
												}}
											>
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
							</div>
							<div
								style={{
									width: '260px',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center', 
									paddingLeft: '12px',
								}}
							>
								<img
									src={selectedPart.imageUrl}
									alt="模具示意圖"
									style={{
										width: '220px',
										height: '220px',
										objectFit: 'contain',
										border: 'none',
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			)}
			{showAddModal && (
				<div
					className="modal-backdrop"
					style={{
						backdropFilter: 'blur(3px)',
						backgroundColor: 'rgba(0, 0, 0, 0.2)',
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
				>
					<div
						className="modal-box"
						style={{
							width: '500px',
							backgroundColor: '#f8f8f8',
							borderRadius: '10px',
							fontFamily: 'Lenter',
							position: 'relative',
							overflow: 'hidden',
						}}
					>
						<div
							style={{
								backgroundColor: '#405E69',
								height: '60px',
								display: 'flex',
								justifyContent: 'flex-end',
								alignItems: 'center',
								paddingRight: '10px',
							}}
						>
							<button
								className="btn-close btn-close-white"
								onClick={() => setShowAddModal(null)}
								style={{ filter: 'invert(1)' }}
							/>
						</div>
						<div style={{ padding: '30px', textAlign: 'center' }}>
							<h5 style={{ color: '#405E69', fontWeight: 'bold', fontSize: '25px' }}>產品編號</h5>
							<p style={{ color: '#888', fontSize: '18px' }}>
								請輸入放置於此處的模具產品編號...
							</p>
							<input
								value={inputCode}
								onChange={(e) => setInputCode(e.target.value)}
								placeholder="請輸入產品編號"
								style={{
									marginTop: '10px',
									width: '60%',
									padding: '8px',
									borderRadius: '5px',
									border: '1px solid #ccc',
									textAlign: 'center',
									backgroundColor: '#f8f8f8',
									color: '#405E69',
									fontSize: '16px',
								}}
							/>
							<div style={{ marginTop: '20px' }}>
								<button
									onClick={handleCodeSubmit}
									style={{
										backgroundColor: '#E7E1C4',
										border: '1px solid #ccc',
										padding: '6px 16px',
										borderRadius: '5px',
										fontWeight: 'bold',
										color: '#405E69',
									}}
								>
									確定
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}