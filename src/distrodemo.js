
// node version:
// import * as nearApi from "near-api-js";
//
// browser version:
window.onload = async function() {

	const { utils, connect, keyStores, WalletConnection} = nearApi;

	const config = {
		networkId: "testnet",
		keyStore: new keyStores.BrowserLocalStorageKeyStore(),
		nodeUrl: "https://rpc.testnet.near.org",
		walletUrl: "https://wallet.testnet.near.org",
		helperUrl: "https://helper.testnet.near.org",
		explorerUrl: "https://explorer.testnet.near.org",
		distrotron: "distro_test.mykletest.testnet",
	};

	const LOTSAGAS = "300000000000000"; // ATM this is the max gas that can be attached to a transaction

	///////////
	//
	// some simple utils for a simple script.
	// 
	// poor man's jquery:
	// const _$ = document.querySelector.bind(document) ;

	const defined = (el) => {
		return (el != null && typeof el !== 'undefined');
	}

	// show/hide elements the bootstrap way:
	const bsHide = (el) => {
		if (defined(el))
			// el.classList.add('d-none');
			el.addClass('d-none');
	}
	const bsShow = (el) => {
		if (defined(el))
			//el.classList.remove('d-none');
			el.removeClass('d-none');
	}
	const bsDisable = (el) => {
		if (defined(el))
			// el.disabled = true;
			el.prop('disabled', false);
	}
	const bsEnable = (el) => {
		if (defined(el))
			// el.disabled = false;
			el.prop('disabled', false);
	}

	// reload the same page with no query args:
	const startOver = () => {
		window.location.href = window.location.origin + window.location.pathname ;
	}


	window.wallet = {};
	window.near = {};
	window.nearAccount = {};

	// export async function init() {
	async function init() {
		// connect to blockchain
		window.near = await connect(config);

		// connect to wallet
		window.wallet = new WalletConnection(window.near);

	};

	// redirects user to wallet to authorize your dApp
	// this creates an access key that will be stored in the browser's local storage
	// access key can then be used to connect to NEAR and sign transactions via keyStore

	// export const signIn = () => {
	const signIn = () => {
		window.wallet.requestSignIn(
			config.distrotron, // contract requesting access
			"Distrotron", // optional
			// "http://YOUR-URL.com/success", // optional
			// "http://YOUR-URL.com/failure" // optional
		);
	};

	// export async function signOut(){
	async function signOut(){
		await window.wallet.signOut();
		window.location.reload();
	};

	// Try to get the list of minters from the minter contract.
	// export async function submitMinterForm(e){
	async function submitMinterForm(e){
		e.preventDefault();

		const mc = new nearApi.Contract(
			window.nearAccount, // the account object that is connecting
			$("#minter-contract").val(),
			{
				// name of contract you're connecting to
				viewMethods: ["list_minters"], // view methods do not change state but usually return a value
				sender: window.nearAccount, // account object to initialize and sign transactions.
			}
		);

		let report = $("#minter-report .alert-success");
		let errReport = $("#minter-report .alert-warning");
		let payform = $("#payment-form");
		let payformForm = $("#payment-form fieldset");
		bsHide(report); bsHide(errReport);
		
		// call listMinters() on the contract:
		try { 
			let minters = await mc.list_minters();
			// TODO: test the list somewhat.
			//

			// report results
			report.html("contract '" + mc.contractId + "' has " + minters.length + " minters: <br/>" + minters.join(", "));
			bsShow(report);
			bsShow(payform);
			bsEnable(payformForm);

			showPaymentUI(mc.contractId);
		} catch(err) { 
			// if errors, report them
			console.log(err);
			errReport.html(err);
			bsShow(errReport);
			bsDisable(payformForm);
		}
	};

	// decorate & show other UI that needs a valid contract to work
	function showPaymentUI(mbContractId) {
			let mbContractName = mbContractId.split('.');
			$(".distrotron-contract-firstname").html(mbContractName.shift());
			$(".distrotron-contract-restname").html('.' + mbContractName.join('.'));
			bsShow($(".distrotron-contract-found"));
	}

	// Call the distrotron to distribute some NEAR
	// export async function submitPaymentForm(e){

	async function payMinters(minterContract, totalPayment, reportEl, errReportEl, meta) {
		bsHide(reportEl); bsHide(errReportEl);

		let allMeta = Object.assign({
			minterContract: minterContract,
			totalPayment: totalPayment
		}, meta);

		const dc = new nearApi.Contract(
			window.wallet.account(), // the connected wallet account
			config.distrotron, 	// address of the distrotron contract
			{
				changeMethods: ["pay_minters", "split_payment"],
				sender: window.nearAccount, // account object to initialize and sign transactions.
			}
		);

		try {
			let net_payment = await dc.pay_minters({
				args: {
					minter_contract: minterContract,
				},
				gas: LOTSAGAS, // attached GAS 
				amount: totalPayment, // attached yoctoNear
				meta: JSON.stringify(allMeta)
			});

				///////////////////
				// The call to a payable method is then REDIRECTED to the NEAR Wallet page! Execution stops here.
				// Success redirects back to window.location.href 
				//      with a "?transactionHashes=F6KN3S7MtBfb6ojoxhsuKeLg4fi2xxErRnfkMeek2gfg" query ...
				/////////
			
		} catch(err) { 
			errReportEl.html(err);
			console.log(err);
			bsShow(errReportEl);
		}
	};

	async function submitPaymentForm(e){
		e.preventDefault();

		let reportEl = $("#main-payment-report .alert-success");
		let errReportEl = $("#main-payment-report .alert-warning");
		let minterContract = $("#minter-contract").val();
		let totalPayment = utils.format.parseNearAmount($("#total-payment").val());

		return await payMinters(minterContract, totalPayment, reportEl, errReportEl);
	};

	async function submitTipButton(e){
		e.preventDefault();

		let form = $(e.target);

		let reportEl = form.find(".payment-report .alert-success");
		let errReportEl = form.find(".payment-report .alert-warning");
		let minterContract = $("#minter-contract").val();
		let tipAmount = utils.format.parseNearAmount(form.find(".tip-amount").val());

		return await payMinters(minterContract, tipAmount, reportEl, errReportEl);
	}

	// window.onload = async function(){

		await init();
		const urlSearchParams = new URLSearchParams(window.location.search);
		const params = Object.fromEntries(urlSearchParams.entries());

		// meta == any previous state reflected back by NEAR Wallet:
		let meta = {};
		if (params.signMeta){
			try { // could be garbled ...
				meta = JSON.parse(params.signMeta);
			} catch {}
		}

		if (window.wallet.isSignedIn()) {
			bsHide($(".near-disconnected"));
			bsShow($(".near-connected"));

			window.nearAccount = await near.account(wallet.getAccountId());
			$(".accountName").html(window.nearAccount.accountId);

			window.nearAccount.__balance = await window.nearAccount.getAccountBalance();
			$("#accountBalance").html(utils.format.formatNearAmount(window.nearAccount.__balance.available, 3));

			if (params.errorCode) {
				// returned here after a tx failure!  
				// bsHide($("#minter-form"));
				// bsHide($("#payment-form"));
				// bsShow($(".tx-error"));
				// bsHide($(".tx-success");
				//
				// not going to talk up this error cuz the Wallet should already have reported it.
				// Just reload the page without query args, to try again.
				startOver();

			} else if (params.transactionHashes) {
				// returned here after a tx success!  give a link to the explorer
				$("a#tx-hash-btn").attr('href',window.near.config.explorerUrl + '/transactions/' + params.transactionHashes);
				$("#start-over-btn").on('click',startOver); 
				bsHide($("#minter-form"));
				bsHide($("#payment-form"));
				bsHide($(".tx-error"));
				bsShow($(".tx-success"));
				// if (meta.minterContract) {
				// 	showPaymentUI(meta.minterContract);
				// }

			} else {
				bsHide($(".tx-error"));
				bsHide($(".tx-success"));
				bsShow($("#minter-form"));
				bsHide($("#payment-form")); // not shown at first ...

				$("#minter-form").on("submit", submitMinterForm);
				$("#payment-form").on("submit", submitPaymentForm);
				$("form.tip-button").on("submit", submitTipButton);

			}
			
		} else { // not signed in
			bsHide($(".near-connected"));
			bsShow($(".near-disconnected"));
		}

		window.utils = {
			signIn: signIn,
			signOut: signOut,
		};
	// }


};
