import React from 'react';

export default (props) => {
  const {index, question, handleChange} = props;

  return (
    <div className='form-group'>
      <label>{index + 1 + '. ' + question.description}</label>
      <textarea
        rows='10'
        className='form-control'
        style={{resize:'none'}}
        onChange={handleChange.bind(null, index, null)}
        >
      </textarea>
    </div>
  );
}
