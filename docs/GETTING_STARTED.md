## Getting Started

Import the module:

```typescript
import { StoreModule } from '@ngrx/store';
import { NgrxFormsModule } from 'ngrx-forms';

import { reducers } from './reducer';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    NgrxFormsModule,
    StoreModule.forRoot(reducers),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Add a group state somewhere in your state tree via `createFormGroupState` and call the `formGroupReducer` inside your reducer:

```typescript
import { Action } from '@ngrx/store';
import { FormGroupState, createFormGroupState, formGroupReducer } from 'ngrx-forms';

export interface MyFormValue {
  someTextInput: string;
  someCheckbox: boolean;
  nested: {
    someNumber: number;
  };
}

const FORM_ID = 'some globally unique string';

const initialFormState = createFormGroupState<MyFormValue>(FORM_ID, {
  someTextInput: '',
  someCheckbox: false,
  nested: {
    someNumber: 0,
  },
});

export interface AppState {
  someOtherField: string;
  myForm: FormGroupState<MyFormValue>;
}

const initialState: AppState = {
  someOtherField: '',
  myForm: initialFormState,
};

export function appReducer(state = initialState, action: Action): AppState {
  const myForm = formGroupReducer(state.myForm, action);
  if (myForm !== state.myForm) {
    state = { ...state, myForm };
  }

  switch (action.type) {
    case 'some action type':
      // modify state
      return state;

    default: {
      return state;
    }
  }
}
```

Expose the form state inside your component:

```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';
import { Observable } from 'rxjs/Observable';

import { MyFormValue } from './reducer';

@Component({
  selector: 'my-component',
  templateUrl: './my-component.html',
})
export class MyComponent {
  formState$: Observable<FormGroupState<MyFormValue>>;

  constructor(private store: Store<AppState>) {
    this.formState$ = store.select(s => s.myForm);
  }
}
```

Set the control states in your template:
```html
<form novalidate [ngrxFormState]="(formState$ | async)">
  <input type="text"
         [ngrxFormControlState]="(formState$ | async).controls.someTextInput">

  <input type="checkbox"
         [ngrxFormControlState]="(formState$ | async).controls.someCheckbox">

  <input type="number"
         [ngrxFormControlState]="(formState$ | async).controls.nested.controls.someNumber">
</form>
```
