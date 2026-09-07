import { useEffect, useState } from "react";
import "./Profile.css";

import API from "../../api/axios";
import { uploadResume } from "../../services/teamService";
import { resetPassword } from "../../services/authService";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeMessage, setResumeMessage] = useState("");
  const [resumeError, setResumeError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const loadProfile = async () => {
    try {
      setProfileLoading(true);
      setProfileError("");

      const response = await API.get("/auth/me");

      const profile =
        response.data?.user ||
        response.data;

      setUser(profile);
    } catch (error) {
      console.error("PROFILE ERROR:", error);

      setProfileError(
        error.response?.data?.message ||
          "Unable to load profile."
      );
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleFileChange = (event) => {
    setResumeMessage("");
    setResumeError("");

    const file = event.target.files?.[0];

    if (!file) {
      setResumeFile(null);
      return;
    }

    const extension =
      file.name.split(".").pop()?.toLowerCase();

    if (
      !["pdf", "docx", "txt"].includes(extension)
    ) {
      setResumeError(
        "Only PDF, DOCX and TXT resumes are allowed."
      );

      event.target.value = "";
      setResumeFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setResumeError(
        "Resume must be smaller than 5 MB."
      );

      event.target.value = "";
      setResumeFile(null);
      return;
    }

    setResumeFile(file);
  };

  const handleResumeUpload = async () => {
    setResumeMessage("");
    setResumeError("");

    if (!resumeFile) {
      setResumeError(
        "Please choose your resume first."
      );
      return;
    }

    const userId =
      user?.id ||
      user?._id;

    if (!userId) {
      setResumeError(
        "Unable to identify the logged-in user."
      );
      return;
    }

    try {
      setResumeLoading(true);

      const response = await uploadResume(
        userId,
        resumeFile
      );

      setResumeMessage(
        response.data?.message ||
          "Resume analyzed successfully."
      );

      setResumeFile(null);

      const input =
        document.getElementById(
          "resume-upload"
        );

      if (input) {
        input.value = "";
      }

      await loadProfile();
    } catch (error) {
      console.error(
        "RESUME UPLOAD ERROR:",
        error
      );

      setResumeError(
        error.response?.data?.message ||
          "Resume analysis failed."
      );
    } finally {
      setResumeLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setPasswordError(
        "Please fill all password fields."
      );
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        "New password must contain at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New password and confirm password do not match."
      );
      return;
    }

    try {
      setPasswordLoading(true);

      const response =
        await resetPassword({
          currentPassword,
          newPassword,
        });

      setPasswordSuccess(
        response.data?.message ||
          "Password updated successfully."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordError(
        error.response?.data?.message ||
          "Unable to update password."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const name =
    user?.full_name ||
    user?.name ||
    "User";

  const email =
    user?.email ||
    "No email";

  const role =
    user?.role ||
    "Member";

  const specialization =
    user?.specialization ||
    "Not detected yet";

  const experience =
    Number(user?.experience_years) || 0;

  const skills =
    Array.isArray(user?.skills)
      ? user.skills
      : [];

  if (profileLoading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">

      <div className="profile-header">
        <div>
          <span>ACCOUNT</span>

          <h1>My Profile</h1>

          <p>
            Manage your account, resume,
            skills and security.
          </p>
        </div>
      </div>

      {profileError && (
        <div className="profile-error-box">
          {profileError}
        </div>
      )}

      <div className="profile-layout">

        <div className="profile-main">

          <div className="profile-card profile-user-card">

            <div className="profile-user-header">

              <div className="profile-avatar">
                {name.charAt(0).toUpperCase()}
              </div>

              <div>
                <h2>{name}</h2>
                <p>{email}</p>

                <span className="role-badge">
                  {role}
                </span>
              </div>

            </div>

            <div className="profile-stats">

              <div>
                <span>Specialization</span>

                <strong>
                  {specialization}
                </strong>
              </div>

              <div>
                <span>Experience</span>

                <strong>
                  {experience} Years
                </strong>
              </div>

              <div>
                <span>Skills</span>

                <strong>
                  {skills.length}
                </strong>
              </div>

            </div>

          </div>

          <div className="profile-card">

            <div className="section-title">
              <span>RESUME ANALYSIS</span>

              <h2>
                Upload Your Resume
              </h2>

              <p>
                Upload your resume and
                CollabFlow AI will detect
                your technical skills,
                specialization and experience.
              </p>
            </div>

            <div className="resume-upload-area">

              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
              />

              <label
                htmlFor="resume-upload"
                className="resume-file-label"
              >
                <div className="upload-icon">
                  ↑
                </div>

                <div>
                  <strong>
                    {resumeFile
                      ? resumeFile.name
                      : "Choose Resume"}
                  </strong>

                  <span>
                    PDF, DOCX or TXT • Max 5 MB
                  </span>
                </div>
              </label>

              <button
                className="analyze-btn"
                onClick={handleResumeUpload}
                disabled={
                  !resumeFile ||
                  resumeLoading
                }
              >
                {resumeLoading
                  ? "Analyzing Resume..."
                  : "Analyze Resume"}
              </button>

            </div>

            {resumeMessage && (
              <div className="resume-success">
                {resumeMessage}
              </div>
            )}

            {resumeError && (
              <div className="resume-error">
                {resumeError}
              </div>
            )}

            {user?.resume_file_name && (
              <div className="current-resume">
                <span>
                  Current Resume
                </span>

                <strong>
                  {user.resume_file_name}
                </strong>
              </div>
            )}

          </div>

          <div className="profile-card">

            <div className="section-title">
              <span>AI PROFILE</span>

              <h2>
                Extracted Skills
              </h2>

              <p>
                These details are automatically
                generated from your resume.
              </p>
            </div>

            {skills.length > 0 ? (
              <div className="skills-list">

                {skills.map((skill) => (
                  <span key={skill}>
                    {skill}
                  </span>
                ))}

              </div>
            ) : (
              <div className="empty-skills">
                No skills detected yet.
                Upload your resume above.
              </div>
            )}

          </div>

        </div>

        <div className="profile-side">

          <div className="profile-card">

            <div className="section-title">
              <span>SECURITY</span>

              <h2>
                Reset Password
              </h2>

              <p>
                Update your account password.
              </p>
            </div>

            <form
              className="password-form"
              onSubmit={
                handleResetPassword
              }
            >

              <label>
                Current Password
              </label>

              <input
                type="password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(
                    e.target.value
                  )
                }
                placeholder="Current password"
              />

              <label>
                New Password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                placeholder="New password"
              />

              <label>
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                placeholder="Confirm password"
              />

              {passwordError && (
                <div className="password-error">
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="password-success">
                  {passwordSuccess}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  passwordLoading
                }
              >
                {passwordLoading
                  ? "Updating..."
                  : "Reset Password"}
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;