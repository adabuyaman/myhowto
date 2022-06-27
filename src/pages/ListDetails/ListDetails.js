import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import { Badge, Box, Button, CircularProgress, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, ListSubheader, Paper, Skeleton, styled, TextField, Tooltip, Typography } from '@mui/material';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from '../../firebase/firestore';
import { useParams } from 'react-router-dom';
import { isEmpty } from '../../utils/objects';
import parse from 'html-react-parser';
import { Delete as DeleteIcon, Share as ShareIcon, Favorite as FavoriteIcon, Edit as EditIcon, Close, Check as CheckIcon, ThumbUpAlt, ThumbDownAlt, ThumbDownOffAlt, ThumbUpOffAlt } from '@mui/icons-material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getAuth } from 'firebase/auth';
import { async } from '@firebase/util';

const CKEditorStyled = styled(CKEditor)(({ theme }) => ({
    '.ck-editor__main': {
        padding: theme.spacing(3)
    }
}));


export default function ListDetails() {
    const theme = useTheme();
    const auth = getAuth();
    const { listId } = useParams();

    const [isHowtoLoading, setIsHowtoLoading] = useState(true);

    const [isListDetailsLoading, setIsListDetailsLoading] = useState(true);
    const [isListHowtosLoading, setIsListHowtosLoading] = useState(true);

    const [listData, setListData] = useState({});
    const [listHowtos, setListHowtos] = useState([]);

    const [selectedHowto, setSelectedHowto] = useState({});
    const [selectedHowtoBody, setSelectedHowtoBody] = useState("");

    const [isEditMode, setIsEditMode] = useState(true);
    const [listEditedTitle, setListEditedTitle] = useState("");
    const [listEditedDescription, setListEditedDescription] = useState("");
    const [vote, setVote] = useState(undefined);

    const handleVoting = async (vote) => {
        console.log('hiiiii', vote, selectedHowto.id);
        const howtoRef = doc(db, "lists", listId);
        console.log(howtoRef);
        await updateDoc(howtoRef, {
            votes: {
                [auth.currentUser.uid]: vote
            }
        });
        setVote(vote);
    }


    useEffect(() => {
        loadListDetails();
    }, []);

    const loadListDetails = async () => {
        try {
            setIsListDetailsLoading(true);
            const listRef = doc(db, "lists", listId);
            const listSnap = await getDoc(listRef);
            if (listSnap.exists()) {
                const data = listSnap.data();
                setListData(data);
                loadListHowtos();
                setVote(data?.votes[auth.currentUser.uid]);
                setListEditedTitle(data.title);
                setListEditedDescription(data.description);
            }
        }
        catch (error) {

        }
        setIsListDetailsLoading(false);
    }

    const loadListHowtos = async () => {
        try {
            setIsListHowtosLoading(true);
            const querySnapshot = await getDocs(collection(db, `lists/${listId}/howtos`));
            const howtos = [];
            querySnapshot.forEach((doc) => howtos.push({
                ...doc.data(),
                id: doc.id
            }));
            setListHowtos(howtos);
        }
        catch (error) {
            console.log(error);
        }
        setIsListHowtosLoading(false);
    }

    const handleHowtoSelect = async (e) => {
        setIsHowtoLoading(true);
        const howtoRef = doc(db, `lists/${listId}/howtos/${e.currentTarget.getAttribute('dataid')}`);
        const docSnap = await getDoc(howtoRef);
        try {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setSelectedHowto({ ...data, id: docSnap.id });
                setSelectedHowtoBody(data.body);
            }
        }
        catch (error) {
            console.log(error);
        }
        setIsHowtoLoading(false);
    }

    const saveHowto = async () => {
        console.log('Saving...');
        let contentNode = new DOMParser().parseFromString(selectedHowto.body, 'text/html');
        const title = contentNode.querySelector('h1,h2,h3,h4,h5,h6');
        await setDoc(doc(db, "lists", listId, "howtos", selectedHowto.id), { ...selectedHowto, title: title.textContent.trim() ?? selectedHowto.title });
    }

    const handleListEdit = async (flag) => {
        if (flag) {
            const listRef = doc(db, "lists", listId);
            await updateDoc(listRef, {
                title: listEditedTitle,
                description: listEditedDescription
            });
            setListData({ ...listData, title: listEditedTitle, description: listEditedDescription });
        } else {
            setListEditedTitle(listData.title);
            setListEditedDescription(listData.description);
        }
        setIsEditMode(false);
    }

    return (
        <Box sx={{ maxWidth: 1000, margin: 'auto', overflow: 'hidden' }}>
            <Grid container spacing={2} sx={{
                padding: theme.spacing(1)
            }}>
                <Grid item md={4}>
                    <Paper sx={{
                        overflow: 'hidden'
                    }}>
                        <Box sx={{
                            p: theme.spacing(3),
                            display: 'grid',
                        }}>
                            {
                                !isListDetailsLoading ?
                                    (
                                        <>
                                            {
                                                isEditMode ?
                                                    <>
                                                        <TextField
                                                            defaultValue={listData.title}
                                                            onChange={(e) => setListEditedTitle(e.currentTarget.value)}
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
                                                                    fontSize: theme.typography.h4.fontSize,
                                                                    padding: 0,
                                                                }
                                                            }}
                                                            variant='filled'
                                                        />
                                                        <TextField
                                                            multiline
                                                            onChange={(e) => setListEditedDescription(e.currentTarget.value)}
                                                            defaultValue={listData.description}
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
                                                        <Typography variant="h4" sx={{ mb: '5px' }}>{listData.title}</Typography>
                                                        <Typography variant="body1">{listData.description}</Typography>
                                                    </>
                                            }
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'flex-start',
                                                gap: '10px',
                                                mt: '10px'
                                            }}>
                                                <IconButton aria-label="delete">
                                                    <Tooltip title="Share">
                                                        <ShareIcon />
                                                    </Tooltip>
                                                </IconButton>

                                                <Badge badgeContent={412} color={vote ? "success" : "info"}>
                                                    <IconButton aria-label="vote-up" color={vote ? "success" : "default"} onClick={() => handleVoting(vote === true ? null : true)}>
                                                        <Tooltip title="Vote up!">
                                                            {
                                                                vote ? <ThumbUpAlt /> : <ThumbUpOffAlt />
                                                            }
                                                        </Tooltip>
                                                    </IconButton>
                                                </Badge>
                                                <IconButton aria-label="vote-down" color={vote === false ? "error" : "default"} onClick={() => handleVoting(vote === false ? null : false)}>
                                                    <Tooltip title="Vote down!">
                                                        {
                                                            vote === false ? <ThumbDownAlt /> : <ThumbDownOffAlt />
                                                        }
                                                    </Tooltip>
                                                </IconButton>

                                                {
                                                    isEditMode &&
                                                    <>
                                                        <IconButton sx={{ ml: 'auto' }} aria-label="edit" onClick={() => handleListEdit(true)}>
                                                            <Tooltip title="Save updates" color='success'>
                                                                <CheckIcon color='success' />
                                                            </Tooltip>
                                                        </IconButton>
                                                        <IconButton aria-label="edit" onClick={() => handleListEdit(false)}>
                                                            <Tooltip title="Discard changes">
                                                                <Close />
                                                            </Tooltip>
                                                        </IconButton>
                                                    </>
                                                }
                                            </Box>
                                        </>
                                    )
                                    :
                                    <>
                                        <Skeleton variant="text" width={210} height={55} />
                                        <Skeleton variant="text" />
                                        <Skeleton width="60%" />

                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start',
                                            gap: '10px',
                                            mt: '10px'
                                        }}>
                                            <Skeleton variant="circular" width={40} height={40} />
                                            <Skeleton variant="circular" width={40} height={40} />
                                            <Skeleton variant="circular" width={40} height={40} />
                                        </Box>
                                    </>
                            }
                            <Button disabled={isListDetailsLoading} sx={{
                                mt: theme.spacing(2)
                            }} variant="contained" >Add How-to</Button>
                        </Box>
                        <Divider />
                        <List sx={{ width: '100%', bgcolor: 'background.paper' }}
                            subheader={
                                <ListSubheader component="div">
                                    How-tos
                                </ListSubheader>
                            }
                        >
                            {
                                isListHowtosLoading ?
                                    [1, 2, 3].map(item => <ListItem key={item} sx={{
                                        px: theme.spacing(3),
                                    }}>
                                        <ListItemText primary={<Skeleton variant="text" width="50%" />} secondary={<Skeleton variant="text" />} />
                                    </ListItem>)
                                    :
                                    listHowtos.map(({ id, title, created_at, votes }) =>
                                        <ListItemButton dataid={id} key={id} sx={{
                                            px: theme.spacing(3),
                                        }}
                                            onClick={handleHowtoSelect}
                                        >
                                            <ListItemText primary={title} secondary={`${created_at.toDate().getDate()}/${created_at.toDate().getMonth() + 1}/${created_at.toDate().getFullYear()} - ${created_at.toDate().toLocaleTimeString()}`} />
                                        </ListItemButton>
                                    )
                            }
                        </List>
                    </Paper>
                </Grid>
                <Grid item md={8}>
                    {
                        isEditMode ?
                            <CKEditorStyled
                                editor={ClassicEditor}
                                data={selectedHowtoBody}
                                config={{
                                    toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'codeBlock'],
                                }}
                                onReady={editor => {
                                    // You can store the "editor" and use when it is needed.
                                    console.log('Editor is ready to use!', editor);
                                }}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    const updated = { ...selectedHowto, body: data };
                                    console.log('updated', updated);
                                    if (!isEmpty(selectedHowto))
                                        setSelectedHowto(updated);
                                }}
                                onBlur={() => {
                                    console.log(selectedHowto);
                                    saveHowto();
                                }}
                            />
                            :
                            <Paper sx={{
                                p: theme.spacing(3)
                            }}>
                                {parse(selectedHowtoBody)}
                            </Paper>
                    }
                </Grid>
            </Grid>
        </Box>
    );
}