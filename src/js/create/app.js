import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

const ItemType = {
  'fill': '简答题',
  'statement': '陈述题',
  'choice': '选择题'
}

const Create = React.createClass({
  getInitialState() {
    return {
      title: '',
      description: '',
      questions: [],
      hasSuccess: false,
      id: null,
      serial: null
    };
  },

  handleItemAdd(type, e) {
    e.preventDefault();
    const tmpState = _.cloneDeep(this.state);
    tmpState.questions.push({ type: type, description: '', content: [] });
    this.setState(tmpState);
  },

  handleItemUp(i, e) {
    e.preventDefault();
    if (i > 0) {
      const tmpState = _.cloneDeep(this.state);
      tmpState.questions.splice(i - 1, 0, tmpState.questions.splice(i, 1)[0]);
      this.setState(tmpState);
    }
  },

  handleItemDown(i, e) {
    e.preventDefault();
    if (i < this.state.questions.length - 1) {
      const tmpState = _.cloneDeep(this.state);
      tmpState.questions.splice(i + 1, 0, tmpState.questions.splice(i, 1)[0]);
      this.setState(tmpState);
    }
  },

  handleItemRemove(i, e) {
    e.preventDefault();
    const tmpState = _.cloneDeep(this.state);
    tmpState.questions.splice(i, 1);
    this.setState(tmpState);
  },

  handleItemContentChange(i, j, e) {
    const tmpState = _.cloneDeep(this.state);
    tmpState.questions[i].content[j] = e.target.value.trim();
    this.setState(tmpState);
  },

  handleItemContentRemove(i, j, e) {
    e.preventDefault();
    const tmpState = _.cloneDeep(this.state);
    tmpState.questions[i].content.splice(j, 1);
    this.setState(tmpState);
  },

  handleItemContentAdd(i, e) {
    e.preventDefault();
    const tmpState = _.cloneDeep(this.state);
    tmpState.questions[i].content.push('');
    this.setState(tmpState);
  },

  handleItemDescription(i, e) {
    const tmpState = _.cloneDeep(this.state);
    tmpState.questions[i].description = e.target.value.trim();
    this.setState(tmpState);
  },

  handleTitle(e) {
    this.setState({ title: e.target.value.trim() });
  },

  handleDescription(e) {
    this.setState({ description: e.target.value.trim() });
  },

  handleSubmit(e) {
    e.preventDefault();

    const { title, description, questions } = this.state;

    fetch('/api/Forms', {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        description,
        questions
      })
    }).then((response) => response.json()).then((data) => {
      if (data.id) {
        this.setState({ id: data.id, hasSuccess: true });
      }
    });
  },

  renderAlert() {
    const { title, id } = this.state;

    return (
        <div className="col-sm-8 col-sm-offset-2" style={{ marginTop: '50px' }}>
          <div className="alert alert-success" role="alert">
            <h1>恭喜你！</h1>
            <p>
              <span>您已经成功创建表单：<strong>【{title}】</strong></span>
              <br/>
              <span>表单唯一识别码为：<strong>【{id}】</strong></span>
              <br/>
              <span>您可以点击&nbsp;<a href={'/form.html?id=' + id}>本链接</a>&nbsp;快速访问表单</span>
              <br/>
              <span>您可以访问&nbsp;<a href={'/admin.html?id=' + id}>本链接</a>&nbsp;查看管理后台</span>
              <br/>
              <span>您可以访问&nbsp;<a href={'/qrcode.html?id=' + id} target="_blank">二维码</a>&nbsp;为移动用户提供服务</span>
            </p>
          </div>
        </div>
    );
  },

  renderForm () {
    const { title, description, questions } = this.state;

    return (
      <div className="container">
        <h3 style={{color: '#3cc'}}>&emsp;&emsp;新建表单</h3>
        <hr />
        <form className="form-horizontal">
          <div className="form-group">
            <label className="col-sm-2 control-label">表单标题</label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                placeholder="请输入表单标题"
                onChange={this.handleTitle}
                value={title}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label">表单描述</label>
            <div className="col-sm-10">
              <textarea
                rows="4"
                className="form-control"
                style={{resize:'none'}}
                placeholder="请输入表单描述"
                onChange={this.handleDescription}
                value={description}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label">表单结构</label>
            <div className="col-sm-10">
              <div className="well">
                <ol>
                  {
                    questions.map((v, i) => (
                      <li key={i}>
                        <div className="form-group">
                          <label className="col-sm-2 control-label">
                            {ItemType[v.type]}
                          </label>
                          <div className="col-sm-10">
                            <button className="btn btn-default" onClick={this.handleItemUp.bind(this, i)}>
                              <span className="glyphicon glyphicon-arrow-up"></span>
                            </button>
                            &nbsp;
                            <button className="btn btn-default" onClick={this.handleItemDown.bind(this, i)}>
                              <span className="glyphicon glyphicon-arrow-down"></span>
                            </button>
                            &nbsp;
                            <button className="btn btn-danger" onClick={this.handleItemRemove.bind(this, i)}>
                              <span className="glyphicon glyphicon-remove"></span>
                            </button>
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-sm-2 control-label">题干</label>
                          <div className="col-sm-10">
                            <input
                              className="form-control"
                              type="text"
                              placeholder="请输入题干"
                              onChange={this.handleItemDescription.bind(this, i)}
                              value={v.description}
                            />
                          </div>
                        </div>
                        {
                          v.type === 'choice' ? (
                            <div className="form-group">
                              <label className="col-sm-2 control-label">选项</label>
                              <div className="col-sm-10">
                                <p>
                                  <button
                                    className="btn
                                    btn-default"
                                    type="button"
                                    onClick={this.handleItemContentAdd.bind(this, i)}
                                  >
                                    <span className="glyphicon glyphicon-plus"></span>
                                    <span>&nbsp;增加选项</span>
                                  </button>
                                </p>
                                <div>
                                  {
                                    v.content.map((w, j) => (
                                      <div key={j}>
                                        <div className="input-group">
                                          <span className="input-group-btn">
                                            <button
                                              className="btn btn-default"
                                              type="button"
                                              onClick={this.handleItemContentRemove.bind(this, i, j)}
                                            >
                                              <span className="glyphicon glyphicon-minus"></span>
                                            </button>
                                          </span>
                                          <input
                                            type="text"
                                            className="form-control"
                                            onChange={this.handleItemContentChange.bind(this, i, j)}
                                            value={w}
                                          />
                                        </div>
                                      </div>
                                    ))
                                  }
                                </div>
                              </div>
                            </div>
                          ) : null
                        }
                      </li>
                    ))
                  }
                </ol>
                <hr/>
                <button className="btn btn-default" onClick={this.handleItemAdd.bind(this, 'fill')}>
                  <span className="glyphicon glyphicon-plus"></span>
                  <span>&nbsp;简答题</span>
                </button>
                &nbsp;
                <button className="btn btn-default" onClick={this.handleItemAdd.bind(this, 'statement')}>
                  <span className="glyphicon glyphicon-plus"></span>
                  <span>&nbsp;陈述题</span>
                </button>
                &nbsp;
                <button className="btn btn-default" onClick={this.handleItemAdd.bind(this, 'choice')}>
                  <span className="glyphicon glyphicon-plus"></span>
                  <span>&nbsp;选择题</span>
                </button>
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button className="btn btn-primary" style={{width:'100px'}} onClick={this.handleSubmit}>
                <span>创 建</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  },

  render() {
    return this.state.hasSuccess ? this.renderAlert() : this.renderForm();
  }

});

ReactDOM.render(<Create />, document.getElementById('main'));
