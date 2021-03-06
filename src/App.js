import React, { Component } from "react";
import { Route, Switch, withRouter} from "react-router-dom";

import "./App.css";
import Clock from "./components/clock";
import Date from "./components/date";
// import Category from "./components/Category";
// import MyAccount from "./components/MyAccount";
import Search from "./components/Search";
import SideMenu from "./components/sidemenu";
import newsApi from "./apis/newsApi";
import Weather from "./components/defaultWeather";
import News from "./components/News";
import Regions from "./components/Region";
import Login from "./components/Login";
import Signup from "./components/Signup";

import "bulma/css/bulma.css";
import {login, logout} from "./utils";
// import Signout from "./components/Signout";


class App extends Component {
  state = {
    news: [],
    selectedRegion: "US",
    selectedCategory: "BreakingNews",
    isLoading: true,
    authToken: "",
  };

  componentDidMount = () => {
    this.getfrmnewsAPI(this.state.selectedCategory);
  };

  getfrmnewsAPI = (categoryName) => {
    let reqURL = "";
    this.setState({ isLoading: true });
    switch (categoryName) {
      case "BreakingNews":
        reqURL = `latest-news?country=${this.state.selectedRegion}&apiKey=${process.env.REACT_APP_CURRENTS_API_KEY}`;
        break;

      case "business":
      case "sports":
      case "technology":
      case "science":
      case "health":
        reqURL = `latest-news?country=${this.state.selectedRegion}&category=${categoryName}&apiKey=${process.env.REACT_APP_CURRENTS_API_KEY}`;
        break;

      case "movies":
        reqURL = `search?country=${this.state.selectedRegion}&keywords=${categoryName}&apiKey=${process.env.REACT_APP_CURRENTS_API_KEY}`;
        break;

      default:
        reqURL = `search?country=${this.state.selectedRegion}&keywords=${categoryName}&apiKey=${process.env.REACT_APP_CURRENTS_API_KEY}`;
    }

    newsApi
      .get(reqURL)
      .then((response) => {
        if (response.status === 200) {
          this.setState({ news: response.data.news, isLoading: false });
        }
      })
      .catch((error) => console.log(error));
  };

  getdatabyCategory = (e) => {
    e.preventDefault();
    let categoryName = e.target.getAttribute("href");
    this.setState({ selectedCategory: categoryName }, () => {
      this.getfrmnewsAPI(categoryName);
    });
  };

  userSearch = (userSearchInput) => {
    this.getfrmnewsAPI(userSearchInput);
  };

  userRegion = (selRegion) => {
    // this.setState ({selectedRegion: selRegion })
    let categoryName = this.props;
    console.log(categoryName);
    this.setState({ selectedRegion: selRegion }, () => {
      this.getfrmnewsAPI(this.state.selectedCategory);
    });
  };

  onLoginSubmit = (userData) => {
    let tokens = userData.tokens;
    let latestToken = tokens[tokens.length - 1].token;
    this.setState({ authToken: latestToken });
    login(latestToken);
    this.props.history.push('/');
  }

  onsignupSubmit = (token) => {
    this.setState({ authToken: token });
    login(token);
    this.props.history.push('/');
  }

  onLogoutSubmit = (e) => {
    e.preventDefault();
    this.setState({ authToken: '' });
    logout();
    this.props.history.push('/');
  }


  render() {
    return (
      <div>
        <div className="App-header nav-items">
          <div className="level nav-left">
            <div className="level-left app-name">CHANNEL MS NEWS</div>

            <div>
              <span className="short-app-name">C M S NEWS</span>
            </div>
            <div className="vl"></div>
            <div className="weather">
              <Weather />
            </div>
          </div>

          <div className="nav-right">
            <div className="region">
              <Regions userRegion={this.userRegion} />
            </div>
            <div className="vl1"></div>
            <div className="level-right clock">
              <Clock />
            </div>

            <div className="smallClock">
              <Date />
            </div>
          </div>
        </div>
        <Switch>
          <Route exact path="/" component={this.DefaultContainer} />
          {/* <Route exact path="/">
            <News
              news={this.state.news}
              isLoading={this.state.isLoading}
              isAuth={this.state.authToken}
            />
          </Route> */}
          {/* <Route
            path="/category/:CategoryName"
            render={(props) => (
              <Category {...props} selectedRegion={this.state.selectedRegion} />
            )}
          /> */}

          {/* <Route path="/login" component={Login} /> */}
          <Route path="/login" render={(props) => <Login {...props} onLoginSubmit={this.onLoginSubmit} />} />
          <Route path="/signup" render={(props) => <Signup {...props} onsignupSubmit={this.onsignupSubmit} />} />
          {/* <Route path="/myaccount" component={MyAccount} /> */}
          <a href="/" onClick ={this.onLogoutSubmit}>Sign Out</a>
        </Switch>
      </div>
    );
  }
  DefaultContainer = () => (
    <div>
      <Route exact path="/">
        <News
          news={this.state.news}
          isLoading={this.state.isLoading}
          isAuth={this.state.authToken}
        />
      </Route>
      <div>
        <Search onSearchSubmit={this.userSearch} />
        <SideMenu
          newsCategory={this.getdatabyCategory}
          onLogoutSubmit = {this.onLogoutSubmit}
          isAuth={this.state.authToken}
        />
      </div>
    </div>
  );
}


export default withRouter(App);