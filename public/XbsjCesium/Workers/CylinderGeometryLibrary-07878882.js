define(["exports","./Math-6a1814d8"],function(r,b){"use strict";var t={computePositions:function(r,t,a,e,i){var n,o=.5*r,s=-o,u=e+e,c=new Float64Array(3*(i?2*u:u)),f=0,h=0,y=i?3*u:0,M=i?3*(u+e):3*e;for(n=0;n<e;n++){var d=n/e*b.CesiumMath.TWO_PI,m=Math.cos(d),v=Math.sin(d),l=m*a,p=v*a,C=m*t,P=v*t;c[h+y]=l,c[h+y+1]=p,c[h+y+2]=s,c[h+M]=C,c[h+M+1]=P,c[h+M+2]=o,h+=3,i&&(c[f++]=l,c[f++]=p,c[f++]=s,c[f++]=C,c[f++]=P,c[f++]=o)}return c}};r.CylinderGeometryLibrary=t});
