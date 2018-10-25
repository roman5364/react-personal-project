// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST';
import Checkbox from "../../theme/assets/Checkbox";
import Task from "../Task"; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

export default class Scheduler extends Component {

   state = {
       tasks:           [],
       newTaskMessage:  '',
       tasksFilter:     '',
       isTasksFetching: false,
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

               /* add and remove methods must be added */
               completed = { task.completed }
               favorite = { task.favorite }
               id = { task.id }
               key = { task.key }
               message = { task.message }
           />
       ));

       return (
           <section className = { Styles.scheduler }>
               <main>
                   <header>
                       <h1>Планировщик задач</h1>
                       <input
                           placeholder = 'Поиск'
                           type = 'search'
                           // add onChange;
                           value = '' // add value later;
                       />
                   </header>
                   <section>
                       <form>
                           <input className = 'createTask' maxLength = { 50 } placeholder = 'Описaние моей новой задачи' type = 'text' value = '' />
                           <button>Добавить задачу</button>
                       </form>
                       <div className = 'overlay'>
                           <ul>
                                /* taskJSX */
                           </ul>
                       </div>
                   </section>
                   <footer>
                       <Checkbox /* add validation */ />
                       <span className = 'completeAllTasks'>
                            Все задачи выполнены
                       </span>
                   </footer>
               </main>
           </section>
       );
   }
}
