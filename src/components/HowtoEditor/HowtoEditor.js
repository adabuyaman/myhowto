import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { CircularProgress, styled, Box } from '@mui/material';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../../firebase/firestore';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import { getAuth } from 'firebase/auth';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { isEmpty } from '../../utils/objects';

const CKEditorStyled = styled(CKEditor)(({ theme }) => ({
    '.ck-editor__main': {
        padding: theme.spacing(3)
    }
}));

export default function HowtoEditor({ howto, setHowto, onSave }) {
    const theme = useTheme();
    const auth = getAuth();

    const { listId, howtoId } = useParams();

    return (
        <CKEditorStyled
            editor={ClassicEditor}
            data={howto.body}
            config={{
                toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'table'],
            }}
            onReady={editor => {
                console.log('Editor is ready to use!', editor);
            }}
            onChange={(event, editor) => {
                const data = editor.getData();
                const updated = { ...howto, body: data };
                // if (!isEmpty(howto))
                //     setSelectedHowto(updated);
            }}
            onBlur={() => {
                onSave();
            }}
        />
    );
}