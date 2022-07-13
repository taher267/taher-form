import React from 'react';
import './App.css';
import useForm from './useForm';


function App() {
  const validate = values => {
    const errors = {};
    if (!values.name) errors.name = `Required!`;
    if (!values.bio) errors.bio = `Required!`;
    if (!values.agree) errors.agree = `Required!`;
    if (!values.gender) errors.gender = `Required!`;
    if (!values.email) errors.email = `Required!`;
    if (!values?.images?.length) errors.images = `Required!`;
    if (!values?.skills?.length) errors.skills = `Required!`;
    return errors;
  }
  const init = {
    name: '',
    email: '',
    bio: '',
    images: [],
    skills: [],
    gender: '',
    agree: false,
  }

  const {
    formState: state,
    changeHandler,
    blurHandler,
    focusHandler,
    submitHandler,
    previewDelete
  } = useForm({ init, validate });
  // console.log(state);
  return <>
    <form onSubmit={submitHandler}>
      <div className="form-floating">
        <TInput
          name="name"
          className={state?.name?.error ? 'form-control is-invalid' : 'form-control'}
          value={state?.name?.value}
          // error={state?.name?.error}
          onChange={changeHandler}
          onBlur={blurHandler}
          onFocus={focusHandler}

        />
        <label htmlFor="name" className={state?.name?.error && 'invalid-feedback'}>Full Name {state?.name?.error}</label>
      </div>

      <div className="form-floating">

        <TInput
          name="email"
          type="email"
          className='form-control'
          value={state?.email.value}
          error={state?.email.error}
          onChange={changeHandler}
          onBlur={blurHandler}
          onFocus={focusHandler}
        />
        <label htmlFor="email">Email address</label>
      </div>
      <div>
        <TInput
          label="Images"
          name="images"
          type='file'
          onChange={changeHandler}
          onBlur={blurHandler}
          onFocus={focusHandler}
          preview={{ data: state?.images?.value, width: '100px', height: '100px', previewDelete }}
        />
      </div>
      <div>
        <TInput
          label="Bio"
          name="bio"
          type='textarea'
          error={state?.bio.error}
          classes={{ field: 'form-control', label: '', error: 'is-invalid', feedback: 'invalid-feedback d-block' }}
          onChange={changeHandler}
          onBlur={blurHandler}
          onFocus={focusHandler}
        />
      </div>
      <TInput
        label="Gender"
        name="gender"
        radios={['male', 'female', 'other']}
        type='radio'
        onChange={changeHandler}
        onBlur={blurHandler}
        onFocus={focusHandler}
      />

      {/* <div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
  <label class="form-check-label" for="flexCheckDefault">
    Default checkbox
  </label>
</div>
<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked/>
  <label class="form-check-label" for="flexCheckChecked">
    Checked checkbox
  </label>
</div> */}
      <div className="form-check">
        <TInput
          label="Skills"
          name="skills"
          checks={['html', 'css', 'javascript']}
          classes={{ field: '', label: '', error: 'is-invalid', feedback: 'invalid-feedback d-inline' }}
          type='checkbox'
          onChange={changeHandler}
          onBlur={blurHandler}
          onFocus={focusHandler}
          value={state?.skills?.value}
          error={state?.skills?.error}
        />
      </div>
      <TInput
        label="Agree"
        name="agree"
        type='checkbox'
        onChange={changeHandler}
        onBlur={blurHandler}
        onFocus={focusHandler}
        value={state.agree}
      />

      <input type='submit' value="Submit" />
    </form>
  </>
}
/**
 * 
 * @property {Array} radios 
 * @property {Array} checks
 * @property {boolean} multiple
 * @returns 
 */
function TInput({ label, name, type, multiple, placeholder, className, classes, style, value, radios, checks, rows, cols, preview, onChange, onBlur, onFocus, error }) {
  const inputProps = {
    name,
    id: name,
    type: type && type !== 'textarea' ? type : 'text',
    placeholder: placeholder ?? name,
    multiple: multiple ?? false,
    // value,
    style,
    className: className ? className : classes?.field + (error && classes?.error ? ' ' + classes?.error : '') ?? '',
    error,
    onChange,
    onBlur,
    onFocus

  }
  if (type === 'radio') {
    if (Array.isArray(radios)) {
      return radios.map((radio, i) => <span {...inputProps} key={i}>
        <input type="radio" id={name + i} name={name} value={radio} />
        {label && <label htmlFor={name + i}>{radio}</label>}
      </span>)
    }
  } else if (type === 'textarea') {
    delete inputProps.value;
    if (rows) inputProps.rows = rows
    if (cols) inputProps.cols = cols
    return <>
      {label && <label htmlFor={name} className={error && classes?.feedback}>{label + (error ? " " + error : '')}</label>}
      <textarea {...inputProps} />
    </>
  } else if (type === 'checkbox') {
    // delete inputProps.value;
    if (Array.isArray(checks)) {
      return checks.map((check, i) => <div {...inputProps} key={i}>
        <input type="checkbox" {...inputProps} id={check} value={check} checked={value.includes(check)} name={name} />
        {label && <label htmlFor={check} className={error && classes?.feedback}>{check}</label>}
      </div>)
    }
  }
  return <>
    {label && <label htmlFor={name} className={error && classes?.feedback}>{label + (' ' + error ?? '')}</label>}
    <input {...inputProps} />
    {preview?.data?.length ? <PreviewImages {...preview} /> : ''}
  </>
}

export default App;

const PreviewImages = ({ data, previewDelete, height, width }) => {
  return <div>{Array.isArray(data) ? data.map((img, i) => {
    return <div key={i} style={{ position: 'relative', display: 'inline-block' }}><span onClick={e => previewDelete(e, i)} style={{ position: 'absolute', right: 0, zIndex: 6, color: 'red', top: 0, cursor: 'pointer' }}>X</span> <img src={img} alt="" height={height} width={width} /></div>
  }) : <div><span>X</span> <img width={width ?? '100%'} height={height ?? 'auto'} src={data} alt='' /></div>}</div>

}


