import React from 'react';
import { useTheme } from '@mui/material/styles';
import { List, ListItem, ListItemButton, ListItemText, ListSubheader, Skeleton, Typography, } from '@mui/material';
import { Link } from 'react-router-dom';

export default function CollectionHowtosList({ howtos, isLoading, listID }) {
    const theme = useTheme();

    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}
            subheader={
                <ListSubheader component="div">
                    How-tos
                </ListSubheader>
            }
        >
            {
                isLoading ?
                    [1, 2, 3].map(item => <ListItem key={item} sx={{
                        px: theme.spacing(3),
                    }}>
                        <ListItemText primary={<Skeleton variant="text" width="50%" />} secondary={<Skeleton variant="text" />} />
                    </ListItem>)
                    :
                    howtos.map(({ id, title, created_at, votes }) =>
                        <Link to={`${id}`} style={{
                            color: 'inherit',
                            textDecoration: 'none'
                        }}>
                            <ListItemButton dataid={id} key={id} sx={{
                                px: theme.spacing(3),
                            }}
                            >
                                <ListItemText primary={title || <span style={{ color: 'rgba(0,0,0,0.4)' }}>No title</span>} secondary={`${created_at.toDate().getDate()}/${created_at.toDate().getMonth() + 1}/${created_at.toDate().getFullYear()} - ${created_at.toDate().toLocaleTimeString()}`} />
                            </ListItemButton>
                        </Link>
                    )
            }
        </List>
    );
}