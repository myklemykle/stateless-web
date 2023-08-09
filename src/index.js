import React from 'react';
import { useEffect, useState } from 'react';

import { createRoot } from 'react-dom/client';

import { ViewSelector, Ident } from './components/Nav';


function Index(){

	return(

	<div id="app" className="app">

		<div className="header">
			<nav className="row">
				<div className="logo col">
					<img src={require("./assets/logo.png")} className="float-start mt-1"/>
				</div>
				<div className="nav-top col-sm-auto mt-2 d-none d-sm-block">

					<ViewSelector id="selector-top" />

				</div>{/* <!-- nav-top --> */}
				<div className="col">
					<div className="float-end mt-2">

						<Ident id="ident" />

					</div>
				</div>
			</nav>
		</div>

		<div className="maincontent text-center mt-5">
			<div className="nft-4up">
				<div className="row align-items-center">
					<div className="col-sm"></div>
					<div className="nft-col col-sm-5">
						<img src={require("./assets/nfts/sparrow_02_lg.png")} className="nft-img img-fluid"/>
					</div>
					<div className="nft-col col-sm-5">
						<img src={require("./assets/nfts/maria_01_lg.png")} className="nft-img img-fluid"/>
					</div>
					<div className="col-sm"></div>
				</div>
				<div className="row align-items-center">
					<div className="col-sm"></div>
					<div className="nft-col col-sm-5">
						<img src={require("./assets/nfts/serste_01_lg.png")} className="nft-img img-fluid"/>
					</div>
					<div className="nft-col col-sm-5">
						<img src={require("./assets/nfts/lenara_lg.png")} className="nft-img img-fluid"/>
					</div>
					<div className="col-sm"></div>
				</div>
			</div>
		</div>

		<div className="footer">
			<div className="row">
				<div className="col"></div>
				<div className="nav-btm col-auto mt-2 mb-4 d-block d-sm-none">

					<ViewSelector id="selector-bottom" className="nav" />

				</div>
				<div className="col"></div>
			</div>
		</div>

		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js" integrity="sha384-pprn3073KE6tl6bjs2QrFaJGz5/SUsLqktiwsUTF55Jfv3qYSDhgCecCxMW52nD2" crossOrigin="anonymous"></script>
	</div>
		) 
}


const root = createRoot(document.getElementById('app'));
root.render(<Index />);


