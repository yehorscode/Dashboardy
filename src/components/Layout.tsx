import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="">
            <div className="pl-1 pr bg-transparent flex gap-3 opacity-60 hover:opacity-100 transition-all hover:transform-3d hover:translate-z-1 hover:shadow-lg hover:bg-green-700">
                <h1 className="font-mono mr-1">Dashboardy</h1>
                <a href="/" className="hover:underline">
                    New Tab
                </a>
                <a href="/gitdash" className="hover:underline">
                    GitDash
                </a>
                <a href="/settings" className="hover:underline">
                    Settings
                </a>
            </div>
            <Outlet />
        </div>
    );
}

