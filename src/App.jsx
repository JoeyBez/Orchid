import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from "./Auth";
import Dashboard from "./Dashboard";
import Header from "./Header";
import Gallery from "./Gallery";
import ViewListing from "./ViewListing";
import ViewProfile from "./ViewProfile";
import YourWorks from "./YourWorks";
import EditListing from "./EditListing";

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <div>
      {
        session ? 
          <div>
            <Router>
              <Header session={session}/>
              <Routes>
                <Route path="/profile" element={ <Dashboard session={session} /> } />
                <Route path="/" element={ <Gallery author="*"/> } />
                <Route path="/listing/:listingId" element={ <ViewListing session={session}/> } />
                <Route path="/artist/:userId" element={ <ViewProfile /> } />
                <Route path="/listings" element={ <YourWorks session={session} /> } />
                <Route path="/edit-listing" element={ <EditListing session={session} /> } />
              </Routes>
              <footer>
                  <p><small>&copy; 2026 Orchid. All Rights Reserved.</small></p>
              </footer>
            </Router>
          </div>
        : 
          <div>
            <Router>
              <Header session={session}/>
              <Routes>
                <Route path="/" element={ <Gallery author="*"/> } />
                <Route path="/listing/:listingId" element={ <ViewListing session={session}/> } />
                <Route path="/artist/:userId" element={ <ViewProfile /> } />
                <Route path="/login/:newUser" element={ <Auth /> } />
              </Routes>
              <footer>
                  <p><small>&copy; 2026 Orchid. All Rights Reserved.</small></p>
              </footer>
            </Router>
          </div>
      }
    </div>
    );
}
