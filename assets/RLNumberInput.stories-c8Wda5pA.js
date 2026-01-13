import{l as t}from"./RLCrud-CB3hB6o5.js";import"./iframe--dhNfDZc.js";import"./preload-helper-C1FmrZbK.js";import"./index-CR6nvIrl.js";const i={title:"Components/Number input",component:t,tags:["autodocs"],argTypes:{size:{control:"select",options:["small","medium","large",void 0]}},args:{}},a={args:{label:"Age (RLNumberInput)",clearable:!0,helpText:"The number must be between 0 and 150",rules:[{validateFn:e=>e!=null,message:"The value is required"},{validateFn:e=>e>0,message:"The value must be greater than 0"},{validateFn:e=>e<=150,message:"The number must be less than 150"}]}};var n,r,s;a.parameters={...a.parameters,docs:{...(n=a.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    label: 'Age (RLNumberInput)',
    clearable: true,
    helpText: 'The number must be between 0 and 150',
    rules: [{
      validateFn: (value: unknown) => value != undefined,
      message: 'The value is required'
    }, {
      validateFn: (value: unknown) => value as number > 0,
      message: 'The value must be greater than 0'
    }, {
      validateFn: (value: unknown) => value as number <= 150,
      message: 'The number must be less than 150'
    }]
  }
}`,...(s=(r=a.parameters)==null?void 0:r.docs)==null?void 0:s.source}}};const b=["Primary"];export{a as Primary,b as __namedExportsOrder,i as default};
