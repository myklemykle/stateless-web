import { Link } from 'react-router-dom'

export function ArtistHeading(props){
  return(

        <div className="profile-info artist-info container text-center mt-5 mb-5">
          <div className="row mb-4">
            <div className="col">
							<Link to={"https://near.social/mob.near/widget/ProfilePage?accountId=" + props.artistId} >
								<div className="profile-image-frame rounded-circle">
									<img className="profile-image" src={ props.profile && props.profile.image ? props.profile.image.src : require("../assets/generic_user.jpg") } />
									</div>
							</Link>
            </div>
          </div>
          <div className="row">
            <div className="col text-uppercase">
							{ props.profile?.name || props.artistId }
            </div>
          </div>
          <div className="row">
            <div className="col text-uppercase">
							{ props.profile?.description }
            </div>
          </div>
        </div>

  )
}

export function OwnerHeading(props){
  return(

        <div className="profile-info owner-info container text-center mt-5 mb-5">
          <div className="row mb-4">
            <div className="col">
							<Link to={"https://near.social/mob.near/widget/ProfilePage?accountId=" + props.ownerId} >
								<div className="profile-image-frame rounded-circle">
									<img className="profile-image" src={ props.profile && props.profile.image ? props.profile.image.src : require("../assets/generic_user.jpg") } />
								</div>
							</Link>
            </div>
          </div>
          <div className="row">
            <div className="col text-uppercase">
							{ props.profile?.name || props.ownerId }
            </div>
          </div>
          <div className="row">
            <div className="col text-uppercase">
							{ props.profile?.description }
            </div>
          </div>
        </div>

  )
}
