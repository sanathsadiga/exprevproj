import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Sidebar = ({ role }) => {
  const location = useLocation();
  const { logout, user } = useAuthStore();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="sidebar">
      <h2>Dashboard</h2>
      <nav>
        <ul>
          {role === 'admin' ? (
            <>
              <li>
                <Link to="/admin-dashboard" className={isActive('/admin-dashboard')}>
                  Admin Dashboard
                </Link>
              </li>
              
            </>
          ) : (
            <>
              <li>
                <Link to="/user-dashboard" className={isActive('/user-dashboard')}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/data-entry" className={isActive('/data-entry')}>
                  Enter Data
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <div className="user-info" style={{ marginTop: '30px', paddingTop: '30px', borderTop: '1px solid #444' }}>
        <div>
          <div className="user-name">{user?.name}</div>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
