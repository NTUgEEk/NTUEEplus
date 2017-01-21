import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import OptionalLink from './OptionalLink';

import '../styles/Aboutme.css';

class ProfileDetail extends Component {

  static propTypes = {
    user: PropTypes.object,
    self: PropTypes.bool
  };

  constructor(props) {
    super(props);
  }

  renderEditButton() {
    if(!this.props.self) return null;
    return (
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<Link to="/edit"><span className="glyphicon glyphicon-pencil"></span></Link></span>
    );
  }

  renderWork() {
    if(!(this.props.user.work instanceof Array)) return (<div></div>);
    return this.props.user.work.map((work, idx) => {
      return (
        <div key={'work-' + idx}>
          <p>年份：{work.year} 公司：{work.place} 名稱：{work.name}</p>
          <p>經歷：{work.experience}</p>
          <hr />
        </div>
      );
    });
  }

  render() {
    return (
      // UI TODO: Add more content
      <div className="container">
        <div className="jumbotron">
          <img
            className="img-responsive center-block img-circle profile-pic"
            alt=""
            src={`/public/resource/default_profile.jpg`}
          />
          <h2 className="text-center">{this.props.user.name}</h2>
          <div>
            <ul className="nav nav-pills nav-justified" role="tablist">
              <li role="presentation"><a href="#contact" role="tab" data-toggle="tab">聯絡方式</a></li>
              <li role="presentation" className="active"><a href="#profile" role="tab" data-toggle="tab">基本資訊</a></li>
              <li role="presentation"><a href="#experience" role="tab" data-toggle="tab">經歷</a></li>
            </ul>
            <div className="tab-content">
              <div role="tabpanel" className="tab-pane" id="contact">
                <h4>聯絡方式{this.renderEditButton()}</h4>
                <table className="table">
                  <tbody>
                    <tr>
                      <td>現在居住地</td>
                      <td>{this.props.user.residence || '未填寫'}</td>
                    </tr>
                    <tr>
                      <td>電話</td>
                      <td>{this.props.user.telephone || '未填寫'}</td>
                    </tr>
                    <tr>
                      <td>手機</td>
                      <td>{this.props.user.mobile || '未填寫'}</td>
                    </tr>
                    <tr>
                      <td>信箱</td>
                      <td>{this.props.user.email}</td>
                    </tr>
                    <tr>
                      <td>個人網頁</td>
                      <td><OptionalLink href={this.props.user.webpage || '未填寫'} /></td>
                    </tr>
                    <tr>
                      <td>Facebook</td>
                      <td><OptionalLink href={this.props.user.facebook || '未填寫'} /></td>
                    </tr>
                    <tr>
                      <td>Linkedin</td>
                      <td><OptionalLink href={this.props.user.linkedin || '未填寫'} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div role="tabpanel" className="tab-pane active" id="profile">
                <h4>基本資料{this.renderEditButton()}</h4>
                <table className="table">
                  <tbody>
                    <tr>
                      <td>姓名</td>
                      <td>{this.props.user.name}</td>
                    </tr>
                    <tr>
                      <td>學號</td>
                      <td>{this.props.user.school_id}</td>
                    </tr>
                    <tr>
                      <td>本科</td>
                      <td>{this.props.user.major}</td>
                    </tr>
                    <tr>
                      <td>Bio</td>
                      <td>{this.props.user.bio || '未填寫'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div role="tabpanel" className="tab-pane" id="experience">
                <h4>在學經歷{this.renderEditButton()}</h4>
                <table className="table">
                  <tbody>
                    <tr>
                      <td>MS</td>
                      <td>{this.props.user.ms}</td>
                    </tr>
                    <tr>
                      <td>PhD</td>
                      <td>{this.props.user.phd}</td>
                    </tr>
                    <tr>
                      <td>研究領域</td>
                      <td>{this.props.user.research}</td>
                    </tr>
                  </tbody>
                </table>
                <h4>工作經歷{this.renderEditButton()}</h4>
                {this.renderWork()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default ProfileDetail;