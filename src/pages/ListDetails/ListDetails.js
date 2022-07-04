import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import { Box, Button, Divider, Paper, styled } from '@mui/material';
import { collection, doc, getDoc, getDocs, Timestamp, updateDoc } from "firebase/firestore";
import { db } from '../../firebase/firestore';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getAuth } from 'firebase/auth';
import CollectionHowtosList from '../../components/CollectionHowtosList/CollectionHowtosList';
import CollectionDetailsInfo from '../../components/CollectionDetailsInfo/CollectionDetailsInfo';
import CollectionDetailsActions from '../../components/CollectionDetailsActions/CollectionDetailsActions';
import "./ListDetails.scss";
import { newHowtoTemp } from '../../dictionaries/newHowto';
import { isEmpty } from '../../utils/objects';

const CKEditorStyled = styled(CKEditor)(({ theme }) => ({
    '.ck-editor__main': {
        padding: theme.spacing(3)
    }
}));


export default function ListDetails() {
    const theme = useTheme();
    const auth = getAuth();
    const navigate = useNavigate();


    const { listId } = useParams();

    const [isCollectionDetailsLoading, setIsCollectionDetailsLoading] = useState(true);
    const [isListHowtosLoading, setIsListHowtosLoading] = useState(true);

    const [listData, setListData] = useState({});
    const [listHowtos, setListHowtos] = useState([]);

    const [isEditMode, setIsEditMode] = useState(false);
    const [listEditedTitle, setListEditedTitle] = useState("");
    const [listEditedDescription, setListEditedDescription] = useState("");
    const [vote, setVote] = useState(undefined);

    const handleVoting = async (vote) => {
        const howtoRef = doc(db, "lists", listId);
        console.log(howtoRef);
        await updateDoc(howtoRef, {
            votes: {
                [auth.currentUser.uid]: vote
            }
        });
        setVote(vote);
        const updatedListData = { ...listData };
        console.log('here');
        updatedListData.votes[auth.currentUser.uid] = vote;
        console.log('here2');

        setListData(updatedListData);
    }

    useEffect(() => {
        loadListDetails();
    }, []);


    const downloadCollection = () => {
        // window.html2canvas = html2canvas;
        // const doc = new jsPDF();
        // const html = new DOMParser().parseFromString(selectedHowtoBody, 'text/html');
        // console.log(window.document);
        // doc.html(html, {
        //     x: 10,
        //     y: 10
        // });
        // doc.save("a4.pdf");
    }

    const loadListDetails = async () => {
        try {
            setIsCollectionDetailsLoading(true);
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
            console.error('ERROR in loadListDetails', error);
        }
        setIsCollectionDetailsLoading(false);
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

    const saveHowto = async () => {
        // console.log('Saving...');
        // let contentNode = new DOMParser().parseFromString(selectedHowto.body, 'text/html');
        // const title = contentNode.querySelector('h1,h2,h3,h4,h5,h6');
        // await setDoc(doc(db, "lists", listId, "howtos", selectedHowto.id), { ...selectedHowto, title: title.textContent.trim() ?? selectedHowto.title });
    }

    const handleNewHowto = () => {
        // col_ref.doc("LA").set({
        //     name: "Los Angeles",
        //     state: "CA",
        //     country: "USA"
        // })
        const newHowto = { ...newHowtoTemp };
        newHowto.created_at = Timestamp.fromDate(new Date());
        setListHowtos([newHowto, ...listHowtos]);
        navigate('new', { replace: true });
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
                            <CollectionDetailsInfo
                                setIsEditing={setIsEditMode}
                                isLoading={isCollectionDetailsLoading}
                                isEditing={isEditMode}
                                title={listData.title}
                                description={listData.description}
                                onTitleChange={setListEditedTitle}
                                onDescriptionChange={setListEditedDescription}
                            />
                            <CollectionDetailsActions
                                onDownloadClick={downloadCollection}
                                isLoading={isCollectionDetailsLoading}
                                isEditing={isEditMode}
                                vote={vote}
                                onVoteChange={handleVoting}
                                votes={listData.votes}
                                onEditClick={handleListEdit}
                            />
                            <Button onClick={handleNewHowto} disabled={isCollectionDetailsLoading} sx={{
                                mt: theme.spacing(2)
                            }} variant="contained">Add How-to</Button>
                        </Box>
                        <Divider />
                        <CollectionHowtosList
                            isLoading={isListHowtosLoading}
                            howtos={listHowtos}
                        />
                    </Paper>
                </Grid>
                <Grid item md={8} className="howto__main">
                    {
                        false ?
                            <CKEditorStyled
                                editor={ClassicEditor}
                                // data={selectedHowtoBody}
                                config={{
                                    toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'table'],
                                }}
                                onReady={editor => {
                                    console.log('Editor is ready to use!', editor);
                                }}
                                // onChange={(event, editor) => {
                                //     const data = editor.getData();
                                //     const updated = { ...selectedHowto, body: data };
                                //     console.log('updated', updated);
                                //     if (!isEmpty(selectedHowto))
                                //         setSelectedHowto(updated);
                                // }}
                                onBlur={() => {
                                    saveHowto();
                                }}
                            />
                            :
                            <Paper
                                className="howto__main__content"
                                sx={{
                                    p: theme.spacing(3)
                                }}>
                                <Outlet />
                            </Paper>
                    }
                </Grid>
            </Grid>
        </Box>
    );
}