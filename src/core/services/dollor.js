let $ = (param) => {
    let self =
        typeof param == "string" ? document.querySelectorAll(param) : param;
    return {
        // target
        target: self,
        on(event, fx) {
            this.target.forEach((el) => {
                el.addEventListener(event, fx.bind(el), false);
            });
            return this;
        },
        length: document.querySelectorAll(param).length,
        remove() {
            this.target.forEach((el) => {
                el.remove();
            });
            return this;
        },
        empty() {
            this.target.forEach((el) => {
                el.innerHTML = "";
            });
            return this;
        },
        append(content = null) {
            this.target.forEach((el) => {
                console.log(el);
                console.log(content);
                el.insertAdjacentHTML("beforeend", content);
            });
            return this;
        },
        html(content = null) {
            this.target.forEach((el) => {
                el.innerHTML = content;
            });
            return this;
        },
        text(content = null) {
            this.target.forEach((el) => {
                el.textContent = content;
            });
            return this;
        },
        addClass(content = null) {
            this.target.forEach((el) => {
                el.classList.add(content);
            });
            return this;
        },
        removeClass(content = null) {
            this.target.forEach((el) => {
                el.classList.remove(content);
            });
            return this;
        },
        scrollTop(height = 0) {
            this.target.forEach((el) => {
                el.scrollTop = height;
            });
            return this;
        },
        prop(key) {
            for (let el of this.target) {
                return el[key];
            }
        },
        one(event, fx) {
            this.target.forEach((el) => {
                el.addEventListener(
                    event,
                    function () {
                        if (el.dataset.triggred) return;
                        el.dataset.triggred = '1';
                        fx.call(el);
                    },
                    false
                );
            });
            return this;
        },
        children() {
            for (let el of this.target) {
                return el.children;
            }
        },
        find(param) {
            for (let el of this.target) {
                return $(el.querySelectorAll(param));
            }
        },
        val(content = null) {
            for (let el of this.target) {
                if (content === null) {
                    return el.value;
                }
                el.value = content;
                break;
            }
            return this;
        },
        prepend(content = null) {
            this.target.forEach((el) => {
                el.insertAdjacentHTML("afterbegin", content);
            });
            return this;
        },
        parent() {
            for (let el of this.target) {
                return $(el.parentElement);
            }
        },
        get() {
            return Array.from(this.target);
        },
        each(fx) {
            this.target.forEach((el, i) => {
                fx.call(el, i, el);
            });
            return this;
        },
        trigger(ev) {
            for (let el of this.target) {
                el[ev]();
            }
            return this;
        },
        attr(param) {
            for (let el of this.target) {
                return el.getAttribute(param);
            }
        },
        off() {
            return this;
        }
    };
};

module.exports = $