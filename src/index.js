import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Form(props) {
  const { form } = props;
  const [formValues, setFormValues] = useState({});
  const [message, setMessage] = useState('');


  form.sort((a, b) => {
    return a.order - b.order;
  });

  const updateFormValues = (e) => {
    const currentFormValues = {...formValues};
    let newValue = e.target.value;

    if (e.target.multiple) {
      let options = e.target.options;
      let value = [];
      for (let i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
          value.push(options[i].value);
        }
      }
      newValue = value;
    }

    currentFormValues[e.target.name] = newValue;

    setFormValues(currentFormValues);
  };

  const submitForm = (e) => {
    e.preventDefault();
    setMessage('');
    let missingFields = '';

    for (let i = 0; i < form.length; i++) {
      const input = form[i];

      if (input.required) {
        let hasInput = false;
        if (input.type === 'multiselect') {
          hasInput = formValues[input.field].length > 0;
        } else {
          hasInput = (formValues[input.field] && formValues[input.field] !== '');
        }
        if (!hasInput) {
          if (missingFields === '') {
            missingFields = 'Please enter your';
          }
          missingFields += ` ${input.display_name},`;
        }
      }
    }
    missingFields = `${missingFields.substr(0, missingFields.length - 1)}.`;

    if (missingFields === '') {
      console.log(missingFields);
    } else {
      setMessage(missingFields);
    }
  };

  const formElements = form.map((input) => {
    let inputEl;
    let field = input.field;
    if (input.type === 'string' || input.type === 'number') {
      inputEl = (
        <input 
          type={input.type} 
          name={field} 
          id={field}
          onChange={updateFormValues} 
        />
      );
    } else if (input.type === 'text') {
      inputEl = (
        <textarea 
          name={field} 
          id={field} 
          onChange={updateFormValues}>
        </textarea>
      );
    } else if(input.type === 'select' || input.type === 'multiselect') {
      const options = input.options.map((option) => {
        return (<option value={option} key={option}>{option}</option>);
      });
      
      if (input.type === 'select') {
        options.unshift(<option value='' key='empty'></option>);
        inputEl = (
          <select 
            name={field} 
            id={field} 
            onChange={updateFormValues}
          >
            {options}
          </select>
        );
      } else {
        inputEl = (
          <select 
            name={field} 
            id={field} 
            onChange={updateFormValues} 
            multiple
          >
            {options}
          </select>
        );
      }
    }

    return (
      <div key={input.field}>
        <label htmlFor={input.field}>{input.display_name}</label>
        <br />
        {inputEl}
      </div>
    );
  });


  return (
    <div className='page'>
      <div className='formContainer'>
        <form>
          {message.length > 0 &&
            <div>{message}</div>
          }
          {formElements}
          <button onClick={submitForm}>Submit Form</button>
        </form>
      </div>
      <div className='remainingSpace'></div>
    </div>
  );
}


function App(props) {
  const form = [
    {
      order: 2,
      field: 'last_name',
      display_name: 'Last Name',
      type: 'string',
      required: true
    },
    {
      order: 1,
      field: 'first_name',
      display_name: 'First Name',
      type: 'string',
      required: true
    },
    {
      order: 5,
      field: 'notes',
      display_name: 'Notes',
      type: 'text',
      required: false,
    },
    {
      order: 3,
      field: 'age',
      display_name: 'Age',
      type: 'number',
      required: false
    },
    {
      order: 3,
      field: 'user_type',
      display_name: 'User Type',
      type: 'select',
      required: false,
      options: [
        'shareholder',
        'investor',
        'other'
      ]
    },
    {
      order: 4,
      field: 'investing_experience',
      display_name: 'Investing Experience',
      type: 'multiselect',
      required: false,
      options: [
        'public_markets',
        'early_stage_private',
        'late_stage_private'
      ]
    },
  ];

  return (
    <div className="App">
      <Form form={form}></Form>
    </div>
  );

}



ReactDOM.render(<App />, document.getElementById('app'));
