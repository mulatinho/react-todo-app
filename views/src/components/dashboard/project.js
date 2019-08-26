import React from 'react';

class Project extends React.Component {
  goToProject = () => {
    this.props.goto(this.props)
  }

  render() {
    return(
      <div>
        <h2>
          <a href="#" onClick={this.goToProject}
            value={this.props.title}>{this.props.title}</a>
            &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; {this.props.selected == this.props.title ? ">" : ""}
        </h2>
        <hr/>
        <br/>
      </div>
    );
  }
}

export default Project;
