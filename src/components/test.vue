<template>
    <div ref="mapcontainer" style="height: 100%; width: 100%;">
        <div
            id="cover"
            style="height: 100%; width: 100%; position: absolute; top:0; left: 0; z-index: 2;"
        ></div>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

@Component
export default class HelloWorld extends Vue {
    public map: any;

    public mounted() {
        let me = this;
        me.map = new AMap.Map(this.$refs.mapcontainer, {
            resizeEnable: true,
            zoom: 15,
            center: new AMap.LngLat(120.236463, 35.958023),
            animateEnable: false,
        });

        me.map.on('complete', function() {
            let cover = document.getElementById('cover');
            let container = window;

            cover.addEventListener('mousedown', e => {
                const mouseclick = document.createEvent('MouseEvent');
                mouseclick.initMouseEvent(
                    e.type,
                    e.cancelBubble,
                    e.cancelable,
                    window,
                    0,
                    e.screenX,
                    e.screenY,
                    e.clientX,
                    e.clientY,
                    e.ctrlKey,
                    e.altKey,
                    e.shiftKey,
                    e.metaKey,
                    e.buttons,
                    container
                );
                container.dispatchEvent(mouseclick);
                cover.addEventListener('mousemove', e => {
                    const mousemove = document.createEvent('MouseEvent');
                    mousemove.initMouseEvent(
                        e.type,
                        e.cancelBubble,
                        e.cancelable,
                        window,
                        0,
                        e.screenX,
                        e.screenY,
                        e.clientX,
                        e.clientY,
                        e.ctrlKey,
                        e.altKey,
                        e.shiftKey,
                        e.metaKey,
                        e.buttons,
                        container
                    );
                    container.dispatchEvent(mousemove);
                });
            });

            container.addEventListener('mousedown', e => {
                console.log(e);
                container.addEventListener('mousemove', e => {
                    console.log(e);
                });
            });
        });
    }
}
</script>
