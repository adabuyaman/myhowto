import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Content from '../../components/Content/Content';
import Navigator from '../../components/Navigator/Navigator';
import Header from '../../components/header/Header';
import { auth, db } from '../../firebase/firestore';
import { addDoc, collection } from "firebase/firestore";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  TextField
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { doc, getDoc } from "firebase/firestore";


import HomeIcon from '@mui/icons-material/Home';
import { Route, Routes } from 'react-router-dom';
import ListDetails from '../ListDetails/ListDetails';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
}

let theme = createTheme({
  palette: {
    primary: {
      light: '#63ccff',
      main: '#009be5',
      dark: '#006db3',
    },
  },

  components: {
    MuiTab: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
});

theme = {
  ...theme,
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#081627',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
        contained: {
          boxShadow: 'none',
          '&:active': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          marginLeft: theme.spacing(3),
        },
        indicator: {
          height: 3,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          backgroundColor: theme.palette.common.white,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          minWidth: 0,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1),
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 4,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgb(255,255,255,0.15)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#4fc3f7',
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: 14,
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: 'inherit',
          minWidth: 'auto',
          marginRight: theme.spacing(2),
          '& svg': {
            fontSize: 20,
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 32,
          height: 32,
        },
      },
    },
  },
};


const drawerWidth = 256;

export default function Home() {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isAddListLoading, setIsAddListLoading] = React.useState(false);

  const handleAddListSubmit = async (event) => {
    event.preventDefault();
    setIsAddListLoading(true);
    const data = new FormData(event.currentTarget);
    const title = data.get('list-title');
    const description = data.get('list-description');

    try {
      const newListRef = await addDoc(collection(db, "lists"), {
        title,
        description,
        author: auth.currentUser.uid
      });
      console.log(newListRef.title);
      event.target.reset();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setIsAddListLoading(false);
    setIsAddModalOpen(false);
  };

  const actions = [
    {
      name: 'New How-to',
      tooltipTitle: 'add new how-to',
      icon: <HomeIcon />,
      onClick: () => {
        setIsAddModalOpen(true);
      }
    },
    {
      name: 'New list',
      tooltipTitle: 'add new how-to',
      icon: <HomeIcon />,
      onClick: () => {
        setIsAddModalOpen(true);
      }
    }
  ]
  const handleCloseAddListDialog = () => {
    setIsAddModalOpen(false);
  }

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {isSmUp ? null : (
            <Navigator
              PaperProps={{ style: { width: drawerWidth } }}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
            />
          )}

          <Navigator
            PaperProps={{ style: { width: drawerWidth } }}
            sx={{ display: { sm: 'block', xs: 'none' } }}
          />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Header onDrawerToggle={handleDrawerToggle} />
          <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#eaeff1' }}>
            <Routes>
              <Route path="/" element={<Content />} />
              <Route path="/:listId" element={<ListDetails />} />
              <Route path="/:list_id/:howto_id" element={<h1>howto_id!</h1>} />
            </Routes>
          </Box>
          <Box component="footer" sx={{ p: 2, bgcolor: '#eaeff1' }}>
            <Copyright />
          </Box>
        </Box>
      </Box>

      <Dialog open={isAddModalOpen} onClose={handleCloseAddListDialog}>
        <DialogTitle>Create a new list</DialogTitle>
        <Box component="form" method="post" onSubmit={handleAddListSubmit}>
          <DialogContent>
            <DialogContentText>
              A list is a way to combine multiple how-tos with a related foucs together under the same list.
            </DialogContentText>

            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="list-title"
              label="Title"
              type="text"
              fullWidth
              required
              variant="standard"
            />
            <TextField
              autoFocus
              name="list-description"
              margin="dense"
              id="name"
              label="Description"
              type="text"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddListDialog}>Cancel</Button>
            <LoadingButton
              loading={isAddListLoading}
              variant="contained"
              type="submit"
            >
              Create List
            </LoadingButton>
          </DialogActions>
        </Box>

      </Dialog>

      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'fixed', bottom: 50, right: 50 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            onClick={action.onClick}
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>
    </ThemeProvider >
  );
}