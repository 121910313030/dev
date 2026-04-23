import { useState, useRef, useEffect } from 'react';
import { 
  User, Settings, LogOut, KeyRound, ChevronLeft, ShieldAlert, ChevronRight,
  Mail, Building, Bell, Moon, Loader2
} from "lucide-react";
import styles from './ProfileMenu.module.css';
import PropTypes from 'prop-types';
import { getProfile, updateProfile, changePassword } from "../api/api";

const MenuHeader = ({ title, onBack }) => (
  <div className={styles["view-header"]}>
    <button className={styles["back-btn"]} onClick={onBack}>
      <ChevronLeft size={16} />
    </button>
    <span>{title}</span>
  </div>
);

MenuHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};

const ProfileMenu = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('menu'); 
  const [loading, setLoading] = useState(false);
  const menuRef = useRef(null);


  const [userData, setUserData] = useState({ user_name: '', email: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '' });


  useEffect(() => {
    if (isOpen) {
      const loadProfile = async () => {
        try {
          const data = await getProfile();
          console.log("Profile data loaded:", data);
          setUserData(data); 
        } catch {
          console.error("Failed to load profile data");
        }
      };
      loadProfile();
    } else {
      setView('menu'); // Reset view when closed
    }
  }, [isOpen]);

  const handleUpdateName = async () => {
    setLoading(true);
    try {
      await updateProfile({ user_name: userData.user_name });
      alert("Account Details Updated!");
      setView('menu');
    } catch {
      alert("Error updating account details");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      await changePassword({
        current_password: passwords.current,
        new_password: passwords.new
      });
      alert("Password Updated Successfully!");
      setPasswords({ current: '', new: '' }); // Clear inputs
      setView('menu');
    } catch (err) {
      alert(err.response?.data?.error || "Password update failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  return (
    <div className={styles["profile-container"]} ref={menuRef}>
      <button
        className={styles["nav-profile"]}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-label="Open profile menu"
      >
          <User size={30} color='black' />
      </button>

      {isOpen && (
        <div className={styles["profile-dropdown"]}>
          
          {/* MAIN MENU */}
          {view === 'menu' && (
            <div className={styles["menu-animate"]}>
              <div className={styles["user-summary"]}>
                <p className={styles["user-name"]}>{userData.user_name || " Profile"}</p>
                <p className={styles["user-email"]}>{userData.email || "surya@ai-resume.com"}</p>
              </div>
              
              <div className={styles["dropdown-header"]}>Management</div>
<button className={styles["dropdown-item"]} onClick={() => setView('details')} type="button">
                  <User size={16} /> <span>Account Details</span> <ChevronRight size={14} className={styles["ml-auto"]} />
                </button>
                <button className={styles["dropdown-item"]} onClick={() => setView('settings')} type="button">
                  <Settings size={16} /> <span>System Settings</span> <ChevronRight size={14} className={styles["ml-auto"]} />
                </button>
                
                <div className={styles["dropdown-header"]}>Security & Legal</div>
                <button className={styles["dropdown-item"]} onClick={() => setView('password')} type="button">
                  <KeyRound size={16} /> <span>Update Password</span>
                </button>
                <button className={styles["dropdown-item"]} onClick={() => setView('policies')} type="button">
                  <ShieldAlert size={16} /> <span>Privacy & Policies</span>
                </button>

                <hr className={styles["divider"]} />
                <button className={`${styles["dropdown-item"]} ${styles["logout-item"]}`} onClick={onLogout} type="button">
                  <LogOut size={16} /> <span>Logout</span>
                </button>
            </div>
          )}

          {/* ACCOUNT DETAILS VIEW */}
          {view === 'details' && (
            <div className={styles["menu-animate"]}>
              <MenuHeader title="Account Details" onBack={() => setView('menu')} />
              <div className={styles["inner-content"]}>
                {/* Name Input Handler */}
                <div className={styles["input-group"]}>
                   <label htmlFor="fullName" style={{fontSize: '11px', color: '#191b1e'}}>Full Name</label>
                   <input 
                      id="fullName"
                      className={styles["p-input"]} 
                      value={userData.user_name}
                      onChange={(e) => setUserData({...userData, user_name: e.target.value})}
                   />
                </div>
                <div className={styles["detail-row"]}><Mail size={14}/> <span>{userData.email}</span></div>
                <div className={styles["detail-row"]}><Building size={14}/> <span>Recruitment Team A</span></div>
                <button 
                  className={styles["primary-btn"]} 
                  onClick={handleUpdateName}
                  disabled={loading}
                >
                  {loading ? <Loader2 className={styles.spinner} size={16} /> : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {/* SYSTEM SETTINGS VIEW */}
          {view === 'settings' && (
            <div className={styles["menu-animate"]}>
              <MenuHeader title="Settings" onBack={() => setView('menu')} />
              <div className={styles["inner-content"]}>
                <div className={styles["toggle-group"]}>
                  <div className={styles["toggle-item"]}>
                    <span><Bell size={14}/> Email Notifications</span>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className={styles["toggle-item"]}>
                    <span><Moon size={14}/> Dark Mode</span>
                    <input type="checkbox" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PASSWORD VIEW */}
          {view === 'password' && (
            <div className={styles["menu-animate"]}>
              <MenuHeader title="Update Password" onBack={() => setView('menu')} />
              <form className={styles["inner-content"]} onSubmit={handlePasswordSubmit}>
                <label htmlFor="currentPassword" style={{fontSize: '11px', color: '#191b1e'}}>Current Password</label>
                <input 
                  id="currentPassword"
                  type="password" 
                  placeholder="Current Password" 
                  className={styles["p-input"]} 
                  required
                  value={passwords.current}
                  onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                />
                <label htmlFor="newPassword" style={{fontSize: '11px', color: '#191b1e'}}>New Password</label>
                <input 
                  id="newPassword"
                  type="password" 
                  placeholder="New Password" 
                  className={styles["p-input"]} 
                  required
                  value={passwords.new}
                  onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                />
                <button type="submit" className={styles["primary-btn"]} disabled={loading}>
                   {loading ? <Loader2 className={styles.spinner} size={16} /> : "Save Changes"}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

ProfileMenu.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default ProfileMenu;