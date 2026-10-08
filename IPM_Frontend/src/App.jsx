import { useState } from "react";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import ItemTypes from "./pages/ItemType";
import Items from "./pages/Items";
import Purchases from "./pages/Purchase";



function App() {

    const [page, setPage] = useState("dashboard");

    return (

        <div>

            <Navbar page={page} setPage={setPage} />

            <div className="container">

                {page === "dashboard" && (
                    <Dashboard />
                )}

                {page === "item-types" && (
                    <ItemTypes />
                )}

                {page === "items" && (
                    <Items />
                )}

                {page === "purchases" && (
                    <Purchases />
                )}

            </div>

        </div>
    );
}


export default App;