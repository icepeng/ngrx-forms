import { AbstractControlState, createFormGroupState, FormGroupControls, isArrayState, isGroupState } from '../../state';

export const FORM_CONTROL_ID = 'test ID';
export const FORM_CONTROL_INNER_ID = FORM_CONTROL_ID + '.inner';
export const FORM_CONTROL_INNER2_ID = FORM_CONTROL_ID + '.inner2';
export const FORM_CONTROL_INNER3_ID = FORM_CONTROL_ID + '.inner3';
export const FORM_CONTROL_INNER4_ID = FORM_CONTROL_INNER3_ID + '.inner4';
export const FORM_CONTROL_INNER5_ID = FORM_CONTROL_ID + '.inner5';
export const FORM_CONTROL_INNER5_0_ID = FORM_CONTROL_ID + '.inner5.0';
export interface FormGroupValue { inner: string; inner2?: string; inner3?: { inner4: string }; inner5?: string[]; }
export const INITIAL_FORM_CONTROL_VALUE: FormGroupValue = { inner: '' };
export const INITIAL_FORM_CONTROL_VALUE_FULL: FormGroupValue = { inner: '', inner2: '', inner3: { inner4: '' }, inner5: [''] };
export const INITIAL_STATE = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);
export const INITIAL_STATE_FULL = createFormGroupState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE_FULL);

export const setPropertyRecursively = <TValue>(
  state: AbstractControlState<TValue>,
  property: keyof AbstractControlState<TValue>,
  value: any,
  ...excludeIds: string[],
): AbstractControlState<TValue> => {
  if (excludeIds.indexOf(state.id) >= 0) {
    return state;
  }

  state = {
    ...state,
    [property]: value,
  };

  if (isArrayState(state)) {
    const controls = state.controls.map(s => setPropertyRecursively(s, property, value, ...excludeIds));
    return {
      ...state,
      controls,
    } as any;
  }

  if (isGroupState(state)) {
    const controls = state.controls;
    const newControls = Object.keys(controls).reduce((res, key) => {
      const s = setPropertyRecursively(controls[key], property, value, ...excludeIds);
      res[key] = s;
      return res;
    }, {} as FormGroupControls<any>);

    return {
      ...state,
      controls: newControls,
    } as any;
  }

  return state;
};

export const setPropertiesRecursively = <TValue>(
  state: AbstractControlState<TValue>,
  properties: Array<[keyof AbstractControlState<TValue>, any]>,
  ...excludeIds: string[],
): AbstractControlState<TValue> => {
  return properties.reduce((s, [p, v]) => setPropertyRecursively(s, p, v, ...excludeIds), state);
};
