import React, { Component } from 'react';


export default class Buzzer extends Component {
constructor () {
    super();
    this.state = {
        name: ''
    }
}

    render() {
        return(
            <div>
                <h1>{this.state.name}</h1>
                <button>Smash it!</button>
            </div>
        )
    }
}