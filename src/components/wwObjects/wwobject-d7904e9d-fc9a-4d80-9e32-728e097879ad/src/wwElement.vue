<template>
    <wwEditableText
        class="ww-text"
        :tag="tag"
        :disabled="!canEditText"
        :model-value="internalText"
        :text-style="textStyle"
        :links="links"
        :sanitize="content.sanitize"
        @update:modelValue="updateText"
        @add-link="addLink"
        @remove-link="removeLink"
    ></wwEditableText>
</template>

<script>
export default {
    props: {
        content: { type: Object, required: true },
        wwElementState: { type: Object, required: true },
        wwFrontState: { type: Object, required: true },
    },
    computed: {
        canEditText() {
            /* wwFront:start */
            // eslint-disable-next-line no-unreachable
            return false;
            /* wwFront:end */
        },
        textStyle() {
            const style = {
                ...(this.content.font
                    ? {
                          fontSize: 'unset',
                          fontFamily: 'unset',
                          lineHeight: 'unset',
                          fontWeight: 'unset',
                          font: this.content.font,
                      }
                    : {
                          fontSize: this.content.fontSize,
                          fontFamily: this.content.fontFamily,
                          lineHeight: this.content.lineHeight,
                          fontWeight: this.content.fontWeight,
                      }),
                textAlign: this.content.textAlign,
                color: this.content.color,
                textTransform: this.content.textTransform,
                textShadow: this.content.textShadow,
                letterSpacing: this.content.letterSpacing,
                wordSpacing: this.content.wordSpacing,
                textDecoration: this.content.textDecoration,
                textDecorationStyle: this.content.textDecorationStyle,
                textDecorationColor: this.content.textDecorationColor,
                overflow: this.content.nowrap ? 'hidden' : 'initial',
                whiteSpace: this.content.nowrap ? 'nowrap' : 'initial',
                textOverflow: this.content.ellipsis ? 'ellipsis' : 'initial',
            };

            return style;
        },
        internalText() {
            return this.wwElementState.props.text || this.content.text;
        },
        tag() {
            if (this.wwElementState.isInsideLink && this.content.tag === 'button') {
                return 'div';
            } else {
                return this.content.tag;
            }
        },
        links() {
            if (this.content.links) {
                const links = { ...this.content.links, ...this.content.links[this.wwFrontState.lang] };
                // Horrible hack to handle the fact that old data are not under lang key
                Object.keys(links).forEach(key => {
                    if (key.length <= 4) {
                        delete links[key];
                    }
                });
                return links;
            } else {
                return {};
            }
        },
    },
    methods: {
        updateText(text) {
            this.$emit('update:content', { text });
        },
        async addLink({ id, value }) {
            const links = { ...this.content.links };
            this.$emit('update:content', {
                links: {
                    ...links,
                    [this.wwFrontState.lang]: { ...links[this.wwFrontState.lang], [id]: value },
                },
            });
        },
        async removeLink(id) {
            const links = { ...this.content.links };
            delete links[id];
            if (links[this.wwFrontState.lang]) {
                delete links[this.wwFrontState.lang][id];
            }
            this.$emit('update:content', { links });
        },
    },
};
</script>
