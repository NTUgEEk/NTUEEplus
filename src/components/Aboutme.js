import React, { PropTypes } from 'react';
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
        <ul className="nav nav-pills" role="tablist">
          <li role="presentation"><a href="#contact" aria-control="contact" role="tab" data-toggle="tab">聯絡方式</a></li>
          <li role="presentation" className="active"><a href="#profile" aria-control="profile" role="tab" data-toggle="tab">基本資訊</a></li>
          <li role="presentation"><a href="#experience" aria-control="experience" role="tab" data-toggle="tab">經歷（未開放）</a></li>
        </ul>
        <div className="tab-content">
          <div role="tabpanel" className="tab-pane" id="contact">
            <table className="table">
              <tbody>
                <tr>
                  <td>現在居住地</td>
                  <td>{user.name}</td>
                </tr>
                <tr>
                  <td>電話</td>
                  <td>{user.school_id}</td>
                </tr>
                <tr>
                  <td>手機</td>
                  <td>是</td>
                </tr>
                <tr>
                  <td>信箱</td>
                  <td></td>
                </tr>
                <tr>
                  <td>個人網頁</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Facebook</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Linkedin</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div role="tabpanel" className="tab-pane active" id="profile">
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
                  <td>是</td>
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
  user: state.user,
});

export default connect(mapStateToProps)(Aboutme);
