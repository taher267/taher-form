import React from 'react';
import useForm from '../hooks/useForm';
const init = {
  firstName: '',
  lastName: '',
  aggree: '',
  image: '',
  category: [],
};
const validate = (values) => {
  const { firstName, lastName, category } = values;
  const errors = {};
  if (!firstName) errors.firstName = `First name is required!`;
  if (!lastName) errors.lastName = `Last name is required!`;
  if (!category) errors.category = `Category is required!`;
  return errors;
};
const Form = () => {
  const { formState, handleChange, handleFocused, handleBlur, handleSubmit } =
    useForm({
      init,
      validate,
    });
  //   console.log(formState);
  return (
    <div>
      <form
        onSubmit={(e) =>
          handleSubmit(e, ({ values, hasError }) => {
            console.log(values);
          })
        }
      >
        <input
          style={{ borderColor: formState?.firstName?.error ? 'red' : '' }}
          type="text"
          name="firstName"
          value={formState.firstName.value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocused}
        />

        <input
          style={{ borderColor: formState?.lastName?.error ? 'red' : '' }}
          type="text"
          name="lastName"
          value={formState.lastName.value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocused}
        />

        <input
          style={{ borderColor: formState?.aggree?.error ? 'red' : '' }}
          type="checkbox"
          name="aggree"
          value={formState.aggree.value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocused}
        />

        <input
          style={{ borderColor: formState?.image?.error ? 'red' : '' }}
          type="file"
          multiple
          name="image"
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocused}
        />

        <select
          style={{ borderColor: formState?.category?.error ? 'red' : '' }}
          multiple
          name="category"
          value={formState?.category?.value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocused}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        {formState?.image?.value?.length
          ? formState?.image?.value?.map(({ preview }, i) => (
              <img key={i} width={50} src={preview} alt="fdkjf" />
            ))
          : ''}
        <button>submit</button>
      </form>
    </div>
  );
};

export default Form;
