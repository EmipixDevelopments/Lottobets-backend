!function(o){var n=function(o,n,t,i,l){var a=i*Math.sqrt(Math.PI)/2;o.rect(n-a,t-a,a+a,a+a)},t=function(o,n,t,i,l){var a=i*Math.sqrt(Math.PI)/2;o.rect(n-a,t-a,a+a,a+a)},i=function(o,n,t,i,l){var a=i*Math.sqrt(Math.PI/2);o.moveTo(n-a,t),o.lineTo(n,t-a),o.lineTo(n+a,t),o.lineTo(n,t+a),o.lineTo(n-a,t),o.lineTo(n,t-a)},l=function(o,n,t,i,l){var a=i*Math.sqrt(2*Math.PI/Math.sin(Math.PI/3)),e=a*Math.sin(Math.PI/3);o.moveTo(n-a/2,t+e/2),o.lineTo(n+a/2,t+e/2),l||(o.lineTo(n,t-e/2),o.lineTo(n-a/2,t+e/2),o.lineTo(n+a/2,t+e/2))},a=function(o,n,t,i,l,a){l||(o.moveTo(n+i,t),o.arc(n,t,i,0,2*Math.PI,!1))},e={square:n,rectangle:t,diamond:i,triangle:l,cross:function(o,n,t,i,l){var a=i*Math.sqrt(Math.PI)/2;o.moveTo(n-a,t-a),o.lineTo(n+a,t+a),o.moveTo(n-a,t+a),o.lineTo(n+a,t-a)},ellipse:a,plus:function(o,n,t,i,l){var a=i*Math.sqrt(Math.PI/2);o.moveTo(n-a,t),o.lineTo(n+a,t),o.moveTo(n,t+a),o.lineTo(n,t-a)}};function r(o){o.drawSymbol=e}n.fill=!0,t.fill=!0,i.fill=!0,l.fill=!0,a.fill=!0,o.plot.plugins.push({init:r,name:"symbols",version:"1.0"})}(jQuery);