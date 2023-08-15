import { ViewSelector, Ident } from './Nav';

export default function Header(props){
	return(
			<div className="header">
				<nav className="row">

					<div className="logo col">
						<img src={require("../assets/logo.png")} className="float-start mt-1"/>
					</div>

					<div className="nav-top col-sm-auto mt-2 d-none d-sm-block">
						<ViewSelector id="selector-top" viewMode={props.viewMode} count={props.count} page={props.page}/>
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

