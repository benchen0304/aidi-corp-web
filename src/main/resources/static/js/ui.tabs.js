/*
 * jQuery UI Tabs 1.7.3
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Tabs
 *
 * Depends:
 *	ui.core.js
 */
(function (c) {
    var b = 0, a = 0;
    c.widget("ui.tabs", {
        _init: function () {
            if (this.options.deselectable !== undefined) {
                this.options.collapsible = this.options.deselectable
            }
            this._tabify(true)
        }, _setData: function (d, e) {
            if (d == "selected") {
                if (this.options.collapsible && e == this.options.selected) {
                    return
                }
                this.select(e)
            } else {
                this.options[d] = e;
                if (d == "deselectable") {
                    this.options.collapsible = e
                }
                this._tabify()
            }
        }, _tabId: function (d) {
            return d.title && d.title.replace(/\s/g, "_").replace(/[^A-Za-z0-9\-_:\.]/g, "") || this.options.idPrefix + (++b)
        }, _sanitizeSelector: function (d) {
            return d.replace(/:/g, "\\:")
        }, _cookie: function () {
            var d = this.cookie || (this.cookie = this.options.cookie.name || "ui-tabs-" + (++a));
            return c.cookie.apply(null, [d].concat(c.makeArray(arguments)))
        }, _ui: function (e, d) {
            return {tab: e, panel: d, index: this.anchors.index(e)}
        }, _cleanup: function () {
            this.lis.filter(".ui-state-processing").removeClass("ui-state-processing").find("span:data(label.tabs)").each(function () {
                var d = c(this);
                d.html(d.data("label.tabs")).removeData("label.tabs")
            })
        }, _tabify: function (q) {
            this.list = this.element.children("ul:first");
            this.lis = c("li:has(a[href])", this.list);
            this.anchors = this.lis.map(function () {
                return c("a", this)[0]
            });
            this.panels = c([]);
            var r = this, f = this.options;
            var e = /^#.+/;
            this.anchors.each(function (u, o) {
                var s = c(o).attr("href");
                var v = s.split("#")[0], w;
                if (v && (v === location.toString().split("#")[0] || (w = c("base")[0]) && v === w.href)) {
                    s = o.hash;
                    o.href = s
                }
                if (e.test(s)) {
                    r.panels = r.panels.add(r._sanitizeSelector(s))
                } else {
                    if (s != "#") {
                        c.data(o, "href.tabs", s);
                        c.data(o, "load.tabs", s.replace(/#.*$/, ""));
                        var y = r._tabId(o);
                        o.href = "#" + y;
                        var x = c("#" + y);
                        if (!x.length) {
                            x = c(f.panelTemplate).attr("id", y).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").insertAfter(r.panels[u - 1] || r.list);
                            x.data("destroy.tabs", true)
                        }
                        r.panels = r.panels.add(x)
                    } else {
                        f.disabled.push(u)
                    }
                }
            });
            if (q) {
                this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all");
                this.list.addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all");
                this.lis.addClass("ui-state-default ui-corner-top");
                this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom");
                if (f.selected === undefined) {
                    if (location.hash) {
                        this.anchors.each(function (s, o) {
                            if (o.hash == location.hash) {
                                f.selected = s;
                                return false
                            }
                        })
                    }
                    if (typeof f.selected != "number" && f.cookie) {
                        f.selected = parseInt(r._cookie(), 10)
                    }
                    if (typeof f.selected != "number" && this.lis.filter(".ui-tabs-selected").length) {
                        f.selected = this.lis.index(this.lis.filter(".ui-tabs-selected"))
                    }
                    f.selected = f.selected || 0
                } else {
                    if (f.selected === null) {
                        f.selected = -1
                    }
                }
                f.selected = ((f.selected >= 0 && this.anchors[f.selected]) || f.selected < 0) ? f.selected : 0;
                f.disabled = c.unique(f.disabled.concat(c.map(this.lis.filter(".ui-state-disabled"), function (s, o) {
                    return r.lis.index(s)
                }))).sort();
                if (c.inArray(f.selected, f.disabled) != -1) {
                    f.disabled.splice(c.inArray(f.selected, f.disabled), 1)
                }
                this.panels.addClass("ui-tabs-hide");
                this.lis.removeClass("ui-tabs-selected ui-state-active");
                if (f.selected >= 0 && this.anchors.length) {
                    this.panels.eq(f.selected).removeClass("ui-tabs-hide");
                    this.lis.eq(f.selected).addClass("ui-tabs-selected ui-state-active");
                    r.element.queue("tabs", function () {
                        r._trigger("show", null, r._ui(r.anchors[f.selected], r.panels[f.selected]))
                    });
                    this.load(f.selected)
                }
                c(window).bind("unload", function () {
                    r.lis.add(r.anchors).unbind(".tabs");
                    r.lis = r.anchors = r.panels = null
                })
            } else {
                f.selected = this.lis.index(this.lis.filter(".ui-tabs-selected"))
            }
            this.element[f.collapsible ? "addClass" : "removeClass"]("ui-tabs-collapsible");
            if (f.cookie) {
                this._cookie(f.selected, f.cookie)
            }
            for (var j = 0, p; (p = this.lis[j]); j++) {
                c(p)[c.inArray(j, f.disabled) != -1 && !c(p).hasClass("ui-tabs-selected") ? "addClass" : "removeClass"]("ui-state-disabled")
            }
            if (f.cache === false) {
                this.anchors.removeData("cache.tabs")
            }
            this.lis.add(this.anchors).unbind(".tabs");
            if (f.event != "mouseover") {
                var h = function (o, i) {
                    if (i.is(":not(.ui-state-disabled)")) {
                        i.addClass("ui-state-" + o)
                    }
                };
                var l = function (o, i) {
                    i.removeClass("ui-state-" + o)
                };
                this.lis.bind("mouseover.tabs", function () {
                    h("hover", c(this))
                });
                this.lis.bind("mouseout.tabs", function () {
                    l("hover", c(this))
                });
                this.anchors.bind("focus.tabs", function () {
                    h("focus", c(this).closest("li"))
                });
                this.anchors.bind("blur.tabs", function () {
                    l("focus", c(this).closest("li"))
                })
            }
            var d, k;
            if (f.fx) {
                if (c.isArray(f.fx)) {
                    d = f.fx[0];
                    k = f.fx[1]
                } else {
                    d = k = f.fx
                }
            }

            function g(i, o) {
                i.css({display: ""});
                if (c.browser.msie && o.opacity) {
                    i[0].style.removeAttribute("filter")
                }
            }

            var m = k ? function (i, o) {
                c(i).closest("li").removeClass("ui-state-default").addClass("ui-tabs-selected ui-state-active");
                o.hide().removeClass("ui-tabs-hide").animate(k, k.duration || "normal", function () {
                    g(o, k);
                    r._trigger("show", null, r._ui(i, o[0]))
                })
            } : function (i, o) {
                c(i).closest("li").removeClass("ui-state-default").addClass("ui-tabs-selected ui-state-active");
                o.removeClass("ui-tabs-hide");
                r._trigger("show", null, r._ui(i, o[0]))
            };
            var n = d ? function (o, i) {
                i.animate(d, d.duration || "normal", function () {
                    r.lis.removeClass("ui-tabs-selected ui-state-active").addClass("ui-state-default");
                    i.addClass("ui-tabs-hide");
                    g(i, d);
                    r.element.dequeue("tabs")
                })
            } : function (o, i, s) {
                r.lis.removeClass("ui-tabs-selected ui-state-active").addClass("ui-state-default");
                i.addClass("ui-tabs-hide");
                r.element.dequeue("tabs")
            };
            this.anchors.bind(f.event + ".tabs", function () {
                var o = this, u = c(this).closest("li"), i = r.panels.filter(":not(.ui-tabs-hide)"),
                    s = c(r._sanitizeSelector(this.hash));
                if ((u.hasClass("ui-tabs-selected") && !f.collapsible) || u.hasClass("ui-state-disabled") || u.hasClass("ui-state-processing") || r._trigger("select", null, r._ui(this, s[0])) === false) {
                    this.blur();
                    return false
                }
                f.selected = r.anchors.index(this);
                r.abort();
                if (f.collapsible) {
                    if (u.hasClass("ui-tabs-selected")) {
                        f.selected = -1;
                        if (f.cookie) {
                            r._cookie(f.selected, f.cookie)
                        }
                        r.element.queue("tabs", function () {
                            n(o, i)
                        }).dequeue("tabs");
                        this.blur();
                        return false
                    } else {
                        if (!i.length) {
                            if (f.cookie) {
                                r._cookie(f.selected, f.cookie)
                            }
                            r.element.queue("tabs", function () {
                                m(o, s)
                            });
                            r.load(r.anchors.index(this));
                            this.blur();
                            return false
                        }
                    }
                }
                if (f.cookie) {
                    r._cookie(f.selected, f.cookie)
                }
                if (s.length) {
                    if (i.length) {
                        r.element.queue("tabs", function () {
                            n(o, i)
                        })
                    }
                    r.element.queue("tabs", function () {
                        m(o, s)
                    });
                    r.load(r.anchors.index(this))
                } else {
                    throw"jQuery UI Tabs: Mismatching fragment identifier."
                }
                if (c.browser.msie) {
                    this.blur()
                }
            });
            this.anchors.bind("click.tabs", function () {
                return false
            })
        }, destroy: function () {
            var d = this.options;
            this.abort();
            this.element.unbind(".tabs").removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible").removeData("tabs");
            this.list.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all");
            this.anchors.each(function () {
                var e = c.data(this, "href.tabs");
                if (e) {
                    this.href = e
                }
                var f = c(this).unbind(".tabs");
                c.each(["href", "load", "cache"], function (g, h) {
                    f.removeData(h + ".tabs")
                })
            });
            this.lis.unbind(".tabs").add(this.panels).each(function () {
                if (c.data(this, "destroy.tabs")) {
                    c(this).remove()
                } else {
                    c(this).removeClass(["ui-state-default", "ui-corner-top", "ui-tabs-selected", "ui-state-active", "ui-state-hover", "ui-state-focus", "ui-state-disabled", "ui-tabs-panel", "ui-widget-content", "ui-corner-bottom", "ui-tabs-hide"].join(" "))
                }
            });
            if (d.cookie) {
                this._cookie(null, d.cookie)
            }
        }, add: function (g, f, e) {
            if (e === undefined) {
                e = this.anchors.length
            }
            var d = this, i = this.options, k = c(i.tabTemplate.replace(/#\{href\}/g, g).replace(/#\{label\}/g, f)),
                j = !g.indexOf("#") ? g.replace("#", "") : this._tabId(c("a", k)[0]);
            k.addClass("ui-state-default ui-corner-top").data("destroy.tabs", true);
            var h = c("#" + j);
            if (!h.length) {
                h = c(i.panelTemplate).attr("id", j).data("destroy.tabs", true)
            }
            h.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide");
            if (e >= this.lis.length) {
                k.appendTo(this.list);
                h.appendTo(this.list[0].parentNode)
            } else {
                k.insertBefore(this.lis[e]);
                h.insertBefore(this.panels[e])
            }
            i.disabled = c.map(i.disabled, function (m, l) {
                return m >= e ? ++m : m
            });
            this._tabify();
            if (this.anchors.length == 1) {
                k.addClass("ui-tabs-selected ui-state-active");
                h.removeClass("ui-tabs-hide");
                this.element.queue("tabs", function () {
                    d._trigger("show", null, d._ui(d.anchors[0], d.panels[0]))
                });
                this.load(0)
            }
            this._trigger("add", null, this._ui(this.anchors[e], this.panels[e]))
        }, remove: function (d) {
            var f = this.options, g = this.lis.eq(d).remove(), e = this.panels.eq(d).remove();
            if (g.hasClass("ui-tabs-selected") && this.anchors.length > 1) {
                this.select(d + (d + 1 < this.anchors.length ? 1 : -1))
            }
            f.disabled = c.map(c.grep(f.disabled, function (j, h) {
                return j != d
            }), function (j, h) {
                return j >= d ? --j : j
            });
            this._tabify();
            this._trigger("remove", null, this._ui(g.find("a")[0], e[0]))
        }, enable: function (d) {
            var e = this.options;
            if (c.inArray(d, e.disabled) == -1) {
                return
            }
            this.lis.eq(d).removeClass("ui-state-disabled");
            e.disabled = c.grep(e.disabled, function (g, f) {
                return g != d
            });
            this._trigger("enable", null, this._ui(this.anchors[d], this.panels[d]))
        }, disable: function (e) {
            var d = this, f = this.options;
            if (e != f.selected) {
                this.lis.eq(e).addClass("ui-state-disabled");
                f.disabled.push(e);
                f.disabled.sort();
                this._trigger("disable", null, this._ui(this.anchors[e], this.panels[e]))
            }
        }, select: function (d) {
            if (typeof d == "string") {
                d = this.anchors.index(this.anchors.filter("[href$=" + d + "]"))
            } else {
                if (d === null) {
                    d = -1
                }
            }
            if (d == -1 && this.options.collapsible) {
                d = this.options.selected
            }
            this.anchors.eq(d).trigger(this.options.event + ".tabs")
        }, load: function (g) {
            var e = this, i = this.options, d = this.anchors.eq(g)[0], f = c.data(d, "load.tabs");
            this.abort();
            if (!f || this.element.queue("tabs").length !== 0 && c.data(d, "cache.tabs")) {
                this.element.dequeue("tabs");
                return
            }
            this.lis.eq(g).addClass("ui-state-processing");
            if (i.spinner) {
                var h = c("span", d);
                h.data("label.tabs", h.html()).html(i.spinner)
            }
            this.xhr = c.ajax(c.extend({}, i.ajaxOptions, {
                url: f, success: function (k, j) {
                    c(e._sanitizeSelector(d.hash)).html(k);
                    e._cleanup();
                    if (i.cache) {
                        c.data(d, "cache.tabs", true)
                    }
                    e._trigger("load", null, e._ui(e.anchors[g], e.panels[g]));
                    try {
                        i.ajaxOptions.success(k, j)
                    } catch (l) {
                    }
                    e.element.dequeue("tabs")
                }
            }))
        }, abort: function () {
            this.element.queue([]);
            this.panels.stop(false, true);
            if (this.xhr) {
                this.xhr.abort();
                delete this.xhr
            }
            this._cleanup()
        }, url: function (e, d) {
            this.anchors.eq(e).removeData("cache.tabs").data("load.tabs", d)
        }, length: function () {
            return this.anchors.length
        }
    });
    c.extend(c.ui.tabs, {
        version: "1.7.3",
        getter: "length",
        defaults: {
            ajaxOptions: null,
            cache: false,
            cookie: null,
            collapsible: false,
            disabled: [],
            event: "click",
            fx: null,
            idPrefix: "ui-tabs-",
            panelTemplate: "<div></div>",
            spinner: "<em>Loading&#8230;</em>",
            tabTemplate: '<li><a href="#{href}"><span>#{label}</span></a></li>'
        }
    });
    c.extend(c.ui.tabs.prototype, {
        rotation: null, rotate: function (f, h) {
            var d = this, i = this.options;
            var e = d._rotate || (d._rotate = function (j) {
                clearTimeout(d.rotation);
                d.rotation = setTimeout(function () {
                    var k = i.selected;
                    d.select(++k < d.anchors.length ? k : 0)
                }, f);
                if (j) {
                    j.stopPropagation()
                }
            });
            var g = d._unrotate || (d._unrotate = !h ? function (j) {
                if (j.clientX) {
                    d.rotate(null)
                }
            } : function (j) {
                t = i.selected;
                e()
            });
            if (f) {
                this.element.bind("tabsshow", e);
                this.anchors.bind(i.event + ".tabs", g);
                e()
            } else {
                clearTimeout(d.rotation);
                this.element.unbind("tabsshow", e);
                this.anchors.unbind(i.event + ".tabs", g);
                delete this._rotate;
                delete this._unrotate
            }
        }
    })
})(jQuery);
