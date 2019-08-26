import React from 'react';

import Task from './task'

export default class TaskList extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    tasks: [],
    taskBlocked: false,
    stats: { completed: 0, late: 0, total: 0 },
    hash: new Date().now
  }

  newTask = (e) => {
    e.preventDefault();
    if (this.state.taskBlocked) { return }

    this.setState({
      // taskBlocked: !this.state.taskBlocked,
      tasks: [
        ...this.state.tasks,
        { description: '', owner: '', due_date: 'M/d', status: 0 }]
    })
  }

  refreshTasks = (obj) => {
    this.fetchTasks()
  }

  fetchTasks = async () => {
    const endpoint = "http://localhost:8000/v1"
    const project_id = this.props.project.id || null

    await fetch(`${endpoint}/tasks?project_id=${project_id}`)
    .then(res => res.json())
    .then(result => {
      /* check task stats */
      let completed = 0, late = 0, total = 0
      if (result.taskList.length) {
        result.taskList.map(function(item, index) {
          if (item.status == 2) { completed++ }
          else if (item.status == 1) { late++ }
          total++;
        })
        this.props.statsFn({ completed, late, total })
      }

      /* populate tasks */
      this.setState({
        tasks: result.taskList,
        hash: new Date().toString()
      })
    });
  }

  componentDidMount() {
    this.fetchTasks()
  }

  render() {
    return (
      <div className="task-list" key={this.state.hash}>
        {
          this.state.tasks ? (
            this.state.tasks.map((item, index) => {
              return (
                <Task key={index} id={item.id}
                  project_id={this.props.project ? this.props.project.id : null}
                  description={item.description} owner={item.owner} status={item.status}
                  due_date={item.due_date} goto={this.refreshTasks}
                />
              )
            })
          ) : <br/>
        }
        <br/>
        {this.props.project.id !== undefined ? <a href="#" onClick={this.newTask} className="addTask color-blue">+ Add Task</a> : <br/>}
      </div>
    );
  }
}
