import React, { Component, Fragment } from "react";
// import { socket } from "../../services/socket";
// import $ from "jquery";
import { Divider, Avatar, Grid, Paper } from "@material-ui/core";
// import "./chat.css";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageList: [],
      message: "",
    };
  }

  handleChange = (event) => {
    this.setState({ message: event.target.value });
  };
  handleNewUserMessage = () => {
    // $("#comment").val("");
    const { message } = this.state;
    console.log(message);
    this.props.addComment(message);
  };
  render() {
    const { comment } = this.props || [];
    console.log(comment);
    return (
      <div>
        <div className="p-2 bg-primary">
          <h5 align="center">Comments</h5>
        </div>
        <div
          style={{
            width: "250px",
            height: "200px",
            overflowY: "auto",
            overflowX: "hidden",
            padding: "10px",
          }}
        >
          <Paper>
            {comment &&
              comment.map((item, id) => {
                return (
                  <Fragment>
                    <Grid container wrap="nowrap" spacing={2}>
                      <Grid item>
                        <Avatar alt="Remy Sharp" />
                      </Grid>
                      <Grid justifyContent="left" item xs zeroMinWidth>
                        <div style={{ margin: 0, textAlign: "left" }}>
                          <h5>{item.userId.username}</h5>
                        </div>
                        <p style={{ textAlign: "left" }}>{item.body}</p>
                        <p style={{ textAlign: "left", color: "gray" }}></p>
                      </Grid>
                    </Grid>
                    <Divider variant="fullWidth" style={{ margin: "15px 0" }} />
                  </Fragment>
                );
              })}
          </Paper>
        </div>
        <div class="type_msg p-1">
          <div class="input_msg_write">
            <TextareaAutosize
              rowsMax={2}
              aria-label="maximum height"
              class="write_msg"
              placeholder="Type a message"
              id="comment"
              style={{ width: "85%" }}
              onChange={(e) => this.handleChange(e)}
            />

            <button
              class="msg_send_btn"
              type="button"
              onClick={this.handleNewUserMessage}
            >
              <i class="fa fa-paper-plane-o" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
