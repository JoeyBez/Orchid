import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";
import { useSearchParams } from 'react-router-dom'
import Price from "./Price";
import ArtistLink from "./ArtistLink";
import { Link } from "react-router-dom";
import ImageUploader from "./ImageUploader";

export default function EditListing({session}){
    //const {listingId} = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [listingId, setListingId] = useState(searchParams.get("listingId"));
    //const [listingId, setListingId] = useState(useParams());
    const [listing, setListing] = useState({});
    
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

    const didCreateRef = useRef(false);

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
            }
            
            if (didCreateRef.current) return;
            didCreateRef.current = true;

            if (!data) {
                // Row doesn't exist → create it
                const { data, error } = await supabase
                .from("gallery")
                .insert({ 
                    title: "New Listing",
                    description: "",
                    price: "0",
                    category: "Other",
                    img_url: "",
                    author_id: session.user.id
                })
                .select()
                .single();

                if (error) {
                    console.error("Error creating listing row:", error);
                    return;
                }
                
                setSearchParams({listingId:data.id});
                setListingId(data.id);
                setListing(data);
                setTitle(data.title);
                setDesc(data.description);
                setPrice(data.price);
                setCategory(data.category);
                setYear(data.year);
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
    }, [listingId, listing.img_url]);

    const updateListing = async () => {
        const timestamp = Date.now();
        setLoading(true);
        const { error, data: updatedListing } = await supabase
        .from("gallery")
        .update({ title: title, description: desc, price: price, category: category, year: year, date_modified: timestamp })
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
            <ImageUploader
                session={session}      // your auth session
                listing={listing} // the ID of the listing you are editing
            />
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
                <Link to="/listings" onClick={() => {updateListing();}} disabled={loading}><button>Save</button></Link>
            </div>
        </div>
    );
}