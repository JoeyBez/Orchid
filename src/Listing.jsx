import { supabase } from "./supabase";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Price from "./Price";
import ArtistLink from "./ArtistLink";

export default function Listing({listing}){
    const [artist, setArtist] = useState("");

    useEffect(() => {
        async function fetchArtist() {
            // Try to get the profile row
            const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", listing.author_id)
            .maybeSingle()

            if (error) {
            console.error("Error fetching artist name:", error);
            return;
            }

            if (!data) {
            setArtist("Loading...");
            return;
            }

            setArtist(data);
        }

        fetchArtist();
    }, [listing.author_id]);

    return (
        <Link to={`/listing/${listing.id}`}>
        <div>
            <div 
            className="galleryImage"
            >
                <img src={listing.img_url} alt="" />
            </div>
            <div style={{position:"relative"}}>
                <h3 style={{marginBottom:"0.1rem"}}>{listing.title}</h3>
                {/* <p>{artist}</p> */}
                <ArtistLink id={listing.author_id} name={`${artist.first_name} ${artist.last_name}`} verified={artist.verified}/>
                <p>{listing.category} &bull; {listing.year}</p>
                <Price price={listing.price}/>
                {/* <p style={{
                    position:"absolute",
                    float:"right",
                    top:"0",
                    margin:"0",
                    right:"0",
                }}>{listing.year}</p> */}
            </div>
        </div>
        </Link>
    );
}