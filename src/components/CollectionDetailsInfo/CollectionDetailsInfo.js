import React from 'react';
import { alpha, Box, Button, Divider, IconButton, Menu, MenuItem, styled, TextField, Typography, useTheme } from '@mui/material';
import CollectionDetailsInfoSkeleton from './CollectionDetailsInfo.skeleton';
import { MoreHoriz, Edit, Delete, FileDownload } from '@mui/icons-material';


const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

export default function CollectionDetailsInfo({ isLoading, isEditing, setIsEditing, title, description, onTitleChange, onDescriptionChange }) {
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        console.log('set!');
    };
    const handleClose = () => {
        setAnchorEl(null);
        console.log('unset!');

    };

    const handleIsEditing = () => {
        setIsEditing(true);
        handleClose();
    }

    if (isLoading)
        return <CollectionDetailsInfoSkeleton />;

    return (
        <Box sx={{
            display: 'grid',
            gap: theme.spacing(1)
        }}>
            {
                isEditing ?
                    <>
                        <TextField
                            defaultValue={title}
                            onChange={(e) => onTitleChange(e.currentTarget.value)}
                            sx={{
                                margin: 0,
                                mb: '5px',
                                '& .MuiInputBase-root': {
                                    marginRight: theme.spacing(-1),
                                    marginLeft: theme.spacing(-1),
                                    marginTop: '-3px',
                                    padding: `0 ${theme.spacing(1)}`
                                },
                                '& input': {
                                    fontSize: theme.typography.h5.fontSize,
                                    padding: 0,
                                }
                            }}
                            variant='filled'
                        />

                        <TextField
                            multiline
                            onChange={(e) => onDescriptionChange(e.currentTarget.value)}
                            defaultValue={description}
                            sx={{
                                margin: 0,
                                padding: 0,
                                '& .MuiInputBase-root': {
                                    padding: `0 ${theme.spacing(1)}`,
                                    marginRight: theme.spacing(-1),
                                    marginLeft: theme.spacing(-1),
                                },
                                '& textarea': {
                                    fontSize: theme.typography.body1.fontSize,
                                    padding: 0,
                                }
                            }}
                            variant='filled'
                        />
                    </>
                    :
                    <>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            gap: theme.spacing(0.5)
                        }}>
                            <Typography variant="h5" component="h1" sx={{ mb: '5px', flex: 1 }}>{title}</Typography>

                            <IconButton
                                id="demo-customized-button"
                                aria-controls={open ? 'demo-customized-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                variant="contained"
                                disableElevation
                                onClick={handleClick}
                            >
                                <MoreHoriz />
                            </IconButton>
                        </Box>
                        <StyledMenu
                            id="demo-customized-menu"
                            MenuListProps={{
                                'aria-labelledby': 'demo-customized-button',
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleIsEditing} disableRipple>
                                <Edit />
                                Edit
                            </MenuItem>
                            <MenuItem onClick={handleClose} disableRipple>
                                <Delete />
                                Delete
                            </MenuItem>
                            <Divider sx={{ my: 0.5 }} />
                            <MenuItem onClick={handleClose} disableRipple>
                                <FileDownload />
                                Download
                            </MenuItem>
                        </StyledMenu>
                        <Typography variant="body1">{description}</Typography>
                    </>
            }
        </Box>
    );
};