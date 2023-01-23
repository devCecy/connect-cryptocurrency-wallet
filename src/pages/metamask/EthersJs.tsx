import { ethers } from "ethers";
import { useState } from "react";

const EthersJs = () => {
	const [balance, setBalance] = useState("");

	const handleConnect = async () => {
		if (typeof window.ethereum === "undefined")
			return alert("메타마스크를 설치해주세요.");

		try {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const accounts = await provider.send("eth_requestAccounts", []);

			const balance = await provider.getBalance(accounts[0]);
			const formattedBalance = ethers.utils.formatEther(balance);
			setBalance(formattedBalance);
		} catch (err) {
			alert((err as { message: string }).message);
		}
	};

	return (
		<>
			{balance && <p>잔액:{balance}ETH</p>}
			<button onClick={handleConnect}>메타마스크 연결!</button>
		</>
	);
};

export default EthersJs;
