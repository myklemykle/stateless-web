import { Link, useLoaderData } from "react-router-dom";
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Rnd1(props){
	const loader = useLoaderData();
	return(

		<div className="rnd1">

      <Header viewMode="1x" page={loader.page} walletSelector={props.walletSelector} walletClick={props.walletClick} />

      <div id="maincontent" className="maincontent text-center mt-5">
				<div className="nft-single nft-1-view">
					<Link to={'/id/666'}>

						{/* duplicated from routes/Id */}
						<div className="nft-1up">
							<div className="row align-items-center">
								<div className="nft-col col-sm-12">
									<img src={require("../assets/nfts/sparrow_02_lg.png")} className="nft-img img-fluid"/>
								</div>
							</div>
						</div>

					</Link>
				</div>

      </div>

      <Footer viewMode="1x" page={props.page} />

    </div>

	)
}
