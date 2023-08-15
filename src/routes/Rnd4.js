import { Link, useLoaderData } from "react-router-dom";
import Header from '../components/Header'
import Footer from '../components/Footer'

// This non-exported NFT gallery image view is used 4 times by NFT4View:
function NFT4up(props){
  return(
          <div className="nft-col col-sm-5">
            <Link to={'/id/' + props.nftid}>
              <img src={props.media} className="nft-img img-fluid"/>
            </Link>
          </div>
  )
}

export default function Rnd4(props){
	const loader = useLoaderData();
	return(

		<div className="rnd4">

      <Header viewMode="4x" page={loader.page} walletSelector={props.walletSelector} walletClick={props.walletClick} />

      <div id="maincontent" className="maincontent text-center mt-5">

				<div className="nft-4up">
					<div className="row align-items-center">
						<div className="col-sm"></div>
						<NFT4up nftid="777" media={require("../assets/nfts/sparrow_02_lg.png")} />
						<NFT4up nftid="777" media={require("../assets/nfts/maria_01_lg.png")} />
						<div className="col-sm"></div>
					</div>
					<div className="row align-items-center">
						<div className="col-sm"></div>
						<NFT4up nftid="777" media={require("../assets/nfts/serste_01_lg.png")} />
						<NFT4up nftid="777" media={require("../assets/nfts/lenara_lg.png")} />
						<div className="col-sm"></div>
					</div>
				</div>

      </div>

      <Footer viewMode="4x" page={loader.page} />

    </div>

	)
}
