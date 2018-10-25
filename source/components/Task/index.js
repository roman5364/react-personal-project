// Core
import React, { PureComponent } from 'react';
import { func, string } from 'prop-types';

// Instruments
import Styles from './styles.m.css';
import Checkbox from "../../theme/assets/Checkbox";
import Star from "../../theme/assets/Star";
import Edit from "../../theme/assets/Edit";
import Remove from "../../theme/assets/Remove";
import cx from 'classnames';

export default class Task extends PureComponent {

    static propTypes = {
        _updateTaskAsync: func.isRequired,
        message:          string,
    };

    state = {
        isTaskEditing: false,
        newMessage:    this.props.message,
    };

    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    _toggleTaskCompletedState = () => {
        const { _updateTaskAsync, completed } = this.props;
        const completedTask = this._getTaskShape({ completed: !completed });

        _updateTaskAsync(completedTask);
    };

    taskInput = React.createRef();

    render () {

        const { message, favorite, completed } = this.props;
        const { isTaskEditing, newMessage } = this.state;

        const taskStyles = this._getTaskStyles();

        return (
            <li className = { taskStyles }>
                <div className = { Styles.content }>
                    <Checkbox
                        checked = { completed }
                        className = { Styles.toggleTaskCompletedState }
                        color1 = '#3B8EF3'
                        color2 = '#FFF'
                        inlineBlock
                        onClick = { this._toggleTaskCompletedState }

                    />
                    <input
                        disabled = { !isTaskEditing }
                        maxLength = { 50 }
                        onChange = { this._updateNewTaskMessage }
                        onKeyDown = { this._updateNewTaskMessageOnKeyDown }
                        ref = { this.taskInput }
                        type = 'text'
                        value = { newMessage }
                    />
                </div>
                <div className = { Styles.actions }>
                    <Star
                        checked = { favorite }
                        className = { Styles.toggleTaskFavoriteState }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        inlineBlock
                        onClick = { this._toggleTaskFavoriteState }
                    />
                    <Edit
                        checked = { isTaskEditing }
                        className = { Styles.updateTaskMessageOnClick }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        inlineBlock
                        onClick = { this._updateTaskMessageOnClick }
                    />
                    <Remove
                        className = { Styles.removeTask }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        inlineBlock
                        onClick = { this._removeTask }
                    />
                </div>
            </li>
        );
    }

    _getTaskStyles = () => {
        const { completed } = this.props;

        return cx(Styles.task, {
            [Styles.completed]: completed,
        });
    };

    _updateNewTaskMessage = (event) => {
        const { value } = event.target;

        this.setState({
            newMessage: value,
        });
    };

    _updateNewTaskMessageOnKeyDown = (event) => {
        const { newMessage } = this.state;

        if (!newMessage.trim()) {
            return null;
        }

        const enterKey = event.key === 'Enter';
        const escapeKey = event.key === 'Escape';

        if (enterKey) {
            this._updateTask();
        }

        if (escapeKey) {
            this._cancelUpdatingTaskMessage();
        }
    };

    _updateTask = () => {
        const { _updatetaskAsync, message } = this.props;
        const { newMessage } = this.state;

        if (newMessage === message) {
            this._setTaskEditingState(false);

            return null;
        }

        _updatetaskAsync(this._getTaskShape({ message: newMessage }));
        this._setTaskEditingState(false);

    };

    _setTaskEditingState = (isTaskEditing) => {
        this.setState({
            isTaskEditing,
        });

        if (isTaskEditing) {
            this._taskInputFocus();
        }

    };

    _taskInputFocus = () => {
        this.taskInput.current.focus();
    };

    _toggleTaskFavoriteState = () => {
        const { _updateTaskAsync, favorite } = this.props;
        const favoriteTask = this._getTaskShape({ favorite: !favorite });

        _updateTaskAsync(favoriteTask);
    };

    _updateTaskMessageOnClick = () => {
        const { isTaskEditing } = this.state;

        if (isTaskEditing) {
            this._updateTask();

            return null;
        }

        this._setTaskEditingState(true);
    };

    _removeTask = () => {
        const { _removeTaskAsync, id } = this.props;

        _removeTaskAsync(id);
    };
}
