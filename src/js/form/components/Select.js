import React from 'react';

export default (props) => {
  const {index, question, handleChange} = props;

  return (
    <div className='form-group'>
      <label>{index + 1 + '. ' + question.description}</label>
      <select
        className='form-control'
        onChange={handleChange.bind(null, index, null)}>
        {
          question.content.map((v, i) => (
            <option key={i} value={v}>{v}</option>
          ))
        }
      </select>
    </div>
  );
}
