import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { CircularProgress, styled, Box } from '@mui/material';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../../firebase/firestore';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import { getAuth } from 'firebase/auth';
import HowtoEditor from '../../components/HowtoEditor/HowtoEditor';
import { newHowtoTemp } from '../../dictionaries/newHowto';

export default function HowtoDetailsPage() {
    const theme = useTheme();
    const auth = getAuth();

    const { listId, howtoId } = useParams();

    const [isLoading, setIsLoading] = useState(true);

    const [selectedHowto, setSelectedHowto] = useState({});
    const [selectedHowtoBody, setSelectedHowtoBody] = useState("");

    useEffect(() => {
        loadHowtoDetails();
    }, [howtoId]);

    const loadHowtoDetails = async (e) => {
        if (howtoId == 'new') {
            setSelectedHowto(newHowtoTemp);
            return;
        }
        setIsLoading(true);
        const howtoRef = doc(db, `lists/${listId}/howtos/${howtoId}`);
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
        setIsLoading(false);
    }

    if (howtoId == 'new')
        return (
            <HowtoEditor
                howto={selectedHowto}

            />
        );

    if (isLoading)
        return (
            <Box sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <CircularProgress />
            </Box>
        );

    return (
        <>
            {parse(selectedHowtoBody)}
        </>
    );
}