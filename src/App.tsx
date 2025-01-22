import React, {useCallback, useEffect, useState} from 'react';
import './App.css';
import axios from "axios";
import {
    IconButton,
    Button,
    Typography,
    List,
    ListItem,
    ListItemText,
    styled,
    TextField,
    Container, Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid2';

interface Task {
    id: string;
    text: string;
}

function App() {
    const [value, setValue] = useState('');
    const [editValue, setEditValue] = useState('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [editTaskId, setEditTaskId] = useState<string | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    const handleEdit = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditValue(event.target.value);
    };

    const fetchTasks = () => {
        axios.get<Task[]>('https://cae76bc591977258ac51.free.beeceptor.com/api/tasks/', {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => setTasks(response.data))
            .catch((err) => console.log(err));
    };

    const handleSubmit = () => {
        axios.post<Task>('https://cae76bc591977258ac51.free.beeceptor.com/api/tasks/', {
            text: value,
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(() => {
                setValue('');
                fetchTasks();
            })
            .catch((err) => console.log(err));
    };

    const deleteTask = (id: string) => {
        axios.delete<Task>(`https://cae76bc591977258ac51.free.beeceptor.com/api/tasks/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(() => {
                fetchTasks();
            })
            .catch((err) => console.log(err));
    }

    const editTask = (id: string) => {
        axios.put<Task>(`https://cae76bc591977258ac51.free.beeceptor.com/api/tasks/${id}`, {
            text: editValue,
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(() => {
                setEditTaskId(null);
                fetchTasks();
            })
            .catch((err) => console.log(err));
    };

    const handleEditClick = (task: Task) => {
        setEditTaskId(task.id);
        setEditValue(task.text);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const Demo = styled('div')(({theme}) => ({
        backgroundColor: theme.palette.background.paper,
    }));

    return (
        <Container maxWidth='xs' sx={{
            marginTop: '2rem',
        }}>
            <Grid>
                <Typography align="center" variant="h6" component="h1">
                    TODO
                </Typography>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
                    <TextField
                        id="standard-basic"
                        value={value}
                        variant="standard"
                        onChange={handleChange}
                        placeholder='TODO TASK'
                        sx={{
                            width: '60%'
                        }}
                    />
                    <Button variant="outlined" onClick={handleSubmit}>ADD TASK</Button>
                </Box>
                <Demo>
                    <List>
                        {tasks.map((task: Task) => (
                            <ListItem key={task.id}>
                                {editTaskId === task.id ? (
                                    <Box sx={{display: 'flex'}}>
                                        <TextField
                                            value={editValue}
                                            autoFocus={true}
                                            onChange={handleEdit}
                                            variant="standard"
                                            placeholder="TODO TASK"
                                            sx={{width: '60%'}}
                                        />
                                        <Button variant="outlined" onClick={() => editTask(task.id)}>
                                            SAVE
                                        </Button>
                                        <Button variant="text" onClick={() => setEditTaskId(null)}>
                                            CANCEL
                                        </Button>
                                    </Box>
                                ) : (
                                    <>
                                        <ListItemText primary={task.text}/>
                                        <IconButton aria-label="delete" size="small"
                                                    onClick={() => deleteTask(task.id)}>
                                            <DeleteIcon fontSize="inherit"/>
                                        </IconButton>
                                        <Button variant="text" onClick={() => handleEditClick(task)}>
                                            EDIT
                                        </Button>
                                    </>
                                )}
                            </ListItem>
                        ))}
                    </List>
                </Demo>
            </Grid>
        </Container>
    );
}

export default App;