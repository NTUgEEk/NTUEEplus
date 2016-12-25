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
      ms: props.user.ms || '',
      phd: props.user.phd || '',
      research: props.user.research || '',
      work: props.user.work || [],
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
    this.handleMsChange = this.handleMsChange.bind(this);
    this.handlePhdChange = this.handlePhdChange.bind(this);
    this.handleResearchChange = this.handleResearchChange.bind(this);
    this.handleWorkYearChange = this.handleWorkYearChange.bind(this);
    this.handleWorkPlaceChange = this.handleWorkPlaceChange.bind(this);
    this.handleWorkNameChange = this.handleWorkNameChange.bind(this);
    this.handleWorkExperienceChange = this.handleWorkExperienceChange.bind(this);
    this.handleWorkAdd = this.handleWorkAdd.bind(this);
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

  handleMsChange(e) {
    this.setState({ ms: e.target.value });
  }

  handlePhdChange(e) {
    this.setState({ phd: e.target.value });
  }

  handleResearchChange(e) {
    this.setState({ research: e.target.value });
  }

  handleWorkYearChange(idx, e) {
    var work = this.state.work.slice();
    work[idx].year = e.target.value;
    this.setState({ work: work });
  }

  handleWorkPlaceChange(idx, e) {
    var work = this.state.work.slice();
    work[idx].place = e.target.value;
    this.setState({ work: work });
  }

  handleWorkNameChange(idx, e) {
    var work = this.state.work.slice();
    work[idx].name = e.target.value;
    this.setState({ work: work });
  }

  handleWorkExperienceChange(idx, e) {
    var work = this.state.work.slice();
    work[idx].experience = e.target.value;
    this.setState({ work: work });
  }

  handleWorkAdd() {
    var work = this.state.work.slice();
    work.push({
      year: '',
      place: '',
      name: '',
      experience: ''
    });
    this.setState({ work: work });
  }

  handleWorkRemove(idx) {
    var work = this.state.work.slice();
    work.splice(idx, 1);
    this.setState({ work: work });
  }

  renderWork() {
    return this.state.work.map((work, idx) => {
      return (
        <div key={'work-' + idx}>
          <div className="form-group row">
            <label className="col-sm-2 control-label">工作 {idx+1} <a href="javascript:void(0)" onClick={this.handleWorkRemove.bind(this, idx)}>x</a></label>
            <div className="col-sm-10">
              <div className="row">
                <div className="col-sm-3">
                  <input type="text" onChange={this.handleWorkYearChange.bind(this, idx)} value={work.year} className="form-control" placeholder="年份" />
                </div>
                <div className="col-sm-3">
                  <input type="text" onChange={this.handleWorkPlaceChange.bind(this, idx)} value={work.place} className="form-control" placeholder="公司" />
                </div>
                <div className="col-sm-6">
                  <input type="text" onChange={this.handleWorkNameChange.bind(this, idx)} value={work.name} className="form-control" placeholder="職稱" />
                </div>
              </div>
            </div>
          </div>
          <div className="form-group row">
            <div className="col-sm-2">&nbsp;</div>
            <div className="col-sm-10">
              <textarea onChange={this.handleWorkExperienceChange.bind(this, idx)} value={work.experience} className="form-control" placeholder="經歷"></textarea>
            </div>
          </div>
        </div>
      );
    });
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
      linkedin: this.state.linkedin,
      ms: this.state.ms,
      phd: this.state.phd,
      research: this.state.research,
      work: this.state.work
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
            <h3>經歷</h3>
            <h4>在學經歷（選填）</h4>
            <div className="form-group row">
              <label htmlFor="inputMs" className="col-sm-2 control-label">MS</label>
              <div className="col-sm-10">
                <input type="text" onChange={this.handleMsChange} value={this.state.ms} className="form-control" id="inputMs" placeholder="MS" />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputPhd" className="col-sm-2 control-label">PhD</label>
              <div className="col-sm-10">
                <input type="text" onChange={this.handlePhdChange} value={this.state.phd} className="form-control" id="inputPhd" placeholder="PhD" />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputResearch" className="col-sm-2 control-label">研究領域</label>
              <div className="col-sm-10">
                <select onChange={this.handleResearchChange} value={this.state.research} className="form-control" id="inputResearch">
                  <option value="通訊">通訊</option>
                  <option value="積體電路系統">積體電路系統</option>
                  <option value="電子設計自動化">電子設計自動化</option>
                  <option value="光電">光電</option>
                  <option value="半導體">半導體</option>
                  <option value="電波">電波</option>
                  <option value="生醫工程">生醫工程</option>
                  <option value="電力工程">電力工程</option>
                  <option value="計算機科學">計算機科學</option>
                  <option value="物理">物理</option>
                  <option value="化學">化學</option>
                  <option value="材料">材料</option>
                  <option value="工業工程">工業工程</option>
                  <option value="工商管理">工商管理</option>
                  <option value="人文社會">人文社會</option>
                  <option value="經濟財金">經濟財金</option>
                  <option value="遊戲設計">遊戲設計</option>
                  <option value="航太工程">航太工程</option>
                  <option value="數位訊號處理">數位訊號處理</option>
                  <option value="影像處理">影像處理</option>
                  <option value="電腦視覺">電腦視覺</option>
                  <option value="人機互動">人機互動</option>
                  <option value="機器學習">機器學習</option>
                  <option value="純數領域">純數領域</option>
                  <option value="應數領域">應數領域</option>
                  <option value="藝術">藝術</option>
                </select>
              </div>
            </div>
            <h4>工作經歷（選填）<a href="javascript:void(0)" onClick={this.handleWorkAdd}>+</a></h4>
            {this.renderWork()}
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
