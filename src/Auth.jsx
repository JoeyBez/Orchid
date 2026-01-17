import { useState } from "react";
import { supabase } from "./supabase";
import { useNavigate, useParams, Link } from "react-router-dom";

export default function Auth() {
    const navigate = useNavigate()
    const {newUser} = useParams();
    const [email, setEmail] = useState("");
    // const [firstName, setFirstName] = useState("");
    // const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function signIn() {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
      });
      if (error) {alert(error.message);} else {navigate("/");}
      setLoading(false);
    }

    async function signUp() {
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            alert(error.message);
            setLoading(false);
            return;
        }

        const user = data.user;

        await supabase.from("profiles").insert({
            id: user.id,
            first_name: email,
            last_name: "",
            avatar_url: null,
        });

        alert("Account created!");
        setLoading(false);
        navigate("/login/returning");
    }


  return (
    <div style={{ position:"fixed", bottom:"0", top:"0", left:"0", right:"0", alignContent:"center", textAlign:"center" }}>
      {newUser == "create-account" ? <h1>Sign Up</h1> : <h1>Login</h1>}
      <br />
      <input
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />
      <br />
      <br />
      {newUser == "returning" && 
        <div>
        <button style={{marginBottom:"3rem"}} onClick={signIn} disabled={loading}>Login</button>
        <br />
        <Link to={"/login/create-account"}>Don't have an account? Sign Up</Link>
        </div>
      }
      {newUser == "create-account" && 
        <div>
        <button style={{marginBottom:"3rem"}} onClick={signUp} disabled={loading}>Create Account</button>
        <br />
        <Link to={"/login/returning"}>Already a user? Login</Link>
        </div>
      }
    </div>
  );
}
