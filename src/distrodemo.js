
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

// poor man's jquery
const _$ = document.querySelector.bind(document) ;

// show/hide the bootstrap way:
const bsHide = (el) => {
	el.classList.add('d-none');
}
const bsShow = (el) => {
	el.classList.remove('d-none');
}
const bsDisable = (el) => {
	el.disabled = true;
}
const bsEnable = (el) => {
	el.disabled = false;
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
    // "Example App", // optional
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
	let payform = _$("#payment-form fieldset");
	bsHide(report); bsHide(errReport);
	
	// call listMinters() on the contract:
	try { 
		let minters = await mc.list_minters();
		// TODO: test the list somewhat.
		report.innerHTML = "contract '" + mc.contractId + "' has " + minters.length + " minters: <br/>" + minters.join(", ");
		bsShow(report);
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
	if (window.wallet.isSignedIn()) {
		_$("#near-disconnected").style.display = "none";
		_$("#minter-form").addEventListener("submit", submitMinterForm);
		_$("#payment-form").addEventListener("submit", submitPaymentForm);
		_$("#near-connected").style.display = "block";

		window.nearAccount = await near.account(wallet.getAccountId());
		window.nearAccount.__balance = await window.nearAccount.getAccountBalance();

		_$("#accountName").innerHTML = window.nearAccount.accountId;
		_$("#accountBalance").innerHTML = utils.format.formatNearAmount(window.nearAccount.__balance.available, 3);
		
	} else {
		_$("#near-connected").style.display = "none";
		_$("#near-disconnected").style.display = "block";
	}

	window.utils = {
		signIn: signIn,
		signOut: signOut,
	};
}
