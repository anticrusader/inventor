import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Pagination,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import AddIcon from '@mui/icons-material/Add';

// Sample data
const sampleGroups = [
  { id: 1, name: 'Natasha Saylor', members: 1677 },
  { id: 2, name: 'Eveline Loth, Jack Behringer, Sergio River', members: 9800 },
  { id: 3, name: 'Mona King, Ervin Stoneking, Kim Mirabal', members: 9065 },
  { id: 4, name: 'Geneva Duff, Alexandrea Early', members: 8811 },
  { id: 5, name: 'Reina Hepburn', members: 8825 },
  { id: 6, name: 'Zelma White, Modesto Clapton', members: 9359 },
  { id: 7, name: 'Tasha Kyle, Migda Romville', members: 5648 },
  { id: 8, name: 'Star Cowley, Brian Fredell, Shawna Sabia, Marceline Otero', members: 9028 },
  { id: 9, name: 'Marie Leroy, Charlie Rubida', members: 8013 },
];

const Groups = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const rowsPerPage = 10;

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(sampleGroups.map(group => group.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleManagePermission = (groupId) => {
    navigate('/groups-permissions');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ typography: 'h5', fontWeight: 'medium' }}>Groups</Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterAltOutlinedIcon />}
            sx={{ borderRadius: '8px' }}
          >
            Filter
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/add-group')}
            sx={{ borderRadius: '8px' }}
          >
            Add Groups
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < sampleGroups.length}
                  checked={selected.length === sampleGroups.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Group Name</TableCell>
              <TableCell>Group Member</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleGroups.map((group) => (
              <TableRow key={group.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.indexOf(group.id) !== -1}
                    onChange={(event) => handleSelectOne(event, group.id)}
                  />
                </TableCell>
                <TableCell>{group.name}</TableCell>
                <TableCell>{group.members}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Button
                      variant="text"
                      onClick={() => handleManagePermission(group.id)}
                      sx={{ color: theme => theme.palette.text.primary }}
                    >
                      Manage Permission
                    </Button>
                    <IconButton size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Pagination
          count={Math.ceil(sampleGroups.length / rowsPerPage)}
          page={page}
          onChange={(event, value) => setPage(value)}
          shape="rounded"
        />
      </Box>
    </Box>
  );
};

export default Groups;
