import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

const EthersJs = () => {
	const [provider, setProvider] = useState<Web3Provider | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [balance, setBalance] = useState("");

	useEffect(() => {
		if (provider !== null) getBalance();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [provider]);

	useEffect(() => {
		if (!isConnected) return;
		const timer = setInterval(() => {
			window.ethereum.on("accountsChanged", handleDisconnect);
			window.ethereum.on("chainChanged", handleDisconnect);
		}, 1000);

		return () => clearInterval(timer);
	}, [isConnected]);

	/**
	 * 메타마스크 연동 시도
	 * @returns
	 */
	const handleConnect = async () => {
		if (typeof window.ethereum === "undefined")
			return alert("메타마스크를 설치해주세요.");

		try {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			setProvider(provider);
		} catch (err) {
			alert((err as { message: string }).message);
		}
	};

	const getBalance = async () => {
		try {
			const accounts = await (provider as Web3Provider).send(
				"eth_requestAccounts",
				[]
			);
			const balance = await (provider as Web3Provider).getBalance(accounts[0]);
			const formattedBalance = ethers.utils.formatEther(balance);

			setBalance(formattedBalance);
			setIsConnected(true);
		} catch (err) {
			alert((err as { message: string }).message);
		}
	};

	/**
	 * 메타마스크 연동 해제
	 */
	const handleDisconnect = () => {
		setProvider(null);
		setIsConnected(false);
		window.location.reload();
	};

	/**
	 *  어카운트가 새로 들어오거나, 잠겼음을 감지합니다.
	 */
	const handleAccountsChanged = (accounts: Array<string>) => {
		console.log(accounts); // 변경된 어카운트 혹은 빈 배열[]
	};

	/**
	 *  새 체인으로 변경됨을 감지 합니다.
	 */
	const handleChainChanged = (chainId: string) => {
		console.log(chainId); // 변경된 체인 주소
	};

	return (
		<>
			<h1>ethers.js</h1>
			{isConnected ? (
				<>
					<p>잔액:{balance}ETH</p>
					<button onClick={handleDisconnect}>연동해제</button>
				</>
			) : (
				<button onClick={handleConnect}>연동</button>
			)}
		</>
	);
};

export default EthersJs;
