import{r as i,j as u}from"./iframe-Bjw0nMSr.js";import{l as a}from"./RLCrud-BCJRpfNT.js";import"./preload-helper-C1FmrZbK.js";import"./index-DbCjbJ06.js";const g={title:"Components/Input",component:a,tags:["autodocs"],argTypes:{size:{control:"select",options:["small","medium","large",void 0]},type:{control:"select",options:["password","text","email",void 0]},autocapitalize:{control:"select",options:["off","none","on","sentences","words","characters",void 0]},autocorrect:{control:"select",options:["off","on",void 0]},inputmode:{control:"select",options:["none","text","email",void 0]}},render(e){const[r,l]=i.useState(void 0);return u.jsx(a,{...e,value:r,onChange:l})}},t={args:{label:"Name (RLInput)",rules:[{validateFn:e=>e&&e.length>0,message:"The value is required"},{validateFn:e=>e.length>1,message:"The value must be at least 2 characters long"}]}};var o,s,n;t.parameters={...t.parameters,docs:{...(o=t.parameters)==null?void 0:o.docs,source:{originalSource:`{
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
}`,...(n=(s=t.parameters)==null?void 0:s.docs)==null?void 0:n.source}}};const v=["Primary"];export{t as Primary,v as __namedExportsOrder,g as default};
