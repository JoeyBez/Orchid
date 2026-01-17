import { Link } from "react-router-dom";
import { VscVerifiedFilled } from "react-icons/vsc";

export default function ArtistLink({id, name, verified}){
    return(
        <div>
        <Link to={`/artist/${id}`}>{name}</Link>
        {verified ? <VscVerifiedFilled title="Verified Artist" style={{marginLeft:"-0.8rem", marginBottom:"-0.2rem", color:"rgb(62, 62, 62)"}}/> : null}
        </div>
    );
}