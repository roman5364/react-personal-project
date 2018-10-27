// Core
import React, { Component } from 'react';
import FlipMove from 'react-flip-move';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST';
import Checkbox from "../../theme/assets/Checkbox";
import Task from "../Task"; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

import { sortTasksByGroup } from "../../instruments";
import Spinner from "../Spinner";

export default class Scheduler extends Component {

   state = {
       tasks:           [],
       newTaskMessage:  '',
       tasksFilter:     '',
       isTasksFetching: false,
   };

    /*  methods   */

   componentDidMount () {
       this._fetchTasksAsync();
   }

    _completeAllTasksAsync = async () => {
        const allCompleted = this._getAllCompleted();

        if (allCompleted) {
            return null;
        }

        const { tasks } = this.state;

        const notCompletedTasks = tasks.filter(
            (task) => task.completed === false,
        );

        try {
            this._setTasksFetchingState(true);
            await api.completeAllTasks(notCompletedTasks);

            this.setState({
                tasks: tasks.map(
                    (task) =>
                        task.completed === false
                            ? { ...task, ...{ completed: true }}
                            : task),
            });
        } catch (error) {
            console.log(error);

        } finally {
            this._setTasksFetchingState(false);
        }

    };

    _createTaskAsync = async (event) => {
        event.preventDefault();

        const { newTaskMessage } = this.state;

        if (!newTaskMessage.trim()) {
            return null;
        }

        try {
            this._setTasksFetchingState(true);
            const task = await api.createTask(newTaskMessage);

            this.setState((prevState) => ({
                tasks:          [task, ...prevState.tasks],
                newTaskMessage: '',
            }));
        } catch (error) {
            console.log(error);

        } finally {
            this._setTasksFetchingState(false);
        }

    };

    _removeTaskAsync = async (id) => {
        try {
            this._setTasksFetchingState(true);
            await api.removeTask(id);

            this.setState(({ tasks }) => ({
                tasks: tasks.filter((task) => task.id !== id),
            }));
        } catch (error) {
            console.log(error);

        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _updateTaskAsync = async (updatedTask) => {

        try {
            this._setTasksFetchingState(true);

            await api.updateTask(updatedTask);

            this.setState((prevState) => ({
                tasks: prevState.tasks.map((task) => task.id === updatedTask.id ? updatedTask : task,
                ),
            }));
        } catch (error) {
            console.log(error);

        } finally {
            this._setTasksFetchingState(false);
        }

    };

    _setTasksFetchingState = (isTasksFetching) => {
        this.setState({
            isTasksFetching,
        });

    };

    _getAllCompleted = () => {
        this._fetchTasksAsync();
        const { tasks } = this.state;

        return tasks.every(this._checkAllTasksIsCompleted);
    };

    _fetchTasksAsync = async () => {
        console.time('_fetchTasksAsync'); // setTime
        try {
            this._setTasksFetchingState(true);
            const tasks = await api.fetchTasks();

            this.setState({
                tasks: sortTasksByGroup(tasks),
            });

        } catch (error) {
            console.log(error);

        } finally {
            this._setTasksFetchingState(false);
        }

        console.timeEnd('_fetchTasksAsync');

    };

    _checkAllTasksIsCompleted = (task) => {
        return task.completed === true;
    };

    _updateNewTaskMessage = (event) => {
        const { value } =  event.target;

        this.setState({
            newTaskMessage: value,
        });
    };

    _updateTasksFilter = (event) => {
        const { value } = event.target;

        this.setState({
            tasksFilter: value.toLowerCase(),
        });
    };

    render () {

        const {
            tasks,
            newTaskMessage,
            tasksFilter,
            isTasksFetching,

        } = this.state;

        const sortedTaskByGroup =  sortTasksByGroup(tasks);

        const taskJSX = sortedTaskByGroup.filter((task) => task.message.includes(tasksFilter)).map((task) => (
            <Task
                _removeTaskAsync = { this._removeTaskAsync }
                _updateTaskAsync = { this._updateTaskAsync }
                completed = { task.completed }
                favorite = { task.favorite }
                id = { task.id }
                key = { task.id }
                message = { task.message }
            />
        ));

        return (
            <section className = { Styles.scheduler }>
                <Spinner isSpinning = { isTasksFetching } />
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input
                            placeholder = 'Поиск'
                            type = 'search'
                            onChange = { this._updateTasksFilter }
                            value = { tasksFilter }
                        />
                    </header>
                    <section>
                        <form onSubmit = { this._createTaskAsync }>
                            <input
                                className = 'createTask'
                                maxLength = { 50 }
                                placeholder = 'Описaние моей новой задачи'
                                type = 'text'
                                onChange = { this._updateNewTaskMessage }
                                value = { newTaskMessage }
                            />
                            <button>Добавить задачу</button>
                        </form>
                        <div className = 'overlay'>
                            <ul>
                                <FlipMove duration = { 400 }>{taskJSX}</FlipMove>
                            </ul>
                        </div>
                    </section>
                    <footer>
                        <Checkbox
                            checked = { tasks.every((task) => task.completed === true) }
                            color1 = '#363636'
                            color2 = '#fff'
                            onClick = { this._completeAllTasksAsync }
                        />
                        <span className = 'completeAllTasks'>
                            Все задачи выполнены
                        </span>
                    </footer>
                </main>
            </section>
        );
    }

}
