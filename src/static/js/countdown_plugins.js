/**
 * jCanvas v13.09.16
 * Copyright 2013 Caleb Evans
 * Released under the MIT license
 */
(function(e, t, n, r, i, s, o, u, a) {
    function L(e) {
        var t = this;
        l(t, e);
        return t
    }

    function A(e) {
        e ? l(L.prototype, e) : A.prefs = L.prototype = l({}, f);
        return this
    }

    function O(e) {
        return h(e) === "string"
    }

    function M(e) {
        return e && e.getContext ? e.getContext("2d") : u
    }

    function _(e) {
        e = l({}, e);
        e.masks = e.masks.slice(0);
        return e
    }

    function D(e, t) {
        var n;
        e.save();
        n = _(t.transforms);
        t.savedTransforms.push(n)
    }

    function P(e, t) {
        if (t.savedTransforms.length === 0) t.transforms = _(N);
        else {
            e.restore();
            t.transforms = t.savedTransforms.pop()
        }
    }

    function H(e, t, n) {
        p(n.fillStyle) ? t.fillStyle = n.fillStyle.call(e, n) : t.fillStyle = n.fillStyle;
        p(n.strokeStyle) ? t.strokeStyle = n.strokeStyle.call(e, n) : t.strokeStyle = n.strokeStyle;
        t.lineWidth = n.strokeWidth;
        if (n.rounded) t.lineCap = t.lineJoin = "round";
        else {
            t.lineCap = n.strokeCap;
            t.lineJoin = n.strokeJoin;
            t.miterLimit = n.miterLimit
        }
        t.shadowOffsetX = n.shadowX;
        t.shadowOffsetY = n.shadowY;
        t.shadowBlur = n.shadowBlur;
        t.shadowColor = n.shadowColor;
        t.globalAlpha = n.opacity;
        t.globalCompositeOperation = n.compositing;
        n.imageSmoothing && (t.webkitImageSmoothingEnabled = t.mozImageSmoothingEnabled = n.imageSmoothing)
    }

    function B(e, t, n) {
        if (n.mask) {
            n.autosave && D(e, t);
            e.clip();
            t.transforms.masks.push(n._args)
        }
    }

    function j(e, t) {
        t._transformed && e.restore()
    }

    function F(e, t, n) {
        var r;
        n.closed && t.closePath();
        if (n.shadowStroke && n.strokeWidth !== 0) {
            t.stroke();
            t.fill();
            t.shadowColor = "transparent";
            t.shadowBlur = 0;
            t.stroke()
        } else {
            t.fill();
            n.fillStyle !== "transparent" && (t.shadowColor = "transparent");
            n.strokeWidth !== 0 && t.stroke()
        }
        n.closed || t.closePath();
        j(t, n);
        if (n.mask) {
            r = z(e);
            B(t, r, n)
        }
    }

    function I(e, t, n) {
        t._toRad = t.inDegrees ? v / 180 : 1;
        e.translate(t.x, t.y);
        e.rotate(t.rotate * t._toRad);
        e.translate(-t.x, -t.y);
        n && (n.rotate += t.rotate * t._toRad)
    }

    function q(e, t, n) {
        t.scale !== 1 && (t.scaleX = t.scaleY = t.scale);
        e.translate(t.x, t.y);
        e.scale(t.scaleX, t.scaleY);
        e.translate(-t.x, -t.y);
        if (n) {
            n.scaleX *= t.scaleX;
            n.scaleY *= t.scaleY
        }
    }

    function R(e, t, n) {
        t.translate && (t.translateX = t.translateY = t.translate);
        e.translate(t.translateX, t.translateY);
        if (n) {
            n.translateX += t.translateX;
            n.translateY += t.translateY
        }
    }

    function U(e, t, n, r, i) {
        n._toRad = n.inDegrees ? v / 180 : 1;
        n._transformed = s;
        t.save();
        i === a && (i = r);
        if (!n.fromCenter && !n._centered) {
            n.x += r / 2;
            n.y += i / 2;
            n._centered = s
        }
        n.rotate && I(t, n, {});
        (n.scale !== 1 || n.scaleX !== 1 || n.scaleY !== 1) && q(t, n, {});
        (n.translate || n.translateX || n.translateY) && R(t, n, {})
    }

    function z(t) {
        var n;
        if (S._canvas === t && S._data) n = S._data;
        else {
            n = e.data(t, "jCanvas");
            if (!n) {
                n = {
                    canvas: t,
                    layers: [],
                    layer: {
                        names: {},
                        groups: {}
                    },
                    intersecting: [],
                    lastIntersected: u,
                    cursor: e(t).css("cursor"),
                    drag: {},
                    event: {
                        type: u,
                        x: u,
                        y: u
                    },
                    events: {},
                    transforms: _(N),
                    savedTransforms: [],
                    animating: o,
                    animated: u,
                    pos: 0,
                    pixelRatio: 1,
                    scaled: !1
                };
                e.data(t, "jCanvas", n)
            }
            S._canvas = t;
            S._data = n
        }
        return n
    }

    function W(e, t, n) {
        var r;
        for (r in A.events) A.events.hasOwnProperty(r) && (n[r] || n.cursors && n.cursors[r]) && X(e, t, n, r)
    }

    function X(e, t, n, r) {
        r = ot(r);
        A.events[r](e, t);
        n._event = s
    }

    function V(e, t, n) {
        var r, i, o;
        if (n.draggable || n.cursor || n.cursors) {
            r = ["mousedown", "mousemove", "mouseup"];
            for (o = 0; o < r.length; o += 1) {
                i = r[o];
                X(e, t, n, i)
            }
            if (!t.events.mouseoutdrag) {
                e.bind("mouseout.jCanvas", function() {
                    var n = t.drag.layer;
                    if (n) {
                        t.drag = {};
                        n.dragcancel && n.dragcancel.call(e[0], n);
                        e.drawLayers()
                    }
                });
                t.events.mouseoutdrag = s
            }
            n._event = s
        }
    }

    function $(e, t, n, r) {
        var i = t.layer.names;
        r ? r.name !== a && O(n.name) && n.name !== r.name && delete i[n.name] : r = n;
        O(r.name) && (i[r.name] = n)
    }

    function J(e, t, n, r) {
        var i = t.layer.groups,
            s, o, f, l, c;
        if (n.group !== u) {
            n.groups = [n.group];
            n.dragGroupWithLayer && (n.dragGroups = [n.group])
        }
        if (r && r.group !== a)
            if (r.group === u) r.groups = u;
            else {
                r.groups = [r.group];
                r.dragGroupWithLayer && (r.dragGroups = [r.group])
            }
        if (!r) r = n;
        else if (r.groups !== a && n.groups !== u)
            for (f = 0; f < n.groups.length; f += 1) {
                o = n.groups[f];
                s = i[o];
                if (s) {
                    for (c = 0; c < s.length; c += 1)
                        if (s[c] === n) {
                            l = c;
                            s.splice(c, 1);
                            break
                        }
                    s.length === 0 && delete i[o]
                }
            }
        if (r.groups !== a && r.groups !== u)
            for (f = 0; f < r.groups.length; f += 1) {
                o = r.groups[f];
                s = i[o];
                if (!s) {
                    s = i[o] = [];
                    s.name = o
                }
                l === a && (l = s.length);
                s.splice(l, 0, n)
            }
    }

    function K(e) {
        var t, n, r;
        t = {};
        for (n = e.intersecting.length - 1; n >= 0; n -= 1) {
            t = e.intersecting[n];
            if (t._masks) {
                for (r = t._masks.length - 1; r >= 0; r -= 1)
                    if (!t._masks[r].intersects) {
                        t.intersects = o;
                        break
                    }
                if (t.intersects) break
            }
        }
        return t
    }

    function Q(e, t, n, r) {
        if (n && n.visible && n._method) {
            r ? n._next = r : n._next = u;
            n._method.call(e, n)
        }
    }

    function G(e, t, n) {
        var r, i, u, a, f, l, h, p;
        a = t.drag;
        i = a.layer;
        f = i.dragGroups || [];
        r = t.layers;
        if (n === "mousemove" || n === "touchmove") {
            if (!a.dragging) {
                a.dragging = s;
                if (i.bringToFront) {
                    r.splice(i.index, 1);
                    i.index = r.push(i)
                }
                for (p = 0; p < f.length; p += 1) {
                    h = f[p];
                    l = t.layer.groups[h];
                    if (i.groups && l)
                        for (u = 0; u < l.length; u += 1)
                            if (l[u] !== i) {
                                l[u]._startX = l[u].x;
                                l[u]._startY = l[u].y;
                                l[u]._endX = i._eventX;
                                l[u]._endY = i._eventY;
                                if (l[u].bringToFront) {
                                    l[u].index = c(l[u], r);
                                    r.splice(l[u].index, 1);
                                    r.splice(-1, 0, l[u]);
                                    l[u].index = r.length - 2
                                }
                                l[u].dragstart && l[u].dragstart.call(e[0], l[u])
                            }
                }
                a._startX = i._startX = i.x;
                a._startY = i._startY = i.y;
                a._endX = i._endX = i._eventX;
                a._endY = i._endY = i._eventY;
                Y(e, i, "dragstart")
            }
            i.x = i._eventX - (a._endX - a._startX);
            i.y = i._eventY - (a._endY - a._startY);
            for (p = 0; p < f.length; p += 1) {
                h = f[p];
                l = t.layer.groups[h];
                if (i.groups && l)
                    for (u = 0; u < l.length; u += 1)
                        if (l[u] !== i) {
                            l[u].x = i._eventX - (l[u]._endX - l[u]._startX);
                            l[u].y = i._eventY - (l[u]._endY - l[u]._startY);
                            l[u].drag && l[u].drag.call(e[0], l[u])
                        }
            }
            Y(e, i, "drag")
        } else if (n === "mouseup" || n === "touchend") {
            if (a.dragging) {
                Y(e, i, "dragstop");
                a.dragging = o
            }
            for (p = 0; p < f.length; p += 1) {
                h = f[p];
                l = t.layer.groups[h];
                if (i.groups && l)
                    for (u = 0; u < l.length; u += 1) l[u] !== i && l[u].dragstop && l[u].dragstop.call(e[0], l[u])
            }
            t.drag = {}
        }
    }

    function Y(e, t, n, r) {
        r || (t.cursors ? r = t.cursors[n] : r = t.cursor);
        r && e.css({
            cursor: r
        });
        t[n] && t[n].call(e[0], t)
    }

    function Z(t, n, r, i) {
        var o, a, f = n,
            l;
        n._args = r;
        n.canvas = t;
        if (n.draggable || n.dragGroups) {
            n.layer = s;
            n.draggable = s
        }
        i ? n._method = i : n.method ? n._method = e.fn[n.method] : n.type ? n._method = e.fn[E[n.type]] : n._method = function() {};
        if (n.layer && !n._layer) {
            o = e(t);
            a = o.getLayers();
            l = z(t);
            f = new L(n);
            f.layer = s;
            f._layer = s;
            $(o, l, f);
            J(o, l, f);
            W(o, l, f);
            V(o, l, f);
            n._event = f._event;
            f.index === u && (f.index = a.length);
            a.splice(f.index, 0, f)
        }
        return f
    }

    function et(e) {
        var t, n;
        for (n = 0; n < C.length; n += 1) {
            t = C[n];
            e[t] = e["_" + t]
        }
    }

    function tt(e, t) {
        var n, r;
        for (r = 0; r < C.length; r += 1) {
            n = C[r];
            e["_" + n] = e[n];
            k[n] = s;
            t && delete e[n]
        }
    }

    function nt(e, t, n) {
        var r;
        for (r in n) n.hasOwnProperty(r) && p(n[r]) && (n[r] = n[r].call(e, t, r));
        return n
    }

    function rt(n) {
        var r, s, o = [],
            u = 1;
        if (n.match(/^#?\w+$/gi)) {
            n === "transparent" && (n = "rgba(0,0,0,0)");
            s = t.head;
            r = s.style.color;
            s.style.color = n;
            n = e.css(s, "color");
            s.style.color = r
        }
        if (n.match(/^rgb/gi)) {
            o = n.match(/\d+/gi);
            n.match(/%/gi) && (u = 2.55);
            o[0] *= u;
            o[1] *= u;
            o[2] *= u;
            o[3] !== a ? o[3] = i(o[3]) : o[3] = 1
        }
        return o
    }

    function it(e) {
        var t = 3,
            n;
        if (h(e.start) !== "array") {
            e.start = rt(e.start);
            e.end = rt(e.end)
        }
        e.now = [];
        if (e.start[3] !== 1 || e.end[3] !== 1) t = 4;
        for (n = 0; n < t; n += 1) {
            e.now[n] = e.start[n] + (e.end[n] - e.start[n]) * e.pos;
            n < 3 && (e.now[n] = d(e.now[n]))
        }
        if (e.start[3] !== 1 || e.end[3] !== 1) e.now = "rgba(" + e.now.join(",") + ")";
        else {
            e.now.slice(0, 3);
            e.now = "rgb(" + e.now.join(",") + ")"
        }
        e.elem.nodeName ? e.elem.style[e.prop] = e.now : e.elem[e.prop] = e.now
    }

    function st(t) {
        var n;
        for (n = 0; n < t.length; n += 1) e.fx.step[t[n]] = it
    }

    function ot(e) {
        window.ontouchstart !== undefined && b[e] && (e = b[e]);
        return e
    }

    function ut(e) {
        w[e] && (e = w[e]);
        return e
    }

    function at(e) {
        A.events[e] = function(t, n) {
            var r, i;
            i = n.event;
            r = e === "mouseover" || e === "mouseout" ? "mousemove" : e;
            if (!n.events[r]) {
                t.bind(r + ".jCanvas", function(e) {
                    i.x = e.offsetX;
                    i.y = e.offsetY;
                    i.type = r;
                    i.event = e;
                    t.drawLayers({
                        resetFire: s
                    });
                    e.preventDefault()
                });
                n.events[r] = s
            }
        }
    }

    function ft(e) {
        var t;
        for (t = 0; t < e.length; t += 1) at(e[t])
    }

    function lt(e, t, n) {
        var r, i, s, o, a, f, l, c;
        r = n._args;
        if (r._event) {
            i = z(e);
            s = i.event;
            if (s.x !== u && s.y !== u) {
                f = s.x * i.pixelRatio;
                l = s.y * i.pixelRatio;
                o = t.isPointInPath(f, l) || t.isPointInStroke && t.isPointInStroke(f, l)
            }
            a = i.transforms;
            r.eventX = r.mouseX = s.x;
            r.eventY = r.mouseY = s.y;
            r.event = s.event;
            c = i.transforms.rotate;
            f = r.eventX;
            l = r.eventY;
            if (c !== 0) {
                r._eventX = f * g(-c) - l * m(-c);
                r._eventY = l * g(-c) + f * m(-c)
            } else {
                r._eventX = f;
                r._eventY = l
            }
            r._eventX /= a.scaleX;
            r._eventY /= a.scaleY;
            o && i.intersecting.push(r);
            r.intersects = o
        }
    }

    function ct(e, t) {
        isNaN(Number(t.fontSize)) || (t.fontSize += "px");
        e.font = t.fontStyle + " " + t.fontSize + " " + t.fontFamily
    }

    function ht(t, n, r, s) {
        var o, u, a;
        if (x.text === r.text && x.fontStyle === r.fontStyle && x.fontSize === r.fontSize && x.fontFamily === r.fontFamily && x.maxWidth === r.maxWidth && x.lineHeight === r.lineHeight) {
            r.width = x.width;
            r.height = x.height
        } else {
            r.width = n.measureText(s[0]).width;
            for (a = 1; a < s.length; a += 1) {
                u = n.measureText(s[a]).width;
                u > r.width && (r.width = u)
            }
            o = t.style.fontSize;
            t.style.fontSize = r.fontSize;
            r.height = i(e.css(t, "fontSize")) * s.length * r.lineHeight;
            t.style.fontSize = o
        }
    }

    function pt(e, t) {
        var n = t.text,
            r = t.maxWidth,
            i = n.split("\n"),
            s = [],
            o, u, a, f, l, c;
        for (a = 0; a < i.length; a += 1) {
            f = i[a];
            l = f.split(" ");
            o = [];
            u = "";
            if (l.length === 1 || e.measureText(f).width < r) o = [f];
            else {
                for (c = 0; c < l.length; c += 1) {
                    if (e.measureText(u + l[c]).width > r) {
                        u !== "" && o.push(u);
                        u = ""
                    }
                    u += l[c];
                    c !== l.length - 1 && (u += " ")
                }
                o.push(u)
            }
            s = s.concat(o.join("\n").replace(/( (\n))|( $)/gi, "$2").split("\n"))
        }
        return s
    }
    var f, l = e.extend,
        c = e.inArray,
        h = e.type,
        p = e.isFunction,
        d = r.round,
        v = r.PI,
        m = r.sin,
        g = r.cos,
        y = e.event.fix,
        b, w, E, S = {}, x = {}, T = {}, N = {
            rotate: 0,
            scaleX: 1,
            scaleY: 1,
            translateX: 0,
            translateY: 0,
            masks: []
        }, C, k;
    e.fn.jCanvas = A;
    A.events = {};
    f = {
        align: "center",
        autosave: s,
        baseline: "middle",
        bringToFront: o,
        ccw: o,
        closed: o,
        compositing: "source-over",
        concavity: 0,
        cornerRadius: 0,
        count: 1,
        cropFromCenter: s,
        cursor: u,
        cursors: u,
        disableEvents: o,
        draggable: o,
        dragGroups: u,
        group: u,
        groups: u,
        data: {},
        each: u,
        end: 360,
        fillStyle: "transparent",
        fontStyle: "normal",
        fontSize: "12pt",
        fontFamily: "sans-serif",
        fromCenter: s,
        fn: u,
        height: u,
        imageSmoothing: s,
        inDegrees: s,
        index: u,
        lineHeight: 1,
        layer: o,
        load: u,
        mask: o,
        maxWidth: u,
        miterLimit: 10,
        name: u,
        opacity: 1,
        r1: u,
        r2: u,
        radius: 0,
        repeat: "repeat",
        respectAlign: o,
        rotate: 0,
        rounded: o,
        scale: 1,
        scaleX: 1,
        scaleY: 1,
        shadowBlur: 0,
        shadowColor: "transparent",
        shadowStroke: !1,
        shadowX: 0,
        shadowY: 0,
        sHeight: u,
        sides: 0,
        source: "",
        spread: 0,
        start: 0,
        strokeCap: "butt",
        strokeJoin: "miter",
        strokeStyle: "transparent",
        strokeWidth: 1,
        sWidth: u,
        sx: u,
        sy: u,
        text: "",
        translate: 0,
        translateX: 0,
        translateY: 0,
        type: u,
        visible: s,
        width: u,
        x: 0,
        y: 0
    };
    A();
    A.extend = function(n) {
        A.defaults = l(f, n.props);
        A();
        n.name && (e.fn[n.name] = function r(e) {
            var t = this,
                i, s, o, u, a;
            for (s = 0; s < t.length; s += 1) {
                i = t[s];
                o = M(i);
                if (o) {
                    u = new L(e);
                    a = Z(i, u, e, r);
                    H(i, o, u);
                    n.fn.call(i, o, u)
                }
            }
            return t
        });
        return e.fn[n.name]
    };
    e.fn.getLayers = function(t) {
        var n = this[0],
            r, i, s, o = [];
        if (n && n.getContext) {
            r = z(n);
            i = r.layers;
            if (p(t))
                for (s = 0; s < i.length; s += 1) t.call(n, i[s]) && o.push(i[s]);
            else o = i
        }
        return o
    };
    e.fn.getLayer = function(t) {
        var n = this[0],
            r = z(n),
            i = r.layers,
            s = h(t),
            o, u;
        if (t && t.layer) o = t;
        else if (s === "number") {
            t < 0 && (t = i.length + t);
            o = i[t]
        } else if (s === "regexp") {
            for (u = 0; u < i.length; u += 1)
                if (O(i[u].name) && i[u].name.match(t)) {
                    o = i[u];
                    break
                }
        } else o = r.layer.names[t];
        return o
    };
    e.fn.getLayerGroup = function(t) {
        var n = h(t),
            r, i, s, o;
        if (n === "array") return t;
        if (n === "regexp") {
            o = z(this[0]);
            r = o.groups;
            for (i in r)
                if (i.match(t)) {
                    s = r[i];
                    break
                }
        } else {
            o = z(this[0]);
            s = o.layer.groups[t]
        }
        return s
    };
    e.fn.getLayerIndex = function(t) {
        var n = this,
            r = n.getLayers(),
            i = n.getLayer(t);
        return c(i, r)
    };
    e.fn.setLayer = function(n, r) {
        var i = this,
            s, o, u, f;
        for (o = 0; o < i.length; o += 1) {
            s = e(i[o]);
            u = z(i[o]);
            f = e(i[o]).getLayer(n);
            if (f) {
                $(s, u, f, r);
                J(s, u, f, r);
                r.index !== a && s.moveLayer(f, r.index);
                l(f, r);
                W(s, u, f);
                V(s, u, f)
            }
        }
        return i
    };
    e.fn.setLayerGroup = function(n, r) {
        var i = this,
            s, o, u, a;
        for (o = 0; o < i.length; o += 1) {
            s = e(i[o]);
            u = s.getLayerGroup(n);
            if (u)
                for (a = 0; a < u.length; a += 1) s.setLayer(u[a], r)
        }
        return i
    };
    e.fn.setLayers = function(n) {
        var r = this,
            i, s, o, u;
        for (s = 0; s < r.length; s += 1) {
            i = e(r[s]);
            o = i.getLayers();
            for (u = 0; u < o.length; u += 1) i.setLayer(o[u], n)
        }
        return r
    };
    e.fn.moveLayer = function(n, r) {
        var i = this,
            s, o, u, a;
        for (o = 0; o < i.length; o += 1) {
            s = e(i[o]);
            u = s.getLayers();
            a = s.getLayer(n);
            if (a) {
                a.index = c(a, u);
                u.splice(a.index, 1);
                u.splice(r, 0, a);
                r < 0 && (r = u.length + r);
                a.index = r
            }
        }
        return i
    };
    e.fn.removeLayer = function(n) {
        var r = this,
            i, s, o, a, f;
        for (s = 0; s < r.length; s += 1) {
            i = e(r[s]);
            o = z(r[s]);
            a = i.getLayers();
            f = i.getLayer(n);
            if (f) {
                f.index = c(f, a);
                a.splice(f.index, 1);
                $(i, o, f, {
                    name: u
                });
                J(i, o, f, {
                    groups: u
                })
            }
        }
        return r
    };
    e.fn.removeLayerGroup = function(n) {
        var r = this,
            i, s, o, f, l, h, p;
        if (n !== a)
            for (s = 0; s < r.length; s += 1) {
                i = e(r[s]);
                o = z(r[s]);
                f = i.getLayers();
                l = i.getLayerGroup(n);
                if (l) {
                    for (p = 0; p < l.length; p += 1) {
                        h = l[p];
                        h.index = c(h, f);
                        f.splice(h.index, 1);
                        $(i, o, h, {
                            name: u
                        })
                    }
                    delete o.layer.groups[l.name]
                }
            }
        return r
    };
    e.fn.removeLayers = function() {
        var n = this,
            r, i, s;
        for (i = 0; i < n.length; i += 1) {
            r = e(n[i]);
            s = z(n[i]);
            s.layers.length = 0;
            s.layer.names = {};
            s.layer.groups = {}
        }
        return n
    };
    e.fn.addLayerToGroup = function(n, r) {
        var i = this,
            s, o, u, a = [];
        for (o = 0; o < i.length; o += 1) {
            s = e(i[o]);
            u = s.getLayer(n);
            if (u.groups && c(r, u.groups) === -1) {
                a = u.groups.slice(0);
                a.push(r);
                s.setLayer(u, {
                    groups: a
                })
            }
        }
        return i
    };
    e.fn.removeLayerFromGroup = function(n, r) {
        var i = this,
            s, o, u, a = [],
            f;
        for (o = 0; o < i.length; o += 1) {
            s = e(i[o]);
            u = s.getLayer(n);
            f = c(r, u.groups);
            if (f !== -1) {
                a = u.groups.slice(0);
                a.splice(f, 1);
                s.setLayer(u, {
                    groups: a
                })
            }
        }
        return i
    };
    e.fn.drawLayer = function(n) {
        var r = this,
            i, s, o, u;
        for (i = 0; i < r.length; i += 1) {
            o = e(r[i]);
            s = M(r[i]);
            u = o.getLayer(n);
            Q(o, s, u)
        }
        return r
    };
    e.fn.drawLayers = function(n) {
        var r = this,
            i, a, f, c = l({}, n),
            h, p, d, v, m, g, y, b, w;
        c.index || (c.index = 0);
        for (a = 0; a < r.length; a += 1) {
            i = e(r[a]);
            f = M(r[a]);
            if (f) {
                g = z(r[a]);
                c.clear !== o && i.clearCanvas();
                h = g.layers;
                for (v = c.index; v < h.length; v += 1) {
                    p = h[v];
                    p.index = v;
                    c.resetFire && (p._fired = o);
                    p._event = !p.disableEvents;
                    Q(i, f, p, v + 1);
                    p._masks = g.transforms.masks.slice(0);
                    if (p._method === e.fn.drawImage && p.visible) break
                }
                m = v;
                p = K(g);
                y = g.event;
                b = y.type;
                p[b] || (b = ut(b));
                w = g.drag;
                d = g.lastIntersected;
                if (d !== u && p !== d && d._hovered && !d._fired) {
                    g.lastIntersected = u;
                    d._fired = s;
                    d._hovered = o;
                    Y(i, d, "mouseout", g.cursor)
                }
                if (p._event && p.intersects) {
                    g.lastIntersected = p;
                    if (p.mouseover || p.mouseout || p.cursor || p.cursors)
                        if (!p._hovered && !p._fired) {
                            p._fired = s;
                            p._hovered = s;
                            Y(i, p, "mouseover")
                        }
                    if (!p._fired) {
                        p._fired = s;
                        y.type = u;
                        Y(i, p, b)
                    }
                    p.draggable && (b === "mousedown" || b === "touchstart") && (w.layer = p)
                }
                w.layer && G(i, g, b);
                if (m === h.length) {
                    g.intersecting.length = 0;
                    g.transforms = _(N);
                    g.savedTransforms.length = 0
                }
            }
        }
        return r
    };
    e.fn.addLayer = function(t) {
        var n = this,
            r, i, o;
        for (r = 0; r < n.length; r += 1) {
            i = M(n[r]);
            if (i) {
                o = new L(t);
                o.layer = s;
                Z(n[r], o, t)
            }
        }
        return n
    };
    C = ["width", "height", "opacity", "lineHeight"];
    k = {};
    e.fn.animateLayer = function() {
        function g(e, t, n) {
            return function() {
                et(n);
                (!t.animating || t.animated === n) && e.drawLayers();
                c[4] && c[4].call(e[0], n);
                n._animating = o;
                t.animating = o;
                t.animated = u
            }
        }

        function y(e, t, n) {
            return function(r, i) {
                if (n._pos !== i.pos) {
                    n._pos = i.pos;
                    et(n);
                    if (!n._animating && !t.animating) {
                        n._animating = s;
                        t.animating = s;
                        t.animated = n
                    }(!t.animating || t.animated === n) && e.drawLayers();
                    c[5] && c[5].call(e[0], r, i, n)
                }
            }
        }
        var n = this,
            r, i, f, c = [].slice.call(arguments, 0),
            d, v, m;
        if (h(c[2]) === "object") {
            c.splice(2, 0, c[2].duration || u);
            c.splice(3, 0, c[3].easing || u);
            c.splice(4, 0, c[4].done || c[4].complete || u);
            c.splice(5, 0, c[5].step || u)
        } else {
            if (c[2] === a) {
                c.splice(2, 0, u);
                c.splice(3, 0, u);
                c.splice(4, 0, u)
            } else if (p(c[2])) {
                c.splice(2, 0, u);
                c.splice(3, 0, u)
            }
            if (c[3] === a) {
                c[3] = u;
                c.splice(4, 0, u)
            } else p(c[3]) && c.splice(3, 0, u)
        }
        for (i = 0; i < n.length; i += 1) {
            r = e(n[i]);
            f = M(n[i]);
            if (f) {
                d = z(n[i]);
                v = r.getLayer(c[0]);
                if (v && v._method !== e.fn.draw) {
                    m = l({}, c[1]);
                    m = nt(n[i], v, m);
                    tt(m, s);
                    tt(v);
                    v.style = k;
                    e(v).animate(m, {
                        duration: c[2],
                        easing: e.easing[c[3]] ? c[3] : u,
                        complete: g(r, d, v),
                        step: y(r, d, v)
                    })
                }
            }
        }
        return n
    };
    e.fn.animateLayerGroup = function(n) {
        var r = this,
            i, s, o = [].slice.call(arguments, 0),
            u, a;
        for (s = 0; s < r.length; s += 1) {
            i = e(r[s]);
            u = i.getLayerGroup(n);
            if (u)
                for (a = 0; a < u.length; a += 1) i.animateLayer.apply(i, [u[a]].concat(o.slice(1)))
        }
        return r
    };
    e.fn.delayLayer = function(n, r) {
        var i = this,
            s, o;
        r = r || 0;
        for (s = 0; s < i.length; s += 1) {
            o = e(i[s]).getLayer(n);
            e(o).delay(r)
        }
        return i
    };
    e.fn.delayLayerGroup = function(n, r) {
        var i = this,
            s, o, u, a, f;
        r = r || 0;
        for (o = 0; o < i.length; o += 1) {
            s = e(i[o]);
            u = s.getLayerGroup(n);
            if (u)
                for (f = 0; f < u.length; f += 1) {
                    a = u[f];
                    a && e(a).delay(r)
                }
        }
        return i
    };
    e.fn.stopLayer = function(n, r) {
        var i = this,
            s, o, u;
        for (o = 0; o < i.length; o += 1) {
            s = e(i[o]);
            u = s.getLayer(n);
            u && e(u).stop(r)
        }
        return i
    };
    e.fn.stopLayerGroup = function(n, r) {
        var i = this,
            s, o, u, a, f;
        for (o = 0; o < i.length; o += 1) {
            s = e(i[o]);
            u = s.getLayerGroup(n);
            if (u)
                for (f = 0; f < u.length; f += 1) {
                    a = u[f];
                    a && e(a).stop(r)
                }
        }
        return i
    };
    st(["color", "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "fillStyle", "outlineColor", "strokeStyle", "shadowColor"]);
    b = {
        mousedown: "touchstart",
        mouseup: "touchend",
        mousemove: "touchmove"
    };
    w = {
        touchstart: "mousedown",
        touchend: "mouseup",
        touchmove: "mousemove"
    };
    ft(["click", "dblclick", "mousedown", "mouseup", "mousemove", "mouseover", "mouseout", "touchstart", "touchmove", "touchend"]);
    e.event.fix = function(t) {
        var n, r, i;
        t = y.call(e.event, t);
        r = t.originalEvent;
        if (r) {
            i = r.changedTouches;
            if (t.pageX !== a && t.offsetX === a) {
                n = e(t.target).offset();
                if (n) {
                    t.offsetX = t.pageX - n.left;
                    t.offsetY = t.pageY - n.top
                }
            } else if (i) {
                n = e(r.target).offset();
                if (n) {
                    t.offsetX = i[0].pageX - n.left;
                    t.offsetY = i[0].pageY - n.top
                }
            }
        }
        return t
    };
    E = {
        arc: "drawArc",
        bezier: "drawBezier",
        ellipse: "drawEllipse",
        "function": "draw",
        image: "drawImage",
        line: "drawLine",
        polygon: "drawPolygon",
        slice: "drawSlice",
        quadratic: "drawQuadratic",
        rectangle: "drawRect",
        text: "drawText",
        vector: "drawVector"
    };
    e.fn.draw = function dt(t) {
        var n = this,
            r, i, s, o = new L(t),
            u;
        if (E[o.type]) n[E[o.type]](o);
        else
            for (i = 0; i < n.length; i += 1) {
                r = e(n[i]);
                s = M(n[i]);
                if (s) {
                    o = new L(t);
                    u = Z(n[i], o, t, dt);
                    o.visible && o.fn && o.fn.call(n[i], s, o)
                }
            }
        return n
    };
    e.fn.clearCanvas = function vt(e) {
        var t = this,
            n, r, i = new L(e),
            s;
        for (n = 0; n < t.length; n += 1) {
            r = M(t[n]);
            if (r)
                if (i.width === u || i.height === u) {
                    r.save();
                    r.setTransform(1, 0, 0, 1, 0, 0);
                    r.clearRect(0, 0, t[n].width, t[n].height);
                    r.restore()
                } else {
                    s = Z(t[n], i, e, vt);
                    U(t[n], r, i, i.width, i.height);
                    r.clearRect(i.x - i.width / 2, i.y - i.height / 2, i.width, i.height);
                    j(r, i)
                }
        }
        return t
    };
    e.fn.saveCanvas = function mt(e) {
        var t = this,
            n, r, i, s, o, u;
        for (n = 0; n < t.length; n += 1) {
            r = M(t[n]);
            if (r) {
                o = z(t[n]);
                i = new L(e);
                s = Z(t[n], i, e, mt);
                for (u = 0; u < i.count; u += 1) D(r, o)
            }
        }
        return t
    };
    e.fn.restoreCanvas = function gt(e) {
        var t = this,
            n, r, i, s, o, u;
        for (n = 0; n < t.length; n += 1) {
            r = M(t[n]);
            if (r) {
                o = z(t[n]);
                i = new L(e);
                s = Z(t[n], i, e, gt);
                for (u = 0; u < i.count; u += 1) P(r, o)
            }
        }
        return t
    };
    e.fn.restoreCanvasOnRedraw = function(t) {
        var n = this,
            r = l({}, t);
        r.layer = s;
        n.restoreCanvas(r);
        return n
    };
    e.fn.rotateCanvas = function yt(e) {
        var t = this,
            n, r, i, s, o;
        for (n = 0; n < t.length; n += 1) {
            r = M(t[n]);
            if (r) {
                o = z(t[n]);
                i = new L(e);
                s = Z(t[n], i, e, yt);
                i.autosave && D(r, o);
                I(r, i, o.transforms)
            }
        }
        return t
    };
    e.fn.scaleCanvas = function bt(e) {
        var t = this,
            n, r, i, s, o;
        for (n = 0; n < t.length; n += 1) {
            r = M(t[n]);
            if (r) {
                o = z(t[n]);
                i = new L(e);
                s = Z(t[n], i, e, bt);
                i.autosave && D(r, o);
                q(r, i, o.transforms)
            }
        }
        return t
    };
    e.fn.translateCanvas = function wt(e) {
        var t = this,
            n, r, i, s, o;
        for (n = 0; n < t.length; n += 1) {
            r = M(t[n]);
            if (r) {
                o = z(t[n]);
                i = new L(e);
                s = Z(t[n], i, e, wt);
                i.autosave && D(r, o);
                R(r, i, o.transforms)
            }
        }
        return t
    };
    e.fn.drawRect = function Et(e) {
        var t = this,
            n, r, i, u, a, f, l, c, h;
        for (n = 0; n < t.length; n += 1) {
            r = M(t[n]);
            if (r) {
                i = new L(e);
                u = Z(t[n], i, e, Et);
                if (i.visible) {
                    H(t[n], r, i);
                    U(t[n], r, i, i.width, i.height);
                    r.beginPath();
                    a = i.x - i.width / 2;
                    f = i.y - i.height / 2;
                    h = i.cornerRadius;
                    if (h) {
                        i.closed = s;
                        l = i.x + i.width / 2;
                        c = i.y + i.height / 2;
                        l - a - 2 * h < 0 && (h = (l - a) / 2);
                        c - f - 2 * h < 0 && (h = (c - f) / 2);
                        r.moveTo(a + h, f);
                        r.lineTo(l - h, f);
                        r.arc(l - h, f + h, h, 3 * v / 2, v * 2, o);
                        r.lineTo(l, c - h);
                        r.arc(l - h, c - h, h, 0, v / 2, o);
                        r.lineTo(a + h, c);
                        r.arc(a + h, c - h, h, v / 2, v, o);
                        r.lineTo(a, f + h);
                        r.arc(a + h, f + h, h, v, 3 * v / 2, o)
                    } else r.rect(a, f, i.width, i.height);
                    i._event && lt(t[n], r, i);
                    F(t[n], r, i)
                }
            }
        }
        return t
    };
    e.fn.drawArc = function St(e) {
        var t = this,
            n, r, i, s;
        for (n = 0; n < t.length; n += 1) {
            r = M(t[n]);
            if (r) {
                i = new L(e);
                s = Z(t[n], i, e, St);
                if (i.visible) {
                    H(t[n], r, i);
                    U(t[n], r, i, i.radius * 2);
                    !i.inDegrees && i.end === 360 && (i.end = v * 2);
                    i.start *= i._toRad;
                    i.end *= i._toRad;
                    i.start -= v / 2;
                    i.end -= v / 2;
                    r.beginPath();
                    r.arc(i.x, i.y, i.radius, i.start, i.end, i.ccw);
                    i._event && lt(t[n], r, i);
                    F(t[n], r, i)
                }
            }
        }
        return t
    };
    e.fn.drawEllipse = function xt(e) {
        var t = this,
            n, r, i, o, u, a;
        for (n = 0; n < t.length; n += 1) {
            r = M(t[n]);
            if (r) {
                i = new L(e);
                o = Z(t[n], i, e, xt);
                if (i.visible) {
                    H(t[n], r, i);
                    U(t[n], r, i, i.width, i.height);
                    u = i.width * (4 / 3);
                    a = i.height;
                    r.beginPath();
                    r.moveTo(i.x, i.y - a / 2);
                    r.bezierCurveTo(i.x - u / 2, i.y - a / 2, i.x - u / 2, i.y + a / 2, i.x, i.y + a / 2);
                    r.bezierCurveTo(i.x + u / 2, i.y + a / 2, i.x + u / 2, i.y - a / 2, i.x, i.y - a / 2);
                    i._event && lt(t[n], r, i);
                    i.closed = s;
                    F(t[n], r, i)
                }
            }
        }
        return t
    };
    e.fn.drawPolygon = function Tt(e) {
        var t = this,
            n, r, i, o, u, a, f, l, c, h, p;
        for (n = 0; n < t.length; n += 1) {
            r = M(t[n]);
            if (r) {
                i = new L(e);
                o = Z(t[n], i, e, Tt);
                if (i.visible) {
                    H(t[n], r, i);
                    U(t[n], r, i, i.radius * 2);
                    a = 2 * v / i.sides;
                    f = a / 2;
                    u = f + v / 2;
                    l = i.radius * g(f);
                    r.beginPath();
                    for (p = 0; p < i.sides; p += 1) {
                        c = i.x + i.radius * g(u);
                        h = i.y + i.radius * m(u);
                        r.lineTo(c, h);
                        if (i.concavity) {
                            c = i.x + (l + -l * i.concavity) * g(u + f);
                            h = i.y + (l + -l * i.concavity) * m(u + f);
                            r.lineTo(c, h)
                        }
                        u += a
                    }
                    i._event && lt(t[n], r, i);
                    i.closed = s;
                    F(t[n], r, i)
                }
            }
        }
        return t
    };
    e.fn.drawSlice = function Nt(t) {
        var n = this,
            r, i, o, u, a, f, l, c;
        for (i = 0; i < n.length; i += 1) {
            r = e(n[i]);
            o = M(n[i]);
            if (o) {
                u = new L(t);
                a = Z(n[i], u, t, Nt);
                if (u.visible) {
                    H(n[i], o, u);
                    U(n[i], o, u, u.radius * 2);
                    u.start *= u._toRad;
                    u.end *= u._toRad;
                    u.start -= v / 2;
                    u.end -= v / 2;
                    while (u.start < 0) u.start += 2 * v;
                    while (u.end < 0) u.end += 2 * v;
                    u.end < u.start && (u.end += 2 * v);
                    f = (u.start + u.end) / 2;
                    l = u.radius * u.spread * g(f);
                    c = u.radius * u.spread * m(f);
                    u.x += l;
                    u.y += c;
                    o.beginPath();
                    o.arc(u.x, u.y, u.radius, u.start, u.end, u.ccw);
                    o.lineTo(u.x, u.y);
                    u._event && lt(n[i], o, u);
                    u.closed = s;
                    F(n[i], o, u)
                }
            }
        }
        return n
    };
    e.fn.drawLine = function Ct(e) {
        var t = this,
            n, r, i, o, u, f, l;
        for (n = 0; n < t.length; n += 1) {
            r = M(t[n]);
            if (r) {
                i = new L(e);
                o = Z(t[n], i, e, Ct);
                if (i.visible) {
                    H(t[n], r, i);
                    U(t[n], r, i, 0);
                    u = 1;
                    r.beginPath();
                    while (s) {
                        f = i["x" + u];
                        l = i["y" + u];
                        if (f === a || l === a) break;
                        r.lineTo(f + i.x, l + i.y);
                        u += 1
                    }
                    i._event && lt(t[n], r, i);
                    F(t[n], r, i)
                }
            }
        }
        return t
    };
    e.fn.drawQuadratic = function kt(e) {
        var t = this,
            n, r, i, o, u, f, l, c, h;
        for (n = 0; n < t.length; n += 1) {
            r = M(t[n]);
            if (r) {
                i = new L(e);
                o = Z(t[n], i, e, kt);
                if (i.visible) {
                    H(t[n], r, i);
                    U(t[n], r, i, 0);
                    u = 2;
                    r.beginPath();
                    r.moveTo(i.x1 + i.x, i.y1 + i.y);
                    while (s) {
                        f = i["x" + u];
                        l = i["y" + u];
                        c = i["cx" + (u - 1)];
                        h = i["cy" + (u - 1)];
                        if (f === a || l === a || c === a || h === a) break;
                        r.quadraticCurveTo(c + i.x, h + i.y, f + i.x, l + i.y);
                        u += 1
                    }
                    i._event && lt(t[n], r, i);
                    F(t[n], r, i)
                }
            }
        }
        return t
    };
    e.fn.drawBezier = function Lt(e) {
        var t = this,
            n, r, i, o, u, f, l, c, h, p, d, v;
        for (n = 0; n < t.length; n += 1) {
            r = M(t[n]);
            if (r) {
                i = new L(e);
                o = Z(t[n], i, e, Lt);
                if (i.visible) {
                    H(t[n], r, i);
                    U(t[n], r, i, 0);
                    u = 2;
                    f = 1;
                    r.beginPath();
                    r.moveTo(i.x1 + i.x, i.y1 + i.y);
                    while (s) {
                        l = i["x" + u];
                        c = i["y" + u];
                        h = i["cx" + f];
                        p = i["cy" + f];
                        d = i["cx" + (f + 1)];
                        v = i["cy" + (f + 1)];
                        if (l === a || c === a || h === a || p === a || d === a || v === a) break;
                        r.bezierCurveTo(h + i.x, p + i.y, d + i.x, v + i.y, l + i.x, c + i.y);
                        u += 1;
                        f += 2
                    }
                    i._event && lt(t[n], r, i);
                    F(t[n], r, i)
                }
            }
        }
        return t
    };
    e.fn.drawVector = function At(e) {
        var t = this,
            n, r, i, o, u, f, l, c, h;
        for (n = 0; n < t.length; n += 1) {
            r = M(t[n]);
            if (r) {
                i = new L(e);
                o = Z(t[n], i, e, At);
                if (i.visible) {
                    H(t[n], r, i);
                    U(t[n], r, i, 0);
                    u = 1;
                    r.beginPath();
                    c = i.x;
                    h = i.y;
                    r.moveTo(i.x, i.y);
                    while (s) {
                        f = i["a" + u];
                        l = i["l" + u];
                        if (f === a || l === a) break;
                        f *= i._toRad;
                        f -= v / 2;
                        c += l * g(f);
                        h += l * m(f);
                        r.lineTo(c, h);
                        u += 1
                    }
                    i._event && lt(t[n], r, i);
                    F(t[n], r, i)
                }
            }
        }
        return t
    };
    e.fn.drawText = function Ot(t) {
        var n = this,
            r, i, s, o, a, f, l, c, h;
        for (i = 0; i < n.length; i += 1) {
            r = e(n[i]);
            s = M(n[i]);
            if (s) {
                o = new L(t);
                a = Z(n[i], o, t, Ot);
                if (o.visible) {
                    H(n[i], s, o);
                    s.textBaseline = o.baseline;
                    s.textAlign = o.align;
                    ct(s, o);
                    o.maxWidth !== u ? f = pt(s, o) : f = o.text.toString().split("\n");
                    ht(n[i], s, o, f);
                    if (t && o.layer) {
                        t.width = o.width;
                        t.height = o.height
                    }
                    c = o.x;
                    o.align === "left" ? o.respectAlign ? o.x += o.width / 2 : c -= o.width / 2 : o.align === "right" && (o.respectAlign ? o.x -= o.width / 2 : c += o.width / 2);
                    U(n[i], s, o, o.width, o.height);
                    for (l = 0; l < f.length; l += 1) {
                        s.shadowColor = o.shadowColor;
                        h = o.y + l * o.height / f.length - (f.length - 1) * o.height / f.length / 2;
                        s.fillText(f[l], c, h);
                        o.fillStyle !== "transparent" && (s.shadowColor = "transparent");
                        s.strokeText(f[l], c, h)
                    }
                    if (o._event) {
                        s.beginPath();
                        s.rect(o.x - o.width / 2, o.y - o.height / 2, o.width, o.height);
                        lt(n[i], s, o);
                        s.closePath()
                    }
                    j(s, o)
                }
            }
        }
        x = o;
        return n
    };
    e.fn.measureText = function(t) {
        var n = this,
            r, i, s;
        t && t.layer || h(t) === "string" ? i = n.getLayer(t) : i = new L(t);
        if (!i) i = {};
        else {
            r = M(n[0]);
            if (r) {
                ct(r, i);
                s = pt(r, i);
                ht(n[0], r, i, s)
            }
        }
        return i
    };
    e.fn.drawImage = function Mt(t) {
        function g(e, t, n, i, s) {
            i.width === u && i.sWidth === u && (i.width = i.sWidth = d.width);
            i.height === u && i.sHeight === u && (i.height = i.sHeight = d.height);
            if (s) {
                s.width = i.width;
                s.height = i.height
            }
            if (i.sWidth !== u && i.sHeight !== u && i.sx !== u && i.sy !== u) {
                i.width === u && (i.width = i.sWidth);
                i.height === u && (i.height = i.sHeight);
                if (!i.cropFromCenter) {
                    i.sx += i.sWidth / 2;
                    i.sy += i.sHeight / 2
                }
                i.sy - i.sHeight / 2 < 0 && (i.sy = i.sHeight / 2);
                i.sy + i.sHeight / 2 > d.height && (i.sy = d.height - i.sHeight / 2);
                i.sx - i.sWidth / 2 < 0 && (i.sx = i.sWidth / 2);
                i.sx + i.sWidth / 2 > d.width && (i.sx = d.width - i.sWidth / 2);
                U(r[e], t, i, i.width, i.height);
                t.drawImage(d, i.sx - i.sWidth / 2, i.sy - i.sHeight / 2, i.sWidth, i.sHeight, i.x - i.width / 2, i.y - i.height / 2, i.width, i.height)
            } else {
                U(r[e], t, i, i.width, i.height);
                t.drawImage(d, i.x - i.width / 2, i.y - i.height / 2, i.width, i.height)
            }
            H(r[e], t, i);
            t.beginPath();
            t.rect(i.x - i.width / 2, i.y - i.height / 2, i.width, i.height);
            i._event && lt(r[e], t, i);
            t.closePath();
            t.stroke();
            j(t, i);
            B(t, n, i)
        }

        function y(t, n, r, i, u, a) {
            return function() {
                g(n, r, i, u, a);
                u.load && u.load.call(t, a);
                if (u.layer) {
                    u._args._masks = i.transforms.masks.slice(0);
                    u._next && e(t).drawLayers({
                        clear: o,
                        resetFire: s,
                        index: u._next
                    })
                }
            }
        }
        var r = this,
            i, f, l, c, h, p, d, v, m;
        for (f = 0; f < r.length; f += 1) {
            i = r[f];
            l = M(r[f]);
            if (l) {
                c = z(r[f]);
                h = new L(t);
                p = Z(r[f], h, t, Mt);
                if (h.visible) {
                    m = h.source;
                    v = m.getContext;
                    if (m.src || v) d = m;
                    else if (m)
                        if (T[m] !== a) d = T[m];
                        else {
                            d = new n;
                            d.src = m;
                            T[m] = d
                        }
                    if (d)
                        if (d.complete || v) y(i, f, l, c, h, p)();
                        else {
                            e(d).bind("load", y(i, f, l, c, h, p));
                            d.src = d.src
                        }
                }
            }
        }
        return r
    };
    e.fn.createPattern = function(r) {
        function h() {
            l = s.createPattern(a, o.repeat);
            o.load && o.load.call(i[0], l)
        }
        var i = this,
            s, o, a, f, l, c;
        s = M(i[0]);
        if (s) {
            o = new L(r);
            c = o.source;
            if (p(c)) {
                a = e("<canvas />")[0];
                a.width = o.width;
                a.height = o.height;
                f = M(a);
                c.call(a, f);
                h()
            } else {
                f = c.getContext;
                if (c.src || f) a = c;
                else {
                    a = new n;
                    a.src = c
                } if (a.complete || f) h();
                else {
                    e(a).bind("load", h);
                    a.src = a.src
                }
            }
        } else l = u;
        return l
    };
    e.fn.createGradient = function(t) {
        var n = this,
            r, i, s, o = [],
            f, l, c, h, p, d, v;
        i = new L(t);
        r = M(n[0]);
        if (r) {
            i.x1 = i.x1 || 0;
            i.y1 = i.y1 || 0;
            i.x2 = i.x2 || 0;
            i.y2 = i.y2 || 0;
            i.r1 !== u || i.r2 !== u ? s = r.createRadialGradient(i.x1, i.y1, i.r1, i.x2, i.y2, i.r2) : s = r.createLinearGradient(i.x1, i.y1, i.x2, i.y2);
            for (h = 1; i["c" + h] !== a; h += 1) i["s" + h] !== a ? o.push(i["s" + h]) : o.push(u);
            f = o.length;
            o[0] === u && (o[0] = 0);
            o[f - 1] === u && (o[f - 1] = 1);
            for (h = 0; h < f; h += 1) {
                if (o[h] !== u) {
                    d = 1;
                    v = 0;
                    l = o[h];
                    for (p = h + 1; p < f; p += 1) {
                        if (o[p] !== u) {
                            c = o[p];
                            break
                        }
                        d += 1
                    }
                    l > c && (o[p] = o[h])
                } else if (o[h] === u) {
                    v += 1;
                    o[h] = l + v * ((c - l) / d)
                }
                s.addColorStop(o[h], i["c" + (h + 1)])
            }
        } else s = u;
        return s
    };
    e.fn.setPixels = function _t(e) {
        var t = this,
            n, r, i, s, o, a, f, l, c, h;
        for (r = 0; r < t.length; r += 1) {
            n = t[r];
            i = M(n);
            if (i) {
                s = new L(e);
                o = Z(n, s, e, _t);
                U(t[r], i, s, s.width, s.height);
                if (s.width === u || s.height === u) {
                    s.width = n.width;
                    s.height = n.height;
                    s.x = s.width / 2;
                    s.y = s.height / 2
                }
                if (s.width !== 0 && s.height !== 0) {
                    f = i.getImageData(s.x - s.width / 2, s.y - s.height / 2, s.width, s.height);
                    l = f.data;
                    h = l.length;
                    if (s.each)
                        for (c = 0; c < h; c += 4) {
                            a = {
                                r: l[c],
                                g: l[c + 1],
                                b: l[c + 2],
                                a: l[c + 3]
                            };
                            s.each.call(n, a, s);
                            l[c] = a.r;
                            l[c + 1] = a.g;
                            l[c + 2] = a.b;
                            l[c + 3] = a.a
                        }
                    i.putImageData(f, s.x - s.width / 2, s.y - s.height / 2);
                    i.restore()
                }
            }
        }
        return t
    };
    e.fn.getCanvasImage = function(t, n) {
        var r = this[0];
        n === a && (n = 1);
        return r && r.toDataURL ? r.toDataURL("image/" + t, n) : u
    };
    e.fn.detectPixelRatio = function(n) {
        var r = this,
            i, o, u, a, f, l, c, h, p, d;
        for (u = 0; u < r.length; u += 1) {
            o = r[u];
            i = e(r[u]);
            a = M(o);
            d = z(r[u]);
            if (!d.scaled) {
                f = window.devicePixelRatio || 1;
                l = a.webkitBackingStorePixelRatio || a.mozBackingStorePixelRatio || a.msBackingStorePixelRatio || a.oBackingStorePixelRatio || a.backingStorePixelRatio || 1;
                c = f / l;
                if (c !== 1) {
                    h = o.width;
                    p = o.height;
                    o.width = h * c;
                    o.height = p * c;
                    o.style.width = h + "px";
                    o.style.height = p + "px";
                    a.scale(c, c)
                }
                d.pixelRatio = c;
                d.scaled = s;
                n && n.call(o, c)
            }
        }
        return r
    };
    e.support.canvas = e("<canvas />")[0].getContext;
    A.defaults = f;
    A.transformShape = U;
    A.detectEvents = lt;
    A.closePath = F;
    A.getTouchEventName = ot;
    e.jCanvas = A
})(jQuery, document, Image, Math, parseFloat, !0, !1, null);

/* http://keith-wood.name/countdown.html
   Countdown for jQuery v1.6.3.
   Written by Keith Wood (kbwood{at}iinet.com.au) January 2008.
   Available under the MIT (https://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt) license. 
   Please attribute the author if you use it. */

/* Display a countdown timer.
   Attach it with options like:
   $('div selector').countdown(
       {until: new Date(2009, 1 - 1, 1, 0, 0, 0), onExpiry: happyNewYear}); */
(function(e) {
    function t() {
        function r(e) {
            var o = e < 1e12 ? n ? performance.now() + performance.timing.navigationStart : t() : e || t();
            if (o - s >= 1e3) {
                c._updateTargets();
                s = o
            }
            i(r)
        }
        this.regional = [];
        this.regional[""] = {
            labels: ["Years", "Months", "Weeks", "Days", "Hours", "Minutes", "Seconds"],
            labels1: ["Year", "Month", "Week", "Day", "Hour", "Minute", "Second"],
            compactLabels: ["y", "m", "w", "d"],
            whichLabels: null,
            digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
            timeSeparator: ":",
            isRTL: false
        };
        this._defaults = {
            until: null,
            since: null,
            timezone: null,
            serverSync: null,
            format: "dHMS",
            layout: "",
            compact: false,
            significant: 0,
            description: "",
            expiryUrl: "",
            expiryText: "",
            alwaysExpire: false,
            onExpiry: null,
            onTick: null,
            tickInterval: 1
        };
        e.extend(this._defaults, this.regional[""]);
        this._serverSyncs = [];
        var t = typeof Date.now == "function" ? Date.now : function() {
                return (new Date).getTime()
            };
        var n = window.performance && typeof window.performance.now == "function";
        var i = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || null;
        var s = 0;
        if (!i || e.noRequestAnimationFrame) {
            e.noRequestAnimationFrame = null;
            setInterval(function() {
                c._updateTargets()
            }, 980)
        } else {
            s = window.animationStartTime || window.webkitAnimationStartTime || window.mozAnimationStartTime || window.oAnimationStartTime || window.msAnimationStartTime || t();
            i(r)
        }
    }

    function l(t, n) {
        if (t == "option" && (n.length == 0 || n.length == 1 && typeof n[0] == "string")) {
            return true
        }
        return e.inArray(t, f) > -1
    }
    var n = 0;
    var r = 1;
    var i = 2;
    var s = 3;
    var o = 4;
    var u = 5;
    var a = 6;
    e.extend(t.prototype, {
        markerClassName: "hasCountdown",
        propertyName: "countdown",
        _rtlClass: "countdown_rtl",
        _sectionClass: "countdown_section",
        _amountClass: "countdown_amount",
        _rowClass: "countdown_row",
        _holdingClass: "countdown_holding",
        _showClass: "countdown_show",
        _descrClass: "countdown_descr",
        _timerTargets: [],
        setDefaults: function(t) {
            this._resetExtraLabels(this._defaults, t);
            e.extend(this._defaults, t || {})
        },
        UTCDate: function(e, t, n, r, i, s, o, u) {
            if (typeof t == "object" && t.constructor == Date) {
                u = t.getMilliseconds();
                o = t.getSeconds();
                s = t.getMinutes();
                i = t.getHours();
                r = t.getDate();
                n = t.getMonth();
                t = t.getFullYear()
            }
            var a = new Date;
            a.setUTCFullYear(t);
            a.setUTCDate(1);
            a.setUTCMonth(n || 0);
            a.setUTCDate(r || 1);
            a.setUTCHours(i || 0);
            a.setUTCMinutes((s || 0) - (Math.abs(e) < 30 ? e * 60 : e));
            a.setUTCSeconds(o || 0);
            a.setUTCMilliseconds(u || 0);
            return a
        },
        periodsToSeconds: function(e) {
            return e[0] * 31557600 + e[1] * 2629800 + e[2] * 604800 + e[3] * 86400 + e[4] * 3600 + e[5] * 60 + e[6]
        },
        _attachPlugin: function(t, n) {
            t = e(t);
            if (t.hasClass(this.markerClassName)) {
                return
            }
            var r = {
                options: e.extend({}, this._defaults),
                _periods: [0, 0, 0, 0, 0, 0, 0]
            };
            t.addClass(this.markerClassName).data(this.propertyName, r);
            this._optionPlugin(t, n)
        },
        _addTarget: function(e) {
            if (!this._hasTarget(e)) {
                this._timerTargets.push(e)
            }
        },
        _hasTarget: function(t) {
            return e.inArray(t, this._timerTargets) > -1
        },
        _removeTarget: function(t) {
            this._timerTargets = e.map(this._timerTargets, function(e) {
                return e == t ? null : e
            })
        },
        _updateTargets: function() {
            for (var e = this._timerTargets.length - 1; e >= 0; e--) {
                this._updateCountdown(this._timerTargets[e])
            }
        },
        _optionPlugin: function(t, n, r) {
            t = e(t);
            var i = t.data(this.propertyName);
            if (!n || typeof n == "string" && r == null) {
                var s = n;
                n = (i || {}).options;
                return n && s ? n[s] : n
            }
            if (!t.hasClass(this.markerClassName)) {
                return
            }
            n = n || {};
            if (typeof n == "string") {
                var s = n;
                n = {};
                n[s] = r
            }
            if (n.layout) {
                n.layout = n.layout.replace(/</g, "<").replace(/>/g, ">")
            }
            this._resetExtraLabels(i.options, n);
            var o = i.options.timezone != n.timezone;
            e.extend(i.options, n);
            this._adjustSettings(t, i, n.until != null || n.since != null || o);
            var u = new Date;
            if (i._since && i._since < u || i._until && i._until > u) {
                this._addTarget(t[0])
            }
            this._updateCountdown(t, i)
        },
        _updateCountdown: function(t, n) {
            var r = e(t);
            n = n || r.data(this.propertyName);
            if (!n) {
                return
            }
            r.html(this._generateHTML(n)).toggleClass(this._rtlClass, n.options.isRTL);
            if (e.isFunction(n.options.onTick)) {
                var i = n._hold != "lap" ? n._periods : this._calculatePeriods(n, n._show, n.options.significant, new Date);
                if (n.options.tickInterval == 1 || this.periodsToSeconds(i) % n.options.tickInterval == 0) {
                    n.options.onTick.apply(t, [i])
                }
            }
            var s = n._hold != "pause" && (n._since ? n._now.getTime() < n._since.getTime() : n._now.getTime() >= n._until.getTime());
            if (s && !n._expiring) {
                n._expiring = true;
                if (this._hasTarget(t) || n.options.alwaysExpire) {
                    this._removeTarget(t);
                    if (e.isFunction(n.options.onExpiry)) {
                        n.options.onExpiry.apply(t, [])
                    }
                    if (n.options.expiryText) {
                        var o = n.options.layout;
                        n.options.layout = n.options.expiryText;
                        this._updateCountdown(t, n);
                        n.options.layout = o
                    }
                    if (n.options.expiryUrl) {
                        window.location = n.options.expiryUrl
                    }
                }
                n._expiring = false
            } else if (n._hold == "pause") {
                this._removeTarget(t)
            }
            r.data(this.propertyName, n)
        },
        _resetExtraLabels: function(e, t) {
            var n = false;
            for (var r in t) {
                if (r != "whichLabels" && r.match(/[Ll]abels/)) {
                    n = true;
                    break
                }
            }
            if (n) {
                for (var r in e) {
                    if (r.match(/[Ll]abels[02-9]|compactLabels1/)) {
                        e[r] = null
                    }
                }
            }
        },
        _adjustSettings: function(t, n, r) {
            var i;
            var s = 0;
            var o = null;
            for (var u = 0; u < this._serverSyncs.length; u++) {
                if (this._serverSyncs[u][0] == n.options.serverSync) {
                    o = this._serverSyncs[u][1];
                    break
                }
            }
            if (o != null) {
                s = n.options.serverSync ? o : 0;
                i = new Date
            } else {
                var a = e.isFunction(n.options.serverSync) ? n.options.serverSync.apply(t, []) : null;
                i = new Date;
                s = a ? i.getTime() - a.getTime() : 0;
                this._serverSyncs.push([n.options.serverSync, s])
            }
            var f = n.options.timezone;
            f = f == null ? -i.getTimezoneOffset() : f;
            if (r || !r && n._until == null && n._since == null) {
                n._since = n.options.since;
                if (n._since != null) {
                    n._since = this.UTCDate(f, this._determineTime(n._since, null));
                    if (n._since && s) {
                        n._since.setMilliseconds(n._since.getMilliseconds() + s)
                    }
                }
                n._until = this.UTCDate(f, this._determineTime(n.options.until, i));
                if (s) {
                    n._until.setMilliseconds(n._until.getMilliseconds() + s)
                }
            }
            n._show = this._determineShow(n)
        },
        _destroyPlugin: function(t) {
            t = e(t);
            if (!t.hasClass(this.markerClassName)) {
                return
            }
            this._removeTarget(t[0]);
            t.removeClass(this.markerClassName).empty().removeData(this.propertyName)
        },
        _pausePlugin: function(e) {
            this._hold(e, "pause")
        },
        _lapPlugin: function(e) {
            this._hold(e, "lap")
        },
        _resumePlugin: function(e) {
            this._hold(e, null)
        },
        _hold: function(t, n) {
            var r = e.data(t, this.propertyName);
            if (r) {
                if (r._hold == "pause" && !n) {
                    r._periods = r._savePeriods;
                    var i = r._since ? "-" : "+";
                    r[r._since ? "_since" : "_until"] = this._determineTime(i + r._periods[0] + "y" + i + r._periods[1] + "o" + i + r._periods[2] + "w" + i + r._periods[3] + "d" + i + r._periods[4] + "h" + i + r._periods[5] + "m" + i + r._periods[6] + "s");
                    this._addTarget(t)
                }
                r._hold = n;
                r._savePeriods = n == "pause" ? r._periods : null;
                e.data(t, this.propertyName, r);
                this._updateCountdown(t, r)
            }
        },
        _getTimesPlugin: function(t) {
            var n = e.data(t, this.propertyName);
            return !n ? null : n._hold == "pause" ? n._savePeriods : !n._hold ? n._periods : this._calculatePeriods(n, n._show, n.options.significant, new Date)
        },
        _determineTime: function(e, t) {
            var n = function(e) {
                var t = new Date;
                t.setTime(t.getTime() + e * 1e3);
                return t
            };
            var r = function(e) {
                e = e.toLowerCase();
                var t = new Date;
                var n = t.getFullYear();
                var r = t.getMonth();
                var i = t.getDate();
                var s = t.getHours();
                var o = t.getMinutes();
                var u = t.getSeconds();
                var a = /([+-]?[0-9]+)\s*(s|m|h|d|w|o|y)?/g;
                var f = a.exec(e);
                while (f) {
                    switch (f[2] || "s") {
                        case "s":
                            u += parseInt(f[1], 10);
                            break;
                        case "m":
                            o += parseInt(f[1], 10);
                            break;
                        case "h":
                            s += parseInt(f[1], 10);
                            break;
                        case "d":
                            i += parseInt(f[1], 10);
                            break;
                        case "w":
                            i += parseInt(f[1], 10) * 7;
                            break;
                        case "o":
                            r += parseInt(f[1], 10);
                            i = Math.min(i, c._getDaysInMonth(n, r));
                            break;
                        case "y":
                            n += parseInt(f[1], 10);
                            i = Math.min(i, c._getDaysInMonth(n, r));
                            break
                    }
                    f = a.exec(e)
                }
                return new Date(n, r, i, s, o, u, 0)
            };
            var i = e == null ? t : typeof e == "string" ? r(e) : typeof e == "number" ? n(e) : e;
            if (i) i.setMilliseconds(0);
            return i
        },
        _getDaysInMonth: function(e, t) {
            return 32 - (new Date(e, t, 32)).getDate()
        },
        _normalLabels: function(e) {
            return e
        },
        _generateHTML: function(t) {
            var f = this;
            t._periods = t._hold ? t._periods : this._calculatePeriods(t, t._show, t.options.significant, new Date);
            var l = false;
            var h = 0;
            var p = t.options.significant;
            var d = e.extend({}, t._show);
            for (var v = n; v <= a; v++) {
                l |= t._show[v] == "?" && t._periods[v] > 0;
                d[v] = t._show[v] == "?" && !l ? null : t._show[v];
                h += d[v] ? 1 : 0;
                p -= t._periods[v] > 0 ? 1 : 0
            }
            var m = [false, false, false, false, false, false, false];
            for (var v = a; v >= n; v--) {
                if (t._show[v]) {
                    if (t._periods[v]) {
                        m[v] = true
                    } else {
                        m[v] = p > 0;
                        p--
                    }
                }
            }
            var g = t.options.compact ? t.options.compactLabels : t.options.labels;
            var y = t.options.whichLabels || this._normalLabels;
            var b = function(e) {
                var n = t.options["compactLabels" + y(t._periods[e])];
                return d[e] ? f._translateDigits(t, t._periods[e]) + (n ? n[e] : g[e]) + " " : ""
            };
            var w = function(e) {
                var n = t.options["labels" + y(t._periods[e])];
                return !t.options.significant && d[e] || t.options.significant && m[e] ? '<span class="' + c._sectionClass + '">' + '<span class="' + c._amountClass + '">' + f._translateDigits(t, t._periods[e]) + "</span><br/>" + (n ? n[e] : g[e]) + "</span>" : ""
            };
            return t.options.layout ? this._buildLayout(t, d, t.options.layout, t.options.compact, t.options.significant, m) : (t.options.compact ? '<span class="' + this._rowClass + " " + this._amountClass + (t._hold ? " " + this._holdingClass : "") + '">' + b(n) + b(r) + b(i) + b(s) + (d[o] ? this._minDigits(t, t._periods[o], 2) : "") + (d[u] ? (d[o] ? t.options.timeSeparator : "") + this._minDigits(t, t._periods[u], 2) : "") + (d[a] ? (d[o] || d[u] ? t.options.timeSeparator : "") + this._minDigits(t, t._periods[a], 2) : "") : '<span class="' + this._rowClass + " " + this._showClass + (t.options.significant || h) + (t._hold ? " " + this._holdingClass : "") + '">' + w(n) + w(r) + w(i) + w(s) + w(o) + w(u) + w(a)) + "</span>" + (t.options.description ? '<span class="' + this._rowClass + " " + this._descrClass + '">' + t.options.description + "</span>" : "")
        },
        _buildLayout: function(t, f, l, c, h, p) {
            var d = t.options[c ? "compactLabels" : "labels"];
            var v = t.options.whichLabels || this._normalLabels;
            var m = function(e) {
                return (t.options[(c ? "compactLabels" : "labels") + v(t._periods[e])] || d)[e]
            };
            var g = function(e, n) {
                return t.options.digits[Math.floor(e / n) % 10]
            };
            var y = {
                desc: t.options.description,
                sep: t.options.timeSeparator,
                yl: m(n),
                yn: this._minDigits(t, t._periods[n], 1),
                ynn: this._minDigits(t, t._periods[n], 2),
                ynnn: this._minDigits(t, t._periods[n], 3),
                y1: g(t._periods[n], 1),
                y10: g(t._periods[n], 10),
                y100: g(t._periods[n], 100),
                y1000: g(t._periods[n], 1e3),
                ol: m(r),
                on: this._minDigits(t, t._periods[r], 1),
                onn: this._minDigits(t, t._periods[r], 2),
                onnn: this._minDigits(t, t._periods[r], 3),
                o1: g(t._periods[r], 1),
                o10: g(t._periods[r], 10),
                o100: g(t._periods[r], 100),
                o1000: g(t._periods[r], 1e3),
                wl: m(i),
                wn: this._minDigits(t, t._periods[i], 1),
                wnn: this._minDigits(t, t._periods[i], 2),
                wnnn: this._minDigits(t, t._periods[i], 3),
                w1: g(t._periods[i], 1),
                w10: g(t._periods[i], 10),
                w100: g(t._periods[i], 100),
                w1000: g(t._periods[i], 1e3),
                dl: m(s),
                dn: this._minDigits(t, t._periods[s], 1),
                dnn: this._minDigits(t, t._periods[s], 2),
                dnnn: this._minDigits(t, t._periods[s], 3),
                d1: g(t._periods[s], 1),
                d10: g(t._periods[s], 10),
                d100: g(t._periods[s], 100),
                d1000: g(t._periods[s], 1e3),
                hl: m(o),
                hn: this._minDigits(t, t._periods[o], 1),
                hnn: this._minDigits(t, t._periods[o], 2),
                hnnn: this._minDigits(t, t._periods[o], 3),
                h1: g(t._periods[o], 1),
                h10: g(t._periods[o], 10),
                h100: g(t._periods[o], 100),
                h1000: g(t._periods[o], 1e3),
                ml: m(u),
                mn: this._minDigits(t, t._periods[u], 1),
                mnn: this._minDigits(t, t._periods[u], 2),
                mnnn: this._minDigits(t, t._periods[u], 3),
                m1: g(t._periods[u], 1),
                m10: g(t._periods[u], 10),
                m100: g(t._periods[u], 100),
                m1000: g(t._periods[u], 1e3),
                sl: m(a),
                sn: this._minDigits(t, t._periods[a], 1),
                snn: this._minDigits(t, t._periods[a], 2),
                snnn: this._minDigits(t, t._periods[a], 3),
                s1: g(t._periods[a], 1),
                s10: g(t._periods[a], 10),
                s100: g(t._periods[a], 100),
                s1000: g(t._periods[a], 1e3)
            };
            var b = l;
            for (var w = n; w <= a; w++) {
                var E = "yowdhms".charAt(w);
                var x = new RegExp("\\{" + E + "<\\}([\\s\\S]*)\\{" + E + ">\\}", "g");
                b = b.replace(x, !h && f[w] || h && p[w] ? "$1" : "")
            }
            e.each(y, function(e, t) {
                var n = new RegExp("\\{" + e + "\\}", "g");
                b = b.replace(n, t)
            });
            return b
        },
        _minDigits: function(e, t, n) {
            t = "" + t;
            if (t.length >= n) {
                return this._translateDigits(e, t)
            }
            t = "0000000000" + t;
            return this._translateDigits(e, t.substr(t.length - n))
        },
        _translateDigits: function(e, t) {
            return ("" + t).replace(/[0-9]/g, function(t) {
                return e.options.digits[t]
            })
        },
        _determineShow: function(e) {
            var t = e.options.format;
            var f = [];
            f[n] = t.match("y") ? "?" : t.match("Y") ? "!" : null;
            f[r] = t.match("o") ? "?" : t.match("O") ? "!" : null;
            f[i] = t.match("w") ? "?" : t.match("W") ? "!" : null;
            f[s] = t.match("d") ? "?" : t.match("D") ? "!" : null;
            f[o] = t.match("h") ? "?" : t.match("H") ? "!" : null;
            f[u] = t.match("m") ? "?" : t.match("M") ? "!" : null;
            f[a] = t.match("s") ? "?" : t.match("S") ? "!" : null;
            return f
        },
        _calculatePeriods: function(e, t, f, l) {
            e._now = l;
            e._now.setMilliseconds(0);
            var h = new Date(e._now.getTime());
            if (e._since) {
                if (l.getTime() < e._since.getTime()) {
                    e._now = l = h
                } else {
                    l = e._since
                }
            } else {
                h.setTime(e._until.getTime());
                if (l.getTime() > e._until.getTime()) {
                    e._now = l = h
                }
            }
            var p = [0, 0, 0, 0, 0, 0, 0];
            if (t[n] || t[r]) {
                var d = c._getDaysInMonth(l.getFullYear(), l.getMonth());
                var v = c._getDaysInMonth(h.getFullYear(), h.getMonth());
                var m = h.getDate() == l.getDate() || h.getDate() >= Math.min(d, v) && l.getDate() >= Math.min(d, v);
                var g = function(e) {
                    return (e.getHours() * 60 + e.getMinutes()) * 60 + e.getSeconds()
                };
                var y = Math.max(0, (h.getFullYear() - l.getFullYear()) * 12 + h.getMonth() - l.getMonth() + (h.getDate() < l.getDate() && !m || m && g(h) < g(l) ? -1 : 0));
                p[n] = t[n] ? Math.floor(y / 12) : 0;
                p[r] = t[r] ? y - p[n] * 12 : 0;
                l = new Date(l.getTime());
                var b = l.getDate() == d;
                var w = c._getDaysInMonth(l.getFullYear() + p[n], l.getMonth() + p[r]);
                if (l.getDate() > w) {
                    l.setDate(w)
                }
                l.setFullYear(l.getFullYear() + p[n]);
                l.setMonth(l.getMonth() + p[r]);
                if (b) {
                    l.setDate(w)
                }
            }
            var E = Math.floor((h.getTime() - l.getTime()) / 1e3);
            var x = function(e, n) {
                p[e] = t[e] ? Math.floor(E / n) : 0;
                E -= p[e] * n
            };
            x(i, 604800);
            x(s, 86400);
            x(o, 3600);
            x(u, 60);
            x(a, 1);
            if (E > 0 && !e._since) {
                var T = [1, 12, 4.3482, 7, 24, 60, 60];
                var N = a;
                var C = 1;
                for (var k = a; k >= n; k--) {
                    if (t[k]) {
                        if (p[N] >= C) {
                            p[N] = 0;
                            E = 1
                        }
                        if (E > 0) {
                            p[k]++;
                            E = 0;
                            N = k;
                            C = 1
                        }
                    }
                    C *= T[k]
                }
            }
            if (f) {
                for (var k = n; k <= a; k++) {
                    if (f && p[k]) {
                        f--
                    } else if (!f) {
                        p[k] = 0
                    }
                }
            }
            return p
        }
    });
    var f = ["getTimes"];
    e.fn.countdown = function(e) {
        var t = Array.prototype.slice.call(arguments, 1);
        if (l(e, t)) {
            return c["_" + e + "Plugin"].apply(c, [this[0]].concat(t))
        }
        return this.each(function() {
            if (typeof e == "string") {
                if (!c["_" + e + "Plugin"]) {
                    throw "Unknown command: " + e
                }
                c["_" + e + "Plugin"].apply(c, [this].concat(t))
            } else {
                c._attachPlugin(this, e || {})
            }
        })
    };
    var c = e.countdown = new t
})(jQuery)

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 *
 * Open source under the BSD License.
 *
 * Copyright Â© 2008 George McGinley Smith
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing["jswing"] = jQuery.easing["swing"];
jQuery.extend(jQuery.easing, {
    def: "easeOutQuad",
    swing: function(x, t, b, c, d) {
        return jQuery.easing[jQuery.easing.def](x, t, b, c, d)
    },
    easeInQuad: function(x, t, b, c, d) {
        return c * (t /= d) * t + b
    },
    easeOutQuad: function(x, t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b
    },
    easeInOutQuad: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * (--t * (t - 2) - 1) + b
    },
    easeInCubic: function(x, t, b, c, d) {
        return c * (t /= d) * t * t + b
    },
    easeOutCubic: function(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b
    },
    easeInOutCubic: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c /
            2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b
    },
    easeInQuart: function(x, t, b, c, d) {
        return c * (t /= d) * t * t * t + b
    },
    easeOutQuart: function(x, t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b
    },
    easeInOutQuart: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b
    },
    easeInQuint: function(x, t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b
    },
    easeOutQuint: function(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b
    },
    easeInOutQuint: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b
    },
    easeInSine: function(x,
        t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b
    },
    easeOutSine: function(x, t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b
    },
    easeInOutSine: function(x, t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b
    },
    easeInExpo: function(x, t, b, c, d) {
        return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b
    },
    easeOutExpo: function(x, t, b, c, d) {
        return t == d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b
    },
    easeInOutExpo: function(x, t, b, c, d) {
        if (t == 0) return b;
        if (t == d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b
    },
    easeInCirc: function(x, t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b
    },
    easeOutCirc: function(x, t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b
    },
    easeInOutCirc: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b
    },
    easeInElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * 0.3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 *
            Math.PI) / p)) + b
    },
    easeOutElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * 0.3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b
    },
    easeInOutElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d / 2) == 2) return b + c;
        if (!p) p = d * (0.3 * 1.5);
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4
        } else var s = p / (2 * Math.PI) * Math.asin(c / a); if (t < 1) return -0.5 * (a * Math.pow(2,
            10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b
    },
    easeInBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b
    },
    easeOutBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
    },
    easeInOutBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b
    },
    easeInBounce: function(x, t,
        b, c, d) {
        return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b
    },
    easeOutBounce: function(x, t, b, c, d) {
        if ((t /= d) < 1 / 2.75) return c * (7.5625 * t * t) + b;
        else if (t < 2 / 2.75) return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
        else if (t < 2.5 / 2.75) return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
        else return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b
    },
    easeInOutBounce: function(x, t, b, c, d) {
        if (t < d / 2) return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * 0.5 + b;
        return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b
    }
});
/*
 *
 * TERMS OF USE - EASING EQUATIONS
 *
 * Open source under the BSD License.
 *
 * Copyright Â© 2001 Robert Penner
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */
