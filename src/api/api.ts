import axios from "axios";
import {MutationFunction} from "@tanstack/react-query";

export interface NewTask {
    text: string;
}

export interface Task extends NewTask {
    id: string;
}

export const BASE_URL: string = 'https://cadbe128f3d3da6b05d6.free.beeceptor.com/api/tasks/';

export const fetchTasks = () => {
    return axios.get<Task[]>(BASE_URL, {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.data);
};

export const createTask: MutationFunction<Task, NewTask> = ({text}: NewTask) => {
    return axios.post<Task>(BASE_URL, {
        text: text,
    }, {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((res) => res.data)
};

export const deleteTask = (id: string) => {
    return axios.delete(`${BASE_URL}${id}`, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export const editTask: MutationFunction<Task, Task> = ({id, text}) => {
    return axios.put<Task>(`${BASE_URL}${id}`, {
        text: text,
    }, {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((res) => res.data)
};