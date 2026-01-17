/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { IoMdClose } from "react-icons/io";

export default function ImageUploader({ session, listing }) {
  //const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(listing.img_url);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    //setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const uploadFile = async (e) => {
    console.log("uploading file...");
    const selected = e.target.files[0];
    if (!selected) return;
    const file = selected;// setFile(selected);
    setPreview(URL.createObjectURL(selected));

    console.log("set file.", file, selected);
    if (!file) return;
    if (!session?.user) {
      alert("You must be logged in to upload.");
      return;
    }

    console.log("starting save...");
    setUploading(true);

    // Generate a unique path for the file
    const path =`${session.user.id}-${file.name}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("gallery") // replace with your bucket
      .upload(path, file, {
        upsert: true,
        onProgress: (p) => setProgress(p),
      });

    if (uploadError) {
      console.error("Upload failed:", uploadError.message);
      setUploading(false);
      return;
    } else{
        console.log("Uploaded");
    }

    // Get public URL
    // const { publicUrl, error: urlError } = supabase.storage
    //   .from("gallery")
    //   .getPublicUrl(path);
    const publicUrl = `https://xctxbgstkwukxdjpnedd.supabase.co/storage/v1/object/public/gallery/${path}`;

    // if (urlError) {
    //   console.error("Failed to get public URL:", urlError.message);
    //   setUploading(false);
    //   return;
    // } else{
    //     console.log("Got URL:", publicUrl);
    // }

    // Save URL in gallery row (RLS-safe)
    const { data: updatedRow, error: dbError } = await supabase
      .from("gallery")
      .update({ img_url: publicUrl })
      .eq("id", listing.id)
      .select()
      .single(); // important to get the updated row

    if (dbError) {
      console.error("Failed to save image URL:", dbError.message);
    } else {
      console.log("Image uploaded and saved:", publicUrl);
    }

    setUploading(false);
  };

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
          .update({img_url: ""})
          .eq("id", listing.id);

      if (error) {
          console.error("Delete failed:", error.message);
      } else {
          console.log("Listing deleted");
          setPreview("");
      }
  };

  useEffect(() => {
    setPreview(listing.img_url);
  }, [listing]);

  return (
    <div>
      <div 
          className="listingImage"
          style={{marginRight:"1rem", display:"flex"}}
      >
          <img src={preview}/>
          <div style={{
            position:"absolute",
            marginLeft:"25vw",
            marginBottom:"65vh"
          }}>
            {preview != "" && <p className="removeImage" onClick={() => deleteListing(listing)}><IoMdClose className="removeImageIcon"/></p>}
          </div>
          {preview == "" && 
              <div style={{
                position:"absolute",
              }}>
                <h3>Upload Image</h3>
                <p>Choose an image to display your work.</p>
                <input type="file" accept="image/*" onChange={uploadFile} />
              </div>
          }
      </div>
    </div>
  );
}
