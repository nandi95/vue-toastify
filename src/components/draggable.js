export default {
    data() {
        return {
            dragStartPos: {},
            dragPos: {},
            isDragged: false,
            boundingClientRect: {}
        };
    },
    mounted() {
        if (this.status.draggable) {
            this.$el.addEventListener("touchstart", this.dragStarted);
            this.$el.addEventListener("mousedown", this.dragStarted);
            addEventListener("touchmove", this.beingDragged);
            addEventListener("mousemove", this.beingDragged);
            addEventListener("touchend", this.dragFinished);
            addEventListener("mouseup", this.dragFinished);
        }
    },
    beforeDestroy() {
        if (this.status.draggable) {
            this.$el.removeEventListener("touchstart", this.dragStarted);
            this.$el.removeEventListener("mousedown", this.dragStarted);
            removeEventListener("touchmove", this.beingDragged);
            removeEventListener("mousemove", this.beingDragged);
            removeEventListener("touchend", this.dragFinished);
            removeEventListener("mouseup", this.dragFinished);
        }
    },
    computed: {
        hasMoved() {
            return this.dragPos.x !== undefined && this.dragStartPos.x !== this.dragPos.x;
        },
        dragXDistance() {
            return this.isDragged ? this.dragPos.x - this.dragStartPos.x : 0;
        },
        removalDistance() {
            return this.boundingClientRect.width * this.status.dragThreshold;
        },
        draggableStyles() {
            if (this.dragStartPos.x === this.dragPos.x || !this.hasMoved) {
                return {};
            }

            let opacity = 1 - Math.abs(this.dragXDistance / this.removalDistance);
            opacity = isNaN(opacity) ? 1 : opacity;

            return {
                transform: "translateX(" + this.dragXDistance + "px)",
                opacity: opacity,
                "user-select": "none"
            };
        }
    },
    methods: {
        dragStarted(event) {
            this.$el.classList.toggle("vt-will-change");
            this.isDragged = true;
            this.dragStartPos = { x: this.xPos(event), y: this.yPos(event) };
            this.boundingClientRect = this.$el.getBoundingClientRect();
        },
        beingDragged(event) {
            // prevent page scroll
            event.preventDefault();
            if (this.isDragged) {
                this.dragPos = { x: this.xPos(event), y: this.yPos(event) };
                if (!this.hasMoved) {
                    this.$root.$emit("vtDragStarted", {
                        id: this.status.id,
                        position: this.dragStartPos
                    });
                } else {
                    this.$root.$emit("vtBeingDragged", {
                        id: this.status.id,
                        position: this.dragPos
                    });
                }
            }
        },
        dragFinished() {
            if (this.hasMoved) {
                this.$root.$emit("vtDragFinished", {
                    id: this.status.id,
                    position: this.dragPos
                });
                // todo if at least 75% of the notification is out of the window (in case of mobile)
                // eslint-disable-next-line no-unused-vars
                const isAlmostOffRight =
                    this.$el.getBoundingClientRect().right > window.innerWidth &&
                    this.$el.getBoundingClientRect().right - window.innerWidth >
                        this.boundingClientRect.width * 0.75;
                // eslint-disable-next-line no-unused-vars
                const isAlmostOffLeft =
                    this.$el.getBoundingClientRect().right < this.boundingClientRect.width * 0.25;
                if (
                    Math.abs(this.boundingClientRect.left - this.$el.getBoundingClientRect().left) >
                    this.removalDistance
                ) {
                    this.closeNotification();
                }
                this.isDragged = false;
                // execute after the next event cycle
                setTimeout(() => {
                    this.dragPos = {};
                    this.dragStartPos = {};
                    this.$el.classList.toggle("vt-will-change");
                });
            }
        },
        xPos(event) {
            return event.targetTouches && event.targetTouches.length > 0
                ? event.targetTouches[0].clientX
                : event.clientX;
        },
        yPos(event) {
            return event.targetTouches && event.targetTouches.length > 0
                ? event.targetTouches[0].clientY
                : event.clientY;
        }
    }
};
