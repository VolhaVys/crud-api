import {
    Box,
    Button,
    Container,
    IconButton,
    List,
    ListItem,
    ListItemText,
    styled,
    TextField,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import DeleteIcon from "@mui/icons-material/Delete";
import React, {useEffect, useState} from "react";
import {createTask, fetchTasks, deleteTask as importedDeleteTask, editTask as importedEditTask} from "../api/api";

interface Task {
    id: string;
    text: string;
}

const Todo: React.FC = () => {
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

    const updateTasks = () => fetchTasks()
        .then(tasks => setTasks(tasks))
        .catch((err) => console.log(err));

    const handleSubmit = () => {
        createTask(value).then(() => {
            setValue('');
            updateTasks();
        })
            .catch((err) => console.log(err));
    };

    const deleteTask = (id: string) => {
        importedDeleteTask(id).then(() => {
            updateTasks();
        })
            .catch((err) => console.log(err));
    }

    const editTask = (id: string) => {
        importedEditTask(id, editValue)
            .then((id) => {
                setEditTaskId(null);
                updateTasks();
            })
            .catch((err) => console.log(err));
    };

    const handleEditClick = (task: Task) => {
        setEditTaskId(task.id);
        setEditValue(task.text);
    };

    useEffect(() => {
        updateTasks();
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
    )
}

export default Todo;