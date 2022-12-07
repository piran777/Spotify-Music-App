import React, { useEffect, useState } from 'react'
import './Search.css';

export default function SearchTracks() {
    const [track, setTrack] = useState('');

    const handleChangeTrack = e => {
        setTrack(e.target.value);
    }

    useEffect(() => {
        
    })

    return (<>
        <span>
            <input type = "text" className = "searchName" placeholder = "Search for Track" onChange={handleChangeTrack} value = {patientName} />
            <button className = "button buttonName" onClick={handleSubmit}>Search</button>
        </span>

        
        <div className = "patient">
            <table id = "patientHeadings">
                <thead>
                    <tr id = "heading">
                        <th className = "heading_fName">First Name</th>
                        <th className = "heading_lName">Last Name</th>
                        <th className = "heading_dob">Date of Birth</th>
                        <th className = "heading_pNo">Phone Number</th>
                        <th className = "heading_email">Email</th>
                        <th className = "heading_address">Address</th>
                    </tr>
                </thead>
            </table>
            <table id = "patientDetails">
                <tbody>
                    <tr id = "data">
                    </tr>
                </tbody>
            </table>
        </div>
    </>)
}