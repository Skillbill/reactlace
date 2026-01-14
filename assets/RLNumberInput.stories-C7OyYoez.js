import{r as l,j as o}from"./iframe-Bjw0nMSr.js";import{m as n}from"./RLCrud-BCJRpfNT.js";import"./preload-helper-C1FmrZbK.js";import"./index-DbCjbJ06.js";const v={title:"Components/Number input",component:n,tags:["autodocs"],argTypes:{size:{control:"select",options:["small","medium","large",void 0]}},args:{},render(e){const[u,m]=l.useState(null);return o.jsx(n,{...e,value:u,onChange:m})}},a={args:{label:"Age (RLNumberInput)",clearable:!0,helpText:"The number must be between 0 and 150",rules:[{validateFn:e=>e!=null,message:"The value is required"},{validateFn:e=>e>0,message:"The value must be greater than 0"},{validateFn:e=>e<=150,message:"The number must be less than 150"}]}};var r,s,t;a.parameters={...a.parameters,docs:{...(r=a.parameters)==null?void 0:r.docs,source:{originalSource:`{
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
}`,...(t=(s=a.parameters)==null?void 0:s.docs)==null?void 0:t.source}}};const g=["Primary"];export{a as Primary,g as __namedExportsOrder,v as default};
