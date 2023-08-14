import React from 'react'
import { Link } from "react-router-dom";
import { Fragment, useEffect, useState, useRef } from 'react'; // might not use?

// Display 4 NFT images
export function NFT4View(props){
    return (
			<div className="nft-4up">
        <div className="row align-items-center">
          <div className="col-sm"></div>
          <div className="nft-col col-sm-5">
						<Link to={'/id/666'}>
							<img src={require("../assets/nfts/sparrow_02_lg.png")} className="nft-img img-fluid"/>
						</Link>
          </div>
          <div className="nft-col col-sm-5">
						<Link to={'/id/666'}>
							<img src={require("../assets/nfts/maria_01_lg.png")} className="nft-img img-fluid"/>
						</Link>
          </div>
          <div className="col-sm"></div>
        </div>
        <div className="row align-items-center">
          <div className="col-sm"></div>
          <div className="nft-col col-sm-5">
						<Link to={'/id/666'}>
							<img src={require("../assets/nfts/serste_01_lg.png")} className="nft-img img-fluid"/>
						</Link>
          </div>
          <div className="nft-col col-sm-5">
						<Link to={'/id/666'}>
							<img src={require("../assets/nfts/lenara_lg.png")} className="nft-img img-fluid"/>
						</Link>
          </div>
          <div className="col-sm"></div>
        </div>
      </div>
		)
}

// this non-exported NFT hero image node is used by both exported NFT1 views:
function NFT1up(props){
	return(
			<div className="nft-1up">
				<div className="row align-items-center">
					<div className="nft-col col-sm-12">
						<img src={require("../assets/nfts/sparrow_02_lg.png")} className="nft-img img-fluid"/>
					</div>
				</div>
			</div>
	)
}

// Display 1 NFT image (just the image)
export function NFT1View(props){
	return (
		<div className="nft-single nft-1-view">
			<Link to={'/id/666'}>
				<NFT1up />
			</Link>
		</div>
	)
}


// Display 1 NFT image with a bunch of metadata & deets
export function NFTDetailView(props){
	return (
		<div className="nft-single nft-detail-view">
			<NFT1up />
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
	)
}
