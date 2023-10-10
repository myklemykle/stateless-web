import { ViewSelector, Ident } from './Nav';
import { Link } from "react-router-dom"
import { singleSelectorPath, reloadSelectorPath, gridSelectorPath } from '../util'


export function Header(props){
	let singlePath = singleSelectorPath(props.nftGallery, props.nftGalleryCursor, props.viewMode, props.page)
  let reloadPath = reloadSelectorPath(props.nftGallery, props.nftGalleryCursor, props.viewMode, props.page)
  let gridPath   = gridSelectorPath(props.nftGallery, props.nftGalleryCursor, props.viewMode, props.page)

	return(

			<div className="header">
				<nav className="row">

					<div className="logo col">
						<Link to="/">
							<div className="site-name float-start mt-1">{window.stateless_config.sitename}</div>
						</Link>
					</div>

					<div className="nav-top col-sm-auto mt-2 d-none d-sm-block">
						<ViewSelector id="selector-top" 
							viewMode={props.viewMode}
							singlePath={singlePath}
							reloadPath={reloadPath}
							gridPath={gridPath}
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

export function Footer(props){
	let singlePath = singleSelectorPath(props.nftGallery, props.nftGalleryCursor, props.viewMode, props.page)
  let reloadPath = reloadSelectorPath(props.nftGallery, props.nftGalleryCursor, props.viewMode, props.page)
  let gridPath   = gridSelectorPath(props.nftGallery, props.nftGalleryCursor, props.viewMode, props.page)

	return(

			<div className="footer">
        <nav className="row">

          <div className="col"></div>

          <div className="nav-btm col-auto mt-2 mb-4 d-block d-sm-none">
						<ViewSelector id="selector-bottom" className="nav" 
							viewMode={props.viewMode}
							singlePath={singlePath}
              reloadPath={reloadPath}
              gridPath={gridPath}
						/>
          </div>

          <div className="col"></div>

        </nav>
      </div>

	)
}

