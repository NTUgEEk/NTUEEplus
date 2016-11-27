import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import LinkedStateMixin from 'react-addons-linked-state-mixin';

import { fetchJSON } from '../utils';
import { setUser } from '../redux/actions';

import '../styles/Aboutme.css';

class ProfileEdit extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  static propTypes = {
    setUser: React.PropTypes.func,
  };

  constructor(props) {
    console.log(props);

    super(props);

    this.state = {
      major: props.user.major || '',
      bio: props.user.bio || '',
      residence: props.user.residence || '',
      telephone: props.user.telephone || '',
      mobile: props.user.mobile || '',
      email: props.user.email,
      webpage: props.user.webpage || '',
      facebook: props.user.facebook || '',
      linkedin: props.user.linkedin || '',
      error: false
    };

    this.handleMajorChange = this.handleMajorChange.bind(this);
    this.handleBioChange = this.handleBioChange.bind(this);
    this.handleResidenceChange = this.handleResidenceChange.bind(this);
    this.handleTelephoneChange = this.handleTelephoneChange.bind(this);
    this.handleMobileChange = this.handleMobileChange.bind(this);
    this.handleWebpageChange = this.handleWebpageChange.bind(this);
    this.handleFacebookChange = this.handleFacebookChange.bind(this);
    this.handleLinkedinChange = this.handleLinkedinChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleMajorChange(e) {
    this.setState({ major: e.target.value });
  }

  handleBioChange(e) {
    this.setState({ bio: e.target.value });
  }

  handleResidenceChange(e) {
    this.setState({ residence: e.target.value });
  }

  handleTelephoneChange(e) {
    this.setState({ telephone: e.target.value });
  }

  handleMobileChange(e) {
    this.setState({ mobile: e.target.value });
  }

  handleWebpageChange(e) {
    this.setState({ webpage: e.target.value });
  }

  handleFacebookChange(e) {
    this.setState({ facebook: e.target.value });
  }

  handleLinkedinChange(e) {
    this.setState({ linkedin: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    this.setState({ error: false });

    let data = {
      major: this.state.major,
      bio: this.state.bio,
      residence: this.state.residence,
      telephone: this.state.telephone,
      mobile: this.state.mobile,
      webpage: this.state.webpage,
      facebook: this.state.facebook,
      linkedin: this.state.linkedin
    };

    fetchJSON(
      '/api/edit',
      data,
      (json) => {
        if(json.status !== 'success') {
          this.setState({ error: true });
          return;
        }
        this.props.setUser(json.user);
        this.context.router.push('/');
      }
    );
  }

  renderError() {
    if(!this.state.error) return null;
    return (
      <p className="text-danger">系統發生錯誤，請稍後再試。</p>
    );
  }

  render() {
    return (
      // UI TODO: Add more content
      <div className="container">
        <div className="jumbotron">
          <h2 className="text-center">編輯個人資料</h2>
          <form role="form" onSubmit={this.onSubmit}>
            <h3>基本資訊</h3>
            <div className="form-group row">
              <label htmlFor="inputMajor" className="col-sm-2 control-label">姓名</label>
              <div className="col-sm-10">
                {this.props.user.name}
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputMajor" className="col-sm-2 control-label">學號</label>
              <div className="col-sm-10">
                {this.props.user.school_id}
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputMajor" className="col-sm-2 control-label">本科</label>
              <div className="col-sm-10">
                <input type="text" onChange={this.handleMajorChange} value={this.state.major} className="form-control" id="inputMajor" placeholder="是、輔系、雙主修..." />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputBio" className="col-sm-2 control-label">Bio</label>
              <div className="col-sm-10">
                <textarea onChange={this.handleBioChange} value={this.state.bio} className="form-control" id="inputBio" placeholder="（選填）"></textarea>
              </div>
            </div>
            <h3>聯絡資料</h3>
            <div className="form-group row">
              <label htmlFor="inputResidence" className="col-sm-2 control-label">現在居住地</label>
              <div className="col-sm-10">
                <input type="text" onChange={this.handleResidenceChange} value={this.state.residence} className="form-control" id="inputResidence" placeholder="e.g. 麻薩諸塞州,美國 深圳,中國..." />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputTelephone" className="col-sm-2 control-label">電話</label>
              <div className="col-sm-10">
                <input type="text" onChange={this.handleTelephoneChange} value={this.state.telephone} className="form-control" id="inputTelephone" placeholder="02-33661234..." />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputMobile" className="col-sm-2 control-label">手機</label>
              <div className="col-sm-10">
                <input type="text" onChange={this.handleMobileChange} value={this.state.mobile} className="form-control" id="inputMobile" placeholder="0912-345-678..." />
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-2 control-label">信箱</label>
              <div className="col-sm-10">
                {this.props.user.email}（如要修改，請至帳號設定）
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputWebpage" className="col-sm-2 control-label">個人網頁</label>
              <div className="col-sm-10">
                <input type="text" onChange={this.handleWebpageChange} value={this.state.webpage} className="form-control" id="inputWebpage" placeholder="http://github.io/" />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputFacebook" className="col-sm-2 control-label">Facebook</label>
              <div className="col-sm-10">
                <input type="text" onChange={this.handleFacebookChange} value={this.state.facebook} className="form-control" id="inputFacebook" placeholder="http://fb.me/HiNTUEE" />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputLinkedin" className="col-sm-2 control-label">LinkedIn</label>
              <div className="col-sm-10">
                <input type="text" onChange={this.handleLinkedinChange} value={this.state.linkedin} className="form-control" id="inputLinkedin" placeholder="https://www.linkedin.com/" />
              </div>
            </div>
            {this.renderError()}
            <button type="submit" className="btn btn-primary">確定送出</button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  setUser: (user) => dispatch(setUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEdit);
