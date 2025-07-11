import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import Layout from "./components/Layout";
import NewTab from "./pages/NewTab/NewTab";
import Settings from "./pages/Settings/Settings";
import GitDash from "./pages/GitDash/GitDash";
import { BlocksProvider } from "@/blocks-context";

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Toaster />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={
                        <BlocksProvider>
                            <Layout />
                        </BlocksProvider>
                    }>
                        <Route index element={<NewTab />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/gitdash" element={<GitDash />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
