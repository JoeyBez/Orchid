import "./Header.css";
import { Link, useNavigate } from 'react-router-dom';
import { BrowserRouter } from "react-router-dom";
import { IconContext } from "react-icons/lib";
import { VscAccount } from "react-icons/vsc";
import { supabase } from "./supabase";
import { useState } from "react";
//import { VscAccount } from "react-icons/vsc";

export default function Header({session}){
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);

    return (
        <header className="header">
            <Link to="/"><h2 style={{marginRight:"1rem", color:"var(--text-color)"}}>Orchid</h2></Link>
            <p style={{marginRight:"1.5rem"}}>|</p>
            <IconContext.Provider value={{ color: "white", size: "1.2rem", className: "global-class" }}>
                <nav>
                    <Link to="/">Gallery</Link>
                    <div className="menuContainer">
                        <a onClick={() => setExpanded(!expanded)}>{session ? <VscAccount className="profileIcon"/> : "Account"}</a>
                        {expanded ?
                            session ? 
                            <div className="profileMenu">
                                {/* <Link onClick={() => setExpanded(false)} to={`/artist/${session.user.id}`} className="menuOpt" >View Profile</Link> */}
                                <Link onClick={() => setExpanded(false)} to={`/listings`} className="menuOpt" >My Works</Link>
                                <Link onClick={() => setExpanded(false)} to={`/profile`} className="menuOpt" >Account Settings</Link>
                                <a 
                                className="menuOpt" 
                                onClick={() => {supabase.auth.signOut(); setExpanded(false); navigate("/login/returning");}}
                                style={{borderTop:"1px solid var(--button-hover-color)"}}
                                >
                                    Logout
                                </a>
                            </div>
                            :
                            <div className="profileMenu">
                                <Link onClick={() => setExpanded(false)} to={`/login/returning`} className="menuOpt" >Sign In</Link>
                                <Link onClick={() => setExpanded(false)} to={`/login/create-account`} className="menuOpt" >Create Account</Link>
                            </div>
                        :
                        null
                        }
                    </div>
                </nav>
            </IconContext.Provider>
        </header>
    );
}