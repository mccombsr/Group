import React, { Component } from "react";
import io from 'socket.io-client'
import DisplayModal from './DisplayModal'
import TeamDisplay from './TeamDisplay'
import '../../scss/App.scss';
import sky from '../../scss/images/game_sky.png';
import grass from '../../scss/images/game_grass.png';
import sun from '../../scss/images/game_sun.png';
import cloudSmall from '../../scss/images/game_cloud3.png';
import cloudMed from '../../scss/images/game_cloud2.png';
import cloudBig from '../../scss/images/game_cloud1.png';
import trogdor from '../../scss/images/game_trogdor.png';
import { Alert } from "antd";





class GameDisplay extends Component {
  constructor() {
    super()
    this.state = {
      countDown: 0,
      room: 'things',
      qa: [],
      team: [],
      gameTitle: '',
      cOne: '',
      cTwo: '',
      cThree: '',
      showAnswer: false
    }
    this.joinRoom = this.joinRoom.bind(this);
  }

  async componentDidMount() {
    await this.setState({
      room: window.location.pathname.split('/')[2],
    })
    this.socket = io('http://localhost:4000')
    await this.joinRoom()
    await this.socket.on('game state', data => {
      console.log("hit it")
      this.setState({
        qa: data.qa,
        team: data.teams,
        gameTitle: data.gameTitle,
        cOne: data.cOne,
        cTwo: data.cTwo,
        cThree: data.cThree
      })
    })

    //This sets showAnswer to true
    await this.socket.on('show answer', data => {
      this.setState({
        showAnswer: data
      })
    })

    await this.socket.on('buzzer', data => {
      alert(data)
    })

  }

  timer = () => {
    if (this.state.countDown > 0) {
      setTimeout(() => {
        this.setState({
          countDown: this.state.countDown - 1
        })
        this.timer()
      }, 1000)
    }
  }

  countDown = () => {
    this.setState({
      countDown: 10
    })
    this.timer()
  }

  joinRoom() {
    if (this.state.room) {
      this.socket.emit('join room', {
        room: this.state.room
      })
    }
  }

  render() {
    let cOne = this.state.qa.filter(el => el.category_num === 1)
    let cTwo = this.state.qa.filter(el => el.category_num === 2)
    let cThree = this.state.qa.filter(el => el.category_num === 3)
    console.log(this.state.cOne)
    return (
      <div>


        <div className="gdBackground">
          <img id='sky' src={sky} alt='sky-background' />
          <div className='gameinfo'>
            <h1 id='gdgt'>{this.state.gameTitle}</h1>
          </div>
          <img id='grass' src={grass} alt='grass-background' />
          <img id='sun' src={sun} alt='sun-background' />
          <div className='clouds'>
            <img id='cloudBig' src={cloudBig} alt='Big-cloud illustration' />
            <img id='cloudSmall' src={cloudSmall} alt='small-cloud illustration' />
            <img id='cloudMed' src={cloudMed} alt='Medium-cloud illustration' />
          </div>
          <img id='trogdor' src={trogdor} alt='trogdor' />

        </div>

        <div className='gdCategoryContainer'>

          <div className="gdCategory">
            {/* <DisplayModal question={qa} countDown={this.state.countDown} /> */}
            <h1 className='catTitle'>{this.state.cOne}</h1>
            {cOne.map((qa, i) => (
              // className here is .gdBtn
              <DisplayModal key={i} qa={qa} countDown={this.state.countDown} showAnswer={this.state.showAnswer} />
            ))}
          </div>
          <div className="gdCategory">
            <h1 className='catTitle'>{this.state.cTwo}</h1>
            {cTwo.map((qa, i) => (
              <DisplayModal key={i} qa={qa} countDown={this.state.countDown} showAnswer={this.state.showAnswer} />
            ))}
          </div>
          <div className="gdCategory">
            <h1 className='catTitle'>{this.state.cThree}</h1>
            {cThree.map((qa, i) => (
              <DisplayModal key={i} qa={qa} countDown={this.state.countDown} showAnswer={this.state.showAnswer} />
            ))}
          </div>
        </div>
        <div className='gdTeamsContainer'>
          {this.state.team.map((team, i) => (
            <TeamDisplay key={i} team={team} />

          ))}
        </div>


      </div>
    );
  }
}

export default GameDisplay


