import axios from "axios";

interface Task {
    id: string;
    text: string;
}

export const BASE_URL: string = 'https://cadbe128f3d3da6b05d6.free.beeceptor.com/api/tasks/';

export const fetchTasks = () => {
    return axios.get<Task[]>(BASE_URL, {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.data);
};

export const createTask = (value: string) => {
    return axios.post<Task>(BASE_URL, {
        text: value,
    }, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
};

export const deleteTask = (id: string) => {
    return axios.delete<Task>(`${BASE_URL}${id}`, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export const editTask = (id: string, editValue: string) => {
    return axios.put<Task>(`${BASE_URL}${id}`, {
        text: editValue,
    }, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
};