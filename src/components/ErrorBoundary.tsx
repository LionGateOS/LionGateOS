
import React from "react";

type Props={children:React.ReactNode;fallback?:React.ReactNode;};
type State={hasError:boolean;};

export default class ErrorBoundary extends React.Component<Props,State>{
  constructor(p:Props){super(p);this.state={hasError:false};}
  static getDerivedStateFromError(){return{hasError:true};}
  componentDidCatch(e:any,i:any){console.error("Shell ErrorBoundary",e,i);}
  render(){return this.state.hasError?this.props.fallback||<div>Shell recovered</div>:this.props.children;}
}
