import { useState, useRef, useEffect } from "react";
import {user} from "lucide-react";
import styles from "./ProfileMenu.module.css";


const ProfileMenu = () => {
    const[open, setOpen] = useState(false);
    const menuRef = useRef();

    const toggleMenu = () => setOpen(!open);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)){
                setOpen(false)
            }
        };

        document.addEventListener("mousedown",handleClickOutside);
        return() => document.removeEventListener("mousedown", handleClickOutside);
    },[]);

    return(
        <div className={styles["nav-profile"]} ref= {menuRef}>
            <div onClick={toggleMenu} className={styles["profile-trigger"]}>
                <user size = {18}/>
                <span>Profile</span>
            </div>
            {open && (
                <div className={styles["dropdown"]}>
                <p>My Profile</p>
                <p>Company Details</p>
                <p>Settings</p>
                <p>Recent Activity </p>
           </div>
            )}
        </div>
    )
}