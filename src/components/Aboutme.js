import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import '../styles/Aboutme.css';

const Aboutme = ({ user }) => (
  // UI TODO: Add more content
  <div className="container">
    <div className="jumbotron">
      <img
        className="img-responsive center-block img-circle profile-pic"
        alt=""
        src={`/public/users/${user.id}/profile.png`}
      />
      <h2 className="text-center">{user.name}</h2>
      <div>
        <ul className="nav nav-pills nav-justified" role="tablist">
          <li role="presentation"><a href="#contact" role="tab" data-toggle="tab">聯絡方式</a></li>
          <li role="presentation" className="active"><a href="#profile" role="tab" data-toggle="tab">基本資訊</a></li>
          <li role="presentation"><a href="#experience" role="tab" data-toggle="tab">經歷（未開放）</a></li>
        </ul>
        <div className="tab-content">
          <div role="tabpanel" className="tab-pane" id="contact">
            <h4>聯絡方式&nbsp;&nbsp;&nbsp;<Link to="/edit"><span className="glyphicon glyphicon-pencil"></span></Link></h4>
            <table className="table">
              <tbody>
                <tr>
                  <td>現在居住地</td>
                  <td>{user.residence || '未填寫'}</td>
                </tr>
                <tr>
                  <td>電話</td>
                  <td>{user.telephone || '未填寫'}</td>
                </tr>
                <tr>
                  <td>手機</td>
                  <td>{user.mobile || '未填寫'}</td>
                </tr>
                <tr>
                  <td>信箱</td>
                  <td>{user.email}</td>
                </tr>
                <tr>
                  <td>個人網頁</td>
                  <td>{user.webpage || '未填寫'}</td>
                </tr>
                <tr>
                  <td>Facebook</td>
                  <td>{user.facebook || '未填寫'}</td>
                </tr>
                <tr>
                  <td>Linkedin</td>
                  <td>{user.linkedin || '未填寫'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div role="tabpanel" className="tab-pane active" id="profile">
            <h4>基本資料&nbsp;&nbsp;&nbsp;<Link to="/edit"><span className="glyphicon glyphicon-pencil"></span></Link></h4>
            <table className="table">
              <tbody>
                <tr>
                  <td>姓名</td>
                  <td>{user.name}</td>
                </tr>
                <tr>
                  <td>學號</td>
                  <td>{user.school_id}</td>
                </tr>
                <tr>
                  <td>本科</td>
                  <td>{user.major}</td>
                </tr>
                <tr>
                  <td>Bio</td>
                  <td>{user.bio || '未填寫'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div role="tabpanel" className="tab-pane" id="experience">本區尚未開放！</div>
        </div>
      </div>
    </div>
  </div>
);

Aboutme.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.user
});

export default connect(mapStateToProps)(Aboutme);
