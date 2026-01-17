import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import Listing from "./Listing";
import Price from "./Price";
import { LuPencil } from "react-icons/lu";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

export default function WorksList({author, search}){
    const [gallery, setGallery] = useState([]);
    const [reload, setReload] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [idToDelete, setIdToDelete] = useState({});
    const params = new URLSearchParams()

    useEffect(() => {
        async function fetchGallery() {
            // Try to get the profile row
            const { data, error } = await supabase
            .from("gallery")
            .select("*")
            .eq("author_id", author)

            if (error) {
            console.error("Error fetching gallery:", error);
            return;
            }

            setGallery(data);
        }

        fetchGallery();
    }, [author, reload]);

    const deleteListing = async (listing) => {
        const bucket = "gallery";

        console.log("FULL URL:", listing.img_url);

        const marker = `/storage/v1/object/public/${bucket}/`;
        console.log("MARKER:", marker);

        const index = listing.img_url.indexOf(marker);
        console.log("INDEX:", index);

        const extractedPath =
        index !== -1
            ? listing.img_url.substring(index + marker.length)
            : null;

        console.log("EXTRACTED PATH:", extractedPath);
        if (extractedPath) {
            const { data: storageData, error: storageError } = await supabase.storage
            .from("gallery")
            .remove([extractedPath]);
            if (storageError) console.error("Failed to delete image:", storageError.message);
            else console.log("Image deleted:", storageData, extractedPath);
        }

        const { error } = await supabase
            .from("gallery")
            .delete()
            .eq("id", listing.id);

        if (error) {
            console.error("Delete failed:", error.message);
        } else {
            console.log("Listing deleted");
            setReload(!reload);
        }
    };

    return (
        <div>
            <div className="gallery">
                {gallery.length > 0 ?
                    gallery
                    .sort((a, b) => b.date_modified - a.date_modified)
                    .filter((a) => a.title.toLowerCase().includes(search.toLowerCase()))
                    .map((listing, index) => (
                        <div key={index} style={{
                            right:"0",
                            width:"100%",
                            height:"140px",
                            marginBottom:"1rem",
                            display:"flex",
                            alignItems:"center",
                            position:"relative",
                            boxShadow:"0 1px 4px 1px rgba(0, 0, 0, 0.108)"
                        }}>
                            <div 
                                style={{marginLeft:"0.8rem", width:"80px", height:"100px"}}
                            >
                                <img 
                                src={listing.img_url}
                                style={{objectFit:"cover", width:"100%", height:"100%"}}
                                />
                            </div>
                            <div style={{marginLeft:"1rem"}}>
                                <h3>{listing.title}</h3>
                                <p>{listing.category} &bull; {listing.year}</p>
                                <Price price={listing.price}/>
                            </div>
                            <div style={{
                                width:"inherit",
                                display:"flex",
                                justifyContent:"flex-end",
                                paddingRight:"1rem",
                                position:"absolute",
                                right:"0",
                            }}>
                                {params.set('listingId', listing.id)}
                                <Link to={`/listing/${listing.id}`}><IoEyeOutline className="worksButton"/></Link>
                                <Link to={{ pathname: "/edit-listing", search: `?${params.toString()}` }}><LuPencil className="worksButton"/></Link>
                                <Link onClick={() => {setIdToDelete(listing); setConfirmDelete(true);}}><FaRegTrashAlt className="worksButton"/></Link>
                            </div>
                        </div>
                    ))
                    :
                    <p>Loading...</p>
                }
            </div>
            {confirmDelete ?
            <div className="confirmDelete">
                <div>
                    <div style={{textAlign:"left"}}>
                        <h3>Delete this listing?</h3>
                        <p>This action cannot be undone. The artwork will be permanently removed.</p>
                    </div>
                    <div style={{float:"right"}}>
                        <button onClick={() => {setIdToDelete(-1); setConfirmDelete(false);}}>Cancel</button>
                        <button className="deleteButton" onClick={() => {deleteListing(idToDelete); setIdToDelete(-1); setConfirmDelete(false);}}>Delete</button>
                    </div>
                </div>
            </div>
            :
            null
            }
        </div>
    );
}