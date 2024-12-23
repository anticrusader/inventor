import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Box,
  Stack,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const socialPlatforms = [
  { name: 'Facebook', icon: '/facebook-icon.svg' },
  { name: 'Twitter', icon: '/twitter-icon.svg' },
  { name: 'LinkedIn', icon: '/linkedin-icon.svg' },
];

const Profile = () => {
  const [profileImage, setProfileImage] = useState('/default-avatar.jpg');

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>
        Profile
      </Typography>

      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={6}>
          {/* Personal Information */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Personal Information</Typography>
              <Box>
                <Button variant="outlined" sx={{ mr: 1 }}>Reset</Button>
                <Button variant="contained">Save</Button>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Box sx={{ position: 'relative', mr: 2 }}>
                <Avatar
                  src={profileImage}
                  sx={{ width: 100, height: 100 }}
                />
                <Typography
                  component="label"
                  sx={{
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    display: 'block',
                    mt: 1,
                    textAlign: 'center',
                  }}
                >
                  Change picture
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setProfileImage(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                  />
                </Typography>
              </Box>
              <Button
                startIcon={<DeleteIcon />}
                color="error"
                sx={{ alignSelf: 'flex-start' }}
              >
                Delete
              </Button>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  placeholder="Enter First Name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  placeholder="Enter Last Name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  placeholder="Enter Email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="User Name"
                  placeholder="Enter User Name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  placeholder="Enter Password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  placeholder="Bio"
                  multiline
                  rows={3}
                  helperText="Brief description for your profile URLs are hyperlinked"
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Social Links */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Social</Typography>
              <Button startIcon={<AddIcon />}>Add</Button>
            </Box>

            <Stack spacing={2}>
              {socialPlatforms.map((platform, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Avatar src={platform.icon} sx={{ width: 40, height: 40 }} />
                  <Typography>{platform.name}</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ ml: 'auto' }}
                    startIcon={<CloseIcon />}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          {/* Password Section */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Password</Typography>
              <Box>
                <Button variant="outlined" sx={{ mr: 1 }}>Reset</Button>
                <Button variant="contained">Save</Button>
              </Box>
            </Box>

            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Current password"
                type="password"
                placeholder="Enter Current password"
              />
              <TextField
                fullWidth
                label="New Password"
                type="password"
                placeholder="Enter New Password"
              />
              <TextField
                fullWidth
                label="Re-type New Password"
                type="password"
                placeholder="Enter Re-type New Password"
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ bgcolor: 'navy' }}
              >
                Forgot Password
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ bgcolor: 'navy' }}
              >
                Notification Management
              </Button>
            </Stack>
          </Paper>

          {/* Notification Management */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Notification Management</Typography>
              <Button startIcon={<FilterAltOutlinedIcon />}>Filter</Button>
            </Box>

            <Typography variant="subtitle2" sx={{ mb: 2 }}>Users Management</Typography>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox />}
                label="Users - Create and Manage Users (e.g., admin)"
              />
              <FormControlLabel
                control={<Checkbox />}
                label="Roles - Create and Manage Users (e.g., admin)"
              />
              <FormControlLabel
                control={<Checkbox />}
                label="Profiles - Create and Manage user profiles (e.g., GSA Store Manager, etc.)"
              />
              <FormControlLabel
                control={<Checkbox />}
                label="Groups - Create and Manage User groups"
              />
              <FormControlLabel
                control={<Checkbox />}
                label="Default Organization Sharing Access - Setting Default Sharing Access within the Organization"
              />
              <FormControlLabel
                control={<Checkbox />}
                label="Field Accessibility - Setting Field Accessibility for user profiles"
              />
            </FormGroup>

            <Typography variant="subtitle2" sx={{ mt: 3, mb: 2 }}>Manage stock</Typography>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox />}
                label="Enable stock management"
              />
            </FormGroup>

            <Typography variant="subtitle2" sx={{ mt: 3, mb: 2 }}>Hold stock (minutes)</Typography>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox />}
                label="60 - Reducing the reward orders by 1 minute. When this limit is reached, the pending order will be cancelled."
              />
            </FormGroup>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
