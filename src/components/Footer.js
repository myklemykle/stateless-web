import { ViewSelector } from './Nav';

export default function Footer(props){
	return(

			<div className="footer">
        <nav className="row">

          <div className="col"></div>

          <div className="nav-btm col-auto mt-2 mb-4 d-block d-sm-none">
						<ViewSelector id="selector-bottom" className="nav" viewMode={props.viewMode} count={props.count} page={props.page}  />
          </div>

          <div className="col"></div>

        </nav>
      </div>

	)
}

