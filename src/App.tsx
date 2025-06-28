import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import NewTab from "./pages/NewTab/NewTab";
import Settings from "./pages/Settings/Settings";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<NewTab />} />
                        <Route path="/settings" element={<Settings />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
