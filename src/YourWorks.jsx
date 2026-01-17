import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import Gallery from "./Gallery";
import { VscVerifiedFilled } from "react-icons/vsc";
import { IoAddSharp } from "react-icons/io5";
import WorksList from "./WorksList";
import { IoIosSearch } from "react-icons/io";

export default function YourWorks({session}){
    const [profile, setProfile] = useState(null);
    const [search, setSearch] = useState("");
    const params = new URLSearchParams()
    params.set('listingId', '-1')

    useEffect(() => {
        async function fetchProfile() {
            // Try to get the profile row
            const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .maybeSingle(); // prevents 406 if row doesn't exist

            if (error) {
            console.error("Error fetching profile:", error);
            return;
            }

            setProfile(data);
        }

        fetchProfile();
    }, [session.user.id]);
    
    return (
        <div>
            {profile ? 
            <div>
                <br/>
                <div style={{display:"flex", alignItems:"center", width:"75vw", left:"1rem", right:"1rem", justifyContent:"space-between", marginBottom:"-1rem"}}>
                    <h2 style={{marginRight:"1rem"}}>My Artworks</h2>
                    <div>
                        <Link to={{ pathname: "/edit-listing", search: `?${params.toString()}` }}><button><div style={{display:"flex", alignItems:"center", margin:"-0.5rem"}}><IoAddSharp /><p>&nbsp;Add Artwork</p></div></button></Link>
                    </div>
                </div>
                <p>Manage your collection</p>
                <br />
                <div>
                    {/* <IoIosSearch style={{scale:"1.3", marginRight:"0.5rem"}}/> */}
                    <input value={search} placeholder="Search" onChange={(e) => setSearch(e.target.value)}/>
                </div>
                <br />
                <WorksList author={session.user.id} search={search}/>
            </div>
            :
                <p>Loading...</p>
            }
        </div>
    );
}