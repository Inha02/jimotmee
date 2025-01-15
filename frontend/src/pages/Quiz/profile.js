import React, { useState } from 'react';
import styled from 'styled-components';

const ProfileSection = styled.section`
  text-align: center;
  img {
    width: 100%;
    max-width: 180px;
    object-fit: cover;
    border-radius: 50%;
    margin: 0 auto;
  }
  .profile-row {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    position: relative;
  }
  .my-name {
    font-size: 1.05rem;
    font-weight: bold;
    color: ${(props) => props.theme.mainColor.color};
  }
  .edit-buttons {
    display: flex;
    gap: 10px;
    margin-top: 10px;
    justify-content: center;
  }
  .button {
    position: absolute;
    right: 0;
    font-size: 0.75rem;
    color: #666;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 3px 6px;
    background: none;
    cursor: pointer;
    &:hover {
      background-color: ${(props) => props.theme.mainColor.color};
      color: white;
    }
  }
  .edit-button {
    margin-top: 10px;
    font-size: 0.75rem;
    color: #666;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 3px 20px;
    background: none;
    cursor: pointer;
    &:hover {
      background-color: ${(props) => props.theme.mainColor.color};
      color: white;
    }
  }
`;

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  const [name, setName] = useState(userInfo.name || '');
  const [profileImage, setProfileImage] = useState(userInfo.profileImage || '');

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);

  const handleLogout = () => {
    alert('로그아웃 되었습니다!');
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <ProfileSection>
      <img src={profileImage} alt="profile" />
      {isEditing ? (
        <>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <div className="edit-buttons">
            <button className="button" onClick={() => setIsEditing(false)}>
              확인
            </button>
            <button className="button" onClick={handleCancel}>
              취소
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="profile-row">
            <span className="my-name">{name}</span>
            <button className="button" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
          <button className="edit-button" onClick={handleEdit}>
            프로필 수정
          </button>
        </>
      )}
    </ProfileSection>
  );
};

export default Profile;
