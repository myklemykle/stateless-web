import { ViewSelector, Ident } from './Nav';
import { Link } from "react-router-dom"

export default function Header(props){
	return(
			<div className="header">
				<nav className="row">

					<div className="logo col">
						<Link to="/">
							<img src={require("../assets/logo.png")} className="float-start mt-1"/>
						</Link>
					</div>

					<div className="nav-top col-sm-auto mt-2 d-none d-sm-block">
						<ViewSelector id="selector-top" viewMode={props.viewMode} nftGallery={props.nftGallery} page={props.page} nftGalleryCursor={props.nftGalleryCursor} 
							singlePath={props.singlePath}
							reloadPath={props.reloadPath}
							gridPath={props.gridPath}
						/>
					</div>

					<div className="col">
						<div className="float-end mt-2">
							<Ident id="ident" walletSelector={props.walletSelector} walletClick={props.walletClick}/>
						</div>
					</div>

				</nav>
			</div>
	)
}

