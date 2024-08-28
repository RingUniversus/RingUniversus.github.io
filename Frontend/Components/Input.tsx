import {
  RingUniversusCheckbox,
  RingUniversusColorInput,
  RingUniversusNumberInput,
  RingUniversusTextInput,
} from "@ringuniversus/ui";
import { createComponent } from "@lit/react";
import React from "react";

customElements.define(RingUniversusCheckbox.tagName, RingUniversusCheckbox);
customElements.define(RingUniversusColorInput.tagName, RingUniversusColorInput);
customElements.define(
  RingUniversusNumberInput.tagName,
  RingUniversusNumberInput
);
customElements.define(RingUniversusTextInput.tagName, RingUniversusTextInput);

export {
  RingUniversusCheckbox,
  RingUniversusColorInput,
  RingUniversusNumberInput,
  RingUniversusTextInput,
};

// This wraps the customElement in a React wrapper to make it behave exactly like a React component
// export const Checkbox = createComponent<
//   RingUniversusCheckbox,
//   {
//     onChange: (e: Event & React.ChangeEvent<RingUniversusCheckbox>) => void;
//   }
// >(React, RingUniversusCheckbox.tagName, RingUniversusCheckbox, {
//   onChange: "input",
// });
export const CheckBox = createComponent({
  tagName: RingUniversusCheckbox.tagName,
  elementClass: RingUniversusCheckbox,
  react: React,
  events: {
    onchange: "input",
  },
});

// This wraps the customElement in a React wrapper to make it behave exactly like a React component
// export const ColorInput = createComponent<
//   RingUniversusColorInput,
//   {
//     onChange: (e: Event & React.ChangeEvent<RingUniversusColorInput>) => void;
//   }
// >(React, RingUniversusColorInput.tagName, RingUniversusColorInput, {
//   // The `input` event is more like what we expect as `onChange` in React
//   onChange: "input",
// });
export const ColorInput = createComponent({
  tagName: RingUniversusColorInput.tagName,
  elementClass: RingUniversusColorInput,
  react: React,
  events: {
    onchange: "input",
  },
});

// This wraps the customElement in a React wrapper to make it behave exactly like a React component
// export const NumberInput = createComponent<
//   RingUniversusNumberInput,
//   {
//     onChange: (e: Event & React.ChangeEvent<RingUniversusNumberInput>) => void;
//   }
// >(React, RingUniversusNumberInput.tagName, RingUniversusNumberInput, {
//   // The `input` event is more like what we expect as `onChange` in React
//   onChange: "input",
// });
export const NumberInput = createComponent({
  tagName: RingUniversusNumberInput.tagName,
  elementClass: RingUniversusNumberInput,
  react: React,
  events: {
    onchange: "input",
  },
});

// This wraps the customElement in a React wrapper to make it behave exactly like a React component
// export const TextInput = createComponent<
//   RingUniversusTextInput,
//   {
//     onChange: (e: Event & React.ChangeEvent<RingUniversusTextInput>) => void;
//     onBlur: (e: Event) => void;
//   }
// >(React, RingUniversusTextInput.tagName, RingUniversusTextInput, {
//   // The `input` event is more like what we expect as `onChange` in React
//   onChange: "input",
//   onBlur: "blur",
// });
export const TextInput = createComponent({
  tagName: RingUniversusTextInput.tagName,
  elementClass: RingUniversusTextInput,
  react: React,
  events: {
    onchange: "input",
  },
});
