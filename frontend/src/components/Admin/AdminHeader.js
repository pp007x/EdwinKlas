import React from 'react';
import styles from '../../Css/DashboardHeader.module.css';

const AdminHeader = () => (
  <div className={styles.header}>
    <hr />
    <div className={styles["page-title"]}>Dashboard</div>
  </div>
);

export default AdminHeader;
