import React, { useState } from 'react';

import { Badge, Box, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { Share, Close, Check, ThumbUpAlt, ThumbDownAlt, ThumbDownOffAlt, ThumbUpOffAlt, Download } from '@mui/icons-material';
import CollectionDetailsActionsSkeleton from './CollectionDetailsActions.skeleton';

const votesCount = (votes) => votes && Object.values(votes).filter(val => val).length;

export default function CollectionDetailsActions({ isLoading, isEditing, vote, onVoteChange, votes, onEditClick, onDownloadClick }) {

    const [voteLoading, isVoteLoading] = useState(false);

    const _onVoteChange = async (val) => {
        isVoteLoading(true);
        await onVoteChange(val);
        isVoteLoading(false);
    }

    if (isLoading)
        return <CollectionDetailsActionsSkeleton />

    return (
        <>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '10px',
                mt: '10px'
            }}>
                <IconButton aria-label="delete">
                    <Tooltip title="Share">
                        <Share />
                    </Tooltip>
                </IconButton>

                <IconButton aria-label="vote-up" color={vote ? "success" : "default"} onClick={() => _onVoteChange(vote === true ? null : true)}>
                    <Badge badgeContent={voteLoading? <CircularProgress sx={{color:'#fff'}} size={10} thickness={6} /> : votesCount(votes)} color={vote ? "success" : "info"}>

                        <Tooltip title="Vote up!">
                            {
                                vote ? <ThumbUpAlt /> : <ThumbUpOffAlt />
                            }
                        </Tooltip>
                    </Badge>
                </IconButton>
                <IconButton aria-label="vote-down" color={vote === false ? "error" : "default"} onClick={() => _onVoteChange(vote === false ? null : false)}>
                    <Tooltip title="Vote down!">
                        {
                            vote === false ? <ThumbDownAlt /> : <ThumbDownOffAlt />
                        }
                    </Tooltip>
                </IconButton>
                {/* <IconButton aria-label="download collection" onClick={onDownloadClick}>
                    <Tooltip title="Download collection">
                        <Download />
                    </Tooltip>
                </IconButton> */}


                {
                    isEditing &&
                    <>
                        <IconButton sx={{ ml: 'auto' }} aria-label="edit" onClick={() => onEditClick(true)}>
                            <Tooltip title="Save updates" color='success'>
                                <Check color='success' />
                            </Tooltip>
                        </IconButton>
                        <IconButton aria-label="edit" onClick={() => onEditClick(false)}>
                            <Tooltip title="Discard changes">
                                <Close />
                            </Tooltip>
                        </IconButton>
                    </>
                }
            </Box>
        </>
    );
};