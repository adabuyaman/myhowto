import React from 'react';
import { Skeleton } from '@mui/material';

export default function CollectionDetailsInfoSkeleton() {
    return (
        <>
            <Skeleton variant="text" width={210} height={55} />
            <Skeleton variant="text" />
            <Skeleton width="60%" />
        </>
    );
}