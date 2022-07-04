import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AvatarGroup, Badge, Box, Link } from '@mui/material';
import { deepOrange, deepPurple } from '@mui/material/colors';
import PropTypes from 'prop-types';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Link as Linka } from 'react-router-dom';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));
const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: 5,
        top: 5,
    },
}));
export default function HowToList({
    id,
    index,
    title,
    description,
    howTos,
    users
}) {
    const [expanded, setExpanded] = React.useState(false);
    const theme = useTheme();

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    console.log(id);
    return (
        <Card sx={{
            // minHeight: '167px',
        }}>
            <CardHeader
                titleTypographyProps={{
                    fontSize: theme.typography.subtitle1
                }}
                title={<Linka to={id}>{title}</Linka>}

            />
            {
                !!description &&
                <CardContent>{description}</CardContent>
            }
            <CardActions sx={{
                borderTop: '1px dashed #dfdfdf'
            }} disableSpacing>
                {
                    !!users.length &&
                    <AvatarGroup max={4}
                        sx={{
                            '& .MuiAvatar-root': { width: 24, height: 24, fontSize: 12 },
                        }}
                    >
                        {
                            users.map((user, index) => (
                                <Avatar
                                    key={index.toString()}
                                    sx={{ width: 24, height: 24, bgcolor: user.profile_picture_color }}
                                    src={user.profile_picture}
                                />
                            ))
                        }
                    </AvatarGroup>
                }
                {
                    !!howTos.length &&
                    <StyledBadge color="secondary" badgeContent={howTos.length} sx={{
                        ml: 'auto'
                    }}>
                        <ExpandMore
                            expand={expanded}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                            sx={{
                                border: '1px solid #dfdfdf',
                                p: '4px'
                            }}
                        >
                            <ExpandMoreIcon />
                        </ExpandMore>
                    </StyledBadge>
                }
            </CardActions>
            {
                !!howTos.length &&
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent sx={{
                        borderTop: '1px dashed rgba(0,0,0,0.1)'
                    }}>
                        <Droppable droppableId="characters">
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                    {
                                        howTos.map((item, index) => (
                                            <Draggable draggableId={item.id + id} index={index} key={index.toString()}>
                                                {(provided, snapshot) => (
                                                    <Box
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        sx={{
                                                            backgroundColor: '#fff',
                                                            border: `1px ${snapshot.isDragging ? 'dashed' : 'solid'} ${snapshot.isDragging ? "#dfdfdf" : "#fff"}`,
                                                            transition: '.3s'
                                                        }}
                                                    >
                                                        <Link
                                                            component="a"
                                                            variant="body2"
                                                            onClick={() => {
                                                                console.info("I'm a button.");
                                                            }}
                                                        >
                                                            {item.title}
                                                        </Link>
                                                    </Box>
                                                )}
                                            </Draggable>
                                        ))
                                    }
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </CardContent>
                </Collapse>
            }
        </Card>

    );
}

HowToList.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    howTos: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string
    })),
    users: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        profile_picture: PropTypes.string,
    })),
};

HowToList.defaultProps = {
    title: undefined,
    description: undefined,
    howTos: [
        {
            id: '4234234241',
            title: "hello world!",
        },
        {
            id: '534654353',
            title: "hello world!",
        },
        {
            id: '8798702',
            title: "hello world!",
        }
    ],
    users: [
        {
            id: '1231212dafsd',
            profile_picture: 'https://www.noldus.com/static/images/core-blog/learn-about-people-observing-them-1612781760.jpg'
        },
        {
            id: '1231212dafsd',
            profile_picture: undefined
        },
        {
            id: '1231212dafsd',
            profile_picture_color: deepOrange[500],
            profile_picture: undefined
        },
        {
            id: '1231212dafsd',
            profile_picture: undefined,
        },
        {
            id: '1231212dafsd',
            profile_picture: undefined,
        }
    ]
};