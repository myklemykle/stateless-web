
import * as nearAPI from "near-api-js";

const { utils, connect, keyStores, WalletConnection} = nearAPI;

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
const _$ = document.querySelector.bind(document) ;

const defined = (el) => {
	return (el != null && typeof el !== 'undefined');
}

// show/hide elements the bootstrap way:
const bsHide = (el) => {
	if (defined(el))
		el.classList.add('d-none');
}
const bsShow = (el) => {
	if (defined(el))
		el.classList.remove('d-none');
}
const bsDisable = (el) => {
	if (defined(el))
		el.disabled = true;
}
const bsEnable = (el) => {
	if (defined(el))
		el.disabled = false;
}

// reload the same page with no query args:
const startOver = () => {
	window.location.href = window.location.origin + window.location.pathname ;
}


window.wallet = {};
window.near = {};
window.nearAccount = {};

export async function init() {
	// connect to blockchain
	window.near = await connect(config);

	// connect to wallet
	window.wallet = new WalletConnection(window.near);

};

// redirects user to wallet to authorize your dApp
// this creates an access key that will be stored in the browser's local storage
// access key can then be used to connect to NEAR and sign transactions via keyStore

export const signIn = () => {
  window.wallet.requestSignIn(
    config.distrotron, // contract requesting access
    "Distrotron", // optional
    // "http://YOUR-URL.com/success", // optional
    // "http://YOUR-URL.com/failure" // optional
  );
};

export async function signOut(){
  await window.wallet.signOut();
	window.location.reload();
};

// Try to get the list of minters from the minter contract.
export async function submitMinterForm(e){
	e.preventDefault();

	const mc = new nearAPI.Contract(
		window.nearAccount, // the account object that is connecting
		_$("#minter-contract").value,
		{
			// name of contract you're connecting to
			viewMethods: ["list_minters"], // view methods do not change state but usually return a value
			sender: window.nearAccount, // account object to initialize and sign transactions.
		}
	);

	let report = _$("#minter-report .alert-success");
	let errReport = _$("#minter-report .alert-warning");
	//let payform = _$("#payment-form fieldset");
	let payform = _$("#payment-form");
	bsHide(report); bsHide(errReport);
	
	// call listMinters() on the contract:
	try { 
		let minters = await mc.list_minters();
		// TODO: test the list somewhat.
		report.innerHTML = "contract '" + mc.contractId + "' has " + minters.length + " minters: <br/>" + minters.join(", ");
		bsShow(report);
		bsShow(payform);
		bsEnable(payform);
	} catch(err) { 
		// if errors, report them
		console.log(err);
		errReport.innerHTML = err;
		bsShow(errReport);
		bsDisable(payform);
	}
};

// Call the distrotron to distribute some NEAR
export async function submitPaymentForm(e){
	e.preventDefault();
	const dc = new nearAPI.Contract(
		window.wallet.account(), // the connected wallet account
		config.distrotron, 	// address of the distrotron contract
		{
			changeMethods: ["pay_minters", "pay_out"],
			sender: window.nearAccount, // account object to initialize and sign transactions.
		}
	);

	let report = _$("#payment-report .alert-success");
	let errReport = _$("#payment-report .alert-warning");
	bsHide(report); bsHide(errReport);

	try {
		let net_payment = await window.wallet.account().functionCall( 
			// contract we are calling:
			config.distrotron,
			// method on that contract:
			"pay_minters",
			// arguments to that method:
			{
				minter_contract: _$("#minter-contract").value,
			},
			// included gas:
			LOTSAGAS, // attached GAS 
			// included payment: 
			utils.format.parseNearAmount(_$("#total-payment").value),       // attached near
			// walletMeta -- not documented, not working?
			// "all your moneys",
			// walletCallbackURL -- used to work, not sure now?
			// window.location.origin + window.location.pathname + "/victory", 
			//  --- instead, success redirects back to window.location.href 
			//      with a "?transactionHashes=F6KN3S7MtBfb6ojoxhsuKeLg4fi2xxErRnfkMeek2gfg" query ...
		);

		// these lines don't execute, because we're redirected by the functionCall()  ...
		report.innerHTML = "Paid " + utils.format.formatNearAmount(net_payment, 3) + " NEAR to each minter".
		bsShow(report);

	} catch(err) { 
		errReport.innerHTML = err;
		console.log(err);
		bsShow(errReport);
	}
	
};

window.onload = async function(){

	await init();
	const urlSearchParams = new URLSearchParams(window.location.search);
	const params = Object.fromEntries(urlSearchParams.entries());

	if (window.wallet.isSignedIn()) {
		bsHide(_$("#near-disconnected"));
		bsShow(_$("#near-connected"));

		window.nearAccount = await near.account(wallet.getAccountId());
		_$("#accountName").innerHTML = window.nearAccount.accountId;

		window.nearAccount.__balance = await window.nearAccount.getAccountBalance();
		_$("#accountBalance").innerHTML = utils.format.formatNearAmount(window.nearAccount.__balance.available, 3);

		if (params.errorCode) {
			// returned here after a tx failure!  
			// bsHide(_$("#minter-form"));
			// bsHide(_$("#payment-form"));
			// bsShow(_$("#tx-error"));
			// bsHide(_$("#tx-success");
			//
			// not going to talk up this error cuz the Wallet should already have reported it.
			// Just reload the page without query args, to try again.
			startOver();

		} else if (params.transactionHashes) {
			// returned here after a tx success!  give a link to the explorer
			_$("a#tx-hash-btn").href = window.near.config.explorerUrl + '/transactions/' + params.transactionHashes;
			_$("#start-over-btn").onclick = startOver; 
			bsHide(_$("#minter-form"));
			bsHide(_$("#payment-form"));
			bsHide(_$("#tx-error"));
			bsShow(_$("#tx-success"));

		} else {
			bsHide(_$("#tx-error"));
			bsHide(_$("#tx-success"));
			bsShow(_$("#minter-form"));
			bsHide(_$("#payment-form")); // not shown at first ...

			_$("#minter-form").addEventListener("submit", submitMinterForm);
			_$("#payment-form").addEventListener("submit", submitPaymentForm);

		}
		
	} else { // not signed in
		bsHide(_$("#near-connected"));
		bsShow(_$("#near-disconnected"));
	}

	window.utils = {
		signIn: signIn,
		signOut: signOut,
	};
}
