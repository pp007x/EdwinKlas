import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../Css/CompanyDashboard.module.css'; 
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader'; // create and import a new CSS module for this component
import config from '../../config';

function EditOnderwerp() {
    const [onderwerpen, setOnderwerpen] = useState([]);
    const [selectedOnderwerp, setSelectedOnderwerp] = useState({ id: 0, name: "", description: "" });

    const fetchOnderwerpen = async () => {
        try {
            const response = await axios.get(`${config.API_BASE_URL}/api/Onderwerp`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setOnderwerpen(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchOnderwerpen();
    }, []);

    const handleOnderwerpChange = (e) => {
        const selectedOnderwerp = onderwerpen.find(o => o.id === parseInt(e.target.value));
        if (selectedOnderwerp && selectedOnderwerp.description) {
            selectedOnderwerp.description = selectedOnderwerp.description.replace(/<br>/g, '\n');
        }
        setSelectedOnderwerp(selectedOnderwerp);
    };
    
    const handleInputChange = (e) => {
        let value = e.target.value;
        if (e.target.name === 'description') {
            value = value.replace(/<br>/g, '\n');
        }
        setSelectedOnderwerp({
            ...selectedOnderwerp,
            [e.target.name]: value,
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Create a copy of the selectedOnderwerp
            const onderwerpToSave = {...selectedOnderwerp};
    
            // Replace newline characters with <br> tags in the description
            if (onderwerpToSave.description) {
                onderwerpToSave.description = onderwerpToSave.description.replace(/\n/g, '<br>');
            }
    
            await axios.put(`${config.API_BASE_URL}/api/Onderwerp/${onderwerpToSave.id}`, onderwerpToSave, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('Onderwerp updated successfully!');
            fetchOnderwerpen();  // fetch the list again to get the updated data
        } catch (error) {
            console.error(error);
        }
    };
    
    const Header = ({ title }) => (
        <div className={styles.header}>
          <hr />
          <div className={styles['page-title']}>{title}</div>
        </div>
      );
    return (
        <div className={styles.dashboard}>
        <AdminSidebar />
        <div className={styles.main}>
        {/* <Header title="Edit profiles" /> */}
        
            <div className={styles.content}>
            <div className={styles.cool}>
            <div className={styles.hmm}>
                    <h1>Edit profiles</h1>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Onderwerp:
                            <select className={styles.dropdownMenu} name="onderwerpId" value={selectedOnderwerp.id} onChange={handleOnderwerpChange} required>
                                <option value="">Select onderwerp</option>
                                {onderwerpen && onderwerpen.map((onderwerp) => (
                                    <option key={onderwerp.id} value={onderwerp.id}>
                                        {onderwerp.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Name:
                            <input type="text" className={styles.inputField} name="name" value={selectedOnderwerp.name} onChange={handleInputChange} required />
                        </label>
                        <label>
                            Description:
                            <textarea type="text" style={{
                    width: "600px",
                    height: "100px",
                    resize: "none",}}className={styles.inputField} name="description" value={selectedOnderwerp.description} onChange={handleInputChange} required />
                        </label>
                        <button type="submit">Update profiles</button>
                    </form>
                </div>
                </div>
                </div>
            </div>
        </div>
    );
}

export default EditOnderwerp;
