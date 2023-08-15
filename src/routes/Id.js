import { Link, useLoaderData } from "react-router-dom";
import Header from '../components/Header'
import Footer from '../components/Footer'

// Display 1 NFT image with a bunch of metadata & deets
export default function Id(props){
	const loader = useLoaderData();
  return (
		<div className="rnd1">

      <Header viewMode="detail" page={props.page} walletSelector={props.walletSelector} walletClick={props.walletClick} />

      <div id="maincontent" className="maincontent text-center mt-5">

				<div className="nft-single nft-detail-view">

					{/* duplicated from routes/Rnd1 */}
					<div className="nft-1up">
						<div className="row align-items-center">
							<div className="nft-col col-sm-12">
								<img src={require("../assets/nfts/sparrow_02_lg.png")} className="nft-img img-fluid"/>
							</div>
						</div>
					</div>

					<div className="nft-details">
						<div className="nft-metadata">
							<div className="row">
								<div className="col-sm"></div>
								<div className="col-sm-8">
									<p className="nft-title"><span className="label">TITLE:</span> Emotions</p>
									<p className="nft-description"><span className="label">DESCRIPTION:</span> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.  </p>
									<p className="nft-artist"><span className="label">ARTIST:</span> Simon Wairiuko </p>
									<p className="nft-tags">
										<span className="nft-tag">tag</span>
										<span className="nft-tag">tag</span>
										<span className="nft-tag">tag</span>
										<span className="nft-tag">tag</span>
										<span className="nft-tag">tag</span>
										<span className="nft-tag">tag</span>
									</p>
									<p className="nft-mediatype"><span className="label">MEDIA TYPE:</span> </p>
									<p className="nft-editions"><span className="label">EDITIONS:</span>
									</p>
								</div>
								<div className="col-sm"></div>
							</div>
						</div>
						<div className="nft-buy">
							<div className="row">
								<div className="col-sm"></div>
								<div className="col-sm-8">
									<button type="button" className="nft-price nft-buy-button btn btn-outline-dark">100 NEAR</button>
								</div>
								<div className="col-sm"></div>
							</div>
						</div>
						<div className="nft-collectors">
							<div className="row">
								<div className="col-sm"></div>
								<div className="col-sm-8">
									<p className="label">COLLECTORS:</p>
									<p className="collector">name.near</p>
									<p className="collector">name.near</p>
									<p className="collector">name.near</p>
									<p className="collector">name.near</p>
									<p className="collector">name.near</p>
									<p className="collector">name.near</p>
									<p className="collector">name.near</p>
								</div>
								<div className="col-sm"></div>
							</div>
						</div>
					</div>
				</div>

			</div>

		<Footer viewMode="detail" page={props.page} />

	</div>

	)
}

