import { useState } from 'react';
const cloning = (data) => JSON.parse(JSON.stringify(data));
const useForm = ({ init, validate }) => {
  const [state, setState] = useState(mapValueToState(cloning(init)));

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    const oldState = cloning(state);

    if (type === 'checkbox') {
      oldState[name].value = 'checked';
    } else if (type === 'file') {
      previewFile(files, (data) => {
        oldState[name].value = data;
      });
    } else if (type === 'select-multiple') {
      console.log(oldState[name].value);
      if (oldState[name].value.includes(value)) {
        console.log(oldState[name].value, value);
        // oldState[name].value
      } else {
        oldState[name].value.push(value);
      }
      //   console.log();
    } else {
      oldState[name].value = value;
    }

    const { errors } = getErrors();
    if (oldState[name].touched && errors[name]) {
      oldState[name].error = errors[name];
    } else {
      oldState[name].error = '';
    }
    setState(oldState);
  };
  const handleFocused = (e) => {
    const { name } = e.target;

    // console.log('focused', name);
    const cloneState = cloning(state);
    cloneState[name].touched = true;
    cloneState[name].focused = true;
    setState(cloneState);
  };

  //   const handleblur = (e) => {
  //     const {
  //       target: { name },
  //     } = e;
  //     const cloneState = cloning(state);
  //     cloneState[name].focused = false;
  //     setState(cloneState);
  //   };

  const handleBlur = (e) => {
    const { name } = e.target;

    const { errors } = getErrors();

    const oldState = cloning(state);

    if (oldState[name].touched && errors[name]) {
      oldState[name].error = errors[name];
    } else {
      oldState[name].error = '';
    }

    oldState[name].focused = false;
    setState(oldState);
  };
  const getErrors = () => {
    let errors,
      hasError = null;

    const values = mapStateToKeys(state);
    if (typeof validate === 'boolean') {
      hasError = validate;
      errors = mapStateToKeys(state, 'error');
    } else if (typeof validate === 'function') {
      const errs = validate(values);

      hasError = isObjectEmpty(errs);
      errors = errs;
    } else {
      throw new Error('validate property must be boolean or function');
    }

    return { hasError, errors, values };
  };

  const handleSubmit = (e, cb) => {
    e.preventDefault();
    cb({
      ...getErrors(),
      touched: mapStateToKeys(state, 'touched'),
      focused: mapStateToKeys(state, 'focused'),
    });
  };
  return {
    errors: null,
    formState: state,
    handleChange,
    handleSubmit,
    handleFocused,
    handleBlur,
  };
};
export default useForm;

const mapValueToState = (values) =>
  Object.keys(values).reduce((a, c) => {
    a[c] = { value: values[c], error: '', focused: false, touched: false };
    return a;
  }, {});

const mapStateToKeys = (state, key = 'value') =>
  Object.keys(state).reduce((a, c) => ({ ...a, [c]: state[c][key] }), {});

const isObjectEmpty = (obj) => Object.keys(obj).length !== 0;

const previewFile = (files, cb) => {
  const returnData = [];
  for (const file of files) {
    const reader = new FileReader();
    reader.onload = () => {
      returnData.push({ preview: reader.result, file });
    };
    reader.readAsDataURL(file);
  }
  cb(returnData);
};
