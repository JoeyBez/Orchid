import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { useParams } from 'react-router-dom'
import Price from "./Price";
import ArtistLink from "./ArtistLink";

export default function ViewListing({session}){
    const {listingId} = useParams();
    const [listing, setListing] = useState({});
    const [editMode, setEditMode] = useState(false);
    
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [price, setPrice] = useState(0.00);
    const [category, setCategory] = useState("Other");
    const [year, setYear] = useState(2026);
    const [loading, setLoading] = useState(false);

    const categories = [
        "Other",
        "Paint",
        "Charcoal",
        "Pencil",
        "Ink"
    ];

    useEffect(() => {
        async function fetchListing() {
            // Try to get the profile row
            const { data, error } = await supabase
            .from("gallery")
            .select("*")
            .eq("id", listingId)
            .maybeSingle()

            if (error) {
            console.error("Error fetching artist name:", error);
            return;
            }

            setListing(data);
            setTitle(data.title);
            setDesc(data.description);
            setPrice(data.price);
            setCategory(data.category);
            setYear(data.year);
        }

        fetchListing();
    }, [listingId]);

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
            setArtist("...");
            return;
            }

            setArtist(data);
        }

        fetchArtist();
    }, [listing]);

    const updateListing = async () => {
        setLoading(true);
        const { error, data: updatedListing } = await supabase
        .from("gallery")
        .update({ title: title, description: desc, price: price, category: category, year: year })
        .eq("id", listingId)
        .select()
        .single();

        if (error) alert("Error updating name: " + error.message);
        else {
        setListing(updatedListing);
        //   alert("Name updated!");
        }

        setLoading(false);
    };

    function UserIsAuthor(){
        return session.user.id == listing.author_id;
    }

    return (
        <div className="listingView">
            <div 
                className="listingImage"
                style={{marginRight:"1rem"}}
            >
                <img 
                src={listing.img_url}
                />
            </div>
            {editMode ?
            <div>
                <p>Title</p>
                <input value={title} onChange={(e) => setTitle(e.target.value)}></input>
                <p>Price</p>
                <input type="number" pattern="^\d{1,13}(?:\.\d{1,2})?$" maxLength="16" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)}></input>
                <p>About</p>
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)}></textarea>
                <p>Year</p>
                <input type="number" maxLength="4" step="1" value={year} onChange={(e) => setYear(e.target.value)}></input>
                <p>Category</p>
                <select value={category} name="Category" onChange={(e) => setCategory(e.target.value)}>
                    {categories.map((i) => (
                        <option value={i}>{i}</option>
                    ))}
                </select>
                <br/>
                <br/>
                <button onClick={() => {updateListing(); setEditMode(false);}} disabled={loading}>Save</button>
            </div>
            :
            <div>
                <h1 style={{marginBottom:"0.5rem"}}>{listing.title}</h1>
                <ArtistLink id={listing.author_id} name={`${artist.first_name} ${artist.last_name}`} verified={artist.verified}/>
                <Price price={listing.price} big="true"/>
                <br />
                <p>ABOUT THIS WORK</p>
                <p>{listing.description}</p>
                <br/>
                <hr/>
                <div className="listingAboutGrid">
                    <div>
                        <p>YEAR</p>
                        <p>{listing.year}</p>
                    </div>
                    <div>
                        <p>CATEGORY</p>
                        <p>{listing.category}</p>
                    </div>
                    <div>
                        <p>DIMENSIONS</p>
                        <p>{listing.width}" x {listing.height}"</p>
                    </div>
                </div>
                {/* {UserIsAuthor() ? <button onClick={() => {setEditMode(true);}} disabled={loading}>Edit</button> : null} */}
            </div>
            }
        </div>
    );
}