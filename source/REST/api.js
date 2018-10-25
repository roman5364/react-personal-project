import { MAIN_URL, TOKEN } from "./config";

export const api = {

    async fetchTasks () {
        const response = await fetch(`${MAIN_URL}`, {
            method:  'GET',
            headers: {
                'content-type': 'application/json',
                Authorization:  TOKEN,
            },
        });

        if (response.status !== 200) {
            throw new Error('Task were not loaded.');

        }

        const { data: tasks } = await response.json();

        return tasks;
    },

    async createTask (message) {
        const response = await fetch(MAIN_URL, {
            method:  'POST',
            headers: {
                'content-type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify({
                message,
            }),
        });

        if (response.status !== 200) {
            throw new Error('Task were not created.');
        }

        const { data: task } = await response.json();

        return task;
    },

    async updateTask (updatedTask) {
        const response = await fetch(MAIN_URL, {
            method:  'PUT',
            headers: {
                'content-type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify([updatedTask]),
        });

        if (response.status !== 200) {
            throw new Error('Task were not updated.');
        }

        const { data: task } = await response.json();

        return task;
    },

    async removeTask (id) {
        const response = await fetch(`${MAIN_URL}/${id}`, {
            method:  'DELETE',
            headers: {
                Authorization: TOKEN,
            },
        });

        if (response.status !== 204 && response.status !== 200) {
            throw new Error('Task were not deleted.');
        }
    },

    async completeAllTasks (completedTasks) {

        const fetchCompletedTasks = completedTasks.map((task) =>
            fetch(`${MAIN_URL}`, {
                method:  'PUT',
                headers: {
                    Authorization: TOKEN,
                },
                body: JSON.stringify([task]),
            }),
        );

        await Promise.all(fetchCompletedTasks);
    },

};
