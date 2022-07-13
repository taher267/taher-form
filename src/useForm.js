import React from 'react';
/**
 * 
 * @typedef {Object} Param
 * @property {Object} init
 * @property {(Object|boolean)} validate
 * Create forms using useForm
 * @param {Param} param
 * @returns 
 */
export default function useForm({ init, validate }) {
    const [state, setState] = React.useState(mapValuesToState(init));

    const oldState = JSON.parse(JSON.stringify(state));
    const changeHandler = ({ target }) => {
        if (target?.type === 'file' && target?.files[0]) {
            // setState(s => ({ ...s, [target.name]: [] }));
            if (Array.isArray(oldState[target.name].value)) {
                for (const file of target.files) {
                    const reader = new FileReader();
                    reader.onload = _ => {
                        if (reader.readyState === 2) {
                            setState(s => ({ ...s, [target.name]: { ...s[target.name], value: [...s[target.name].value, reader.result] } }));
                        }
                    }
                    reader.readAsDataURL(file);
                }
            } else if (typeof init[target.name] === 'string') {
                const reader = new FileReader();
                reader.onload = _ => {
                    if (reader.readyState === 2) {
                        setState(s => ({ ...s, [target.name]: reader.result }));
                    }
                }
                reader.readAsDataURL(target.files[0]);
            }
        } else if (target?.type === 'checkbox') {
            if (typeof oldState[target.name] === 'boolean') {
                setState(s => ({ ...s, [target.name]: !s[target.name] }))
            }
            else if (Array.isArray(oldState[target.name].value)) {
                if (target.checked) setState({ ...oldState, [target.name]: { ...oldState[target.name], value: [...oldState[target.name].value, target.value] } });
                else setState(skill => ({ ...skill, [target.name]: { ...skill[target.name], value: [...skill[target.name].value.filter(skill => skill !== target.value)] } }));
            }


        } else {
            setState(s => {
                return { ...s, [target.name]: { ...s[target.name], value: target.value } }
            })
        }

    }
    const previewDelete = ({ target }, id) => {
        const input = target.parentNode.parentNode.previousSibling.name; setState(s => {
            // console.log('s[input]', input);
            return ({ ...s, [input]: { ...s[input], value: s[input].value.filter((_, k) => k !== id) } })
        });

    }
    const blurHandler = ({ target }) => {
        const key = target.name;

        const { errors } = getErrors(oldState, validate);
        // const oldState = deepClone(state);
        if (oldState[key].touched && errors[key]) {
            oldState[key].error = errors[key];
        } else {
            oldState[key].error = '';
        }

        oldState[key].focused = false;
        setState(oldState);
    }
    const focusHandler = (e) => {
        const { name } = e.target;

        // const oldState = deepClone(state);
        oldState[name].focused = true;

        if (!oldState[name].touched) {
            oldState[name].touched = true;
        }

        setState(oldState);
    }
    const submitHandler = (e, cb) => {
        e.preventDefault();
        const { hasError, errors, values } = getErrors(oldState, validate);

    }
    const clear = () => { }
    return {
        formState: state,
        changeHandler,
        blurHandler,
        focusHandler,
        submitHandler,
        previewDelete,
        clear
    };
}


const getErrors = (state, validate) => {
    let hasError, errors;
    const values = mapStateToKeys(state, 'value');
    if (typeof validate === 'boolean') {
        hasError = validate;
        errors = mapStateToKeys(state, 'error');
    } else if (typeof validate === 'function') {
        const errorsFromCB = validate(values);
        hasError = !Object.keys(errorsFromCB).length;
        errors = errorsFromCB;
    } else {
        throw new Error('validate property must be boolean or function');
    }
    return {
        values,
        hasError,
        errors
    }
}


const mapValuesToState = (values, shouldClear = false) => Object.keys(values).reduce((acc, key) => ({
    ...acc,
    [key]: {
        value: shouldClear ? '' : values[key],
        error: '',
        focused: false,
        touched: false,
    }
}), {});

const mapStateToKeys = (state, key) => {
    return Object.keys(state).reduce((acc, cur) => {
        acc[cur] = state[cur][key];
        return acc;
    }, {});
};

