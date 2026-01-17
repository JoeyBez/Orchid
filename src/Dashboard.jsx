import { useEffect, useState } from "react";
import { supabase } from "./supabase"; // your initialized Supabase client
import Gallery from "./Gallery";
import { Link } from "react-router-dom";

export default function Dashboard({ session }) {
  const user = session.user;
  const [profile, setProfile] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Fetch or create profile row
  useEffect(() => {
    async function fetchProfile() {
      // Try to get the profile row
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle(); // prevents 406 if row doesn't exist

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (!data) {
        // Row doesn't exist → create it
        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert({ id: user.id, first_name: "", last_name: "" })
          .select()
          .single();

        if (insertError) {
          console.error("Error creating profile row:", insertError);
          return;
        }

        setProfile(newProfile);
        setFirstName("");
        setLastName("");
        setBio("Empty bio.");
      } else {
        setProfile(data);
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setBio(data.bio || "Empty bio.");
      }
    }

    fetchProfile();
  }, [user.id]);

  // Update first/last name
  const updateName = async () => {
    setLoading(true);
    const { error, data: updatedProfile } = await supabase
      .from("profiles")
      .update({ first_name: firstName, last_name: lastName, bio: bio })
      .eq("id", user.id)
      .select()
      .single();

    if (error) alert("Error updating name: " + error.message);
    else {
      setProfile(updatedProfile);
      setSaved(true);
    //   alert("Name updated!");
    }

    setLoading(false);
  };


  if (!profile) return <div><p>Loading profile...</p></div>;

  return (
    <div>
    <div>
      <h2>Account Settings</h2>
        <div>
            <p>First Name</p>
            <input style={{ marginRight: 5 }}
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            />
        </div>
        <div>
            <p>Last Name</p>
            <input
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            />
        </div>
        <div>
            <p>Bio</p>
            <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            />
        </div>
    </div>
    <br/>
    <div>
        <Link onClick={() => {setSaved(false); updateName();}} to={`/artist/${profile.id}`} disabled={loading}>
            <button>Save</button>
        </Link>
        {saved ?
        <p>All changes saved.</p>
        :
        null
        }
    </div>
    </div>
  );
}
