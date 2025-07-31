// client/src/pages/customer/CustomerProfilePage.js
import React, { useState, useEffect } from 'react';
import CustomerNav from '../../components/customer/CustomerNav';
import { useAuth } from '../../context/AuthContext';

// --- Simple UI Color Palette ---
const colors = {
    background: '#F8F8F8',        // Very light grey page background
    cardBackground: '#FFFFFF',     // White for main content and cards
    primaryText: '#333333',        // Dark grey for main text
    secondaryText: '#666666',      // Medium grey for secondary text
    border: '#EEEEEE',             // Light grey for borders and separators
    accentBlue: '#007BFF',         // Standard blue for links and actions
    successGreen: '#28A745',       // Green for success messages/buttons
    errorRed: '#DC3545',           // Red for error messages/buttons
};

// --- Inline Styles for Simple UI ---
// Moved these declarations to the top so they are defined before use.
const pageContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: colors.background,
    fontFamily: 'Inter, sans-serif',
    color: colors.primaryText,
};

const contentAreaStyle = {
    flex: 1,
    padding: '20px',
    backgroundColor: colors.cardBackground,
    borderRadius: '5px',
    margin: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
};

const pageTitleStyle = {
    color: colors.primaryText,
    fontSize: '2em',
    marginBottom: '10px',
    fontWeight: 'bold',
    textAlign: 'center',
};

const pageDescriptionStyle = {
    fontSize: '1em',
    color: colors.secondaryText,
    marginBottom: '20px',
    textAlign: 'center',
};

const errorMessageStyle = {
    color: colors.errorRed,
    backgroundColor: `${colors.errorRed}1A`,
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px',
    fontSize: '0.9em',
    textAlign: 'center',
    border: `1px solid ${colors.errorRed}`,
    width: '100%',
    maxWidth: '600px',
};

const successMessageStyle = {
    color: colors.successGreen,
    backgroundColor: `${colors.successGreen}1A`,
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px',
    fontSize: '0.9em',
    textAlign: 'center',
    border: `1px solid ${colors.successGreen}`,
    width: '100%',
    maxWidth: '600px',
};

const loadingContainerStyle = {
    textAlign: 'center',
    padding: '50px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
};

const spinnerStyle = {
    border: `6px solid ${colors.border}`,
    borderTop: `6px solid ${colors.accentBlue}`,
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto',
};

const profileCardStyle = {
    backgroundColor: colors.cardBackground,
    padding: '25px',
    borderRadius: '8px',
    border: `1px solid ${colors.border}`,
    width: '100%',
    maxWidth: '700px',
    marginBottom: '20px',
};

const cardHeaderContentStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: `1px solid ${colors.border}`,
    paddingBottom: '10px',
};

const cardHeaderStyle = {
    color: colors.primaryText,
    fontSize: '1.5em',
    fontWeight: 'bold',
    margin: 0,
};

const customerProfileImageStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: `2px solid ${colors.accentBlue}`,
};

const infoGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr', // Single column for simplicity
    gap: '10px',
    marginBottom: '20px',
};

const infoItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '15px',
    borderRadius: '5px',
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.background,
};

const infoLabelStyle = {
    fontWeight: 'bold',
    color: colors.secondaryText,
    fontSize: '0.9em',
    marginBottom: '5px',
    textTransform: 'uppercase',
};

const infoValueStyle = {
    fontSize: '1em',
    color: colors.primaryText,
    wordBreak: 'break-word',
    fontWeight: 'normal',
};

const editProfileButtonStyle = {
    padding: '10px 20px',
    backgroundColor: colors.accentBlue,
    color: colors.white,
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9em',
    fontWeight: 'bold',
    // Basic hover effect
    ':hover': {
        backgroundColor: colors.accentBlue,
    },
};

const changePasswordButtonStyle = {
    padding: '10px 20px',
    backgroundColor: colors.secondaryText,
    color: colors.white,
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9em',
    fontWeight: 'bold',
    // Basic hover effect
    ':hover': {
        backgroundColor: colors.secondaryText,
    },
};

const formStyle = {
    marginTop: '15px',
    width: '100%',
};

const formGroupStyle = {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
};

const labelStyle = {
    marginBottom: '5px',
    fontWeight: 'bold',
    color: colors.primaryText,
    fontSize: '0.9em',
};

const inputStyle = {
    padding: '10px',
    border: `1px solid ${colors.border}`,
    borderRadius: '4px',
    fontSize: '0.9em',
    boxSizing: 'border-box',
    backgroundColor: colors.white,
    color: colors.primaryText,
};

const fileInputStyle = {
    padding: '10px',
    border: `1px solid ${colors.border}`,
    borderRadius: '4px',
    fontSize: '0.9em',
    boxSizing: 'border-box',
    backgroundColor: colors.white,
    cursor: 'pointer',
};

const imagePreviewStyle = {
    marginTop: '10px',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: `2px solid ${colors.accentBlue}`,
};

const formActionsStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
};

const cancelButtonStyle = {
    padding: '8px 15px',
    backgroundColor: colors.errorRed,
    color: colors.white,
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8em',
    fontWeight: 'bold',
    // Basic hover effect
    ':hover': {
        backgroundColor: colors.errorRed,
    },
};

const saveButtonStyle = {
    padding: '8px 15px',
    backgroundColor: colors.successGreen,
    color: colors.white,
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8em',
    fontWeight: 'bold',
    // Basic hover effect
    ':hover': {
        backgroundColor: colors.successGreen,
    },
    ':disabled': {
        backgroundColor: `${colors.successGreen}80`,
        cursor: 'not-allowed',
    },
};

const CustomerProfilePage = () => {
    const { user, authAxios, updateUser } = useAuth();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setEmail(user.email);
            setImagePreview(user.imageUrl || null);
            setLoading(false);
        } else {
            setLoading(false);
            setError('User data not available. Please log in.');
        }
    }, [user]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        } else {
            setSelectedFile(null);
            setImagePreview(user?.imageUrl || null);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('email', email);

        if (selectedFile) {
            formData.append('profileImage', selectedFile);
        }

        try {
            const res = await authAxios.put(`/users/${user._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setSuccessMessage('Profile updated successfully!');
            setIsEditing(false);
            setSelectedFile(null);
            if (updateUser) {
                updateUser(res.data);
            }
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Profile update failed:', err.response?.data?.message || err.message);
            setError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        if (newPassword !== confirmNewPassword) {
            setError('New passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            await authAxios.put(`/users/${user._id}`, {
                currentPassword,
                newPassword
            });
            setSuccessMessage('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setIsPasswordChangeOpen(false);
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Password change failed:', err.response?.data?.message || err.message);
            setError(err.response?.data?.message || 'Failed to change password. Check current password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={pageContainerStyle}>
            <CustomerNav />
            <div style={contentAreaStyle}>
                <h2 style={pageTitleStyle}>My Profile</h2>
                <p style={pageDescriptionStyle}>Manage your account details and security settings.</p>

                {error && <p style={errorMessageStyle}>{error}</p>}
                {successMessage && <p style={successMessageStyle}>{successMessage}</p>}

                {loading ? (
                    <div style={loadingContainerStyle}>
                        <div style={spinnerStyle}></div>
                        <p style={{ color: colors.secondaryText, marginTop: '15px', fontSize: '1em' }}>Loading profile data...</p>
                    </div>
                ) : (
                    <>
                        <div style={profileCardStyle}>
                            <div style={cardHeaderContentStyle}>
                                <h3 style={cardHeaderStyle}>Personal Information</h3>
                                <img
                                    src={imagePreview || 'https://placehold.co/60x60/CCCCCC/333333?text=User'}
                                    alt="Customer Profile"
                                    style={customerProfileImageStyle}
                                />
                            </div>
                            {!isEditing ? (
                                <div style={infoGridStyle}>
                                    <div style={infoItemStyle}>
                                        <span style={infoLabelStyle}>First Name:</span>
                                        <span style={infoValueStyle}>{firstName}</span>
                                    </div>
                                    <div style={infoItemStyle}>
                                        <span style={infoLabelStyle}>Last Name:</span>
                                        <span style={infoValueStyle}>{lastName}</span>
                                    </div>
                                    <div style={infoItemStyle}>
                                        <span style={infoLabelStyle}>Email:</span>
                                        <span style={infoValueStyle}>{email}</span>
                                    </div>
                                    <div style={infoItemStyle}>
                                        <span style={infoLabelStyle}>Role:</span>
                                        <span style={infoValueStyle}>{user?.role}</span>
                                    </div>
                                    <button onClick={() => setIsEditing(true)} style={editProfileButtonStyle}>
                                        Edit Profile
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleProfileUpdate} style={formStyle}>
                                    <div style={formGroupStyle}>
                                        <label style={labelStyle}>First Name:</label>
                                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required style={inputStyle} />
                                    </div>
                                    <div style={formGroupStyle}>
                                        <label style={labelStyle}>Last Name:</label>
                                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required style={inputStyle} />
                                    </div>
                                    <div style={formGroupStyle}>
                                        <label style={labelStyle}>Email:</label>
                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
                                    </div>
                                    <div style={formGroupStyle}>
                                        <label style={labelStyle}>Profile Picture:</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            style={fileInputStyle}
                                        />
                                        {imagePreview && (
                                            <img src={imagePreview} alt="Profile Preview" style={imagePreviewStyle} />
                                        )}
                                    </div>
                                    <div style={formActionsStyle}>
                                        <button type="button" onClick={() => { setIsEditing(false); setSelectedFile(null); setImagePreview(user?.imageUrl || null); }} style={cancelButtonStyle}>Cancel</button>
                                        <button type="submit" disabled={loading} style={saveButtonStyle}>
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        <div style={profileCardStyle}>
                            <h3 style={cardHeaderStyle}>Password Settings</h3>
                            {!isPasswordChangeOpen ? (
                                <button onClick={() => setIsPasswordChangeOpen(true)} style={changePasswordButtonStyle}>
                                    Change Password
                                </button>
                            ) : (
                                <form onSubmit={handleChangePassword} style={formStyle}>
                                    <div style={formGroupStyle}>
                                        <label style={labelStyle}>Current Password:</label>
                                        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required style={inputStyle} />
                                    </div>
                                    <div style={formGroupStyle}>
                                        <label style={labelStyle}>New Password:</label>
                                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={inputStyle} />
                                    </div>
                                    <div style={formGroupStyle}>
                                        <label style={labelStyle}>Confirm New Password:</label>
                                        <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required style={inputStyle} />
                                    </div>
                                    <div style={formActionsStyle}>
                                        <button type="button" onClick={() => setIsPasswordChangeOpen(false)} style={cancelButtonStyle}>Cancel</button>
                                        <button type="submit" disabled={loading} style={saveButtonStyle}>
                                            {loading ? 'Changing...' : 'Change Password'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CustomerProfilePage;
