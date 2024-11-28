import React, { useEffect, useState } from 'react';
import './App.css';
import axios from "axios";

interface Task {
    id: string;
    text: string;
}

function App() {
    const [value, setValue] = useState('');
    const [tasks, setTasks] = useState<Task[]>([]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
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

    useEffect(() => {
        fetchTasks();
    }, []);

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

    return (
        <div className="App">
            <h1>TODO</h1>
            <div>
                <ul className="tasks-container">
                    {
                        tasks && tasks.map((task: Task) => (
                            <li key={task.id} className="task">{task.text}
                                <button onClick={() => deleteTask(task.id)} className="task-delete">DELETE</button>
                                <button>EDIT</button>
                            </li>
                        ))
                    }
                </ul>
                <div className='new-task-container'>
                    <input
                        type='text'
                        value={value}
                        placeholder='TODO TASK'
                        onChange={handleChange}
                    />
                    <button type='submit' onClick={handleSubmit}>ADD TASK</button>
                </div>
            </div>
        </div>
    );
}

export default App;