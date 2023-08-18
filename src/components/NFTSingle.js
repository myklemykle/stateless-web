import { Link, useLoaderData, useNavigation } from "react-router-dom";

export default function NFTSingle(props){
	const nav = useNavigation()

	if (nav.state === "loading") {
		return(
						<div className="nft-loading" />
		)
	} else if (! props.nftRecord) {
		return(

						<div className="no-nft" />

		)
	} else{ 
		let nft = props.nftRecord
		return(

					<div className="nft-single nft-1-view">
            <Link to={'/id/' + nft.metadata_id}>

              <div className="nft-1up">
                <div className="row align-items-center">
                  <div className="nft-col col-sm-12">
                    <img src={nft.media_url} className="nft-img img-fluid"/>
                  </div>
                </div>
              </div>

            </Link>
          </div>

		)
	}
}

