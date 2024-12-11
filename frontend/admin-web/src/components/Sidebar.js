import Link from 'next/link';
import './Sidebar.css';


export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">Admin Menu</div>
            <nav className="sidebar-nav">
                <Link href="/dashboard" className="sidebar-link">Dashboard</Link>
                <Link href="/users" className="sidebar-link">Users</Link>
                <Link href="/bikes" className="sidebar-link">Bikes</Link>
            </nav>
        </aside>
    );
}
