import React from 'react';

import Project from './project';
import TaskList from '../../components/tasks';

export default class Dashboard extends React.Component {
  state = {
    projects: [],
    screenNewProject: false,
    newProjectName: '',
    project: {},
    stats: { completed: 0, late: 0, total: 0 },
    hash: new Date().toString()
  }

  viewNewProject = (e) => {
    e.preventDefault();

    this.setState({
      screenNewProject: true,
      project: {}
    })

    this.fetchProjects();
  }

  deleteProject = async (e) => {
    e.preventDefault();

    const endpoint = "http://localhost:8000/v1"

    await fetch(`${endpoint}/projects/${this.state.project.id || null}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
    .then(res => {});

    await this.setState({
      project: {},
      screenNewProject: false
    })
    await this.fetchProjects();
  }

  cbKeyPress = async (e) => {
    if (e.charCode === 13) { // ENTER
      let project_payload = JSON.stringify({
        title: this.state.newProjectName
      });

      const endpoint = "http://localhost:8000/v1/projects"

      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: project_payload
      })
      .then(res => res.json())
      .then(res => {})

      await this.setState({ newProjectName: '', screenNewProject: false })
      await this.fetchProjects();
    }
  }

  cbOnChange = (e) => {
    this.setState({
      newProjectName: e.target.value
    })
  }

  handleStatus = (obj) => {
    this.setState({
      stats: obj
    })
  }

  gotoProject = (obj) => {
    this.setState({
      screenNewProject: false,
      project: obj,
      hash: new Date().toString()
    })

    this.fetchProjects();
  }

  async fetchProjects() {
    const endpoint = "http://localhost:8000/v1"

    /* check out the projects */
    await fetch(`${endpoint}/projects`)
    .then(res => res.json())
    .then(result => {
      this.setState({
        projects: result.projects,
        hash: new Date().toString()
      })
    });
  }

  componentDidMount() {
    this.fetchProjects();
  }

  render() {
    return (
      <div className="contentContainerStyle">
        <div className="box-menu" key={this.state.hash}>
          <h1>Projects</h1>
          <br/>
          {
            this.state.projects.map((item, index) => {
              return <Project key={item.id} title={item.title} goto={this.gotoProject} id={item.id} selected={this.state.project ? this.state.project.title : ""} />
            })
          }
          <br/>
          <a href="#" onClick={this.viewNewProject} className="color-blue">+ New Project</a>
        </div>

        <div className="box-content">
          {!this.state.screenNewProject ? (
            <div className="box-header">
              <h1>{this.state.project.title || "No project setted yet"}</h1>
              {this.state.project.title === undefined ? <p/> : <p key={this.state.hash}>{this.state.stats.completed}/{this.state.stats.late}/{this.state.stats.total}</p>}
              {this.state.project.title === undefined ? <a href="#"/> : <a href="#" onClick={this.deleteProject} className="color-blue littleUp">Delete Project</a>}
            </div>
          ) : (
            <div className="box-header">
              <input type="text"
                className="projectName minUp"
                placeholder="Type new project name"
                onKeyPress={this.cbKeyPress}
                onChange={this.cbOnChange}
              />
            </div>
          )}

          <TaskList
            key={this.state.hash}
            project={this.state.project}
            statsFn={this.handleStatus}
          />
        </div>
      </div>
    );
  }
}
