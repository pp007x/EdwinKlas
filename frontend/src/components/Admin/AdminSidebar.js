import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../images/HigtechLogo.jpeg';
import styles from '../../Css/AdminDashboardSidebar.module.css';
import jwtDecode from "jwt-decode";
import { useNavigate} from 'react-router-dom';

const AdminSidebar = () => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  let role = "";
  if (token) {
    const decoded = jwtDecode(token);
    role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "";
  }
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  }
  
  const linkStyles = (path) => `${styles["nav-button"]} ${location.pathname === path ? styles.active : ''}`;

  return (
    <div className={styles["sidebar-container"]}>
      <div className={styles.sidebar}>
        <div className={styles["logo-container"]}>
          <img src={logo} alt="Logo" className={styles.logo} />
        </div>
        <hr />
        <div className={styles.navigation}>
          {role === 'Admin' && (
            <>
              {/* Admin-specific Links */}
              <Link to="/admin" className={linkStyles('/admin')}>Dashboard</Link>
              <Link to="/admin/addcompany" className={linkStyles('/admin/addcompany')}>Voeg bedrijf toe</Link>
              <Link to="/admin/adduser" className={linkStyles('/admin/adduser')}>Voeg gebruiker toe</Link>
              <Link to="/admin/companies" className={linkStyles('/admin/companies')}>Info per bedrijf</Link>
              <Link to="/admin/users" className={linkStyles('/admin/users')}>Info per gebruiker</Link>
              <Link to="/admin/newquestion" className={linkStyles('/admin/newquestion')}>Upload vragen</Link>
              <Link to="/admin/newquestions" className={linkStyles('/admin/newquestions')}>Bewerk vragen</Link>
              <Link to="/admin/addquestions" className={linkStyles('/admin/addquestions')}>Voeg vragen toe</Link>
              <Link to="/admin/removeuser" className={linkStyles('/admin/removeuser')}>Verwijder gebruiker</Link>
              <Link to="/admin/removecompany" className={linkStyles('/admin/removecompany')}>Verwijder bedrijf</Link>
              <Link to="/admin/editonderwerp" className={linkStyles('/admin/editonderwerp')}>Edit profielen</Link>
              <Link to="/admin/resetpassword" className={linkStyles('/admin/resetpassword')}>Wachtwoord resetten</Link>
              <Link to="/admin/hulpvakjes" className={linkStyles('/admin/hulpvakjes')}>Bewerk help boxes</Link>
              <button onClick={logout} style={{background: "#077da1"}} className={styles["nav-button"]}>Logout</button> 
            </>
          )}
          {role === 'Mod' && (
            <>
              {/* Mod-specific Links */}
              <Link to="/admin" className={linkStyles('/admin')}>Dashboard</Link>
              <Link to="/admin/addcompany" className={linkStyles('/admin/addcompany')}>Voeg bedrijf toe</Link>
              <Link to="/admin/adduser" className={linkStyles('/admin/adduser')}>Voeg gebruiker toe</Link>
              <Link to="/admin/companies" className={linkStyles('/admin/companies')}>Info per bedrijf</Link>
              <Link to="/admin/users" className={linkStyles('/admin/users')}>Info per gebruiker</Link>
              <button style={{background: "#077da1"}} onClick={logout} className={styles["nav-button"]}>Log uit</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
