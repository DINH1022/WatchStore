import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Avatar,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { PhotoCamera, Person, Email, Lock } from "@mui/icons-material";
import Navigation from "../Auth/Navigation";
import usersApi from "../../service/api/usersApi";
import Loader from "../../components/Loader";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Profile = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    avatar: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tabValue, setTabValue] = useState(0);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const data = await usersApi.getProfile();
      setUserData((prevState) => ({
        ...prevState,
        username: data.username,
        email: data.email,
        avatar: data.avatar,
      }));
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch profile");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError("");
    setSuccess("");
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrl(previewUrl);
      setPreviewOpen(true);
    }
  };

  const handleAvatarUpload = async () => {
    if (selectedFile) {
      const data = new FormData();
      data.append("avatar", selectedFile);
      try {
        setUpdating(true);
        const response = await usersApi.uploadAvatar(data);

        const storage = localStorage.getItem("userData")
          ? localStorage
          : sessionStorage;
        const userData = JSON.parse(storage.getItem("userData"));
        const updatedUserData = { ...userData, avatar: response.avatar };
        storage.setItem("userData", JSON.stringify(updatedUserData));

        setUserData((prev) => ({
          ...prev,
          avatar: response.avatar,
        }));
        window.dispatchEvent(
          new CustomEvent("avatarChange", {
            detail: { avatar: response.avatar },
          })
        );
        setSuccess("Avatar updated successfully");
        handleClosePreview();
      } catch (error) {
        setError("Failed to update avatar");
      } finally {
        setUpdating(false);
      }
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
  };

  const validateForm = () => {
    if (
      userData.newPassword &&
      userData.newPassword !== userData.confirmPassword
    ) {
      setError("Passwords don't match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setUpdating(true);
    setError("");
    setSuccess("");

    try {
      const updateData = {
        username: userData.username,
        email: userData.email,
      };
      if (userData.newPassword) {
        if (userData.newPassword == userData.confirmPassword) {
          updateData.newPassword = userData.newPassword;
        }
      }

      await usersApi.updateProfile(updateData);
      setSuccess("Profile updated successfully");
      setUserData((prev) => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Navigation />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "#f4f4f4",
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="md">
          <Paper sx={{ mb: 4, p: 3 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                gap: 3,
              }}
            >
              <Avatar
                src={userData.avatar}
                alt={userData.username}
                sx={{ width: 120, height: 120 }}
              />
              <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
                <Typography variant="h4" gutterBottom>
                  {userData.username}
                </Typography>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Email fontSize="small" />
                  {userData.email}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ mb: 4 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              <Tab icon={<Person />} label="Thông tin chung" />
              <Tab icon={<PhotoCamera />} label="Ảnh đại diện" />
              <Tab icon={<Lock />} label="Mật khẩu" />
            </Tabs>

            {(error || success) && (
              <Box sx={{ p: 2 }}>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                  </Alert>
                )}
              </Box>
            )}

            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleChange}
                />
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSubmit}
                  disabled={updating}
                >
                  {updating ? <CircularProgress size={24} /> : "Lưu thay đổi"}
                </Button>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <Avatar
                  src={userData.avatar}
                  alt={userData.username}
                  sx={{ width: 180, height: 180 }}
                />
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="avatar-upload"
                  type="file"
                  onChange={handleFileSelect}
                />
                <label htmlFor="avatar-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<PhotoCamera />}
                  >
                    Chọn ảnh mới
                  </Button>
                </label>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <TextField
                  fullWidth
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={userData.newPassword}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={userData.confirmPassword}
                  onChange={handleChange}
                />
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSubmit}
                  disabled={updating}
                >
                  {updating ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Thay đổi mật khẩu"
                  )}
                </Button>
              </Box>
            </TabPanel>
          </Paper>
        </Container>
      </Box>

      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Xem trước ảnh đại diện</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              py: 2,
            }}
          >
            <Typography variant="body2" color="textSecondary">
              Ảnh đại diện mới của bạn
            </Typography>
            {previewUrl && (
              <Avatar
                src={previewUrl}
                alt="Preview"
                sx={{ width: 400, height: 400 }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview} color="inherit">
            Hủy
          </Button>
          <Button
            onClick={handleAvatarUpload}
            variant="contained"
            disabled={updating}
          >
            {updating ? <CircularProgress size={24} /> : "Xác nhận thay đổi"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
