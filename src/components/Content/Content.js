import * as React from 'react';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import HowToList from '../howToList/howToList';
import { Box } from '@mui/material';
import { DragDropContext } from 'react-beautiful-dnd';

import { collection, getDocs } from "firebase/firestore";
import { db } from '../../firebase/firestore';

export default function Content() {
    const [lists, setLists] = React.useState([]);

    React.useEffect(() => {
        (async () => {
            const querySnapshot = await getDocs(collection(db, "lists"));
            setLists(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        })();
    }, []);

    const theme = useTheme();
    return (
        <Box sx={{ maxWidth: 1000, margin: 'auto', overflow: 'hidden' }}>
            <DragDropContext>
                <Grid container spacing={2} sx={{
                    padding: theme.spacing(1)
                }}>
                    {
                        lists.map((item, index) =>
                            <Grid item xs={12} md={3} key={index.toString()}>
                                <HowToList
                                    title={item.title}
                                    description={item.description}
                                    index={index}
                                    id={item.id}
                                />
                            </Grid>
                        )
                    }
                </Grid>
            </DragDropContext>

        </Box>
    );
}