!(function(e, t) {
    'object' == typeof exports && 'object' == typeof module ? (module.exports = t()) : 'function' == typeof define && define.amd ? define('simpleParallax', [], t) : 'object' == typeof exports ? (exports.simpleParallax = t()) : (e.simpleParallax = t());
})(window, function() {
    return (function(e) {
        var t = window.webpackHotUpdatesimpleParallax;
        window.webpackHotUpdatesimpleParallax = function(e, n) {
            !(function(e, t) {
                if (b[e] && w[e]) {
                    for (var n in ((w[e] = !1), t)) Object.prototype.hasOwnProperty.call(t, n) && (h[n] = t[n]);
                    0 == --y && 0 === v && k();
                }
            })(e, n),
                t && t(e, n);
        };
        var n,
            i = !0,
            r = 'c02ad0cebd899e2a65c5',
            o = 1e4,
            a = {},
            s = [],
            l = [];
        function c(e) {
            var t = _[e];
            if (!t) return D;
            var i = function(i) {
                    return t.hot.active ? (_[i] ? -1 === _[i].parents.indexOf(e) && _[i].parents.push(e) : ((s = [e]), (n = i)), -1 === t.children.indexOf(i) && t.children.push(i)) : (console.warn('[HMR] unexpected require(' + i + ') from disposed module ' + e), (s = [])), D(i);
                },
                r = function(e) {
                    return {
                        configurable: !0,
                        enumerable: !0,
                        get: function() {
                            return D[e];
                        },
                        set: function(t) {
                            D[e] = t;
                        }
                    };
                };
            for (var o in D) Object.prototype.hasOwnProperty.call(D, o) && 'e' !== o && 't' !== o && Object.defineProperty(i, o, r(o));
            return (
                (i.e = function(e) {
                    return (
                        'ready' === u && f('prepare'),
                        v++,
                        D.e(e).then(t, function(e) {
                            throw (t(), e);
                        })
                    );
                    function t() {
                        v--, 'prepare' === u && (g[e] || x(e), 0 === v && 0 === y && k());
                    }
                }),
                (i.t = function(e, t) {
                    return 1 & t && (e = i(e)), D.t(e, -2 & t);
                }),
                i
            );
        }
        var d = [],
            u = 'idle';
        function f(e) {
            u = e;
            for (var t = 0; t < d.length; t++) d[t].call(null, e);
        }
        var p,
            h,
            m,
            y = 0,
            v = 0,
            g = {},
            w = {},
            b = {};
        function O(e) {
            return +e + '' === e ? +e : e;
        }
        function E(e) {
            if ('idle' !== u) throw new Error('check() is only allowed in idle status');
            return (
                (i = e),
                f('check'),
                (function(e) {
                    return (
                        (e = e || 1e4),
                        new Promise(function(t, n) {
                            if ('undefined' == typeof XMLHttpRequest) return n(new Error('No browser support'));
                            try {
                                var i = new XMLHttpRequest(),
                                    o = D.p + '' + r + '.hot-update.json';
                                i.open('GET', o, !0), (i.timeout = e), i.send(null);
                            } catch (e) {
                                return n(e);
                            }
                            i.onreadystatechange = function() {
                                if (4 === i.readyState)
                                    if (0 === i.status) n(new Error('Manifest request to ' + o + ' timed out.'));
                                    else if (404 === i.status) t();
                                    else if (200 !== i.status && 304 !== i.status) n(new Error('Manifest request to ' + o + ' failed.'));
                                    else {
                                        try {
                                            var e = JSON.parse(i.responseText);
                                        } catch (e) {
                                            return void n(e);
                                        }
                                        t(e);
                                    }
                            };
                        })
                    );
                })(o).then(function(e) {
                    if (!e) return f('idle'), null;
                    (w = {}), (g = {}), (b = e.c), (m = e.h), f('prepare');
                    var t = new Promise(function(e, t) {
                        p = { resolve: e, reject: t };
                    });
                    return (h = {}), x(1), 'prepare' === u && 0 === v && 0 === y && k(), t;
                })
            );
        }
        function x(e) {
            b[e]
                ? ((w[e] = !0),
                  y++,
                  (function(e) {
                      var t = document.createElement('script');
                      (t.charset = 'utf-8'), (t.src = D.p + '' + e + '.' + r + '.hot-update.js'), document.head.appendChild(t);
                  })(e))
                : (g[e] = !0);
        }
        function k() {
            f('ready');
            var e = p;
            if (((p = null), e))
                if (i)
                    Promise.resolve()
                        .then(function() {
                            return j(i);
                        })
                        .then(
                            function(t) {
                                e.resolve(t);
                            },
                            function(t) {
                                e.reject(t);
                            }
                        );
                else {
                    var t = [];
                    for (var n in h) Object.prototype.hasOwnProperty.call(h, n) && t.push(O(n));
                    e.resolve(t);
                }
        }
        function j(t) {
            if ('ready' !== u) throw new Error('apply() is only allowed in ready status');
            var n, i, o, l, c;
            function d(e) {
                for (
                    var t = [e],
                        n = {},
                        i = t.slice().map(function(e) {
                            return { chain: [e], id: e };
                        });
                    0 < i.length;

                ) {
                    var r = i.pop(),
                        o = r.id,
                        a = r.chain;
                    if ((l = _[o]) && !l.hot._selfAccepted) {
                        if (l.hot._selfDeclined) return { type: 'self-declined', chain: a, moduleId: o };
                        if (l.hot._main) return { type: 'unaccepted', chain: a, moduleId: o };
                        for (var s = 0; s < l.parents.length; s++) {
                            var c = l.parents[s],
                                d = _[c];
                            if (d) {
                                if (d.hot._declinedDependencies[o]) return { type: 'declined', chain: a.concat([c]), moduleId: o, parentId: c };
                                -1 === t.indexOf(c) && (d.hot._acceptedDependencies[o] ? (n[c] || (n[c] = []), p(n[c], [o])) : (delete n[c], t.push(c), i.push({ chain: a.concat([c]), id: c })));
                            }
                        }
                    }
                }
                return { type: 'accepted', moduleId: e, outdatedModules: t, outdatedDependencies: n };
            }
            function p(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var i = t[n];
                    -1 === e.indexOf(i) && e.push(i);
                }
            }
            t = t || {};
            var y = {},
                v = [],
                g = {},
                w = function() {
                    console.warn('[HMR] unexpected require(' + x.moduleId + ') to disposed module');
                };
            for (var E in h)
                if (Object.prototype.hasOwnProperty.call(h, E)) {
                    var x;
                    c = O(E);
                    var k = !1,
                        j = !1,
                        P = !1,
                        H = '';
                    switch (((x = h[E] ? d(c) : { type: 'disposed', moduleId: E }).chain && (H = '\nUpdate propagation: ' + x.chain.join(' -> ')), x.type)) {
                        case 'self-declined':
                            t.onDeclined && t.onDeclined(x), t.ignoreDeclined || (k = new Error('Aborted because of self decline: ' + x.moduleId + H));
                            break;
                        case 'declined':
                            t.onDeclined && t.onDeclined(x), t.ignoreDeclined || (k = new Error('Aborted because of declined dependency: ' + x.moduleId + ' in ' + x.parentId + H));
                            break;
                        case 'unaccepted':
                            t.onUnaccepted && t.onUnaccepted(x), t.ignoreUnaccepted || (k = new Error('Aborted because ' + c + ' is not accepted' + H));
                            break;
                        case 'accepted':
                            t.onAccepted && t.onAccepted(x), (j = !0);
                            break;
                        case 'disposed':
                            t.onDisposed && t.onDisposed(x), (P = !0);
                            break;
                        default:
                            throw new Error('Unexception type ' + x.type);
                    }
                    if (k) return f('abort'), Promise.reject(k);
                    if (j) for (c in ((g[c] = h[c]), p(v, x.outdatedModules), x.outdatedDependencies)) Object.prototype.hasOwnProperty.call(x.outdatedDependencies, c) && (y[c] || (y[c] = []), p(y[c], x.outdatedDependencies[c]));
                    P && (p(v, [x.moduleId]), (g[c] = w));
                }
            var A,
                M = [];
            for (i = 0; i < v.length; i++) (c = v[i]), _[c] && _[c].hot._selfAccepted && M.push({ module: c, errorHandler: _[c].hot._selfAccepted });
            f('dispose'),
                Object.keys(b).forEach(function(e) {
                    !1 === b[e] &&
                        (function(e) {
                            delete installedChunks[e];
                        })(e);
                });
            for (var T, F, C = v.slice(); 0 < C.length; )
                if (((c = C.pop()), (l = _[c]))) {
                    var I = {},
                        V = l.hot._disposeHandlers;
                    for (o = 0; o < V.length; o++) (n = V[o])(I);
                    for (a[c] = I, l.hot.active = !1, delete _[c], delete y[c], o = 0; o < l.children.length; o++) {
                        var S = _[l.children[o]];
                        S && 0 <= (A = S.parents.indexOf(c)) && S.parents.splice(A, 1);
                    }
                }
            for (c in y) if (Object.prototype.hasOwnProperty.call(y, c) && (l = _[c])) for (F = y[c], o = 0; o < F.length; o++) (T = F[o]), 0 <= (A = l.children.indexOf(T)) && l.children.splice(A, 1);
            for (c in (f('apply'), (r = m), g)) Object.prototype.hasOwnProperty.call(g, c) && (e[c] = g[c]);
            var q = null;
            for (c in y)
                if (Object.prototype.hasOwnProperty.call(y, c) && (l = _[c])) {
                    F = y[c];
                    var R = [];
                    for (i = 0; i < F.length; i++)
                        if (((T = F[i]), (n = l.hot._acceptedDependencies[T]))) {
                            if (-1 !== R.indexOf(n)) continue;
                            R.push(n);
                        }
                    for (i = 0; i < R.length; i++) {
                        n = R[i];
                        try {
                            n(F);
                        } catch (n) {
                            t.onErrored && t.onErrored({ type: 'accept-errored', moduleId: c, dependencyId: F[i], error: n }), t.ignoreErrored || q || (q = n);
                        }
                    }
                }
            for (i = 0; i < M.length; i++) {
                var z = M[i];
                (c = z.module), (s = [c]);
                try {
                    D(c);
                } catch (i) {
                    if ('function' == typeof z.errorHandler)
                        try {
                            z.errorHandler(i);
                        } catch (n) {
                            t.onErrored && t.onErrored({ type: 'self-accept-error-handler-errored', moduleId: c, error: n, originalError: i }), t.ignoreErrored || q || (q = n), q || (q = i);
                        }
                    else t.onErrored && t.onErrored({ type: 'self-accept-errored', moduleId: c, error: i }), t.ignoreErrored || q || (q = i);
                }
            }
            return q
                ? (f('fail'), Promise.reject(q))
                : (f('idle'),
                  new Promise(function(e) {
                      e(v);
                  }));
        }
        var _ = {};
        function D(t) {
            if (_[t]) return _[t].exports;
            var i = (_[t] = {
                i: t,
                l: !1,
                exports: {},
                hot: (function(e) {
                    var t = {
                        _acceptedDependencies: {},
                        _declinedDependencies: {},
                        _selfAccepted: !1,
                        _selfDeclined: !1,
                        _disposeHandlers: [],
                        _main: n !== e,
                        active: !0,
                        accept: function(e, n) {
                            if (void 0 === e) t._selfAccepted = !0;
                            else if ('function' == typeof e) t._selfAccepted = e;
                            else if ('object' == typeof e) for (var i = 0; i < e.length; i++) t._acceptedDependencies[e[i]] = n || function() {};
                            else t._acceptedDependencies[e] = n || function() {};
                        },
                        decline: function(e) {
                            if (void 0 === e) t._selfDeclined = !0;
                            else if ('object' == typeof e) for (var n = 0; n < e.length; n++) t._declinedDependencies[e[n]] = !0;
                            else t._declinedDependencies[e] = !0;
                        },
                        dispose: function(e) {
                            t._disposeHandlers.push(e);
                        },
                        addDisposeHandler: function(e) {
                            t._disposeHandlers.push(e);
                        },
                        removeDisposeHandler: function(e) {
                            var n = t._disposeHandlers.indexOf(e);
                            0 <= n && t._disposeHandlers.splice(n, 1);
                        },
                        check: E,
                        apply: j,
                        status: function(e) {
                            if (!e) return u;
                            d.push(e);
                        },
                        addStatusHandler: function(e) {
                            d.push(e);
                        },
                        removeStatusHandler: function(e) {
                            var t = d.indexOf(e);
                            0 <= t && d.splice(t, 1);
                        },
                        data: a[e]
                    };
                    return (n = void 0), t;
                })(t),
                parents: ((l = s), (s = []), l),
                children: []
            });
            return e[t].call(i.exports, i, i.exports, c(t)), (i.l = !0), i.exports;
        }
        return (
            (D.m = e),
            (D.c = _),
            (D.d = function(e, t, n) {
                D.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: n });
            }),
            (D.r = function(e) {
                'undefined' != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }), Object.defineProperty(e, '__esModule', { value: !0 });
            }),
            (D.t = function(e, t) {
                if ((1 & t && (e = D(e)), 8 & t)) return e;
                if (4 & t && 'object' == typeof e && e && e.__esModule) return e;
                var n = Object.create(null);
                if ((D.r(n), Object.defineProperty(n, 'default', { enumerable: !0, value: e }), 2 & t && 'string' != typeof e))
                    for (var i in e)
                        D.d(
                            n,
                            i,
                            function(t) {
                                return e[t];
                            }.bind(null, i)
                        );
                return n;
            }),
            (D.n = function(e) {
                var t =
                    e && e.__esModule
                        ? function() {
                              return e.default;
                          }
                        : function() {
                              return e;
                          };
                return D.d(t, 'a', t), t;
            }),
            (D.o = function(e, t) {
                return Object.prototype.hasOwnProperty.call(e, t);
            }),
            (D.p = ''),
            (D.h = function() {
                return r;
            }),
            c(2)((D.s = 2))
        );
    })([
        function(e, t, n) {
            (function(n) {
                var i, r;
                function o(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var i = t[n];
                        (i.enumerable = i.enumerable || !1), (i.configurable = !0), 'value' in i && (i.writable = !0), Object.defineProperty(e, i.key, i);
                    }
                }
                (r = void 0 !== n ? n : 'undefined' != typeof window ? window : this),
                    void 0 ===
                        (i = function() {
                            return (function(e) {
                                'use strict';
                                var t = (function() {
                                    for (var e, t = 'transform webkitTransform mozTransform oTransform msTransform'.split(' '), n = 0; void 0 === e; ) (e = null != document.createElement('div').style[t[n]] ? t[n] : void 0), n++;
                                    return e;
                                })();
                                (function() {
                                    for (var t = 0, n = ['ms', 'moz', 'webkit', 'o'], i = 0; i < n.length && !e.requestAnimationFrame; ++i)
                                        (e.requestAnimationFrame = e[n[i] + 'RequestAnimationFrame']), (e.cancelAnimationFrame = e[n[i] + 'CancelAnimationFrame'] || e[n[i] + 'CancelRequestAnimationFrame']);
                                    e.requestAnimationFrame ||
                                        (e.requestAnimationFrame = function(n, i) {
                                            var r = new Date().getTime(),
                                                o = Math.max(0, 16 - (r - t)),
                                                a = e.setTimeout(function() {
                                                    n(r + o);
                                                }, o);
                                            return (t = r + o), a;
                                        }),
                                        e.cancelAnimationFrame ||
                                            (e.cancelAnimationFrame = function(e) {
                                                clearTimeout(e);
                                            });
                                })(),
                                    Element.prototype.matches || (Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector),
                                    Element.prototype.closest ||
                                        (Element.prototype.closest = function(e) {
                                            var t = this;
                                            if (!document.documentElement.contains(t)) return null;
                                            do {
                                                if (t.matches(e)) return t;
                                                t = t.parentElement || t.parentNode;
                                            } while (null !== t && 1 === t.nodeType);
                                            return null;
                                        });
                                var n,
                                    i,
                                    r,
                                    a,
                                    s = [],
                                    l = -1,
                                    c = !1,
                                    d = (function() {
                                        function d(e, t) {
                                            !(function(e, t) {
                                                if (!(e instanceof d)) throw new TypeError('Cannot call a class as a function');
                                            })(this),
                                                (this.element = e),
                                                (this.elementContainer = e),
                                                (this.defaults = { delay: 0.6, orientation: 'up', scale: 1.3, overflow: !1, transition: 'cubic-bezier(0,0,0,1)', breakpoint: !1 }),
                                                (this.settings = Object.assign(this.defaults, t)),
                                                (this.settings.breakpoint && document.documentElement.clientWidth <= this.settings.breakpoint) ||
                                                    ((this.init = this.init.bind(this)),
                                                    (this.animationFrame = this.animationFrame.bind(this)),
                                                    (this.handleResize = this.handleResize.bind(this)),
                                                    this.isImageLoaded(this.element) ? this.init() : this.element.addEventListener('load', this.init),
                                                    s.push(this),
                                                    c || ((c = !0), this.getViewportOffsetHeight(), this.animationFrame()));
                                        }
                                        return (
                                            (function(e, t, n) {
                                                t && o(e.prototype, t);
                                            })(d, [
                                                {
                                                    key: 'init',
                                                    value: function() {
                                                        this.isInit || (!1 === this.settings.overflow && this.wrapElement(), this.setStyle(), this.getElementOffset(), this.getTranslateValue(), this.animate(), e.addEventListener('resize', this.handleResize), (this.isInit = !0));
                                                    }
                                                },
                                                {
                                                    key: 'isImageLoaded',
                                                    value: function() {
                                                        return !!this.element.complete && (void 0 === this.element.naturalWidth || 0 !== this.element.naturalWidth);
                                                    }
                                                },
                                                {
                                                    key: 'isVisible',
                                                    value: function() {
                                                        return this.elementBottomX > n && this.elementTopX < i;
                                                    }
                                                },
                                                {
                                                    key: 'wrapElement',
                                                    value: function() {
                                                        var e = this.element.closest('picture') || this.element,
                                                            t = document.createElement('div');
                                                        t.classList.add('simpleParallax'), (t.style.overflow = 'hidden'), e.parentNode.insertBefore(t, e), t.appendChild(e), (this.elementContainer = t);
                                                    }
                                                },
                                                {
                                                    key: 'unWrapElement',
                                                    value: function() {
                                                        var e = this.elementContainer.parentNode;
                                                        if (e) {
                                                            for (; this.elementContainer.firstChild; ) e.insertBefore(this.elementContainer.firstChild, this.elementContainer);
                                                            e.removeChild(this.elementContainer);
                                                        }
                                                    }
                                                },
                                                {
                                                    key: 'setStyle',
                                                    value: function() {
                                                        !1 === this.settings.overflow && (this.element.style[t] = 'scale(' + this.settings.scale + ')'),
                                                            0 < this.settings.delay && (this.element.style.transition = 'transform ' + this.settings.delay + 's ' + this.settings.transition),
                                                            (this.element.style.willChange = 'transform');
                                                    }
                                                },
                                                {
                                                    key: 'unSetStyle',
                                                    value: function() {
                                                        (this.element.style.willChange = ''), (this.element.style[t] = ''), (this.element.style.transition = '');
                                                    }
                                                },
                                                {
                                                    key: 'getElementOffset',
                                                    value: function() {
                                                        var t = this.elementContainer.getBoundingClientRect();
                                                        (this.elementHeight = t.height), (this.elementTopX = t.top + e.pageYOffset), (this.elementBottomX = this.elementHeight + this.elementTopX);
                                                    }
                                                },
                                                {
                                                    key: 'getViewportOffsetTop',
                                                    value: function() {
                                                        n = e.pageYOffset;
                                                    }
                                                },
                                                {
                                                    key: 'getViewportOffsetHeight',
                                                    value: function() {
                                                        r = document.documentElement.clientHeight;
                                                    }
                                                },
                                                {
                                                    key: 'getViewportOffsetBottom',
                                                    value: function() {
                                                        i = n + r;
                                                    }
                                                },
                                                {
                                                    key: 'handleResize',
                                                    value: function() {
                                                        this.getViewportOffsetHeight(), this.getElementOffset(), this.getRangeMax();
                                                    }
                                                },
                                                {
                                                    key: 'getRangeMax',
                                                    value: function() {
                                                        var e = this.element.clientHeight;
                                                        (this.rangeMax = e * this.settings.scale - e), ('down' !== this.settings.orientation && 'right' !== this.settings.orientation) || (this.rangeMax *= -1);
                                                    }
                                                },
                                                {
                                                    key: 'getTranslateValue',
                                                    value: function() {
                                                        var e = ((i - this.elementTopX) / ((r + this.elementHeight) / 100)).toFixed(1);
                                                        return (
                                                            (e = Math.min(100, Math.max(0, e))),
                                                            this.oldPercentage !== e &&
                                                                (this.rangeMax || this.getRangeMax(),
                                                                (this.translateValue = ((e / 100) * this.rangeMax - this.rangeMax / 2).toFixed(0)),
                                                                this.oldTranslateValue !== this.translateValue && ((this.oldPercentage = e), (this.oldTranslateValue = this.translateValue), !0))
                                                        );
                                                    }
                                                },
                                                {
                                                    key: 'animate',
                                                    value: function() {
                                                        var e,
                                                            n = 0,
                                                            i = 0;
                                                        'left' === this.settings.orientation || 'right' === this.settings.orientation ? (i = this.translateValue + 'px') : (n = this.translateValue + 'px'),
                                                            (e = !1 === this.settings.overflow ? 'translate3d(' + i + ', ' + n + ', 0) scale(' + this.settings.scale + ')' : 'translate3d(' + i + ', ' + n + ', 0)'),
                                                            (this.element.style[t] = e);
                                                    }
                                                },
                                                {
                                                    key: 'proceedElement',
                                                    value: function(e) {
                                                        e.isVisible() && e.getTranslateValue() && e.animate();
                                                    }
                                                },
                                                {
                                                    key: 'animationFrame',
                                                    value: function() {
                                                        if ((this.getViewportOffsetTop(), l !== n)) {
                                                            this.getViewportOffsetBottom();
                                                            for (var t = 0; t < s.length; t++) this.proceedElement(s[t]);
                                                            (a = e.requestAnimationFrame(this.animationFrame)), (l = n);
                                                        } else a = e.requestAnimationFrame(this.animationFrame);
                                                    }
                                                },
                                                {
                                                    key: 'destroy',
                                                    value: function() {
                                                        this.isDestroyed || (this.unSetStyle(), !1 === this.settings.overflow && this.unWrapElement(), s.splice(s.indexOf(this), 1), s.length || ((c = !1), e.cancelAnimationFrame(a)), e.removeEventListener('resize', this.handleResize));
                                                    }
                                                },
                                                {
                                                    key: 'isDestroyed',
                                                    get: function() {
                                                        return -1 === s.indexOf(this);
                                                    }
                                                }
                                            ]),
                                            d
                                        );
                                    })();
                                return function(e, t) {
                                    var n = [];
                                    if (e.length) for (var i = 0; i < e.length; i++) n.push(new d(e[i], t));
                                    else n.push(new d(e, t));
                                    return n;
                                };
                            })(r);
                        }.apply(t, [])) || (e.exports = i);
            }.call(this, n(1)));
        },
        function(e, t) {
            var n;
            n = (function() {
                return this;
            })();
            try {
                n = n || new Function('return this')();
            } catch (e) {
                'object' == typeof window && (n = window);
            }
            e.exports = n;
        },
        function(e, t, n) {
            'use strict';
            n.r(t);
            var i = n(0),
                r = n.n(i),
                o = document.querySelectorAll('img');
            new r.a(o, { orientation: 'up' });
        }
    ]);
});
