import { LogOut , Bot,UserCog } from "lucide-react";
import styles from './Navbar.module.css'; 
import { Link } from "react-router-dom";
import ProfileMenu from './ProfileMenu';
import PropTypes from 'prop-types';

const Navbar = ({ onLogout }) => {
  return (
    <nav className={styles["top-nav"]}>

      <div  className={styles["nav-left"]}>
        <div className={styles["logo-text"]}>
        <Bot size={28} color="#4f46e5" />
        <span > AI Resume</span>
      </div>

      <div>
        <Link to="/HILP" className={styles["hero-admin-btn"]}>
          <UserCog size={25} />
          Human-In-Loop
        </Link> 
      </div>
      </div>

      <div className={styles["nav-right"]}>

    
      <div className={styles["nav-right"]}>
        {/* Pass the logout function down to the menu */}
        <ProfileMenu onLogout={onLogout} />
      </div>

    
    <button className={styles["nav-logout-btn"]} onClick={onLogout}>
        <LogOut size={18} /> 
        <span>Logout</span>
    </button>
    </div>
    
    </nav>
  );
};

Navbar.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default Navbar;