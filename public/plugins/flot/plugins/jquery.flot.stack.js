!function(s){var n={series:{stack:null}};function o(s){function n(s,n){for(var o=null,t=0;t<n.length&&s!==n[t];++t)n[t].stack===s.stack&&(o=n[t]);return o}function o(s,n){for(var o=[],t=0;t<n.points.length;t+=2)o.push(n.points[t]),o.push(n.points[t+1]),o.push(0);n.format.push({x:s.bars.horizontal,y:!s.bars.horizontal,number:!0,required:!1,computeRange:"none"!==s.yaxis.options.autoScale,defaultValue:0}),n.points=o,n.pointsize=3}function t(s,t,i){if(null!=t.stack&&!1!==t.stack){var l=t.bars.show||t.lines.show&&t.lines.fill,e=i.pointsize>2&&(t.bars.horizontal?i.format[2].x:i.format[2].y);l&&!e&&o(t,i);var a=n(t,s.getData());if(a){for(var u,r,p,f,h,c,g,z,k=i.pointsize,v=i.points,b=a.datapoints.pointsize,m=a.datapoints.points,d=[],y=t.lines.show,w=t.bars.horizontal,x=y&&t.lines.steps,D=!0,j=w?1:0,q=w?0:1,Q=0,R=0;!(Q>=v.length);){if(g=d.length,null==v[Q]){for(z=0;z<k;++z)d.push(v[Q+z]);Q+=k}else if(R>=m.length){if(!y)for(z=0;z<k;++z)d.push(v[Q+z]);Q+=k}else if(null==m[R]){for(z=0;z<k;++z)d.push(null);D=!0,R+=b}else{if(u=v[Q+j],r=v[Q+q],f=m[R+j],h=m[R+q],c=0,u===f){for(z=0;z<k;++z)d.push(v[Q+z]);d[g+q]+=h,c=h,Q+=k,R+=b}else if(u>f){if(y&&Q>0&&null!=v[Q-k]){for(p=r+(v[Q-k+q]-r)*(f-u)/(v[Q-k+j]-u),d.push(f),d.push(p+h),z=2;z<k;++z)d.push(v[Q+z]);c=h}R+=b}else{if(D&&y){Q+=k;continue}for(z=0;z<k;++z)d.push(v[Q+z]);y&&R>0&&null!=m[R-b]&&(c=h+(m[R-b+q]-h)*(u-f)/(m[R-b+j]-f)),d[g+q]+=c,Q+=k}D=!1,g!==d.length&&l&&(d[g+2]+=c)}if(x&&g!==d.length&&g>0&&null!==d[g]&&d[g]!==d[g-k]&&d[g+1]!==d[g-k+1]){for(z=0;z<k;++z)d[g+k+z]=d[g+z];d[g+1]=d[g-k+1]}}i.points=d}}}s.hooks.processDatapoints.push(t)}jQuery.plot.plugins.push({init:o,options:n,name:"stack",version:"1.2"})}();