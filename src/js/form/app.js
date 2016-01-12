import React from 'react';
import ReactDOM from 'react-dom';
import Fill from './components/Fill';
import Statement from './components/Statement';
import Choice from './components/Choice';
import Multi from './components/Multi';
import Select from './components/Select';

import _ from 'lodash';

const App = React.createClass({
  getInitialState() {
    return {
      title: '',
      description: '',
      questions: [],
      formAnswers: [],
      id: null,
      hasSuccess: false
    };
  },

  componentDidMount() {
    this.fetchForm();
  },

  fetchForm() {
    fetch(
      '/api/Forms/' + window.location.search.slice(4), { method: 'GET' }
    ).then((response) => response.json()).then((data) => {
      const { title, description, questions, id } = data;
      this.setState({
        title,
        description,
        questions,
        id,
        formAnswer: {
          answers: questions.map(()=>({ answer: '', changedTime: 0 })),
          start: (new Date).valueOf(),
          end: null
        }
      });
    });
  },

  handleSubmit(e) {
    e.preventDefault();
    const { formAnswer, id } = this.state;
    const { answers, start } = formAnswer;

    fetch('/api/Answers', {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        answers,
        start,
        formId: id,
        end: (new Date).valueOf()
      })
    }).then((response) => response.json()).then((data) => {
      if (data.id) {
        console.log(data.id);
        this.setState({ hasSuccess: true });
      }
    });
  },

  handleFormItemChange(i, opt, e) {
    const { answers } = this.state.formAnswer;

    answers[i] = {
      answer: e.target.value.trim(),
      changedTime: ++answers[i].changedTime
    };

    this.setState({answers});
  },

  renderFormItems() {
    const {questions, formAnswer} = this.state;

    return questions.map((v, i) => {
      let Question;
      switch (v.type) {
        case 'fill':
          Question = Fill;
          break;
        case 'statement':
          Question = Statement;
          break;
        case 'select':
          Question = Select;
          break;
        case 'choice':
          Question = Choice;
          break;
        case 'multi':
          Question = Multi;
          break;
        default:
          Question = null;
          break;
      }
      return Question == null ? null :
        <Question answer={formAnswer.answers[i]} key={i} index={i} question={v} handleChange={this.handleFormItemChange} />
    })
  },

  render() {
    const {title, description, hasSuccess} = this.state;

    return hasSuccess ? (
        <div className="col-sm-8 col-sm-offset-2" style={{ marginTop: '50px' }}>
          <div className="alert alert-success" role="alert">
            <p>
              <span>您已经成功填写表单：<strong>【{title}】</strong>！</span>
              <br/>
              <span><small>祝您生活愉快，再见！</small></span>
            </p>
          </div>
        </div>
      ) : (
        <div className="container">
          <div className="col-md-8 col-md-offset-2">
            <h2>{title}</h2>
            <p>{description}</p>
            <hr/>
            <form>
              {this.renderFormItems()}
              <div className="form-group text-center">
                <hr/>
                <button className="btn btn-primary" style={{ width: '100px' }} onClick={this.handleSubmit}>提&nbsp;交</button>
              </div>
            </form>
          </div>
        </div>
      );
  }
});

ReactDOM.render((<App />), document.getElementById('main'));
