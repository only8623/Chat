import React, { Component } from 'react';
import { render } from 'react-dom';
import moment from 'moment';
//import logo from './logo.svg';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";


import config from './config.json';
import './main.css';//使用require导入css文件
import ioClient from 'socket.io-client';


//import './entra.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

const Basic = () => (
  <Router>
    <div>
      <Route exact path="/" component={Words} />
      <Route path="/Friend" component={Friend} />
      <Route path="/Entrance" component={Entrance} />
    </div>
  </Router>
);

class Entrance extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "请输入你喜欢的名字", light: 0, };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    console.log(1);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });

  }


  onSubmit(event) {
    event.preventDefault();
    localStorage.setItem('Myusername', this.state.value);//获取用户名
    let username = localStorage.getItem("Myusername");
    console.log(username);
    let userpic = localStorage.getItem('Myimage');
    console.log(userpic);
  }

  onClick(event) {
    localStorage.setItem('Myimage', event.target.src);
    let userpic = localStorage.getItem('Myimage');
    this.setState({ light: parseInt(event.target.name) });//转数字
  }

  render() {
    const { light } = this.state;
    return (
      <div className="head-portrait">
        <div className="hp-pic">
          <img src={"/entra/pic/001"} style={light === 1 ? { border: '2px solid #FFF' } : {}} onClick={this.onClick} name='1' />
          <img src={"/entra/pic/002"} style={light === 2 ? { border: '2px solid #FFF' } : {}} onClick={this.onClick} name='2' />
          <img src={"/entra/pic/003"} style={light === 3 ? { border: '2px solid #FFF' } : {}} onClick={this.onClick} name='3' />
          <img src={"/entra/pic/004"} style={light === 4 ? { border: '2px solid #FFF' } : {}} onClick={this.onClick} name='4' />
        </div>
        <form className="Favorite-name" onSubmit={this.onSubmit}>
          <input className="name" value={this.state.value} onChange={this.handleChange} />
        </form>

      </div>
    )
  }
}

class People extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    console.log('123');

  }

  onClick() {
    this.props.history.push('/');//配合react-router使用
  }


  render() {
    return (
      <div className="friends" onClick={this.onClick}>
        <img src={"/abc/pic/QQ20180116215459"} className="gravatar" />
        <div className="reminder"><p>3</p></div>
        <div className="words">
          <div className="words">{this.props.name}
            <div className="words">·{this.props.distance}</div>
          </div>
          <div className="f-words">{this.props.IndividualResume}</div>
        </div>

      </div>
    )
  }
}

class Friend extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "Lily", distance: "100m", IndividualResume: "NO", peoplelist: [""] };

  }

  componentDidMount() {
    fetch('/abc/data/people')
      .then((response) => {
        return response.json();
      })
      .then((people) => {
        this.setState({ peoplelist: people });
      });



    //  xhrs("/abc/data/people", (result)=>{console.log(result)}, "sendvalue");
  }
  componentWillUnmount() {
    // clearInterval();
  }

  render() {
    let peoplelist = this.state.peoplelist;
    return (<div>
      <div className={"searchBar " + ""} >
        <input className={"inbox"} value="inbox" />
        <div className={"inbox"} >?</div>
      </div>
      {peoplelist.map((item, i) => <People key={i} name={item.name} distance={item.distance} IndividualResume={item.IndividualResume} history={this.props.history} />)}

    </div>)
  }
}

//对话页面
class Opposite extends React.Component {
  constructor(props) {
    super(props);
    this.state = { head: "../src/QQ图片20180116215459.jpg", value: "对方对话内容对方对话内容对方对话内容", tlaktime: [""] };
  }

  componentDidMount() {

    fetch('/abc/data/time')
      .then((response) => {
        return response.json();
      })
      .then((time) => {
        this.setState({ tlaktime: time });
      })


  }

  render() {

    return (
      <div >
        {/* <p className={"time"}><div className={"dialog " + this.props.className}> <p>{this.props.tlakvalue}</p></div> </p> */}
      </div>

    )
  }
}

class Words extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      chatlist: [{ type: "right", content: "my words", src: localStorage.getItem('Myimage'), name: "Lily" }, { type: "left", content: "her words", src: localStorage.getItem('Myimage'), name: "Ann" }],
      searchvalue: "P.Ghani", tlakvalue: [{ type: "left", content: "对方的话" }]
    };
    this.handleChange = this.handleChange.bind(this);
    this.searchChange = this.searchChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    fetch('/abc/data/words')
      .then((response) => {
        return response.json();
      })
      .then((words) => {
        this.setState({ tlakvalue: words });
        //指向对话框内容this.setState({ tlakvalue: words[Math.floor(Math.random() * 7)] });
        console.log(this.state.chatlist)
      });
    this.socket = ioClient();
    this.socket.on("chatTime", (valuemsg) => {
      console.log(valuemsg);
      this.state.chatlist.push({ type: valuemsg.type, name: valuemsg.name, src: valuemsg.src, content: valuemsg.content, });
      this.setState({ chatlist: this.state.chatlist });
    });

    console.log(localStorage.getItem('Myimage'));
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  onSubmit(event) {
    event.preventDefault();
    this.state.chatlist.push({ type: "right", content: this.state.value, src: localStorage.getItem('Myimage'), name: "Lily" });//本地
    // this.state.chatlist.push(this.state.tlakvalue);
    console.log(this.state.chatlist);
    this.socket.emit('chat message', this.state.value);//对应服务器同名事件，发送内容至服务器
    this.socket.emit("chatTime", { type: "left", name: "Myname", src: localStorage.getItem('Myimage'), content: this.state.value });//发送聊天内容

    this.setState({ value: "" }, () => {//固定底部
      let rootHeight = document.getElementById("root").offsetHeight;
      window.scroll(0, rootHeight)
    });
  }

  searchChange(event) {
    this.setState({ searchvalue: event.target.value });

  }

  render() {
    const chatlist = this.state.chatlist;

    return (
      <div className="background" >
        <div className="searchBar" >
          <Link className="goback" to="/Friend">←</Link>
          <input type="text" className="search" value={this.state.searchvalue} onChange={this.searchChange} />
          <div className="cion">!</div>
        </div>

        {chatlist.map((item, i) =>
          <div key={i} className={"user" + item.type}>
            <p className={"username" + item.type}>{item.name}</p>
            <div className={"Align-" + item.type}>
              <p className={"dialog " + item.type}> {item.content}  </p>
              <img src={item.src} className={"avatar " + item.type} />
            </div>

          </div>
        )}

        <div className="kbback">
          <form onSubmit={this.onSubmit}>
            <input className="keyboard" value={this.state.value} onChange={this.handleChange} />
          </form>
        </div>

      </div >
    )
  }
};



export default Basic;

render(<Basic />, document.getElementById('root'));

//储存头像
function populateStorage() {
  localStorage.setItem('Myimage', 'myCat.png');
  localStorage.setItem('Myusername', 'Lily');
}

let username = localStorage.getItem("Myusername");

