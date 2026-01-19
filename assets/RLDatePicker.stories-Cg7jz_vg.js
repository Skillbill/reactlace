import{r as M,j as f}from"./iframe-Dj_In7CA.js";import{f as s}from"./RLCrud-BWSJ4BMQ.js";import"./RLRadioGroup-Bzwx_NLW.js";import"./preload-helper-C1FmrZbK.js";import"./index-DoXLqg2K.js";const y={title:"Components/Date picker",component:s,tags:["autodocs"],argTypes:{selectionMode:{control:"select",options:["single","range","multiple",void 0]}},args:{},render:e=>{const[b,v]=M.useState(null);return f.jsx(s,{...e,value:b,onChange:T=>v(T)})}},a={args:{label:"Date of birth (RLDatePicker)",rules:[{validateFn:e=>!!e,message:"The value is required"},{validateFn:e=>e.getTime()<new Date().getTime(),message:"Oh...it seems you are not born yet!"}]}},t={args:{label:"Date",name:"DateInput",placeholder:"Select a date...",selectionMode:"multiple"}},r={args:{label:"Date",name:"DateInput",placeholder:"Select a date...",selectionMode:"range"}},n={args:{label:"Date",name:"DateInput",placeholder:"Select a date and time...",withTime:!0}};var o,l,i;a.parameters={...a.parameters,docs:{...(o=a.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {
    label: 'Date of birth (RLDatePicker)',
    rules: [{
      validateFn: (value: unknown) => !!value,
      message: 'The value is required'
    }, {
      validateFn: (value: unknown) => (value as Date).getTime() < new Date().getTime(),
      message: 'Oh...it seems you are not born yet!'
    }]
  }
}`,...(i=(l=a.parameters)==null?void 0:l.docs)==null?void 0:i.source}}};var c,m,p;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    label: 'Date',
    name: 'DateInput',
    placeholder: 'Select a date...',
    selectionMode: 'multiple'
  }
}`,...(p=(m=t.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var u,d,g;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    label: 'Date',
    name: 'DateInput',
    placeholder: 'Select a date...',
    selectionMode: 'range'
  }
}`,...(g=(d=r.parameters)==null?void 0:d.docs)==null?void 0:g.source}}};var D,h,S;n.parameters={...n.parameters,docs:{...(D=n.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    label: 'Date',
    name: 'DateInput',
    placeholder: 'Select a date and time...',
    withTime: true
  }
}`,...(S=(h=n.parameters)==null?void 0:h.docs)==null?void 0:S.source}}};const F=["Single","Multiple","Range","WithTime"];export{t as Multiple,r as Range,a as Single,n as WithTime,F as __namedExportsOrder,y as default};
