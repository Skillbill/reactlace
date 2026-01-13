import{r as u,j as d}from"./iframe--dhNfDZc.js";import{i as o}from"./RLCrud-CB3hB6o5.js";import"./preload-helper-C1FmrZbK.js";import"./index-CR6nvIrl.js";const x={title:"Components/File input",component:o,tags:["autodocs"],argTypes:{error:{control:"text"}},render:l=>{const[c,m]=u.useState(null);return d.jsx(o,{...l,value:c,onChange:m})}},e={args:{label:"File Upload (RLFileInput)",placeholder:"Select a file...",name:"file"}},r={args:{label:"File Upload (RLFileInput)",placeholder:"Select a file...",name:"file",multiple:!0,fileLimit:2,onError:l=>{console.log("Error: ",l)}}};var a,t,n;e.parameters={...e.parameters,docs:{...(a=e.parameters)==null?void 0:a.docs,source:{originalSource:`{
  args: {
    label: 'File Upload (RLFileInput)',
    placeholder: 'Select a file...',
    name: 'file'
  }
}`,...(n=(t=e.parameters)==null?void 0:t.docs)==null?void 0:n.source}}};var s,i,p;r.parameters={...r.parameters,docs:{...(s=r.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {
    label: 'File Upload (RLFileInput)',
    placeholder: 'Select a file...',
    name: 'file',
    multiple: true,
    fileLimit: 2,
    onError: (error: unknown) => {
      console.log('Error: ', error);
    }
  }
}`,...(p=(i=r.parameters)==null?void 0:i.docs)==null?void 0:p.source}}};const E=["Primary","Multiple"];export{r as Multiple,e as Primary,E as __namedExportsOrder,x as default};
