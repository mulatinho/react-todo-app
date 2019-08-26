import React from 'react';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default class Task extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  state = {
    task: {
      id: '',
      description: '',
      owner: '',
      due_date: null,
      status: 0,
      desc_color: '',
      rest_color: ''
    },
    checked: false,
    checkSizes: { description: '90px', owner: '40px' }
  }

  refreshTasks = () => {
    this.props.goto()
  }

  cbChangeDate = async(date) => {
    await this.setState({
      task: {
        ...this.state.task,
        due_date: date
      },
    })
  }

  cbKeyPress = async (e) => {
    if (e.charCode === 13 && e.target.id === "taskTitle") { // ENTER
      if (this.state.task.id === null)
        await this.createTask()
      else
        await this.updateTask()

      await this.refreshTasks()
    }
  }

  cbInputChange = e => {
    if (e.target.id === "taskTitle") {
      this.setState({
        task: {
          ...this.state.task,
          description: e.target.value
        },
        checkSizes: {
          ...this.state.checkSizes,
          description:((e.target.value.length+1) * 7) + 'px'
        }
      })
    } else if (e.target.id === "taskOwner") {
      this.setState({
        task: {
          ...this.state.task,
          owner: e.target.value
        },
        checkSizes: {
          ...this.state.checkSizes,
          owner: ((e.target.value.length+1) * 7) + 'px'
        }
      })
    }
  }

  cbTaskCheck = async(e) => {
    await this.setState({
      checked: !this.state.checked,
    })

    await this.setState({
      task: {
        ...this.state.task,
        status: this.state.checked === true ? 2 : 0
      }
    })

    await this.updateTask()
  }

  createTask = async () => {
    let task_payload = JSON.stringify({
      description: this.state.task ? this.state.task.description : '',
      owner: this.state.task ? this.state.task.owner : '',
      due_date: this.state.task ? this.state.task.due_date : Date.now(),
      project_id: this.props.project_id ? this.props.project_id : null,
      status: this.props.project ? this.props.project.status : 0
    });
    const endpoint = "http://localhost:8000/v1"

    console.log(task_payload)

    await fetch(`${endpoint}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: task_payload
    })
    .then(res => res.json())
    .then(res => {})
  }

  updateTask = async () => {
    const endpoint = "http://localhost:8000/v1"
    let task_payload = JSON.stringify(this.state.task);

    await fetch(`${endpoint}/tasks/${this.state.task?this.state.task.id : null}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: task_payload
    })
    .then(res => res.json())
    .then(res => {})
  }

  async componentDidMount() {
    await this.setState({
      task: {
        id: this.props.id || null,
        description: this.props.description || '',
        owner: this.props.owner || '',
        due_date: this.props.due_date === null ? '' : new Date(Date.parse(this.props.due_date)),
        project_id: this.props.project_id || null
      },
      checkSizes: {
        description: this.props.description ? ((this.props.description.length+1) * 7) + 'px' : '90px',
        owner: this.props.owner ? ((this.props.owner.length+1) * 7) + 'px' : '40px'
      }
    })

    let color_desc_task = "task-color-desc-";
    let color_rest_task = "task-color-rest-";

    if (this.props.status === 0) {
      color_desc_task += "ok"
      color_rest_task += "ok"
    } else if (this.props.status === 1) {
      color_desc_task += "late"
      color_rest_task += "late"
    } else {
      color_desc_task += "complete lineThrough"
      color_rest_task += "complete lineThrough"
    }

    await this.setState({
      task: {
        ...this.state.task,
        desc_color: color_desc_task,
        rest_color: color_rest_task
      }
    });
  }

  render() {
    return (
      <div className={`task-item ${this.state.task.rest_color}`}>
        <input type="checkbox" onChange={this.cbTaskCheck}/>
        &nbsp; &nbsp;
        <div>
          <input type="text" id="taskTitle" placeholder="type new task"
            value={this.state.task ? this.state.task.description : ""}
            onChange={this.cbInputChange} onKeyPress={this.cbKeyPress}
            style={{ width: this.state.checkSizes.description }}
            className={`${this.state.checked ? "lineThrough" : ""} ${this.state.task.desc_color}`}
          />,
          &nbsp; &nbsp;
          <span className="owner">@
            <input type="text" id="taskOwner" placeholder="owner"
              value={this.state.task ? this.state.task.owner : ""}
              onChange={this.cbInputChange} onKeyPress={this.cbKeyPress}
              style={{ width: this.state.checkSizes.owner }}
              className={`${this.state.checked ? "lineThrough" : ""} ${this.state.task.rest_color}`}
            />
          </span>,
          &nbsp; &nbsp;
          <span className="due_date">
            <DatePicker className="datepicker" id="datePicker"
              placeholderText="M/d"
              selected={this.state.task.due_date}
              onChange={this.cbChangeDate} dateFormat="M/d"
              className={`${this.state.checked ? "datepicker lineThrough" : "datepicker"} ${this.state.task.rest_color}`}
            />
          </span>
          <br/>
        </div>
      </div>
    );
  }
}
