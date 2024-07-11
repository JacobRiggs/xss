// Stop multiple boxes appearing; log to console instead.
window.JROrigin = location.origin && location.origin !== "null" ? location.origin : document.domain;
if (window.JRXSS) {
    console.log("And another! (Total: "+(++window.JRXSS.count)+"). Affected domain: " + window.JROrigin);
} else {
    console.log("A popup by Jacob Riggs was generated! Affected domain: " + window.JROrigin);
    window.JRXSS = {count:1};

    var TINY={};

    function T$(i){return document.getElementById(i)}

    TINY.box=function(){
        var p,m,b,fn,ic,iu,iw,ih,ia,f=0;
        return {
            show:function(c,u,w,h,a,t){
                if(!f){
                    p=document.createElement('div'); p.id='tinybox';
                    
                    p.style.position='absolute'; 
                    p.style.display='none'; 
                    p.style.padding='10px'; 
                    p.style.background='#fff'; 
                    p.style.border='10px solid #e3e3e3'; 
                    p.style.boxSizing='content-box';
                    p.style.zIndex=999;
                    
                    
                    m=document.createElement('div'); m.id='tinymask';
                    
                    m.style.position='absolute';
                    m.style.display='none';
                    m.style.top=0;
                    m.style.left=0;
                    m.style.height='100%';
                    m.style.width='100%';
                    m.style.background='#555';
                    m.style.boxSizing='content-box';
                    m.style.zIndex=998;
                    
                    
                    b=document.createElement('div'); b.id='tinycontent';
                    b.style.background='#fff';
                    b.style.textAlign='justify';
                    
                    document.body.appendChild(m); document.body.appendChild(p); p.appendChild(b);
                    m.onclick=TINY.box.hide; window.onresize=TINY.box.resize; f=1
                }
                if(!a&&!u){
                    p.style.width=w?w+'px':'auto'; p.style.height=h?h+'px':'auto';
                    p.style.backgroundImage='none'; b.innerHTML=c;
                } else {
                    b.style.display='none'; p.style.width=p.style.height='100px'
                }
                this.mask();
                ic=c; iu=u; iw=w; ih=h; ia=a; this.alpha(m,1,80,3);
                if(t){setTimeout(function(){TINY.box.hide()},1000*t)}
                loadAndMakeDraggable();
            },
            fill:function(c,u,w,h,a){
                if(u){
                    p.style.backgroundImage='';
                    var x=window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject('Microsoft.XMLHTTP');
                    x.onreadystatechange=function(){
                        if(x.readyState==4&&x.status==200){TINY.box.psh(x.responseText,w,h,a)}
                    };
                    x.open('GET',c,1); x.send(null)
                } else {
                    this.psh(c,w,h,a)
                }
            },
            psh:function(c,w,h,a){
                if(a){
                    if(!w||!h){
                        var x=p.style.width, y=p.style.height; b.innerHTML=c;
                        p.style.width=w?w+'px':''; p.style.height=h?h+'px':'';
                        b.style.display='';
                        w=parseInt(b.offsetWidth); h=parseInt(b.offsetHeight);
                        b.style.display='none'; p.style.width=x; p.style.height=y;
                    } else {
                        b.innerHTML=c;
                        // JR Extra attacks.
                        if (typeof window.JRSelect !== "undefined") b.insertBefore(window.JRSelect, b.firstChild);
                    }
                    this.size(p,w,h)
                } else {
                    p.style.backgroundImage='none'
                }
            },
            hide:function(){
                TINY.box.alpha(p,-1,0,3)
            },
            resize:function(){
                TINY.box.pos(); TINY.box.mask()
            },
            mask:function(){
                m.style.height=TINY.page.total(1)+'px';
                m.style.width=''; m.style.width=TINY.page.total(0)+'px'
            },
            pos:function(){
                var t=(TINY.page.height()/2)-(p.offsetHeight/2); t=t<10?10:t;
                p.style.top=(t+TINY.page.top())+'px';
                p.style.left=(TINY.page.width()/2)-(p.offsetWidth/2)+'px'
            },
            alpha:function(e,d,a){
                clearInterval(e.ai);
                if(d==1){
                    e.style.opacity=0; e.style.filter='alpha(opacity=0)';
                    e.style.display='block'; this.pos()
                }
                e.ai=setInterval(function(){TINY.box.ta(e,a,d)},20)
            },
            ta:function(e,a,d){
                var o=Math.round(e.style.opacity*100);
                if(o==a){
                    clearInterval(e.ai);
                    if(d==-1){
                        e.style.display='none';
                        e==p?TINY.box.alpha(m,-1,0,2):b.innerHTML=p.style.backgroundImage=''
                    } else {
                        e==m?this.alpha(p,1,100):TINY.box.fill(ic,iu,iw,ih,ia)
                    }
                } else {
                    var n=Math.ceil((o+((a-o)*.5))); n=n==1?0:n;
                    e.style.opacity=n/100; e.style.filter='alpha(opacity='+n+')'
                }
            },
            size:function(e,w,h){
                e=typeof e=='object'?e:T$(e); clearInterval(e.si);
                var ow=e.offsetWidth, oh=e.offsetHeight,
                wo=ow-parseInt(e.style.width), ho=oh-parseInt(e.style.height);
                var wd=ow-wo>w?0:1, hd=(oh-ho>h)?0:1;
                e.si=setInterval(function(){TINY.box.ts(e,w,wo,wd,h,ho,hd)},20)
            },
            ts:function(e,w,wo,wd,h,ho,hd){
                var ow=e.offsetWidth-wo, oh=e.offsetHeight-ho;
                if(ow==w&&oh==h){
                    clearInterval(e.si); p.style.backgroundImage='none'; b.style.display='block';
                    // it's prettier this way.
                    p.style.height='';
                } else {
                    if(ow!=w){var n=ow+((w-ow)*.5); e.style.width=wd?Math.ceil(n)+'px':Math.floor(n)+'px'}
                    if(oh!=h){var n=oh+((h-oh)*.5); e.style.height=hd?Math.ceil(n)+'px':Math.floor(n)+'px'}
                    this.pos()
                }
            }
        }
    }();

    TINY.page=function(){
        return{
            top:function(){return document.documentElement.scrollTop||document.body.scrollTop},
            width:function(){return self.innerWidth||document.documentElement.clientWidth||document.body.clientWidth},
            height:function(){return self.innerHeight||document.documentElement.clientHeight||document.body.clientHeight},
            total:function(d){
                var b=document.body, e=document.documentElement;
                return d?Math.max(Math.max(b.scrollHeight,e.scrollHeight),Math.max(b.clientHeight,e.clientHeight)):
                Math.max(Math.max(b.scrollWidth,e.scrollWidth),Math.max(b.clientWidth,e.clientWidth))
            }
        }
    }();

    var msg = '<style type="text/css">*{font-family:Verdana !important;}p{margin:12px 0;}</style>'
            + '<div style="padding: 15px;border-radius: 4px;position:absolute;bottom:9px;right:14px;padding:0;font-size:10px;font-style:italic;color:#aaa;">Origin: '+window.JROrigin+'</div>'
            + '<img src=//jacobriggs.io/assets/images/header/riggs-logo.svg style="float:right;margin-bottom:14px;height: 40px;">'
            + '<p style="font-size:12pt;color:#727272;margin-top: 37px;line-height: 20px;">'
            +   'This popup has been generated by JavaScript inserted into the page as a result of a Cross-Site Scripting (XSS) vulnerability.'
            + '</p>'
            + '<p style="font-size:10pt;font-style:italic;color:#717171;">'
            +   'The injected script executes in the user\u2019s browser in the security context of the vulnerable page, potentially '
            +   'allowing an attacker to steal session tokens, redirect the user to malicious content, capture keystrokes, copy '
            +   'sensitive information from the page or the clipboard, or perform arbitrary actions on behalf of the user.'
            + '</p>'
            + '<p style="font-size:8pt;color:#3f4873"><a href="javascript:TINY.box.hide()" style="color:#3f4873;">close</a></p>';

    TINY.box.show(msg,0,520,270,1,0);

    // Add draggability to popup div.
    function loadAndMakeDraggable() {
        // Load jQuery if not already loaded
        if (typeof jQuery === 'undefined') {
            var script = document.createElement('script');
            script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
            script.onload = makeDraggable;
            document.head.appendChild(script);
        } else {
            makeDraggable();
        }
    }

    function makeDraggable() {
        console.log("Making popup draggable");
        jQuery('#tinybox').mousedown(function(e){
            window.my_dragging = {};
            my_dragging.pageX0 = e.pageX;
            my_dragging.pageY0 = e.pageY;
            my_dragging.elem = this;
            my_dragging.offset0 = jQuery(this).offset();
            function handle_dragging(e){
                var left = my_dragging.offset0.left + (e.pageX - my_dragging.pageX0);
                var top = my_dragging.offset0.top + (e.pageY - my_dragging.pageY0);
                jQuery(my_dragging.elem).offset({top: top, left: left});
            }
            function handle_mouseup(e){
                jQuery('body').off('mousemove', handle_dragging).off('mouseup', handle_mouseup);
            }
            jQuery('body').on('mouseup', handle_mouseup).on('mousemove', handle_dragging);
        });
    }
}
