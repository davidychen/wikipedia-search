import React, { Component } from "react";

import { Meteor } from "meteor/meteor";
import classnames from "classnames";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
// import AccountsUIWrapper from "./AccountsUIWrapper.jsx";

import { TopSearch } from "../api/wiki.js";

import {
  Button,
  Container,
  Badge,
  Card,
  CardTitle,
  CardText,
  Row,
  Col,
  Form,
  FormGroup,
  InputGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  ListGroup,
  ListGroupItem
} from "reactstrap";

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      typing: "",
      term: "",
      wikis: [],
      history: []
    };
  }

  onChange(event) {
    this.setState({ typing: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const text = document.getElementById("search").value;
    this.callMethod(text);
    this.setState(state => {
      const history = state.history;
      if (history.indexOf(text) < 0) {
        history.unshift(text);
      }
      return { history: history };
    });
  }

  callMethod(text) {
    Meteor.call("wikiSearch", text, (err, res) => {
      if (err) {
        console.log(err);
        return;
      }
      if (res) {
        this.setState({
          typing: res.title,
          term: res.title,
          links: res.links,
          content: res.text["*"]
        });
      }
      console.log(res);
    });
  }

  onClick(text) {
    this.callMethod(text);
    this.setState(state => {
      const history = state.history;
      if (history.indexOf(text) < 0) {
        history.unshift(text);
      }
      return { history: history };
    });
  }

  goHistory(i) {
    this.callMethod(this.state.history[i]);
    this.setState(state => {
      return { history: state.history.slice(i, state.history.length) };
    });
  }

  renderHistory() {
    // console.log(this.state.history);
    const content =
      this.state.history &&
      this.state.history.map((term, i) => {
        return (
          <ListGroupItem
            key={i}
            tag="button"
            action
            onClick={this.goHistory.bind(this, i)}
          >
            {term}
          </ListGroupItem>
        );
      });
    return (
      <Container className="links-container">
        <h3> History </h3>
        <ListGroup className="links">{content}</ListGroup>
      </Container>
    );
  }

  renderLinks() {
    const content =
      this.state.links &&
      this.state.links.map((link, i) => {
        return (
          <ListGroupItem
            key={i}
            tag="button"
            action
            onClick={this.onClick.bind(this, link["*"])}
          >
            {link["*"]}
          </ListGroupItem>
        );
      });
    return (
      <Container className="links-container">
        <h3> Links </h3>
        <ListGroup className="links">{content}</ListGroup>
      </Container>
    );
  }

  renderTops() {
    const content =
      this.props.searches &&
      this.props.searches.map((link, i) => {
        return (
          <ListGroupItem
            key={i}
            tag="button"
            className="justify-content-between"
            action
            onClick={this.onClick.bind(this, link.term)}
          >
            {link.term}
            <Badge pill>{link.count}</Badge>
          </ListGroupItem>
        );
      });
    return (
      <Container className="links-container">
        <h3> Top Searches </h3>
        <ListGroup className="links">{content}</ListGroup>
      </Container>
    );
  }

  renderHtml() {
    return (
      <Container className="content-container">
        <h2> Content: {this.state.term} </h2>
        <div dangerouslySetInnerHTML={{ __html: this.state.content }} />
      </Container>
    );
  }

  // renderWikis() {
  //   const content =
  //     this.state.wikis &&
  //     false &&
  //     this.state.wikis.query.search.map((wiki, i) => {
  //       const link = "http://en.wikipedia.org/?curid=" + wiki.pageid;
  //       return (
  //         <Col xs="12" sm="6" md="6" key={i}>
  //           <Card className="wiki">
  //             <CardTitle>
  //               <h2>{wiki.title}</h2>
  //             </CardTitle>
  //             <CardText className="snippet">{wiki.snippet}</CardText>
  //             <Button
  //               type="button"
  //               className="my-4"
  //               color="primary"
  //               href={link}
  //               target="_blank"
  //             >
  //               Go To
  //             </Button>
  //           </Card>
  //         </Col>
  //       );
  //     });
  //   return (
  //     <Container fluid>
  //       <Row>{content} </Row>
  //     </Container>
  //   );
  // }

  render() {
    console.log(this.props.searches);
    return (
      <div className="container">
        <header>
          <h1>Wikipedia Navigation</h1>

          {/*<AccountsUIWrapper />*/}

          <Form role="form">
            <FormGroup className="mb-3">
              <InputGroup
                className={classnames("input-group-alternative", {
                  "input-group-focus": this.state.nameFocus
                })}
              >
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fas fa-tag" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Search..."
                  id="search"
                  type="text"
                  value={this.state.typing}
                  onChange={this.onChange.bind(this)}
                  onFocus={() => this.setState({ nameFocus: true })}
                  onBlur={() => this.setState({ nameFocus: false })}
                />
              </InputGroup>
            </FormGroup>

            <div className="text-center">
              <Button
                className="my-4"
                color="primary"
                type="button"
                disabled={this.state.typing == ""}
                onClick={this.handleSubmit.bind(this)}
              >
                Search
              </Button>
            </div>
          </Form>
        </header>
        <Container>
          <Row>
            <Col xs="12" md="12" lg="3">
              <Container>
                {this.renderHistory()}
                {this.renderLinks()}
                {this.renderTops()}
              </Container>
            </Col>
            <Col xs="12" md="12" lg="9">
              {this.renderHtml()}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

App.propTypes = {
  searches: PropTypes.arrayOf(PropTypes.object)
};

export default withTracker(() => {
  Meteor.subscribe("top-search");

  return {
    searches: TopSearch.find({}, { sort: { count: -1 } }).fetch()
  };
})(App);
