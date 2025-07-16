import React from "react"
import { SvgXml } from "react-native-svg"

const logoXml = `
<svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="1028.000000pt" height="1028.000000pt" viewBox="0 0 1028.000000 1028.000000" preserveAspectRatio="xMidYMid meet">
  <g transform="translate(0.000000,1028.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
    <path d="M5130 7602 c-8 -2 -60 -32 -115 -65 ..."/>
    <path d="M4473 6049 c-87 -25 -98 -161 ..."/>
    <path d="M4451 5556 c-48 -27 -67 -108 ..."/>
    <path d="M4434 5056 c-46 -46 -48 -101 ..."/>
    <path d="M5033 4614 c-23 -9 -62 -33 ..."/>
  </g>
</svg>
`

const Logo = (props: Record<string, any>) => (
  <SvgXml xml={logoXml} width="100%" height="100%" {...props} />
)

export default Logo
