(async function(){
    let attach = {
        body : 'body',
        input : 'textarea'
    }
    class xObj extends Object {
        constructor() {
            super();
        }
    }
    
    const atxz = {
        q : function(s) {
            if(!s) return;
            let p = this instanceof Window ? document : this;
            return p.querySelector(s);
        },
        qs : function(s) {
            if(!s) return;
            let p = this instanceof Window ? document : this;
            return p.querySelectorAll(s);
        },
        attr : function(q) {
            let e = this;
            if(typeof q == 'string') q = Object.values(arguments);
            if(Array.isArray(q)) {
                let r = new xObj();
                q.forEach((n)=>{ r[n] = e.getAttribute(n); });
                return r;
            }
            for(let k in q) {
                if(q.hasOwnProperty(k)) {
                    e.setAttribute(k, q[k]);
                }
            }
            return e;
        },
        prop : function(q) {
            let e = this;
            if(typeof q == 'string') q = Object.values(arguments);
            if(Array.isArray(q)) {
                let r = new xObj();
                q.forEach((n)=>{ r[n] = e[n]; });
                return r;
            }
            for(let k in q) {
                if(q.hasOwnProperty(k)) {
                    e[k] = q[k];
                }
            }
            return e;
        },
        css : function(q) {
            let e = this;
            if(typeof q == 'string') q = Object.values(arguments);
            if(Array.isArray(q)) {
                let r = new xObj();
                let ui = window.getComputedStyle(e);
                q.forEach((n)=>{ r[n] = ui[n]; });
                return r;
            }
            for(let k in q) {
                if(q.hasOwnProperty(k)) {
                    e.style[k] = q[k];
                }
            }
            return e;
        },
        on : function(ev, fn, b) {
            let e = this;
            return e.addEventListener(ev, fn, b || false);
        },
        off : function(fn) {
            let e = this;
            return e.removeEventListener(fn);
        },
        add(s, a, p, c, f) {
            if(!s) return;
            let pn = this instanceof Window ? null : this.hasOwnProperty('shadowRoot') ? this.shadowRoot : this;
            s = s.split(",");
            let els = [];
            for(let t of s) {
                let amt = 1;
                t = t.replace(/\*[\d]+/, function(d){
                    amt = parseFloat(d.replace('*',''));
                    return "";
                });
                for(l = 0; l < amt; l++) {
                    let tn = t.match(/\b\w/i) ? t.match(/\b[\w]+/i)[0] : null;
                    if(!tn) continue;
                    let cn = t.match(/\b\./gi) ? t.match(/\.[\w\-\_]+/gi) : null;
                    let idn = t.match(/\b\#/i) ? t.match(/\#[\w\-\_]+/i)[0] : null;
                    
                    let el = document.createElement(tn);
                    if(cn) el.className = cn.join(' ').replace(/\./g,"");
                    if(idn && l < 1) el.id = idn.replace('#','');
                    
                    if(a) el.attr(a);
                    if(p) el.prop(p);
                    if(c) el.css(c);
                    
                    if(pn) pn.appendChild(el);
                    els.push(el);
                }
            }
            return els.length > 1 ? els : els[0];
        }
    }
    const win = {
        q : atxz.q,
        qs : atxz.qs,
        add : atxz.add
    }
    for(let k in atxz) {
        if(atxz.hasOwnProperty(k)) {
            HTMLDocument.prototype[k] = atxz[k];
            HTMLElement.prototype[k] = atxz[k];
            ShadowRoot.prototype[k] = atxz[k];
        }
    }
    for(let k in win) {
        if(win.hasOwnProperty(k)) {
            Window.prototype[k] = win[k];
        }
    }
    
    //load temp chat data
    async function TMPInit(attach) {
        const tmpSource = '//cdn.jsdelivr.net/gh/leomilstechnologies/Chat.Template@main/chatTemplate.json'; //change to valid link
        async function loadTmp() {
            let d = await fetch(tmpSource)
            .then((response)=>response.json())
            .then((data)=>data)
            .catch((err)=>console.error(err.message));
            
            return d;
        }
        
        let tmpData = await loadTmp();
        
        let db = [];
        for(let t of tmpData) {
            let n = [];
            for(let k in t) {
                if(t.hasOwnProperty(k)) {
                    n.push(t[k].replace(/\n/g, ' '));
                }
            }
            db.push(n.join('>'));
        }
        db = db.join("|"); // data base ready
        
        const body = document.q(attach.body);
        const container = add('div');
        container.css({
            position: 'relative',
            zIndex: '9999999999'
        });
        body.insertBefore(container, body.children[0]);
        const shadow = container.attachShadow({ mode : 'open' });
        shadow.add('link', {
            rel : 'stylesheet',
            type : 'text/css',
            href : '//cdn.jsdelivr.net/gh/leomilstechnologies/Chat.Template@refs/heads/main/ui.tmp.css' //change to valid link
        })
        const app = shadow.add('div#tmp');
        const results = app.add('div#tmp-results');
        
        function quePatt(q) {
            return new RegExp(`([^\\|]*)?(${q})([^\\|]*)?\\|`,"gi");
        }
        function query(t) {
            let patt = quePatt(t);
            return db.match(patt);
        }
        function tmpCard(d) {
            if(!d) return;
            for(let str of d) {
                let l = str.replace("|","").split(">");
                let card = results.add('div.tmp-card');
                let label = card.add('div.tmp-label');
                label.innerHTML = `<span>${l[0]} : </span><span>${l[2]} ${l[1]}</span>`;
                let layout = card.add('div.tmp-layout');
                let format = l[3];
                
                format = format.replace(/(\.\.\.)/gi,'<div class="objectif" contentEditable>di isi</div>');
                layout.innerHTML = `${format}`;
                let toolbar = card.add('div.tmp-toolbars').add('button.tmp-select').prop({
                    'innerHTML' : 'Use'
                });
                toolbar.on('click', function() {
                    que.value = layout.textContent;
                }, false);
                layout.qs('.objectif').forEach((n)=>{
                    n.on('click', (e)=>e.target.innerHTML = '');
                });
            }
        }
        
        const que = document.q(attach.input);
        que.on('input', function() {
            results.innerHTML = "";
            if(!this.value.length || this.value.length > 15) return;
            let enquee = query(this.value);
            tmpCard(enquee);
        }, false);
    }
    Window.prototype['TMPInit'] = TMPInit;
}());

//TMPInit({ body : '#inputField', input: 'textarea'});

/*----------Copy this line to browser-----------*\
javascript:(function () { var script = document.createElement('script'); script.src="https://cdn.jsdelivr.net/gh/leomilstechnologies/Chat.Template@refs/heads/main/app.v1.1.js"; document.body.appendChild(script); script.onload = function () { TMPInit({'body':'#inputField','input':'textarea'}) } })();

*/