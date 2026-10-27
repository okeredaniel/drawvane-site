import { ImageResponse } from "next/og";
export const alt = "Stratora. Your project documents. Answers you can check.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(<div style={{background:"#f5f6f8",color:"#111722",display:"flex",flexDirection:"column",padding:"70px",width:"100%",height:"100%",fontFamily:"sans-serif"}}><div style={{display:"flex",alignItems:"center",fontSize:32,color:"#4052ee"}}>Stratora</div><div style={{display:"flex",flexDirection:"column",fontSize:72,lineHeight:1.1,letterSpacing:"-3px",marginTop:85}}><span>Your project documents.</span><span style={{color:"#4052ee"}}>Answers you can check.</span></div><div style={{display:"flex",fontSize:24,marginTop:55,color:"#586273"}}>Construction intelligence, in context.</div></div>,size);
}
