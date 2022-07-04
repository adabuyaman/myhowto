import React from 'react';
import { Skeleton, Box } from '@mui/material';

export default function CollectionDetailsActionsSkeleton() {
    return (
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
    );
}