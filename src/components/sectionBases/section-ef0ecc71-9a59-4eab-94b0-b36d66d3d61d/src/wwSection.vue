<template>
  <div
    class="modal-container"
    :style="backdropStyle"
    ww-responsive="modal-container"
    @click.self="$emit('trigger-event', { name: 'backdropClick' })"
  >
    <transition :name="content.animation" mode="out-in">
      <wwLayout
        v-if="show"
        class="modal-dropzone"
        direction="column"
        path="modalContent"
        :class="content.position"
        :style="modalContentStyle"
        ww-responsive="modal-dropzone"
        :inherit-from-element="['width']"
      ></wwLayout>
    </transition>
  </div>
</template>

<script>
import { presets } from "./settings.js";

export default {
  props: {
    content: { type: Object, required: true },

  },
  emits: ["trigger-event", "update:sidepanel-content"],
  computed: {
    isEditing() {

      return false;
    },
    show() {

      return this.content.display;
    },
    backdropStyle() {
      if (this.show && this.content.backdrop) {
        return {
          "--backdropColor": this.content.backdropColor,
          "--backdropEvents": "auto",
        };
      }

      return {
        "--backdropColor": "transparent",
        "--backdropEvents": "none",
      };
    },
    modalContentStyle() {
      const baseStyle = {
        "--transition": this.content.transition,
      };

      if (this.content.position !== "custom") {
        return {
          ...baseStyle,
          ...presets[this.content.position],
        };
      }

      return {
        ...baseStyle,
        "--top": this.content.positionTop,
        "--left": this.content.positionLeft,
      };
    },
  },
  watch: {

  },
};
</script>

<style lang="scss" scoped>
:root {
  --top: auto;
  --right: auto;
  --bottom: auto;
  --left: auto;
  --translateY: 0%;
  --translateX: 0%;
  --transition: none;
  --backdropColor: transparent;
  --backdropEvents: none;
}

.modal-container {
  display: flex;
  position: fixed;
  top: 0;
  height: 100vh;
  z-index: 30;
  transition: background-color 0.5s;
  background-color: var(--backdropColor);
  pointer-events: var(--backdropEvents);
}

.modal-dropzone {
  position: absolute;
  width: 100%;
  height: inset;
  width: inset;
  top: var(--top);
  right: var(--right);
  bottom: var(--bottom);
  left: var(--left);
  transform: translate(var(--translateX), var(--translateY));
  display: flex;
  justify-content: var(--align);
  pointer-events: none;
  & * {
    pointer-events: all;
  }
}

.fade-enter-active,
.fade-leave-active,
.fromTop-enter-active,
.fromTop-leave-active,
.fromRight-enter-active,
.fromRight-leave-active,
.fromBottom-enter-active,
.fromBottom-leave-active,
.fromLeft-enter-active,
.fromLeft-leave-active,
.zoomIn-enter-active,
.zoomIn-leave-active,
.zoomOut-enter-active,
.zoomOut-leave-active {
  transition: var(--transition);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fromTop-enter-from {
  opacity: 0;
  transform: translate(var(--translateX), -100%);
}
.fromTop-leave-to {
  opacity: 0;
  transform: translate(var(--translateX), -100%);
}

.fromRight-enter-from {
  opacity: 0;
  transform: translate(100%, var(--translateY));
}
.fromRight-leave-to {
  opacity: 0;
  transform: translate(100%, var(--translateY));
}

.fromBottom-enter-from {
  opacity: 0;
  transform: translate(var(--translateX), 100%);
}
.fromBottom-leave-to {
  opacity: 0;
  transform: translate(var(--translateX), 100%);
}

.fromLeft-enter-from {
  opacity: 0;
  transform: translate(-100%, var(--translateY));
}
.fromLeft-leave-to {
  opacity: 0;
  transform: translate(-100%, var(--translateY));
}

.zoomIn-enter-from {
  opacity: 0;
  transform: translate(var(--translateX), var(--translateY)) scale(1.5);
}
.zoomIn-leave-to {
  opacity: 0;
  transform: translate(var(--translateX), var(--translateY)) scale(1.5);
}

.zoomOut-enter-from {
  opacity: 0;
  transform: translate(var(--translateX), var(--translateY)) scale(0.5);
}
.zoomOut-leave-to {
  opacity: 0;
  transform: translate(var(--translateX), var(--translateY)) scale(0.5);
}
</style>
