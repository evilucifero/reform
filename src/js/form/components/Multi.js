import React from 'react';

export default (props) => {
  const {index, question, handleChange, answer} = props;

  return (
    <div className='form-group'>
      <label>{index + 1 + '. ' + question.description}</label>
      {
        question.content.map((v, i) => (
          <div className='checkbox' key={i}>
            <label>
              <input
                type='checkbox'
                value={v}
                onChange={handleChange.bind(null, index, null)}
                checked={question.content.indexOf(answer.answer) === i}
                />
              <span>{v}</span>
            </label>
          </div>
        ))
      }
    </div>
  );
}
