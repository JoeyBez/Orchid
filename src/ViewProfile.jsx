import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import Gallery from "./Gallery";
import { VscVerifiedFilled } from "react-icons/vsc";
import { IoAddSharp } from "react-icons/io5";

export default function ViewProfile(){
    const {userId} = useParams();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        async function fetchProfile() {
            // Try to get the profile row
            const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .maybeSingle(); // prevents 406 if row doesn't exist

            if (error) {
            console.error("Error fetching profile:", error);
            return;
            }

            setProfile(data);
        }

        fetchProfile();
    }, [userId]);
    
    return (
        <div>
            {profile ? 
            <div>
                <h1>{profile.first_name} {profile.last_name} &nbsp;{profile.verified ? <VscVerifiedFilled title="Verified Artist" style={{marginLeft:"-0.8rem", marginBottom:"-0.7rem", color:"rgb(62, 62, 62)", width:"2rem"}}/> : null}</h1>
                <br/>
                <pre>{profile.bio}</pre>
                <h2 style={{marginRight:"1rem"}}>Works by {profile.first_name} {profile.last_name}</h2>
                <Gallery author={userId}/>
            </div>
            :
                <p>Loading...</p>
            }
        </div>
    );
}