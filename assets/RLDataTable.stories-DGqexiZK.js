import{j as i}from"./iframe--dhNfDZc.js";import{d as l,e as c}from"./RLCrud-CB3hB6o5.js";import"./preload-helper-C1FmrZbK.js";import"./index-CR6nvIrl.js";const u=({data:t,field:e,trueColor:m})=>{const n=t[e];return i.jsx(c,{name:n?"check":"close",className:n?m||"text-green-500":"text-red-500"})},p=()=>new Array(40).fill(0).map((t,e)=>({username:`user${e}`,firstName:`Name${e}`,lastName:`LastName${e}`,active:e%2,activation_date:"2021-01-01",expiration_date:"2025-12-31"})),N={title:"Components/Data Table",component:l,tags:["autodocs"],argTypes:{selectionMode:{control:"select",options:[void 0,"single","multiple"]}},args:{}},a={args:{columns:[{name:"Username",value:"username"},{name:"First name",value:"firstName",sortable:!0},{name:"Last name",value:"lastName"},{name:"Active",value:"active",component:u,componentProps:{trueColor:"text-yellow-500"}},{name:"Activation Date",value:"activation_date"},{name:"Expiration Date",value:"expiration_date"}],actions:[],items:p()}};var o,s,r;a.parameters={...a.parameters,docs:{...(o=a.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {
    columns: [{
      name: 'Username',
      value: 'username'
    }, {
      name: 'First name',
      value: 'firstName',
      sortable: true
    }, {
      name: 'Last name',
      value: 'lastName'
    }, {
      name: 'Active',
      value: 'active',
      component: ActiveCell,
      componentProps: {
        trueColor: 'text-yellow-500'
      }
    }, {
      name: 'Activation Date',
      value: 'activation_date'
    }, {
      name: 'Expiration Date',
      value: 'expiration_date'
    }],
    actions: [],
    items: getItems()
  }
}`,...(r=(s=a.parameters)==null?void 0:s.docs)==null?void 0:r.source}}};const _=["Simple"];export{a as Simple,_ as __namedExportsOrder,N as default};
