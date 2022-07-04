import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { CircularProgress, styled, Box } from '@mui/material';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../../firebase/firestore';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import { getAuth } from 'firebase/auth';

export default function SelectHowtoPage() {
    const theme = useTheme();
    const auth = getAuth();
    const { listId, howtoId } = useParams();

    return (
        <>
           <h1>please select something</h1>
        </>
    );
}