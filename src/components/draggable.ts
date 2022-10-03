export function xPos(event: TouchEvent & MouseEvent): number {
    return event.targetTouches && event.targetTouches.length > 0
        ? event.targetTouches[0].clientX
        : event.clientX;
}

export function yPos(event: TouchEvent & MouseEvent): number {
    return event.targetTouches && event.targetTouches.length > 0
        ? event.targetTouches[0].clientY
        : event.clientY;
}

export default {
    mounted() {
        if (this.status.draggable) {
            this.$el.addEventListener('touchstart', this.dragStarted);
            this.$el.addEventListener('mousedown', this.dragStarted);
            addEventListener('touchmove', this.beingDragged);
            addEventListener('mousemove', this.beingDragged);
            addEventListener('touchend', this.dragFinished);
            addEventListener('mouseup', this.dragFinished);
        }
    },
    beforeDestroy() {
        if (this.status.draggable) {
            this.$el.removeEventListener('touchstart', this.dragStarted);
            this.$el.removeEventListener('mousedown', this.dragStarted);
            removeEventListener('touchmove', this.beingDragged);
            removeEventListener('mousemove', this.beingDragged);
            removeEventListener('touchend', this.dragFinished);
            removeEventListener('mouseup', this.dragFinished);
        }
    },
    methods: {
        dragStarted(event) {
            this.$el.classList.toggle('vt-will-change');
            this.isDragged = true;
            this.dragStartPos = { x: xPos(event), y: yPos(event) };
            this.boundingClientRect = this.$el.getBoundingClientRect();
        },
        beingDragged(event) {
            // prevent page scroll
            event.preventDefault();
            if (this.isDragged) {
                this.dragPos = { x: xPos(event), y: yPos(event) };
                if (!this.hasMoved) {
                    this.$root.$emit('vtDragStarted', {
                        id: this.status.id,
                        position: this.dragStartPos
                    });
                } else {
                    this.$root.$emit('vtBeingDragged', {
                        id: this.status.id,
                        position: this.dragPos
                    });
                }
            }
        },
        dragFinished() {
            if (this.hasMoved) {
                this.$root.$emit('vtDragFinished', {
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
                    this.$el.classList.toggle('vt-will-change');
                });
            }
        }
    }
};
