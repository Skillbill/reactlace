import{k as s}from"./RLCrud-CB3hB6o5.js";import"./iframe--dhNfDZc.js";import"./preload-helper-C1FmrZbK.js";import"./index-CR6nvIrl.js";const m={title:"Components/Input",component:s,tags:["autodocs"],argTypes:{size:{control:"select",options:["small","medium","large",void 0]},type:{control:"select",options:["password","text","email",void 0]},autocapitalize:{control:"select",options:["off","none","on","sentences","words","characters",void 0]},autocorrect:{control:"select",options:["off","on",void 0]},inputmode:{control:"select",options:["none","text","email",void 0]}}},t={args:{label:"Name (RLInput)",rules:[{validateFn:e=>e&&e.length>0,message:"The value is required"},{validateFn:e=>e.length>1,message:"The value must be at least 2 characters long"}]}};var a,o,n;t.parameters={...t.parameters,docs:{...(a=t.parameters)==null?void 0:a.docs,source:{originalSource:`{
  args: {
    label: 'Name (RLInput)',
    rules: [{
      validateFn: (value: unknown) => value && (value as string).length > 0,
      message: 'The value is required'
    }, {
      validateFn: (value: unknown) => (value as string).length > 1,
      message: 'The value must be at least 2 characters long'
    }]
  }
}`,...(n=(o=t.parameters)==null?void 0:o.docs)==null?void 0:n.source}}};const u=["Primary"];export{t as Primary,u as __namedExportsOrder,m as default};
