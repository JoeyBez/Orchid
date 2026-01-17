import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import Listing from "./Listing";

export default function Gallery({author = "*"}){
    const [gallery, setGallery] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState(0);
    const [search, setSearch] = useState("");
    const categoryFilters = [
        "All Works",
        "Paint",
        "Charcoal",
        "Pencil",
        "Ink",
        "Other"
    ];

    useEffect(() => {
        async function fetchGallery() {
            let filter = categoryFilters[categoryFilter];
            if(filter == categoryFilters[0]) filter = "*";
            // Try to get the profile row
            let query = supabase
            .from("gallery")
            .select("*")
            .like("category", filter)

            if(author != "*") query.eq("author_id", author)

            const { data, error } = await query
            .select()

            if (error) {
            console.error("Error fetching gallery:", error);
            return;
            }

            setGallery(data);
        }

        fetchGallery();
    }, [categoryFilter, search]);



    return (
        <div>
            {author == "*" && <div style={{marginTop:"1rem", marginBottom:"2rem"}}>
                <h1>Gallery</h1>
            </div>}
            <div style={{display:"flex"}}>
                <div className="filterButtons" style={{width:"16rem", position:"sticky", height:"80vh", top:"6rem", overflowY:"scroll", padding:"0.1rem"}}>
                    <p>SEARCH</p>
                    <div style={{marginBottom:"0.75rem"}}>
                        <input value={search} placeholder="Search" onChange={(e) => setSearch(e.target.value)}/>
                    </div>
                    <p>CATEGORY</p>
                    {categoryFilters.map((f, index) => (
                        <button 
                        key={index} 
                        onClick={() => {setCategoryFilter(index)}}
                        style={{ 
                            marginRight:"0.5rem",
                            marginBottom:"0.5rem",
                            backgroundColor:(categoryFilter == index ? "#1a1a1a" : ""),
                            color:(categoryFilter == index ? "white" : "var(--text-color)")
                        }}>
                        {f}
                        </button>
                    ))}
                </div>
                <div className="gallery">
                    {gallery.length > 0 ?
                        gallery
                        .filter((a) => a.title.toLowerCase().includes(search.toLowerCase()))
                        .map((listing, index) => (
                            <div key={index} className="listing">
                                <Listing listing={listing}/>
                            </div>
                        ))
                        :
                        <p>No gallery info</p>
                    }
                </div>
            </div>
        </div>
    );
}