import React, { PropTypes, Component } from 'react';

import * as userService from '../services/user';

class APIView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        {
          name: 'Like(v1 removal)',
          fn: () => {
            return userService.like({
              code: '520',
            }, 1);
          },
        },
        {
          name: 'Like(v2 deprecate)',
          fn: () => {
            return userService.like({
              code: '520',
            }, 2);
          },
        },
        {
          name: 'Like(v3 latest)',
          fn: () => {
            return userService.like({
              code: '520',
            }, 3);
          },
        },
      ],
    };
  }
  render() {
    const {
      items,
      result,
      response,
    } = this.state;
    const list = _.map(items, (item, i) => {
      return (
        <li
          key={i}
        >
          <a
            href="javascript:;"
            onClick={(e) => {
              e.preventDefault();
              item.fn().then((data) => {
                this.setState({
                  result: 'success',
                  response: data,
                });
              }).catch((err) => {
                this.setState({
                  result: 'fail',
                  response: err.response.body,
                });
              });
            }}
          >
            {item.name}
          </a>
        </li>
      );
    });
    return (
      <div className="api-view">
        <ul>
          { list }
        </ul>
        <div className="preview">
          <p>result:{result}</p>
          <pre className="response">
            { JSON.stringify(response, null, 2) }
          </pre>
        </div>
      </div>
    );
  }
}

export default APIView;
