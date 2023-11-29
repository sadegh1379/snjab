import React from 'react';
import PropTypes from 'prop-types';

const OPERATOR=[
    '+',
    '-',
    '*',
    '/',
    '%',

]
const LEVEL={
    'easy':1,
    'medium':2,
    'hard':4
}
class RCG extends React.Component {

    constructor(prop){
        super(prop);
        this.state={
            a:0,
            b:0,
            operator:'+',
            width:prop.width || 200,
            height:prop.height || 50,
            level:prop.level || 'easy'
        }
    }
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    randomColor(){
        const r = Math.floor(Math.random()*240);
        const g = Math.floor(Math.random()*240);
        const b = Math.floor(Math.random()*240);
        return "rgb("+ r + "," + g + "," + b +")";
    }
    texter(str, x, y,ctx){
        ctx.font = "40px Comic Sans MS";
        ctx.textAlign = "center";
        x=x-(ctx.measureText(str).width/2);
        for(let i = 0; i <= str.length; ++i){
            const ch = str.charAt(i);
            ctx.fillStyle = this.randomColor();
            ctx.fillText(ch, x+5, y+(Math.floor(Math.random()*10)));
            x += ctx.measureText(ch).width;
        }
    }
    componentDidMount(){
        const {height,width,level}=this.state;
        const canvas = this.refs.canvas
        const ctx = canvas.getContext("2d")

        const max=this.props.max,min=this.props.min;
        let a=this.getRandomInt(min,max),b=this.getRandomInt(min,max),operator=OPERATOR[this.getRandomInt(0,LEVEL[level])];
        if(a<b){
            let bb=b;
            b=a;
            a=bb;
        }
        if(this.props.result ){
            this.props.result(eval(a+operator+b));
        }else{
            console.error('Requirement `result` props for callback result of captcha')
        }

        this.setState({
            a,
            b,
            operator
        })



        this.texter(a+operator+b, parseInt(width)/2,(parseInt(height)/2)+10,ctx)
    }
    render(){
        const {height,width}=this.state;
        return(
            <div>
                <canvas ref="canvas" width={width} height={height} className={this.props.className || ''}/>
            </div>
        )
    }
}
RCG.defaultProps={
    min:1,
    max:20
}
RCG.propTypes={
    result:PropTypes.func.isRequired,
    min:PropTypes.number,
    max:PropTypes.number,
}
export {RCG};