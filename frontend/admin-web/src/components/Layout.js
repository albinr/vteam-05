import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import './Layout.css';

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Header />
      <div className="layout-body">
        <Sidebar />
        <div className="layout-content">
          <main className="layout-main">{children}</main>
        </div>
      </div>
      <Footer />

    </div>
  );
}
