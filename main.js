
Number.prototype.clamp = function (min, max) {
    'use strict';
    return Math.max(min, Math.min(this, max));
};
var url = document.location.href;
var n = parseInt((url.indexOf('n=') != -1) ? url.substring(url.indexOf('n=') + 2, ((url.substring(url.indexOf('n=') + 2, url.length)).indexOf('&') != -1) ? url.indexOf('n=') + 2 + (url.substring(url.indexOf('n=') + 2, url.length)).indexOf('&') : url.length) : 512 * 4);
var star = new Array(n);
var hyperspace = 0;
var lol = {}
lol.id = 'starfield';
lol.pr = {
    w: 1,
    h: 1
}; /* pixel ratio */
lol.zr = 256; /* focale */
lol.timer = 0;
lol.spd = 2; /* speed */
lol.rid = false; /* frame request id */
lol.cvs = false; /* canvas */
lol.ctx = false; /* 2d lol.ctx */
lol.util = {
    isboolean: function (v) {
        if (typeof v === 'boolean') {
            return true;
        }
        return false;
    },
    isnumber: function (v) {
        if (typeof v === 'number') {
            return true;
        }
        return false;
    },
    isstring: function (v) {
        if (typeof v === 'string') {
            return true;
        }
        return false;
    },
    isobject: function (v) {
        if (typeof v === 'object') {
            return true;
        }
        return false;
    },
    isfunction: function (v) {
        if (typeof v === 'function') {
            return true;
        }
        return false;
    },
    isempty: function (obj) {
        if (window.Object.getOwnPropertyNames(obj).length === 0) {
            return true;
        }
        return false;
    },
    isffx: function () {
        return (/firefox/i).test(window.navigator.userAgent);
    },
    copy: function (v) {
        return v.slice(0);
    },
    clone: function (v) {
        return Object.create({
            x: v.x,
            y: v.y,
            z: v.z
        });
    },
    sign: function (v) {
        v = parseFloat(Number(v).toFixed(1));
        if (v === 0) {
            return '&nbsp;';
        }
        if (v < 0) {
            return '';
        }
        if (v > 0) {
            return '+';
        }
    },
    random: function (n) {
        var i = 0,
            type, start, len, rnd = '';
        while (i < n) {
            type = Math.round(Math.random() * 2);
            if (type === 0) {
                start = 48;
                len = 10;
            } else {
                start = (Math.round(Math.random() * 2) % 2 === 0) ? 65 : 97;
                len = 26;
            }
            rnd += String.fromCharCode(start + Math.floor(Math.random() * len));
            i += 1;
        }
        return rnd;
    },
    interpolate: function (from, to, n, i) {
        return from + (to - from) / n * i;
    },
    time: function () {
        return (new Date()).getTime();
    }
};
lol.i = function (id) {
    return window.document.getElementById(String(id));
};
lol.el = function (el) {
    return window.document.createElement(String(el));
};
lol.tn = function (txt) {
    return window.document.createTextNode(String(txt));
};

function get_screen_size() {
    var w = document.documentElement.clientWidth;
    var h = document.documentElement.clientHeight;
    return Array(w, h);
};
lol.init = function () {
    //document.onkeyup=release;
    window.addEventListener('resize', lol.resize, false);
    window.addEventListener('mousemove', lol.mouse.move, false);
    var e = lol.util.isffx() ? 'DOMMouseScroll' : 'mousewheel';
    window.addEventListener(e, lol.mouse.wheel, false);
    window.addEventListener('keypress', lol.key, false);
    lol.viewport();
    lol.resize();
    for (var i = 0; i < n; i++) {
        star[i] = new Array(5);
        star[i].x = Math.random() * lol.w * 3 - lol.x * 3;
        star[i].y = Math.random() * lol.h * 3 - lol.y * 3;
        star[i].z = Math.round(Math.random() * lol.z);
        star[i].cx = lol.x;
        star[i].cy = lol.y;
    }
    lol.anim.start();
};
lol.viewport = function () {
    var el = lol.el('div');
    el.id = lol.id;
    el.style.position = 'absolute';
    window.document.body.appendChild(el);
    lol.cvs = lol.el('canvas');
    lol.cvs.id = lol.id + '-viewport';
    lol.cvs.style.position = 'absolute';
    el.appendChild(lol.cvs);
    lol.ctx = lol.cvs.getContext('2d');
};
lol.resize = function () {
    var w = window.innerWidth,
        h = window.innerHeight,
        el = lol.i(lol.id);
    lol.w = (w + lol.pr.w - w % lol.pr.w) / lol.pr.w;
    lol.w += lol.w % 2;
    lol.h = (h + lol.pr.h - h % lol.pr.h) / lol.pr.h;
    lol.h += lol.h % 2;
    lol.x = Math.round(w / 2);
    lol.y = Math.round(h / 2);
    lol.z = (w + h) / 2;
    lol.r = 1 / lol.z;
    el.width = lol.w * lol.pr.w;
    el.height = lol.h * lol.pr.h;
    lol.cvs.width = lol.w * lol.pr.w;
    lol.cvs.height = lol.h * lol.pr.h;
    lol.cvs.style.backgroundColor = '#999';
    lol.ctx.scale(lol.pr.w, lol.pr.h);
    lol.mouse.o = {
        x: lol.x,
        y: lol.y
    };
    //if(star.length>0){lol.anim.update();}
};
lol.anim = {
    update: function () {
        var c;
        lol.ctx.fillStyle = 'rgba(0,0,10,0.5)';
        if (hyperspace === 1) {
            lol.spd = lol.spd * 1.015;
            lol.zr = lol.zr * 0.99;
            c = Math.round(lol.spd * 4);
            lol.ctx.fillStyle = 'rgba(' + c + ',' + c + ',' + c + ',0.5)';
            if (lol.spd > 64) {
                lol.ctx.fillStyle = 'rgba(0,0,0,0.5)';
                lol.spd = 16;
                lol.zr = 256;
                hyperspace = 2;
            }
        }
        if (hyperspace === 2) {
            if (lol.spd > 1) {
                lol.spd *= 0.99;
            } else {
                lol.spd = 1;
                hyperspace = 0;
            }
        }
        lol.ctx.fillRect(0, 0, lol.w, lol.h);
        //lol.ctx.clearRect(0,0,lol.w,lol.h); /* clear viewport */
        for (var i = 0; i < n; i++) {
            var test = true,
                x2 = star[i].px,
                y2 = star[i].py;
            star[i].x += lol.mouse.p.x * 0.1;
            if (star[i].x > lol.x * 3) {
                star[i].x -= lol.w * 3;
                test = false;
            }
            if (star[i].x < -lol.x * 3) {
                star[i].x += lol.w * 3;
                test = false;
            }
            star[i].y += lol.mouse.p.y * 0.1;
            if (star[i].y > lol.y * 3) {
                star[i].y -= lol.h * 3;
                test = false;
            }
            if (star[i].y < -lol.y * 3) {
                star[i].y += lol.h * 3;
                test = false;
            }
            star[i].z -= lol.spd;
            if (star[i].z > lol.z) {
                star[i].z -= lol.z;
                test = false;
            }
            if (star[i].z < 0) {
                star[i].z += lol.z;
                test = false;
            }
            star[i].px = lol.x + (star[i].x / star[i].z) * lol.zr;
            star[i].py = lol.y + (star[i].y / star[i].z) * lol.zr;
            //if(x2>0&&x2<lol.w&&y2>0&&y2<lol.h&&test)
            if (test) {
                c = 1 - lol.r * star[i].z;
                lol.ctx.fillStyle = 'rgba(255,255,255,' + c + ')';
                lol.ctx.strokeStyle = 'rgba(255,255,255,' + (c / 4) + ')';
                lol.ctx.lineWidth = (1 - lol.r * star[i].z) * 1.5;
                lol.ctx.beginPath();
                lol.ctx.moveTo(x2, y2);
                lol.ctx.lineTo(star[i].px, star[i].py);
                lol.ctx.rect(star[i].px - 0.75, star[i].py - 0.75, 1.5, 1.5);
                // lol.ctx.arc(star[i].px - 0.75, star[i].py - 0.75, 1,  0, 2 * Math.PI);
                lol.ctx.closePath();
                lol.ctx.stroke();
                lol.ctx.fill();
            }
        }
        lol.rid = window.requestAnimationFrame(lol.anim.update);
    },
    start: function () {
        lol.anim.update();
    },
    stop: function () {
        window.cancelAnimationFrame(lol.rid);
        lol.rid = false;
    },
    pause: function () {
        lol.anim[lol.rid ? 'stop' : 'start']();
    }
};
lol.mouse = {
    p: {
        x: 0,
        y: 0
    },
    /* position */
    o: {
        x: 0,
        y: 0
    },
    /* origin */
    click: false,
    move: function (e) {
        e = e || window.event;
        lol.mouse.p.x = ((e.pageX - lol.mouse.o.x) / window.innerWidth) * 128;
        lol.mouse.p.y = ((e.pageY - lol.mouse.o.y) / window.innerHeight) * 128;
        console.log(lol.mouse.p.x)
        e.preventDefault();
    },
    wheel: function (e) {
        e = e || window.event;
        var delta = e.wheelDelta / 120;
        lol.spd -= delta * 0.3;
        e.preventDefault();
    }
};
lol.key = function (e) {
    e = e || window.event;
    console.log(e.keyCode);
    switch (e.keyCode) {
        case 13:
            lol.anim.pause();
            break;
        case 32:
            hyperspace = 1;
            break;
    }
};