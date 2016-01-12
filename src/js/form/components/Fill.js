import React from 'react';

export default (props) => {
  const {index, question, handleChange} = props;

  return (
    <div className='form-group'>
      <label>{index + 1 + '. ' + question.description}</label>
      <input
        type='text'
        className='form-control'
        onChange={handleChange.bind(null, index, null)}
        >
      </input>
    </div>
  );
}
