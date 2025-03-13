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
import React, {useState} from "react";
import {
    createTask,
    fetchTasks,
    deleteTask as importedDeleteTask,
    editTask as importedEditTask,
    NewTask, Task
} from "../api/api";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

const Todo: React.FC = () => {
    const [value, setValue] = useState('');
    const [editValue, setEditValue] = useState('');
    const [editTaskId, setEditTaskId] = useState<string | null>(null);
    const {
        data: tasks,
        isLoading,
        isError,
        error,
    } = useQuery<Task[], Error>({
        queryKey: ['tasks'],
        queryFn: fetchTasks,
    });

    const queryClient = useQueryClient();

    const {
        mutate,
    } = useMutation<Task, Error, NewTask>({
        mutationFn: createTask,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['tasks']});
        },
    });

    const {
        mutate: updateTask,
    } = useMutation<Task, Error, Task>({
        mutationFn: importedEditTask,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['tasks']});
            setEditTaskId(null);
        },
    });

    const {
        mutate: removeTask,
    } = useMutation({
        mutationFn: importedDeleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['tasks']});
        },
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    const handleEdit = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditValue(event.target.value);
    };

    const handleSubmit = () => {
        mutate({text: value})
    };

    const deleteTask = (id: string) => {
        removeTask(id)
    }

    const editTask = (id: string) => {
        updateTask({id, text: editValue})
    };

    const handleEditClick = (task: Task) => {
        setEditTaskId(task.id);
        setEditValue(task.text);
    };

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
                        {tasks?.map((task: Task) => (
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